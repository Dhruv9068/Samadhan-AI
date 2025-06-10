#!/bin/bash

# 🚀 Samadhan AI - Quick IBM Cloud Deployment Script
# Hackathon-ready deployment automation

echo "🏆 Samadhan AI - IBM Cloud Deployment"
echo "====================================="

# Check if IBM Cloud CLI is installed
if ! command -v ibmcloud &> /dev/null; then
    echo "❌ IBM Cloud CLI not found. Please install it first:"
    echo "curl -fsSL https://clis.cloud.ibm.com/install/linux | sh"
    exit 1
fi

# Check if Cloud Foundry CLI is installed
if ! command -v cf &> /dev/null; then
    echo "❌ Cloud Foundry CLI not found. Please install it first:"
    echo "curl -L 'https://packages.cloudfoundry.org/stable?release=linux64-binary&source=github' | tar -zx"
    echo "sudo mv cf /usr/local/bin"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Login to IBM Cloud
echo "🔐 Logging into IBM Cloud..."
ibmcloud login

# Target Cloud Foundry
echo "🎯 Targeting Cloud Foundry..."
ibmcloud target --cf

# Create organization and space if they don't exist
echo "🏗️ Setting up organization and space..."
ibmcloud cf create-org samadhan-ai-org 2>/dev/null || true
ibmcloud cf create-space samadhan-ai-space -o samadhan-ai-org 2>/dev/null || true
ibmcloud target -o samadhan-ai-org -s samadhan-ai-space

# Deploy the application
echo "🚀 Deploying Samadhan AI to IBM Cloud..."
ibmcloud cf push samadhan-ai-backend -f manifest.yml

# Set environment variables
echo "🔧 Setting environment variables..."
ibmcloud cf set-env samadhan-ai-backend WATSONX_API_KEY "UFC2xNPCDeKALJHWsV6vKsEvH7EoPZcpTB08rdsgibaG"
ibmcloud cf set-env samadhan-ai-backend WATSONX_DEPLOYMENT_ID "3aaa4718-6122-49cf-bf7c-a2c122d62058"

# Restart to apply environment variables
echo "🔄 Restarting application..."
ibmcloud cf restart samadhan-ai-backend

# Get application info
echo "📊 Getting application information..."
APP_URL=$(ibmcloud cf app samadhan-ai-backend | grep "routes:" | awk '{print $2}')

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "🌐 Application URL: https://$APP_URL"
echo "🔍 Health Check: https://$APP_URL/health"
echo "🤖 AI Chat API: https://$APP_URL/api/ai/chat"
echo "📊 Dataset API: https://$APP_URL/api/up/data"
echo ""
echo "🏆 Your Samadhan AI is now live on IBM Cloud!"
echo ""
echo "📝 Next Steps:"
echo "1. Update your frontend VITE_BACKEND_URL to: https://$APP_URL"
echo "2. Test the health endpoint: curl https://$APP_URL/health"
echo "3. Test AI chat: curl -X POST https://$APP_URL/api/ai/chat -H 'Content-Type: application/json' -d '{\"message\":\"test\"}'"
echo ""
echo "🎯 Ready for hackathon demo!"