# 🔧 Troubleshooting "Network Request Failed"

## Current Configuration

Your `.env` file is set to:
```
EXPO_PUBLIC_TTS_PROXY_URL=http://10.169.181.50:3000/api/tts
```

## Common Issues & Solutions

### Issue 1: Phone and Computer on Different Networks

**Problem**: Your phone and computer must be on the **same WiFi network** for the local IP to work.

**Solution**: 
- Make sure both devices are connected to the same WiFi network
- Check your phone's WiFi settings to confirm

### Issue 2: Firewall Blocking Port 3000

**Problem**: Your computer's firewall might be blocking incoming connections on port 3000.

**Solution (macOS)**:
```bash
# Allow incoming connections on port 3000
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

Or manually:
1. Go to **System Settings** > **Network** > **Firewall**
2. Click **Options** or **Firewall Options**
3. Make sure Node.js is allowed, or add an exception for port 3000

### Issue 3: Proxy Server Not Running

**Problem**: The proxy server must be running before the app tries to use it.

**Solution**:
1. Make sure the proxy server is running:
   ```bash
   cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
   ./start.sh
   ```

2. Test it locally:
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok"}`

3. Test from your computer's IP:
   ```bash
   curl http://10.169.181.50:3000/health
   ```
   Should also return: `{"status":"ok"}`

### Issue 4: IP Address Changed

**Problem**: Your computer's IP address might have changed.

**Solution**: Find your current IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
```

Then update your `.env` file with the new IP.

### Issue 5: University/Corporate Network Restrictions

**Problem**: University or corporate networks often block peer-to-peer connections.

**Solution**: Use ngrok to create a tunnel:

1. **Install ngrok**:
   ```bash
   # macOS
   brew install ngrok
   # Or download from https://ngrok.com/download
   ```

2. **Start the proxy server** (in one terminal):
   ```bash
   cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
   ./start.sh
   ```

3. **Start ngrok tunnel** (in another terminal):
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (looks like `https://xxxx-xx-xx-xx-xx.ngrok-free.app`)

5. **Update your `.env` file**:
   ```
   EXPO_PUBLIC_TTS_PROXY_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/tts
   ```

6. **Restart Expo**

## Quick Test

Test if your phone can reach the proxy server:

1. Make sure proxy server is running
2. On your phone, open a browser
3. Go to: `http://10.169.181.50:3000/health`
4. You should see: `{"status":"ok"}`

If this doesn't work, your phone can't reach your computer, and you'll need to use ngrok.

## Alternative: Use ngrok (Recommended for University Networks)

If you're on a university network (like 129.x.x.x), ngrok is the most reliable solution:

```bash
# Terminal 1: Start proxy server
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/tts-proxy
./start.sh

# Terminal 2: Start ngrok
ngrok http 3000

# Copy the https URL from ngrok and update .env
# Then restart Expo
```

