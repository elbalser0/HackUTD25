# 🚀 Start the TTS Proxy Server

## Quick Start

1. **Open a new terminal window** (keep your Expo server running in another terminal)

2. **Navigate to the proxy directory:**
   ```bash
   cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
   ```

3. **Start the proxy server:**
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="../pnc-productivity-app-f47d7b6f6c70.json"
   node server.js
   ```

4. **You should see:**
   ```
   🚀 Starting TTS Proxy Server...
   📁 Using credentials: /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/pnc-productivity-app-f47d7b6f6c70.json
   🌐 Server will run on: http://localhost:3000
   
   TTS Proxy server running on port 3000
   Set EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts in your .env file
   ```

5. **Keep this terminal open** - the proxy server needs to keep running

6. **Update your `.env` file** (if you haven't already):
   ```
   EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts
   ```

7. **Restart your Expo app** to pick up the new environment variable

## Test the Proxy

In another terminal, test if the proxy is working:

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"Hello, this is a test"}}'
```

You should get back a JSON response with `audioContent` (a long base64 string).

## Troubleshooting

### Port 3000 already in use?
Change the port:
```bash
PORT=3001 node server.js
```

Then update your `.env`:
```
EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3001/api/tts
```

### "Cannot find module" error?
Run:
```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
npm install
```

### "Failed to synthesize speech" error?
- Make sure Cloud Text-to-Speech API is enabled in Google Cloud Console
- Check that the service account has the **Cloud Text-to-Speech API User** role
- Verify the service account JSON file path is correct

