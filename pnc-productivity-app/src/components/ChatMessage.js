import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Markdown from 'react-native-markdown-display';
import colors from '../constants/colors';

// Map category groups to pill colors (fallback to neutral)
const groupColors = {
  product_strategy: colors.pnc.primary, // PNC Blue
  requirements_development: '#7c3aed',
  customer_market_research: '#0d9488',
  prototyping_testing: colors.pnc.secondary, // PNC Orange
  go_to_market: colors.pnc.secondary, // PNC Orange
  automation_agents: '#16a34a',
  prd_creation: colors.pnc.darkBlue, // Dark PNC Blue
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

        {isUser ? (
          <Text style={[styles.messageText, styles.userText]}>
            {message.text}
          </Text>
        ) : (
          <Markdown
            style={markdownStyles(false)}
          >
            {message.text}
          </Markdown>
        )}

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
    borderWidth: 2,
    borderColor: colors.pnc.secondary, // PNC Orange border for emphasis
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

// Markdown styling function
const markdownStyles = (isUser) => {
  const baseTextColor = isUser ? colors.white : colors.text.primary;
  const baseTextSize = 16;
  const baseLineHeight = 22;

  return {
    body: {
      color: baseTextColor,
      fontSize: baseTextSize,
      lineHeight: baseLineHeight,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
      color: baseTextColor,
      fontSize: baseTextSize,
      lineHeight: baseLineHeight,
    },
    heading1: {
      fontSize: 24,
      fontWeight: '700',
      color: baseTextColor,
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 30,
    },
    heading2: {
      fontSize: 20,
      fontWeight: '700',
      color: baseTextColor,
      marginTop: 14,
      marginBottom: 8,
      lineHeight: 26,
    },
    heading3: {
      fontSize: 18,
      fontWeight: '600',
      color: baseTextColor,
      marginTop: 12,
      marginBottom: 6,
      lineHeight: 24,
    },
    heading4: {
      fontSize: 16,
      fontWeight: '600',
      color: baseTextColor,
      marginTop: 10,
      marginBottom: 6,
      lineHeight: 22,
    },
    heading5: {
      fontSize: 14,
      fontWeight: '600',
      color: baseTextColor,
      marginTop: 8,
      marginBottom: 4,
      lineHeight: 20,
    },
    heading6: {
      fontSize: 12,
      fontWeight: '600',
      color: baseTextColor,
      marginTop: 6,
      marginBottom: 4,
      lineHeight: 18,
    },
    strong: {
      fontWeight: '700',
      color: baseTextColor,
    },
    em: {
      fontStyle: 'italic',
      color: baseTextColor,
    },
    code_inline: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
      color: baseTextColor,
      fontSize: baseTextSize - 2,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
      color: baseTextColor,
      fontSize: baseTextSize - 2,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
      overflow: 'hidden',
    },
    fence: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
      color: baseTextColor,
      fontSize: baseTextSize - 2,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
      overflow: 'hidden',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: isUser ? 'rgba(255, 255, 255, 0.5)' : colors.pnc.primary,
      paddingLeft: 12,
      marginVertical: 8,
      color: baseTextColor,
      fontStyle: 'italic',
    },
    list_item: {
      color: baseTextColor,
      fontSize: baseTextSize,
      lineHeight: baseLineHeight,
      marginBottom: 4,
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    link: {
      color: isUser ? colors.white : colors.pnc.primary,
      textDecorationLine: 'underline',
    },
    hr: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.3)' : colors.gray.medium,
      height: 1,
      marginVertical: 16,
    },
    table: {
      marginVertical: 8,
      borderWidth: 1,
      borderColor: isUser ? 'rgba(255, 255, 255, 0.3)' : colors.gray.medium,
      borderRadius: 4,
    },
    thead: {
      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
    },
    th: {
      padding: 8,
      fontWeight: '600',
      color: baseTextColor,
      borderBottomWidth: 1,
      borderBottomColor: isUser ? 'rgba(255, 255, 255, 0.3)' : colors.gray.medium,
    },
    td: {
      padding: 8,
      color: baseTextColor,
      borderBottomWidth: 1,
      borderBottomColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: isUser ? 'rgba(255, 255, 255, 0.2)' : colors.gray.light,
    },
  };
};

export default ChatMessage;