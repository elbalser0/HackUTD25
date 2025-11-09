#!/bin/bash

# Start the TTS Proxy Server with ngrok tunnel
# This makes the proxy accessible from anywhere, even if devices are on different networks

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

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Error: ngrok is not installed"
    echo "Install it from: https://ngrok.com/download"
    echo "Or use the regular start.sh script with your local IP address"
    exit 1
fi

echo "🚀 Starting TTS Proxy Server with ngrok tunnel..."
echo "📁 Using credentials: $SERVICE_ACCOUNT_FILE"
echo ""

# Start the proxy server in the background
node server.js &
PROXY_PID=$!

# Wait a moment for the server to start
sleep 2

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel on port 3000..."
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Could not get ngrok URL. Check ngrok status at http://localhost:4040"
    echo "Proxy server is running on PID: $PROXY_PID"
    echo "ngrok is running on PID: $NGROK_PID"
    echo ""
    echo "Update your .env file with the ngrok URL shown at http://localhost:4040"
else
    echo "✅ ngrok tunnel active!"
    echo "📝 Update your .env file with:"
    echo "   EXPO_PUBLIC_TTS_PROXY_URL=${NGROK_URL}/api/tts"
    echo ""
    echo "Press Ctrl+C to stop both servers"
fi

# Wait for user interrupt
trap "kill $PROXY_PID $NGROK_PID 2>/dev/null; exit" INT TERM
wait

