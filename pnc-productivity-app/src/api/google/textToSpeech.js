import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Paths, File } from 'expo-file-system';

// Backend proxy URL (required)
// Set this to your backend proxy endpoint that handles Google Cloud TTS authentication
const TTS_PROXY_URL = process.env.EXPO_PUBLIC_TTS_PROXY_URL;

class GoogleTextToSpeechService {
  constructor() {
    this.baseURL = 'https://texttospeech.googleapis.com/v1';
    this.voice = 'en-US-Neural2-C';
    this.languageCode = 'en-US';
    this.currentSound = null;
  }

  /**
   * Synthesize speech from text using Google Cloud Text-to-Speech API via backend proxy
   * @param {string} text - The text to synthesize
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} - Base64 encoded audio data
   */
  async synthesize(text, options = {}) {
    try {
      
      if (!TTS_PROXY_URL) {
        const errorMsg = 'TTS Proxy URL not configured. Please set EXPO_PUBLIC_TTS_PROXY_URL in your .env file.\n\n' +
          'The Google Cloud Text-to-Speech API requires OAuth2 authentication, which cannot be done securely from a client-side app.\n' +
          'You need to set up a backend proxy server. See tts-proxy-example.js for an example implementation.\n\n' +
          'Quick setup:\n' +
          '1. Create a service account in Google Cloud Console\n' +
          '2. Enable Cloud Text-to-Speech API\n' +
          '3. Deploy the backend proxy (see tts-proxy-example.js)\n' +
          '4. Set EXPO_PUBLIC_TTS_PROXY_URL to your proxy URL';
        throw new Error(errorMsg);
      }

      const requestBody = {
        input: {
          text: text,
        },
        voice: {
          languageCode: options.languageCode || this.languageCode,
          name: options.voice || this.voice,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: options.speakingRate || 1.5,
          pitch: options.pitch || 0,
          volumeGainDb: options.volumeGainDb || 0,
        },
      };

      const response = await fetch(TTS_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = `TTS Proxy error: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.audioContent; // Base64 encoded audio
    } catch (error) {
        message: error.message,
        stack: error.stack,
        TTS_PROXY_URL: TTS_PROXY_URL
      });
      throw error;
    }
  }

  /**
   * Synthesize and play speech from text
   * @param {string} text - The text to synthesize and play
   * @param {Object} options - Optional configuration
   * @returns {Promise<Object>} - Audio playback object with stop method and callbacks
   */
  async speak(text, options = {}) {
    try {
      
      // Stop any currently playing audio
      if (this.currentSound) {
        try {
          await this.currentSound.unloadAsync();
        } catch (error) {
          // Ignore errors when stopping previous audio
        }
        this.currentSound = null;
      }

      const audioContent = await this.synthesize(text, options);
      
      // Create a temporary file using the new expo-file-system API
      // Use Paths.cache for the cache directory
      const fileName = `tts_${Date.now()}.mp3`;
      const file = new File(Paths.cache, fileName);
      const fileUri = file.uri;
      
      // Create the file (may throw if it already exists, but we use unique timestamp)
      try {
        file.create();
      } catch (error) {
        // File might already exist, that's okay
      }
      
      // Convert base64 to binary and write to file using the new API
      // Convert base64 string to Uint8Array
      const binaryString = atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      file.write(bytes);
      
      // Create and play audio using expo-av
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );

      this.currentSound = sound;

      // Set up playback status update listener
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          // Clean up when playback finishes
          sound.unloadAsync().catch(() => {});
          if (this.currentSound === sound) {
            this.currentSound = null;
          }
          // Clean up the temporary file using the new API
          try {
            file.delete();
          } catch (error) {
            // Ignore errors when deleting file
          }
          if (options.onDone) {
            options.onDone();
          }
        }
        if (status.error) {
          if (options.onError) {
            options.onError(status.error);
          }
        }
      });

      return {
        sound,
        stop: async () => {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
            if (this.currentSound === sound) {
              this.currentSound = null;
            }
            // Clean up the temporary file using the new API
            try {
              file.delete();
            } catch (error) {
            }
            if (options.onStopped) {
              options.onStopped();
            }
          } catch (error) {
          }
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stop any currently playing audio
   */
  async stop() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      } catch (error) {
      }
    }
  }
}

export default new GoogleTextToSpeechService();

