import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';

const ButtonPrimary = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false, 
  style = {}, 
  variant = 'primary',
  noGradient = false 
}) => {
  const getButtonColors = () => {
    if (disabled) return [colors.gray.medium, colors.gray.medium];
    
    switch (variant) {
      case 'secondary':
        return [colors.pnc.lightBlue, colors.pnc.lightBlue];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return [colors.pnc.primary, colors.pnc.secondary];
    }
  };

  const getSolidColor = () => {
    if (disabled) return colors.gray.medium;
    
    switch (variant) {
      case 'secondary':
        return colors.pnc.lightBlue;
      case 'outline':
        return 'transparent';
      default:
        return colors.pnc.secondary; // Use orange for solid buttons
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.gray.dark;
    if (variant === 'outline') return colors.pnc.primary;
    return colors.white;
  };

  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.outlineButton,
    disabled && styles.disabled,
    style
  ];

  const contentStyle = [
    styles.gradient,
    noGradient && { backgroundColor: getSolidColor() }
  ];

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </>
  );

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {noGradient ? (
        <View style={contentStyle}>
          <ButtonContent />
        </View>
      ) : (
        <LinearGradient
          colors={getButtonColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={contentStyle}
        >
          <ButtonContent />
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.pnc.primary,
  },
  disabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default ButtonPrimary;