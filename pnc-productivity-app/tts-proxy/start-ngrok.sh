#!/bin/bash

# Start the TTS Proxy Server and ngrok tunnel
# This makes the proxy accessible from anywhere

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
echo ""

# Start the proxy server in the background
node server.js &
PROXY_PID=$!

# Wait for server to start
sleep 2

# Check if server started successfully
if ! kill -0 $PROXY_PID 2>/dev/null; then
    echo "❌ Failed to start proxy server"
    exit 1
fi

echo "✅ Proxy server started (PID: $PROXY_PID)"
echo "🌐 Starting ngrok tunnel..."
echo ""

# Start ngrok tunnel
ngrok http 3000 &
NGROK_PID=$!

# Wait for ngrok to start
sleep 4

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Could not automatically get ngrok URL"
    echo ""
    echo "1. Check ngrok status at: http://localhost:4040"
    echo "2. Copy the 'Forwarding' URL (looks like https://xxxx-xx-xx-xx-xx.ngrok-free.app)"
    echo "3. Update your .env file with:"
    echo "   EXPO_PUBLIC_TTS_PROXY_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/tts"
    echo ""
    echo "Proxy server PID: $PROXY_PID"
    echo "ngrok PID: $NGROK_PID"
    echo ""
    echo "Press Ctrl+C to stop both servers"
else
    echo "✅ ngrok tunnel active!"
    echo "📝 Copy this line to your .env file:"
    echo ""
    echo "EXPO_PUBLIC_TTS_PROXY_URL=${NGROK_URL}/api/tts"
    echo ""
    echo "Or run this command:"
    echo "cd $PROJECT_DIR && sed -i '' 's|EXPO_PUBLIC_TTS_PROXY_URL=.*|EXPO_PUBLIC_TTS_PROXY_URL=${NGROK_URL}/api/tts|' .env"
    echo ""
    echo "Press Ctrl+C to stop both servers"
fi

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $PROXY_PID $NGROK_PID 2>/dev/null; exit" INT TERM
wait


