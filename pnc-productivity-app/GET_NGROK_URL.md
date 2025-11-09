# 🔍 Get Your Real ngrok URL

## The Problem

Your `.env` file has a placeholder URL: `https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/tts`

You need to replace this with your **actual** ngrok URL.

## Steps to Get Your Real ngrok URL

### Step 1: Make sure the proxy server is running

In Terminal 1:
```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
./start.sh
```

### Step 2: Start ngrok

In Terminal 2 (new terminal):
```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456-ghi789.ngrok-free.app -> http://localhost:3000
```

### Step 3: Copy the Forwarding URL

Copy the URL that looks like: `https://abc123-def456-ghi789.ngrok-free.app`

### Step 4: Update your .env file

```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app
# Replace YOUR_NGROK_URL with the actual URL from ngrok
sed -i '' 's|EXPO_PUBLIC_TTS_PROXY_URL=.*|EXPO_PUBLIC_TTS_PROXY_URL=https://YOUR_NGROK_URL/api/tts|' .env
```

For example, if your ngrok URL is `https://abc123-def456-ghi789.ngrok-free.app`, run:
```bash
sed -i '' 's|EXPO_PUBLIC_TTS_PROXY_URL=.*|EXPO_PUBLIC_TTS_PROXY_URL=https://abc123-def456-ghi789.ngrok-free.app/api/tts|' .env
```

### Step 5: Verify

```bash
grep TTS_PROXY .env
```

Should show your real ngrok URL (not the placeholder).

### Step 6: Restart Expo

Stop and restart your Expo server to pick up the new URL.

## Quick Script to Get ngrok URL Automatically

If ngrok is already running, you can get the URL with:

```bash
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4
```

Then update your .env file with that URL.

