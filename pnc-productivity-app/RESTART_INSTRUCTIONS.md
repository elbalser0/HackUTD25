# 🔄 Restart Instructions - Google Cloud TTS

## What I Fixed

1. ✅ Updated proxy server to listen on all interfaces (0.0.0.0)
2. ✅ Updated `.env` file to use your computer's IP: `http://10.169.181.50:3000/api/tts`
3. ✅ Verified the app is using GoogleTextToSpeechService (not expo-speech)

## Steps to Get It Working

### 1. Start the Proxy Server

Open a **new terminal window** and run:

```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
./start.sh
```

You should see:
```
🚀 Starting TTS Proxy Server...
📁 Using credentials: /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/pnc-productivity-app-f47d7b6f6c70.json
🌐 Server will run on: http://localhost:3000

TTS Proxy server running on port 3000
Server listening on all interfaces (0.0.0.0:3000)
```

**Keep this terminal open** - the proxy server needs to keep running!

### 2. Test the Proxy Server

In another terminal, test if it's working:

```bash
curl -X POST http://10.169.181.50:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"input":{"text":"Hello, this is a test"}}'
```

You should get back a JSON response with `audioContent` (a long base64 string).

### 3. Restart Your Expo App

**Stop your current Expo server** (Ctrl+C) and restart it:

```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app
npx expo start --tunnel
```

The app will now pick up the new `EXPO_PUBLIC_TTS_PROXY_URL` from your `.env` file.

### 4. Test in Your App

Try using text-to-speech in your app - it should now use Google Cloud TTS with the `en-US-Neural2-C` voice!

## Troubleshooting

### "Network request failed" error
- Make sure the proxy server is running
- Check that your computer and phone are on the same WiFi network
- Verify the IP address in `.env` matches your computer's IP (run `ifconfig | grep "inet "` to check)

### "TTS Proxy URL not configured" error
- Make sure `EXPO_PUBLIC_TTS_PROXY_URL` is in your `.env` file
- Restart Expo after changing `.env`

### Proxy server won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Kill any process using port 3000: `lsof -ti:3000 | xargs kill -9`
- Try a different port: `PORT=3001 node server.js`

### Still using old voice?
- Make sure you restarted Expo after updating `.env`
- Check the logs - you should see requests going to `http://10.169.181.50:3000/api/tts`
- Verify the proxy server is receiving requests (check the terminal where it's running)

