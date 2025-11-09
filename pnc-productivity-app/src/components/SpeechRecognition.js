import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const SpeechRecognitionComponent = forwardRef(({ onSpeechResult, onSpeechError, onSpeechStart, onSpeechEnd, isListening, language = 'en-US' }, ref) => {
  const webViewRef = useRef(null);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif; 
                background: #f5f5f5;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            .status {
                font-size: 18px;
                margin-bottom: 20px;
                text-align: center;
                color: #333;
            }
            .listening {
                color: #F58025;
                font-weight: bold;
            }
            .result {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                min-height: 50px;
                width: 100%;
                max-width: 400px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="status" id="status">Ready for speech recognition</div>
        <div class="result" id="result">Speech will appear here...</div>
        
        <script>
            // Make functions global immediately
            let recognition;
            let isRecognizing = false;
            
            // Define functions at global scope first
            function startRecognition() {                
                if (!recognition) {
                    return;
                }
                
                if (isRecognizing) {                    return;
                }
                
                try {                    recognition.start();
                    document.getElementById('result').innerHTML = 'Starting to listen...'; called successfully');
                } catch (error) {
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'error',
                        message: error.message
                    }));
                }
            }
            
            function stopRecognition() {                
                if (recognition && isRecognizing) {
                    try {                        recognition.stop(); called successfully');
                    } catch (error) {
                    }
                }
            }
            
            // Make functions globally accessible
            window.startRecognition = startRecognition;
            window.stopRecognition = stopRecognition;
            
            async function initSpeechRecognition() {
                // Skip getUserMedia permission check since Expo already has permissions                
                if ('webkitSpeechRecognition' in window) {
                    recognition = new webkitSpeechRecognition();                } else if ('SpeechRecognition' in window) {
                    recognition = new SpeechRecognition();                } else {
                    document.getElementById('status').innerHTML = 'Speech recognition not supported';
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'error',
                        message: 'Speech recognition not supported'
                    }));
                    return false;
                }
                
                // Configure recognition settings
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = '${language}';
                recognition.maxAlternatives = 1;
                
                recognition.onstart = function() {
                    isRecognizing = true;
                    document.getElementById('status').innerHTML = '<span class="listening">🎤 Listening...</span>';
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'start'
                    }));
                };
                    }));
                };
                
                recognition.onresult = function(event) {
                    let finalTranscript = '';
                    let interimTranscript = '';
                    
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interimTranscript += transcript;
                        }
                    }
                    
                    const displayText = finalTranscript || interimTranscript;
                    document.getElementById('result').innerHTML = displayText || 'Listening...';
                    
                    if (finalTranscript) {
                        window.ReactNativeWebView?.postMessage(JSON.stringify({
                            type: 'result',
                            transcript: finalTranscript.trim()
                        }));
                    }
                };
                
                recognition.onerror = function(event) {
                    isRecognizing = false;
                    let errorMessage = event.error;
                    let displayMessage = 'Error: ' + event.error;
                    
                    // Provide more helpful error messages
                    switch(event.error) {
                        case 'not-allowed':
                        case 'service-not-allowed':
                            errorMessage = 'microphone-permission-denied';
                            displayMessage = 'Microphone access denied. Please allow microphone permission.';
                            break;
                        case 'network':
                            errorMessage = 'network-error';
                            displayMessage = 'Network error. Check your internet connection.';
                            break;
                        case 'audio-capture':
                            errorMessage = 'audio-capture-failed';
                            displayMessage = 'Audio capture failed. Check microphone.';
                            break;
                        case 'no-speech':
                            errorMessage = 'no-speech-detected';
                            displayMessage = 'No speech detected. Try speaking louder.';
                            break;
                    }
                    
                    document.getElementById('status').innerHTML = displayMessage;
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'error',
                        message: errorMessage
                    }));
                };
                
                recognition.onend = function() {
                    isRecognizing = false;
                    document.getElementById('status').innerHTML = 'Ready for speech recognition';
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'end'
                    }));
                };
                
                // Set initial status
                document.getElementById('status').innerHTML = 'Ready for speech recognition';
                
                return true;
            }
            
            // Initialize when page loads
            window.addEventListener('load', async function() {                try {
                    const result = await initSpeechRecognition();                    
                    // Test if the functions are properly defined                    
                    // Send a test message to React Native to confirm WebView is working
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'webview-ready',
                        message: 'WebView initialized successfully'
                    }));
                } catch (error) {
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'error',
                        message: 'WebView initialization failed: ' + error.message
                    }));
                }
            });
            
            // Make functions available globally for React Native to call
            window.startSpeechRecognition = function() {                startRecognition();
            };
            
            window.stopSpeechRecognition = function() {                stopRecognition();
            };
            
            // Listen for messages from React Native
            document.addEventListener('message', function(event) {                try {
                    const data = JSON.parse(event.data);                    if (data.action === 'start') {                        startRecognition();
                    } else if (data.action === 'stop') {                        stopRecognition();
                    }
                } catch (error) {
                }
            });
            
            // Also try window message handler as fallback
            window.addEventListener('message', function(event) {                try {
                    const data = JSON.parse(event.data);                    if (data.action === 'start') {                        startRecognition();
                    } else if (data.action === 'stop') {                        stopRecognition();
                    }
                } catch (error) {
                }
            });
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {    try {
      const data = JSON.parse(event.nativeEvent.data);      
      switch (data.type) {
        case 'webview-ready':          break;
        case 'start':          onSpeechStart && onSpeechStart();
          break;
        case 'result':          onSpeechResult && onSpeechResult(data.transcript);
          break;
        case 'error':          onSpeechError && onSpeechError(data.message);
          break;
        case 'end':          onSpeechEnd && onSpeechEnd();
          break;
      }
    } catch (error) {
      onSpeechError && onSpeechError('Failed to parse speech recognition data');
    }
  };

  // Add a WebView load handler
  const handleWebViewLoad = () => {    // Test if we can inject JavaScript
    webViewRef.current?.injectJavaScript(`      document.getElementById('status').innerHTML = 'JavaScript injection working';
      true;
    `);
  };

  const startListening = () => {    
    // Try direct JavaScript injection instead of postMessage
    webViewRef.current?.injectJavaScript(`      try {
        if (typeof startRecognition === 'function') {          startRecognition();
        } else {
        }
      } catch (error) {
      }
      true;
    `);
  };

  const stopListening = () => {    
    // Try direct JavaScript injection instead of postMessage
    webViewRef.current?.injectJavaScript(`      try {
        if (typeof stopRecognition === 'function') {          stopRecognition();
        } else {
        }
      } catch (error) {
      }
      true;
    `);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening
  }));

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoad={handleWebViewLoad}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onPermissionRequest={(request) => {
          request.grant();
        }}
        originWhitelist={['*']}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowsLinkPreview={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -1000, // Hide the WebView off-screen
    left: 0,
    width: width,
    height: 200,
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

export default SpeechRecognitionComponent;