#!/bin/bash

# Google Cloud Text-to-Speech Proxy Setup Script
# This script helps you set up the backend proxy server

echo "🚀 Setting up Google Cloud Text-to-Speech Proxy Server"
echo ""

# Check if service account JSON file exists
SERVICE_ACCOUNT_FILE="pnc-productivity-app-f47d7b6f6c70.json"
if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ Error: Service account file '$SERVICE_ACCOUNT_FILE' not found!"
    echo "   Please make sure the file is in the current directory."
    exit 1
fi

echo "✅ Found service account file: $SERVICE_ACCOUNT_FILE"
echo ""

# Get absolute path to the service account file
ABSOLUTE_PATH=$(cd "$(dirname "$SERVICE_ACCOUNT_FILE")" && pwd)/$(basename "$SERVICE_ACCOUNT_FILE")
echo "📁 Absolute path: $ABSOLUTE_PATH"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Create proxy directory if it doesn't exist
PROXY_DIR="tts-proxy"
if [ ! -d "$PROXY_DIR" ]; then
    echo "📁 Creating proxy directory: $PROXY_DIR"
    mkdir -p "$PROXY_DIR"
fi

# Copy proxy server file
echo "📋 Setting up proxy server files..."
cp tts-proxy-example.js "$PROXY_DIR/server.js"

# Create package.json for proxy if it doesn't exist
if [ ! -f "$PROXY_DIR/package.json" ]; then
    echo "📦 Creating package.json for proxy server..."
    cat > "$PROXY_DIR/package.json" << EOF
{
  "name": "tts-proxy",
  "version": "1.0.0",
  "description": "Google Cloud Text-to-Speech Proxy Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@google-cloud/text-to-speech": "^5.0.0",
    "cors": "^2.8.5"
  }
}
EOF
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PROXY_DIR"
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Set the environment variable:"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=\"$ABSOLUTE_PATH\""
echo ""
echo "2. Start the proxy server:"
echo "   cd $PROXY_DIR"
echo "   npm start"
echo ""
echo "3. Update your .env file with:"
echo "   EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts"
echo ""
echo "4. Restart your Expo app"
echo ""


