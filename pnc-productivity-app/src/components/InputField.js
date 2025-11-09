import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error = '',
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style = {},
  required = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputStyle = [
    styles.input,
    multiline && styles.multilineInput,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    disabled && styles.inputDisabled,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon name={leftIcon} size={20} color={colors.gray.medium} />
          </View>
        )}
        
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray.medium}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Icon 
              name={isPasswordVisible ? 'visibility-off' : 'visibility'} 
              size={20} 
              color={colors.gray.medium} 
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
          >
            <Icon name={rightIcon} size={20} color={colors.gray.medium} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray.light,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text.primary,
  },
  inputFocused: {
    borderColor: colors.pnc.secondary, // PNC Orange when focused
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.gray.light,
    color: colors.gray.medium,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});

export default InputField;