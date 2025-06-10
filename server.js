import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = "H9Z0V1kQMMv0ToXbcGChnqIQsu2DeK_NRVeeXvgFDiwQ";
const scoring_url = "https://eu-de.ml.cloud.ibm.com/ml/v4/deployments/3aaa4718-6122-49cf-bf7c-a2c122d62058/ai_service_stream?version=2021-05-01";

app.post("/chat", async (req, res) => {
  try {
    // Get access token
    const tokenRes = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
    });

    const tokenData = await tokenRes.json();
    console.log("Token Data:", tokenData);
    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token");
    }
    const accessToken = tokenData.access_token;

    // Make request to Watsonx streaming endpoint
    const watsonRes = await fetch(scoring_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    // console.log("Watsonx status:", watsonRes.status);
    if (watsonRes.status !== 200) {
      throw new Error(`Watsonx API returned status ${watsonRes.status}`);
    }

    // Process the streaming response
    const stream = watsonRes.body;
    let responseText = "";
    let buffer = ""; // Buffer to handle split JSON

    stream.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      // console.log("Stream chunk:", chunkStr);

      // Append chunk to buffer
      buffer += chunkStr;

      // Split buffer by newlines and process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep the last (possibly incomplete) line in buffer

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const dataStr = line.slice(5).trim();
          if (dataStr) {
            try {
              const jsonData = JSON.parse(dataStr);
              const content = jsonData?.choices?.[0]?.delta?.content;
              if (content) {
                responseText += content;
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
            }
          }
        }
      }
    });

    stream.on("end", () => {
      // Process any remaining buffer content
      if (buffer.startsWith("data:")) {
        const dataStr = buffer.slice(5).trim();
        if (dataStr) {
          try {
            const jsonData = JSON.parse(dataStr);
            const content = jsonData?.choices?.[0]?.delta?.content;
            if (content) {
              responseText += content;
            }
          } catch (e) {
            console.error("Error parsing final buffer:", e);
          }
        }
      }

      console.log("Final response:", responseText);
      res.json({ results: [{ response: responseText }] });
    });

    stream.on("error", (err) => {
      // console.error("Stream error:", err);
      res.status(500).json({ error: "Stream Error", details: err.toString() });
    });
  } catch (err) {
    // console.error("Error details:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.toString() });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));