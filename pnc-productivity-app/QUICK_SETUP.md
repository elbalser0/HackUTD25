# Quick Setup Guide - Google Cloud Text-to-Speech

## ✅ Step 1: Verify Service Account Permissions

Your service account is: `pnchackutd@pnc-productivity-app.iam.gserviceaccount.com`

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `pnc-productivity-app`
3. Go to **IAM & Admin** > **Service Accounts**
4. Click on `pnchackutd@pnc-productivity-app.iam.gserviceaccount.com`
5. Go to **Permissions** tab
6. Make sure it has the **Cloud Text-to-Speech API User** role (or **Editor** role)

If it doesn't have the right permissions:
- Click **Grant Access**
- Add role: **Cloud Text-to-Speech API User**
- Click **Save**

## ✅ Step 2: Enable Cloud Text-to-Speech API

1. Go to [APIs & Services](https://console.cloud.google.com/apis/library)
2. Search for "Cloud Text-to-Speech API"
3. Click **Enable**

## ✅ Step 3: Set Up the Proxy Server

### Option A: Use the Setup Script (Easiest)

```bash
cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app
./setup-tts-proxy.sh
```

Then follow the instructions it prints.

### Option B: Manual Setup

1. **Create proxy directory:**
   ```bash
   cd /Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app
   mkdir tts-proxy
   cd tts-proxy
   ```

2. **Copy the proxy server file:**
   ```bash
   cp ../tts-proxy-example.js server.js
   ```

3. **Create package.json:**
   ```bash
   npm init -y
   npm install express @google-cloud/text-to-speech cors
   ```

4. **Set the environment variable:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/dcc/Documents/GitHub/HackUTD25/pnc-productivity-app/pnc-productivity-app-f47d7b6f6c70.json"
   ```

5. **Start the server:**
   ```bash
   node server.js
   ```

   You should see:
   ```
   TTS Proxy server running on port 3000
   Set EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts in your .env file
   ```

## ✅ Step 4: Update Your .env File

Add this line to your `.env` file in the `pnc-productivity-app` directory:

```
EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts
```

## ✅ Step 5: Test It

1. **Test the proxy server:**
   ```bash
   curl -X POST http://localhost:3000/api/tts \
     -H "Content-Type: application/json" \
     -d '{"input":{"text":"Hello, this is a test"}}'
   ```

   You should get back a JSON response with `audioContent`.

2. **Restart your Expo app:**
   ```bash
   npm start
   ```

3. **Try text-to-speech in your app** - it should now work!

## 🔧 Troubleshooting

### Error: "Failed to synthesize speech"
- Make sure Cloud Text-to-Speech API is enabled
- Check that the service account has the right permissions
- Verify `GOOGLE_APPLICATION_CREDENTIALS` is set correctly

### Error: "Cannot find module '@google-cloud/text-to-speech'"
- Run `npm install` in the `tts-proxy` directory

### Error: "CORS error" in the app
- Make sure the proxy server is running
- Check that `EXPO_PUBLIC_TTS_PROXY_URL` is set correctly in `.env`
- Restart your Expo development server after changing `.env`

### The proxy server won't start
- Check that port 3000 is not already in use
- Try a different port: `PORT=3001 node server.js`
- Update `.env` with the new port

## 🚀 For Production

When deploying to production, you'll need to:
1. Deploy the proxy server to a hosting service (Cloud Run, Heroku, etc.)
2. Update `EXPO_PUBLIC_TTS_PROXY_URL` to your production URL
3. Make sure the service account JSON is securely stored on the server

