import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const SectionTitle = ({ 
  title, 
  subtitle, 
  style = {}, 
  titleStyle = {}, 
  subtitleStyle = {},
  size = 'medium',
  color = 'primary' 
}) => {
  const getTitleSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'xlarge':
        return 28;
      default:
        return 20;
    }
  };

  const getTitleColor = () => {
    switch (color) {
      case 'secondary':
        return colors.text.secondary;
      case 'white':
        return colors.white;
      case 'pnc':
        return colors.pnc.primary;
      default:
        return colors.text.primary;
    }
  };

  const titleStyles = [
    styles.title,
    {
      fontSize: getTitleSize(),
      color: getTitleColor(),
    },
    titleStyle,
  ];

  const subtitleStyles = [
    styles.subtitle,
    {
      color: color === 'white' ? colors.white : colors.text.secondary,
    },
    subtitleStyle,
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={titleStyles}>{title}</Text>
      {subtitle && (
        <Text style={subtitleStyles}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default SectionTitle;