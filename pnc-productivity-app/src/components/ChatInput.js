import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';

const ChatInput = ({ 
  value, 
  onChangeText, 
  onSend, 
  placeholder, 
  disabled, 
  onMicPress, 
  isListening,
  ttsEnabled,
  onTTSToggle,
  isSpeaking,
  onCancelRecording
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={onMicPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={isListening ? "Stop recording" : "Start recording"}
        >
          <Icon 
            name={isListening ? "radio-button-checked" : "mic"} 
            size={18} 
            color={colors.white} 
          />
        </TouchableOpacity>
        {isListening && (
          <TouchableOpacity
            style={styles.cancelRecordingButton}
            onPress={onCancelRecording}
            accessibilityRole="button"
            accessibilityLabel="Cancel recording"
          >
            <Text style={styles.cancelRecordingText}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[styles.textInput, disabled && styles.disabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={isListening ? "Listening..." : (placeholder || "Type your response...")}
          placeholderTextColor={colors.text.secondary}
          multiline
          editable={!disabled && !isListening}
        />
        
        <TouchableOpacity
          style={[styles.ttsButton, isSpeaking && styles.ttsButtonActive]}
          onPress={onTTSToggle}
          accessibilityRole="button"
          accessibilityLabel={isSpeaking ? "Disable text-to-speech" : "Enable text-to-speech"}
        >
          <Icon 
            name={isSpeaking ? "volume-off" : ttsEnabled ? "volume-up" : "volume-off"} 
            size={18} 
            color={colors.white} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.sendButton, (!value.trim() || disabled) && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!value.trim() || disabled}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Icon 
            name="send" 
            size={18} 
            color={colors.white} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.pnc.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  micButtonActive: {
    backgroundColor: colors.pnc.secondary, // PNC Orange when recording
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  disabled: {
    color: colors.text.secondary,
  },
  ttsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.pnc.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  ttsButtonActive: {
    backgroundColor: colors.pnc.secondary,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.pnc.secondary, // PNC Orange for primary action
    backgroundColor: colors.pnc.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.text.secondary,
  },
  cancelRecordingButton: {
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.pnc.secondary, // PNC Orange
    borderRadius: 16,
    alignSelf: 'flex-end'
  },
  cancelRecordingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  }
});

export default ChatInput;