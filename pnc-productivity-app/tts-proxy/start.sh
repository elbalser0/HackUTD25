#!/bin/bash

# Start the TTS Proxy Server with Google Application Credentials

# Get the absolute path to the service account JSON file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SERVICE_ACCOUNT_FILE="$PROJECT_DIR/pnc-productivity-app-f47d7b6f6c70.json"

# Check if the service account file exists
if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "❌ Error: Service account file not found at: $SERVICE_ACCOUNT_FILE"
    exit 1
fi

# Set the environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_FILE"

echo "🚀 Starting TTS Proxy Server..."
echo "📁 Using credentials: $SERVICE_ACCOUNT_FILE"
echo "🌐 Server will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js

