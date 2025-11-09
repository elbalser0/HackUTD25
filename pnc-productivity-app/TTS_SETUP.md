# Google Cloud Text-to-Speech Setup Guide

## Problem

The Google Cloud Text-to-Speech API **does not support API keys** for authentication. It requires **OAuth2 tokens**, which cannot be securely generated from a client-side React Native app.

The API key you got from Vertex AI Studio is only for Vertex AI services, not for Text-to-Speech.

## Solution: Backend Proxy

You need to create a backend proxy server that:
1. Handles OAuth2 authentication securely on the server
2. Forwards requests from your React Native app to Google Cloud TTS
3. Returns the audio data to your app

## Setup Steps

### 1. Enable Cloud Text-to-Speech API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `pnc-productivity-app`
3. Navigate to **APIs & Services** > **Library**
4. Search for "Cloud Text-to-Speech API"
5. Click **Enable**

### 2. Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "tts-proxy-service")
4. Click **Create and Continue**
5. Grant it the **Cloud Text-to-Speech API User** role
6. Click **Continue** then **Done**

### 3. Create Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Choose **JSON** format
5. Click **Create** - this downloads a JSON key file
6. **Keep this file secure** - never commit it to git!

### 4. Set Up Backend Proxy

#### Option A: Use the Example Proxy (Node.js/Express)

1. Create a new directory for your proxy server:
   ```bash
   mkdir tts-proxy
   cd tts-proxy
   ```

2. Initialize npm:
   ```bash
   npm init -y
   ```

3. Install dependencies:
   ```bash
   npm install express @google-cloud/text-to-speech cors
   ```

4. Copy `tts-proxy-example.js` to your proxy directory and rename it to `server.js`

5. Set the environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
   ```

6. Run the server:
   ```bash
   node server.js
   ```

7. The server will run on `http://localhost:3000` (or the PORT you set)

#### Option B: Deploy to Cloud Run (Recommended for Production)

1. Create a Dockerfile:
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 8080
   CMD ["node", "server.js"]
   ```

2. Build and deploy:
   ```bash
   gcloud builds submit --tag gcr.io/pnc-productivity-app/tts-proxy
   gcloud run deploy tts-proxy --image gcr.io/pnc-productivity-app/tts-proxy --platform managed
   ```

### 5. Update Your React Native App

Add to your `.env` file:
```
EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts
```

For production, use your deployed URL:
```
EXPO_PUBLIC_TTS_PROXY_URL=https://your-proxy-url.run.app/api/tts
```

### 6. Test

Restart your Expo app and try using text-to-speech. It should now work!

## Security Notes

- ✅ **DO**: Keep service account keys on the server only
- ✅ **DO**: Use environment variables for configuration
- ✅ **DO**: Deploy the proxy to a secure server (Cloud Run, Heroku, etc.)
- ❌ **DON'T**: Commit service account keys to git
- ❌ **DON'T**: Expose service account keys in client-side code
- ❌ **DON'T**: Use API keys for Text-to-Speech (they don't work)

## Troubleshooting

### Error: "TTS Proxy URL not configured"
- Make sure `EXPO_PUBLIC_TTS_PROXY_URL` is set in your `.env` file
- Restart your Expo development server after changing `.env`

### Error: "Failed to synthesize speech"
- Check that the Cloud Text-to-Speech API is enabled
- Verify your service account has the correct permissions
- Check that `GOOGLE_APPLICATION_CREDENTIALS` is set correctly on the server

### Error: "CORS error"
- Make sure your proxy server has CORS enabled (see `tts-proxy-example.js`)
- Check that your proxy URL is correct

## Alternative: Use a Different TTS Service

If setting up a backend proxy is too complex, consider:
- **Azure Cognitive Services Speech** - supports API keys
- **Amazon Polly** - supports API keys
- **ElevenLabs** - supports API keys

These services can work directly from your React Native app without a backend proxy.

