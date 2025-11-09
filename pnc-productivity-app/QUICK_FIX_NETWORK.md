# 🚨 Quick Fix: Network Request Timed Out

## Problem
Your phone can't reach `http://10.169.181.50:3000/api/tts` - the request is timing out.

## Solution: Use ngrok to Tunnel the Proxy Server

### Option 1: Install ngrok via Homebrew (Recommended)

```bash
brew install ngrok/ngrok/ngrok
```

### Option 2: Install ngrok Manually

1. Download from: https://ngrok.com/download
2. Extract and move to `/usr/local/bin/`:
   ```bash
   unzip ngrok.zip
   sudo mv ngrok /usr/local/bin/
   ```

### Option 3: Use ngrok Web (No Installation)

1. Go to https://dashboard.ngrok.com/get-started/setup
2. Sign up for a free account
3. Get your authtoken
4. Run: `ngrok config add-authtoken YOUR_TOKEN`

## Once ngrok is installed:

### Step 1: Start the Proxy Server

In Terminal 1:
```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
./start.sh
```

Keep this running!

### Step 2: Start ngrok Tunnel

In Terminal 2:
```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding   https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

### Step 3: Copy the ngrok URL

Copy the `https://xxxx-xx-xx-xx-xx.ngrok-free.app` URL

### Step 4: Update Your .env File

```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app
# Replace with your actual ngrok URL
echo "EXPO_PUBLIC_TTS_PROXY_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/tts" >> .env
```

Or edit `.env` manually and set:
```
EXPO_PUBLIC_TTS_PROXY_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/tts
```

### Step 5: Restart Expo

Stop and restart your Expo server to pick up the new environment variable.

## Alternative: Use Your Computer's Public IP (If on Same Network)

If both devices are on the same WiFi network, try:

1. Find your computer's IP on the network:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Make sure your firewall allows connections on port 3000

3. Test from your phone's browser: `http://YOUR_IP:3000/health`

But ngrok is the most reliable solution!

