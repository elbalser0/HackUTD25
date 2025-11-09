/**
 * Google Cloud Text-to-Speech Backend Proxy Example
 * 
 * This is a simple Express.js server that acts as a proxy between your React Native app
 * and Google Cloud Text-to-Speech API. This keeps your service account credentials secure
 * on the server side.
 * 
 * To use this:
 * 1. Install dependencies: npm install express @google-cloud/text-to-speech
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account JSON file path
 * 3. Run: node tts-proxy-example.js
 * 4. Update your .env file: EXPO_PUBLIC_TTS_PROXY_URL=http://your-server-url:3000/api/tts
 */

const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Cloud Text-to-Speech client
// This will use Application Default Credentials (ADC)
// Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account JSON file
const client = new textToSpeech.TextToSpeechClient();

// TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { input, voice, audioConfig } = req.body;

    // Validate request
    if (!input || !input.text) {
      return res.status(400).json({ error: 'Missing required field: input.text' });
    }

    // Prepare request
    const request = {
      input: input || {},
      voice: voice || {
        languageCode: 'en-US',
        name: 'en-US-Neural2-C',
      },
      audioConfig: audioConfig || {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0,
        volumeGainDb: 0,
      },
    };

    // Call Google Cloud TTS API
    const [response] = await client.synthesizeSpeech(request);

    // Return audio content
    res.json({
      audioContent: response.audioContent.toString('base64'),
    });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    res.status(500).json({
      error: 'Failed to synthesize speech',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`TTS Proxy server running on port ${port}`);
  console.log(`Set EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:${port}/api/tts in your .env file`);
});

