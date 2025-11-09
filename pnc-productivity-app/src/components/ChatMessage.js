import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';

// Map category groups to pill colors (fallback to neutral)
const groupColors = {
  product_strategy: '#2563eb',
  requirements_development: '#7c3aed',
  customer_market_research: '#0d9488',
  prototyping_testing: '#db2777',
  go_to_market: '#ea580c',
  automation_agents: '#16a34a',
  prd_creation: '#4338ca',
  default: colors.pnc.primary,
};

const ChatMessage = ({ message, isUser, onOptionPress, onSpeakPress, onExportPress, onCategoryPress }) => {
  const category = message.meta?.category;
  const group = message.meta?.group;
  const pillColor = groupColors[group] || groupColors.default;
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <View style={styles.aiHeader}>
            <Text style={styles.aiLabel}>ProdigyPM Assistant</Text>
            {category && (
              <TouchableOpacity
                style={[styles.categoryPill, { backgroundColor: pillColor }]}
                onPress={() => onCategoryPress && onCategoryPress(message)}
                accessibilityRole="button"
                accessibilityLabel={`Category: ${category}. Tap to override.`}
              >
                <Text style={styles.categoryText}>{category.replace(/_/g,' ')}</Text>
              </TouchableOpacity>
            )}
            {onSpeakPress && (
              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => onSpeakPress(message.text)}
                accessibilityRole="button"
                accessibilityLabel="Speak message"
              >
                <Icon name="volume-up" size={18} color={colors.pnc.primary} />
              </TouchableOpacity>
            )}
            {onExportPress && (
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => onExportPress(message)}
                accessibilityRole="button"
                accessibilityLabel="Export message"
              >
                <Icon name="description" size={18} color={colors.pnc.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {message.text}
        </Text>

        {message.options && message.options.length > 0 && (
          <View style={styles.optionsContainer}>
            {message.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => onOptionPress(option)}
              >
                {option.iconName ? (
                  <Icon name={option.iconName} size={20} color={colors.pnc.primary} style={styles.optionIcon} />
                ) : (
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                )}
                <Text style={styles.optionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.pnc.primary,
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray.light,
    borderBottomLeftRadius: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.pnc.primary,
    flex: 1,
  },
  speakButton: {
    padding: 4,
    marginLeft: 8,
  },
  exportButton: {
    padding: 4,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.text.primary,
  },
  optionsContainer: {
    marginTop: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray.light,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
  },
});

export default ChatMessage;