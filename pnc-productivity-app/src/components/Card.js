import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const Card = ({ 
  children, 
  style = {}, 
  onPress, 
  elevated = true, 
  padding = 16,
  margin = 8 
}) => {
  const cardStyle = [
    styles.card,
    { padding, margin },
    elevated && styles.elevated,
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray.light,
  },
  elevated: {
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});

export default Card;