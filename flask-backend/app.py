from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime
import json
import requests
from typing import Dict, Any, List, Optional
import time
import traceback
import re

# Import the comprehensive Samadhan AI dataset
from samadhan_dataset import SAMADHAN_AI_COMPLETE_DATASET
from samadhan_dataset.load_dataset import (
    get_complete_dataset,
    get_training_documents,
    get_priority_keywords,
    get_response_templates,
    get_department_info,
    get_helpline_number,
    get_district_info,
    get_dataset_stats
)

# LangChain imports with error handling (no OpenAI)
try:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.schema import Document
    from langchain.prompts import PromptTemplate
    LANGCHAIN_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ LangChain not available: {e}")
    LANGCHAIN_AVAILABLE = False

# Sentence transformers for embeddings fallback
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    SENTENCE_TRANSFORMERS_AVAILABLE = True
    print("✅ Sentence transformers available")
except ImportError:
    print("⚠️ Sentence transformers not available")
    SENTENCE_TRANSFORMERS_AVAILABLE = False

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://eclectic-centaur-42bbfd.netlify.app"])

# Configure logging - 
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)



# Global variables for caching
token_cache = {
    'token': None,
    'expiry': 0
}

# Initialize components (without OpenAI)
sentence_model = None

class SimpleDocument:
    """Simple document class for when LangChain is not available"""
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}

def create_samadhan_ai_rag_documents():
    """Create comprehensive RAG documents trained on Samadhan AI dataset"""
    if LANGCHAIN_AVAILABLE:
        from langchain.schema import Document
        doc_class = Document
    else:
        doc_class = SimpleDocument
    
    documents = []
    training_docs = get_training_documents()
    
    for doc_data in training_docs:
        documents.append(doc_class(
            page_content=doc_data['content'],
            metadata=doc_data['metadata']
        ))
    
    # Add project information
    project_info = SAMADHAN_AI_COMPLETE_DATASET['project_info']
    documents.append(doc_class(
        page_content=f"Samadhan AI is {project_info['theme']}. Objective: {project_info['objective']}. Tech stack: {', '.join(project_info['tech_stack'])}. Features: {', '.join(project_info['features'])}. Dataset size: {project_info['dataset_size']}.",
        metadata={"type": "project_info", "category": "system"}
    ))
    
    return documents

def initialize_sentence_transformers():
    """Initialize sentence transformers for embeddings"""
    global sentence_model
    
    try:
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("✅ RAG system initialized with comprehensive Samadhan AI dataset")
        else:
            logger.warning("⚠️ Using rule-based analysis (sentence transformers not available)")
    except Exception as e:
        logger.error(f"❌ Error initializing RAG system: {e}")

def get_ibm_cloud_token():
    """Get IBM Cloud IAM token with caching - EXACTLY like your friend's code"""
    global token_cache
    
    # Check if we have a valid cached token
    if token_cache['token'] and time.time() < token_cache['expiry']:
        return token_cache['token']
    
    try:
        logger.info('🔄 Getting IBM Cloud token...')
        
        # EXACTLY like your friend's approach
        response = requests.post(
            'https://iam.cloud.ibm.com/identity/token',
            headers={
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            data=f'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={config.WATSONX_API_KEY}'
        )
        
        if response.status_code != 200:
            logger.error(f'❌ IBM Cloud error: {response.status_code}')
            raise Exception(f'IBM Cloud authentication failed: {response.status_code}')
        
        token_data = response.json()
        
        if not token_data.get('access_token'):
            raise Exception('Failed to obtain access token')
        
        # Cache the token (expire 5 minutes before actual expiry)
        token_cache['token'] = token_data['access_token']
        token_cache['expiry'] = time.time() + (token_data.get('expires_in', 3600) - 300)
        
        logger.info('✅ IBM Cloud token obtained')
        return token_data['access_token']
        
    except Exception as e:
        logger.error(f'❌ Token error: {e}')
        raise

def call_watsonx_streaming(request_body: dict) -> str:
    """Call WatsonX streaming API - EXACTLY like your friend's working approach with FIXED parsing"""
    try:
        if not config.WATSONX_API_KEY:
            raise Exception("WatsonX API key not configured")
        
        logger.info('🤖 Calling WatsonX...')
        
        # Get IBM Cloud token
        access_token = get_ibm_cloud_token()
        
        # Use the streaming URL
        scoring_url = config.WATSONX_STREAMING_URL
        
        # EXACTLY like your friend's approach
        response = requests.post(
            scoring_url,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'text/event-stream',
                'Content-Type': 'application/json',
            },
            json=request_body,
            stream=True,
            timeout=60
        )

        if response.status_code != 200:
            logger.error(f'❌ WatsonX error: {response.status_code}')
            raise Exception(f'WatsonX API error: {response.status_code}')

        # Process the streaming response - EXACTLY like your friend's code with FIXED parsing
        response_text = ""
        buffer = ""  # Buffer to handle split JSON

        try:
            for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
                if chunk:
                    chunk_str = str(chunk)

                    # Append chunk to buffer
                    buffer += chunk_str

                    # Split buffer by newlines and process complete lines
                    lines = buffer.split('\n')
                    buffer = lines.pop() if lines else ""  # Keep the last (possibly incomplete) line in buffer

                    for line in lines:
                        if line.startswith('data:'):
                            data_str = line[5:].strip()
                            if data_str and data_str != '[DONE]':
                                try:
                                    json_data = json.loads(data_str)
                                    # FIXED: Better error handling for choices array
                                    choices = json_data.get('choices', [])
                                    if choices and len(choices) > 0:
                                        delta = choices[0].get('delta', {})
                                        content = delta.get('content')
                                        if content:
                                            response_text += content
                                except json.JSONDecodeError:
                                    continue
                                except (IndexError, KeyError):
                                    continue

            # Process any remaining buffer content
            if buffer and buffer.startswith('data:'):
                data_str = buffer[5:].strip()
                if data_str and data_str != '[DONE]':
                    try:
                        json_data = json.loads(data_str)
                        # FIXED: Better error handling for choices array
                        choices = json_data.get('choices', [])
                        if choices and len(choices) > 0:
                            delta = choices[0].get('delta', {})
                            content = delta.get('content')
                            if content:
                                response_text += content
                    except (json.JSONDecodeError, IndexError, KeyError):
                        pass

        except Exception as stream_error:
            logger.error(f'❌ WatsonX streaming error: {stream_error}')
            raise Exception(f'WatsonX streaming error: {stream_error}')
        
        if not response_text.strip():
            raise Exception('No response from WatsonX')

        # Clean up response - remove markdown formatting
        cleaned_text = clean_ai_response(response_text)
        
        logger.info('✅ WatsonX response generated')
        return cleaned_text
        
    except Exception as e:
        logger.error(f'❌ WatsonX failed: {e}')
        raise

def call_openrouter_api(prompt: str, model: str = "deepseek/deepseek-r1-0528-qwen3-8b:free") -> str:
    """Call OpenRouter API with DeepSeek model (fallback when WatsonX fails)"""
    try:
        if not config.OPENROUTER_API_KEY:
            raise Exception("OpenRouter API key not configured")
        
        logger.info(f'🤖 Using OpenRouter DeepSeek (fallback)...')
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": config.FRONTEND_URL,
                "X-Title": "Samadhan AI"
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 500,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f'❌ OpenRouter error: {response.status_code}')
            raise Exception(f'OpenRouter API error: {response.status_code}')
        
        data = response.json()
        content = data['choices'][0]['message']['content']
        
        logger.info('✅ OpenRouter response generated')
        return content
        
    except Exception as e:
        logger.error(f'❌ OpenRouter failed: {e}')
        raise

def clean_ai_response(text: str) -> str:
    """Clean AI response from unwanted formatting and markdown"""
    if not text:
        return text
    
    # Remove markdown formatting
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove **bold**
    text = re.sub(r'\*(.*?)\*', r'\1', text)      # Remove *italic*
    text = re.sub(r'#{1,6}\s*', '', text)         # Remove headers
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)  # Remove code blocks
    text = re.sub(r'`(.*?)`', r'\1', text)        # Remove inline code
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)  # Remove links
    
    # Remove extra whitespace and newlines
    text = re.sub(r'\n\s*\n', '\n', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text

def get_up_government_info(category: str, district: str = None) -> Dict[str, Any]:
    """Get real UP government information based on category"""
    dept_info = get_department_info(category)
    
    if not dept_info:
        # Try to map category to department
        category_mapping = {
            'Infrastructure': 'Public Works',
            'Utilities': 'Water Supply',
            'Traffic': 'Traffic Police',
            'Environment': 'Environment',
            'Healthcare': 'Healthcare',
            'Education': 'Education'
        }
        dept_name = category_mapping.get(category, 'Public Works')
        dept_info = get_department_info(dept_name)
    
    info = {
        'department': category,
        'contact': dept_info.get('contact', 'N/A'),
        'email': dept_info.get('email', 'N/A'),
        'emergency': dept_info.get('emergency_contact', get_helpline_number('emergency')),
        'response_time': dept_info.get('response_time', '3-5 days'),
        'services': dept_info.get('services', []),
        'head': dept_info.get('head', 'Department Head'),
        'address': dept_info.get('address', 'Government Office, Lucknow')
    }
    
    # Add district specific info if provided
    if district:
        district_info = get_district_info(district)
        if district_info:
            info['district_dm'] = district_info.get('dm_contact')
            info['district_email'] = district_info.get('collectorate')
    
    return info

def analyze_complaint_with_rag(complaint_text: str, language: str = 'en') -> Dict[str, Any]:
    """Analyze complaint using RAG system trained on comprehensive Samadhan AI dataset"""
    try:
        # Try OpenRouter first for analysis
        if config.OPENROUTER_API_KEY:
            analysis_prompt = f"""
            You are Samadhan AI, an expert system for UP government complaints trained on comprehensive real data.
            
            Analyze this complaint for Uttar Pradesh CM Helpline 1076:
            Complaint: {complaint_text}
            Language: {language}
            
            Based on comprehensive Samadhan AI training data with {get_dataset_stats()['total_training_documents']} documents, provide JSON response:
            {{
                "category": "Infrastructure|Utilities|Environment|Traffic|Healthcare|Education|Other",
                "priority": "low|medium|high|critical",
                "department": "Public Works|Water Supply|Environment|Traffic Police|Healthcare|Education|General Services",
                "sentiment": "positive|neutral|negative",
                "timeline": "expected resolution time",
                "confidence": 0.8,
                "district": "if mentioned"
            }}
            
            Only respond with valid JSON.
            """
            
            try:
                openrouter_response = call_openrouter_api(analysis_prompt)
                
                # Clean and try to parse JSON from response
                cleaned_response = clean_ai_response(openrouter_response)
                json_match = re.search(r'\{.*\}', cleaned_response, re.DOTALL)
                if json_match:
                    parsed = json.loads(json_match.group())
                    
                    # Get real UP government info
                    category = parsed.get('category', 'Other')
                    district = parsed.get('district')
                    up_info = get_up_government_info(category, district)
                    
                    return {
                        'category': category,
                        'priority': parsed.get('priority', 'medium'),
                        'department': parsed.get('department', 'General Services'),
                        'sentiment': parsed.get('sentiment', 'neutral'),
                        'suggested_response': f"Thank you for your {category.lower()} complaint. We will address it promptly.",
                        'timeline': up_info['response_time'],
                        'confidence': parsed.get('confidence', 0.8),
                        'source': 'samadhan_ai_rag',
                        'up_info': up_info
                    }
            except Exception as e:
                logger.warning(f"⚠️ OpenRouter analysis failed, using fallback: {e}")
        
        # Fallback to sentence transformers RAG if available
        if sentence_model:
            sample_docs = create_samadhan_ai_rag_documents()
            doc_texts = [doc.page_content for doc in sample_docs]
            
            # Get embeddings
            complaint_embedding = sentence_model.encode([complaint_text])
            doc_embeddings = sentence_model.encode(doc_texts)
            
            # Find most similar document
            similarities = np.dot(complaint_embedding, doc_embeddings.T)[0]
            best_match_idx = np.argmax(similarities)
            best_doc = sample_docs[best_match_idx]
            
            # Use metadata from best match
            analysis = get_fallback_analysis(complaint_text)
            analysis['category'] = best_doc.metadata.get('category', analysis['category'])
            analysis['department'] = best_doc.metadata.get('department', analysis['department'])
            analysis['confidence'] = float(similarities[best_match_idx])
            analysis['source'] = 'samadhan_ai_sentence_transformers'
            
            # Add UP government info
            up_info = get_up_government_info(analysis['category'])
            analysis['up_info'] = up_info
            analysis['timeline'] = up_info['response_time']
            
            return analysis
        
        # Final fallback to rule-based analysis
        return get_fallback_analysis(complaint_text)
        
    except Exception as e:
        logger.error(f"❌ RAG analysis error: {e}")
        return get_fallback_analysis(complaint_text)

def generate_ai_response(complaint_text: str, category: str, priority: str, language: str = 'en') -> str:
    """Generate AI response using available services (WatsonX primary, OpenRouter fallback)"""
    try:
        # Get UP government info
        up_info = get_up_government_info(category)
        
        # Try WatsonX streaming first for response generation
        if config.WATSONX_API_KEY:
            watson_prompt = f"""You are Samadhan AI, a helpful government assistant for Uttar Pradesh, India.

A citizen submitted this complaint to CM Helpline 1076:
Complaint: "{complaint_text}"
Category: {category}
Priority: {priority}
Language: {language}

Department: {up_info['department']}
Contact: {up_info['contact']}
Emergency: {up_info['emergency']}
Response Time: {up_info['response_time']}
Head: {up_info['head']}

Provide a professional, empathetic response that:
1. Acknowledges the citizen's concern
2. Provides correct contact information
3. Gives realistic timeline
4. Mentions emergency contact if urgent
5. Is helpful and reassuring

Keep response concise (2-3 sentences). No markdown formatting."""

            try:
                # Use your friend's exact request format
                request_body = {
                    "messages": [
                        {
                            "role": "user",
                            "content": watson_prompt
                        }
                    ],
                    "max_tokens": 300,
                    "temperature": 0.7
                }
                
                watson_response = call_watsonx_streaming(request_body)
                logger.info('✅ WatsonX response generated')
                return watson_response
            except Exception as e:
                logger.warning(f"⚠️ WatsonX failed, using OpenRouter fallback: {e}")
        
        # Try OpenRouter as fallback
        if config.OPENROUTER_API_KEY:
            openrouter_prompt = f"""Generate professional UP government response for Samadhan AI:

Complaint: {complaint_text}
Category: {category}
Priority: {priority}
Department: {up_info['department']}
Contact: {up_info['contact']}
Emergency: {up_info['emergency']}
Response Time: {up_info['response_time']}

Professional, empathetic response with real contact info. 2-3 sentences. No markdown."""

            try:
                openrouter_response = call_openrouter_api(openrouter_prompt)
                cleaned_response = clean_ai_response(openrouter_response)
                logger.info('✅ OpenRouter fallback response generated')
                return cleaned_response
            except Exception as e:
                logger.warning(f"⚠️ OpenRouter fallback failed: {e}")
        
        # Final fallback to category-based response with real UP data
        return get_category_fallback_response(category, priority, up_info)
        
    except Exception as e:
        logger.error(f"❌ AI response generation error: {e}")
        up_info = get_up_government_info(category)
        return get_category_fallback_response(category, priority, up_info)

def get_fallback_analysis(complaint_text: str) -> Dict[str, Any]:
    """Enhanced rule-based analysis with comprehensive Samadhan AI dataset"""
    text = complaint_text.lower()
    
    # Use comprehensive Samadhan AI dataset for better categorization
    priority_keywords = get_priority_keywords()
    
    category_scores = {}
    for dept_name, dept_info in SAMADHAN_AI_COMPLETE_DATASET['government_data']['departments'].items():
        score = sum(1 for keyword in dept_info['priority_keywords'] if keyword in text)
        if score > 0:
            category_scores[dept_name] = score
    
    if category_scores:
        category = max(category_scores, key=category_scores.get)
        department = category
    else:
        category = 'Other'
        department = 'General Services'
    
    # Priority detection using comprehensive keywords
    priority = 'medium'  # default
    for p in ['critical', 'high', 'low']:
        if any(keyword in text for keyword in priority_keywords[p]['general']):
            priority = p
            break
        # Check category-specific keywords
        category_key = category.lower().replace(' ', '_')
        if category_key in priority_keywords[p]:
            if any(keyword in text for keyword in priority_keywords[p][category_key]):
                priority = p
                break
    
    # Sentiment analysis
    sentiment_keywords = {
        'negative': ['angry', 'frustrated', 'terrible', 'worst', 'horrible', 'disgusted', 'furious', 'outraged', 'disappointed'],
        'positive': ['thank', 'appreciate', 'good', 'excellent', 'satisfied', 'happy', 'pleased', 'grateful']
    }
    
    sentiment = 'neutral'
    neg_score = sum(1 for word in sentiment_keywords['negative'] if word in text)
    pos_score = sum(1 for word in sentiment_keywords['positive'] if word in text)
    
    if neg_score > pos_score:
        sentiment = 'negative'
    elif pos_score > neg_score:
        sentiment = 'positive'
    
    # Get UP government info
    up_info = get_up_government_info(category)
    
    return {
        'category': category,
        'priority': priority,
        'department': department,
        'sentiment': sentiment,
        'timeline': up_info['response_time'],
        'confidence': 0.7,
        'source': 'samadhan_ai_rule_based',
        'up_info': up_info,
        'suggested_response': f'Thank you for your {category.lower()} complaint. Contact {department} at {up_info["contact"]} or emergency {up_info["emergency"]}. Response time: {up_info["response_time"]}.'
    }

def get_category_fallback_response(category: str, priority: str = 'medium', up_info: Dict = None) -> str:
    """Get fallback response based on category and priority with real UP data"""
    if not up_info:
        up_info = get_up_government_info(category)
    
    # Use response templates from dataset
    response_templates = get_response_templates()
    
    if category in response_templates and priority in response_templates[category]:
        templates = response_templates[category][priority]
        base_response = templates[0]  # Use first template
    else:
        # Fallback response
        base_response = f"Thank you for your {category.lower()} complaint. Contact {up_info['head']} at {up_info['contact']} or emergency {up_info['emergency']}. Expected response: {up_info['response_time']}."
    
    return base_response

# Routes
@app.route('/', methods=['GET'])
def root():
    """Root endpoint - Welcome message"""
    dataset_stats = get_dataset_stats()
    return jsonify({
        'message': 'Samadhan AI - UP Government Services ',
        'status': 'running',
        'version': '3.0.0 - COMPREHENSIVE DATASET',
        'project': SAMADHAN_AI_COMPLETE_DATASET['project_info'],
        'dataset_statistics': dataset_stats,
        'ai_services': {
            'watson_x_streaming': bool(config.WATSONX_API_KEY),
            'openrouter_deepseek_fallback': bool(config.OPENROUTER_API_KEY),
            'rag_system': SENTENCE_TRANSFORMERS_AVAILABLE,
            'comprehensive_dataset': 'loaded'
        },
        'endpoints': ['/health', '/api/ai/chat', '/api/ai/analyze', '/api/up/data', '/api/dataset/stats'],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    dataset_stats = get_dataset_stats()
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'samadhan_ai': {
            'version': '3.0.0',
            'dataset': 'comprehensive',
            'rag_trained': bool(sentence_model),
            'dataset_stats': dataset_stats
        },
        'watsonx': {
            'configured': bool(config.WATSONX_API_KEY),
            'streaming_ready': True
        },
        'openrouter': {
            'configured': bool(config.OPENROUTER_API_KEY),
            'fallback_ready': True
        }
    })

@app.route('/api/up/data', methods=['GET'])
def get_up_data():
    """Get comprehensive Samadhan AI UP Government dataset"""
    return jsonify(get_complete_dataset())

@app.route('/api/dataset/stats', methods=['GET'])
def get_dataset_statistics():
    """Get dataset statistics"""
    return jsonify(get_dataset_stats())

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """Main AI chat endpoint - handles all AI interactions with comprehensive Samadhan AI"""
    try:
        data = request.get_json()
        message = data.get('message')
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400

        logger.info(f'💬 Samadhan AI processing: {message[:50]}...')
        
        # Analyze with comprehensive RAG system
        analysis = analyze_complaint_with_rag(message, language)
        
        # Generate response
        ai_response = generate_ai_response(
            message, 
            analysis['category'], 
            analysis['priority'], 
            language
        )
        
        logger.info('✅ Samadhan AI response ready')
        
        return jsonify({
            'response': ai_response,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat(),
            'language': language,
            'system': 'samadhan_ai_comprehensive'
        })
        
    except Exception as e:
        logger.error(f'❌ Samadhan AI error: {e}')
        return jsonify({
            'error': str(e),
            'response': f'I apologize for the error. Please contact CM Helpline {get_helpline_number("cm_helpline")} for immediate assistance.',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/ai/analyze', methods=['POST'])
def ai_analyze():
    """AI analysis endpoint with comprehensive Samadhan AI RAG"""
    try:
        data = request.get_json()
        complaint_text = data.get('complaint')
        language = data.get('language', 'en')
        
        if not complaint_text:
            return jsonify({'error': 'Complaint text is required'}), 400

        logger.info(f'🔍 Samadhan AI analyzing: {complaint_text[:50]}...')
        
        # Analyze with comprehensive RAG system
        analysis = analyze_complaint_with_rag(complaint_text, language)
        
        # Generate response
        ai_response = generate_ai_response(
            complaint_text,
            analysis['category'],
            analysis['priority'],
            language
        )
        
        # Add response to analysis
        analysis['ai_response'] = ai_response
        analysis['timestamp'] = datetime.now().isoformat()
        analysis['system'] = 'samadhan_ai_comprehensive'
        
        logger.info('✅ Samadhan AI analysis complete')
        
        return jsonify(analysis)
        
    except Exception as e:
        logger.error(f'❌ Samadhan AI analysis error: {e}')
        return jsonify({
            'error': str(e),
            'fallback_analysis': get_fallback_analysis(complaint_text)
        }), 500

# Legacy endpoints (for backward compatibility)
@app.route('/api/watsonx/test', methods=['GET'])
def test_watsonx():
    """Test WatsonX streaming connection"""
    try:
        if not config.WATSONX_API_KEY:
            return jsonify({
                'success': False,
                'error': 'WatsonX API key not configured'
            }), 400
        
        logger.info('🧪 Testing WatsonX...')
        
        test_request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": "Hello from Samadhan AI. Please respond with 'Connection successful'."
                }
            ],
            "max_tokens": 50,
            "temperature": 0.7
        }
        
        test_response = call_watsonx_streaming(test_request_body)
        
        logger.info('✅ WatsonX test successful')
        
        return jsonify({
            'success': True,
            'response': test_response,
            'system': 'samadhan_ai_watsonx'
        })
        
    except Exception as e:
        logger.error(f'❌ WatsonX test failed: {e}')
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found', 'system': 'samadhan_ai'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f'Internal error: {error}')
    return jsonify({'error': 'Internal server error', 'system': 'samadhan_ai'}), 500

if __name__ == '__main__':
    dataset_stats = get_dataset_stats()
    logger.info('🚀 Starting Samadhan AI Backend ')
    logger.info(f'📊 Project: {SAMADHAN_AI_COMPLETE_DATASET["project_info"]["name"]}')
    logger.info(f'🎯 Theme: {SAMADHAN_AI_COMPLETE_DATASET["project_info"]["theme"]}')
    logger.info(f'📈 Dataset Size: {dataset_stats["total_training_documents"]} training documents')
    logger.info(f'🏛️ Departments: {dataset_stats["departments"]}')
    logger.info(f'📞 Helplines: {dataset_stats["helplines"]}')
    logger.info(f'🏙️ Districts: {dataset_stats["districts"]}')
    logger.info(f'💬 Complaint Patterns: {dataset_stats["complaint_patterns"]}')
    logger.info(f'🔧 WatsonX: {"✅ Ready" if config.WATSONX_API_KEY else "❌ Not configured"}')
    logger.info(f'🔧 OpenRouter: {"✅ Ready" if config.OPENROUTER_API_KEY else "❌ Not configured"}')
    
    # Initialize RAG system
    initialize_sentence_transformers()
    
    logger.info('AI ready ')
    
    app.run(host='0.0.0.0', port=config.PORT, debug=True)