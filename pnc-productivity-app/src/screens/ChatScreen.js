import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ButtonPrimary from '../components/ButtonPrimary';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';
import globalStyles from '../styles/globalStyles';
import OpenAIService from '../api/openai/service';

const ChatScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFlow, setCurrentFlow] = useState(null);
  const [flowData, setFlowData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const scrollViewRef = useRef();

  const tools = [
    {
      id: 'strategy',
      title: 'Strategy & Ideation',
      icon: '💡',
      description: 'Generate innovative product ideas'
    },
    {
      id: 'prd',
      title: 'PRD Generator',
      icon: '📝',
      description: 'Create comprehensive Product Requirements Documents'
    },
    {
      id: 'backlog',
      title: 'Smart Backlog',
      icon: '📊',
      description: 'RICE framework prioritization with AI insights'
    },
    {
      id: 'research',
      title: 'Customer Research',
      icon: '🔍',
      description: 'Analyze customer feedback and sentiment'
    },
    {
      id: 'gtm',
      title: 'Go-to-Market Planning',
      icon: '🚀',
      description: 'Launch strategy and persona generation'
    }
  ];

  const conversationFlows = {
    strategy: {
      questions: [
        { key: 'business', question: 'What industry or business area are you working in?' },
        { key: 'audience', question: 'Who is your target audience?' },
        { key: 'problems', question: 'What problem areas or pain points should we address?' },
        { key: 'goals', question: 'What are your main business goals? (optional)' },
        { key: 'constraints', question: 'Any constraints I should know about? (budget, timeline, regulations, etc.)' }
      ],
      finalAction: 'generateIdeas'
    },
    prd: {
      questions: [
        { key: 'name', question: 'What\'s the name of your product?' },
        { key: 'audience', question: 'Who is the target audience for this product?' },
        { key: 'problem', question: 'What problem does this product solve?' },
        { key: 'solution', question: 'What\'s your proposed solution?' },
        { key: 'features', question: 'What are the key features? (optional)' },
        { key: 'metrics', question: 'How will you measure success? (optional)' }
      ],
      finalAction: 'generatePRD'
    },
    research: {
      questions: [
        { key: 'feedback', question: 'Please share the customer feedback you\'d like me to analyze. You can provide multiple pieces of feedback.' }
      ],
      finalAction: 'analyzeFeedback'
    },
    gtm: {
      questions: [
        { key: 'name', question: 'What\'s the name of your product?' },
        { key: 'audience', question: 'Who is your target audience?' },
        { key: 'timeline', question: 'What\'s your launch timeline?' },
        { key: 'features', question: 'What are the key features?' },
        { key: 'metrics', question: 'How will you measure success?' }
      ],
      finalAction: 'generateGTMPlan'
    }
  };

  useEffect(() => {
    // Generate AI welcome message
    const generateWelcome = async () => {
      try {
        setLoading(true);
        const welcomeText = await OpenAIService.generateWelcomeMessage(user?.displayName);
        
        const welcomeMessage = {
          id: Date.now(),
          text: welcomeText,
          isUser: false,
          options: tools.map(tool => ({
            id: tool.id,
            title: tool.title,
            icon: tool.icon,
            description: tool.description
          }))
        };
        setMessages([welcomeMessage]);
        
        // Initialize conversation history
        setConversationHistory([
          { role: 'assistant', content: welcomeText }
        ]);
      } catch (error) {
        console.error('Error generating welcome:', error);
        // Fallback message
        const fallbackMessage = {
          id: Date.now(),
          text: `Hello ${user?.displayName || 'there'}! 👋 I'm your ProdigyPM Assistant. How can I help you today?`,
          isUser: false,
          options: tools.map(tool => ({
            id: tool.id,
            title: tool.title,
            icon: tool.icon,
            description: tool.description
          }))
        };
        setMessages([fallbackMessage]);
      } finally {
        setLoading(false);
      }
    };

    generateWelcome();
  }, [user]);

  // Text-to-Speech functions
  const speak = async (text) => {
    if (!ttsEnabled || !text || isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      // Clean the text for better speech
      const cleanText = text
        .replace(/[*_#]/g, '') // Remove markdown
        .replace(/\n{2,}/g, '. ') // Replace multiple newlines
        .replace(/---/g, '') // Remove separators
        .trim();
        
      if (cleanText) {
        await Speech.speak(cleanText, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.9,
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setTtsEnabled(!ttsEnabled);
  };

  const addMessage = (text, isUser = false, options = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      isUser,
      options
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Speak AI messages if TTS is enabled
    if (!isUser && ttsEnabled) {
      speak(text);
    }
    
    // Auto scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleOptionPress = async (option) => {
    // Add user selection message
    addMessage(`I'd like to use: ${option.title}`, true);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, 
      { role: 'user', content: `I'd like to use: ${option.title}` }
    ]);
    
    // Start the conversation flow
    await startConversationFlow(option.id);
  };

  const startConversationFlow = async (toolId) => {
    setCurrentFlow(toolId);
    setCurrentStep(0);
    setFlowData({});
    
    try {
      setLoading(true);
      
      // Generate AI response for starting the tool
      const toolName = tools.find(t => t.id === toolId)?.title;
      const aiResponse = await OpenAIService.generateChatResponse(
        `User wants to use ${toolName}. Start helping them with this tool.`,
        {
          conversationHistory,
          currentTool: toolName,
          availableTools: tools
        }
      );
      
      setTimeout(() => {
        addMessage(aiResponse, false);
        setConversationHistory(prev => [...prev, 
          { role: 'assistant', content: aiResponse }
        ]);
      }, 500);
      
    } catch (error) {
      console.error('Error starting flow:', error);
      addMessage('I\'d be happy to help you with that! Let\'s get started.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, true);

    // Add to conversation history
    setConversationHistory(prev => [...prev, 
      { role: 'user', content: userMessage }
    ]);

    try {
      setLoading(true);
      
      if (currentFlow) {
        // Handle tool-specific conversation
        await handleToolConversation(userMessage);
      } else {
        // General conversation
        const aiResponse = await OpenAIService.generateChatResponse(
          userMessage,
          {
            conversationHistory,
            availableTools: tools
          }
        );
        
        setTimeout(() => {
          addMessage(aiResponse, false);
          setConversationHistory(prev => [...prev, 
            { role: 'assistant', content: aiResponse }
          ]);
        }, 500);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      addMessage('I apologize, but I encountered an error. Please try again.', false);
    } finally {
      setLoading(false);
    }
  };

  const handleToolConversation = async (userMessage) => {
    const flow = conversationFlows[currentFlow];
    if (!flow) return;

    const currentQuestion = flow.questions[currentStep];
    
    // Store the answer
    const newFlowData = {
      ...flowData,
      [currentQuestion.key]: userMessage
    };
    setFlowData(newFlowData);

    // Check if we have all required data
    const requiredFields = flow.questions.filter(q => !q.question.includes('optional')).map(q => q.key);
    const hasAllRequired = requiredFields.every(field => newFlowData[field]);
    
    if (currentStep < flow.questions.length - 1 && !hasAllRequired) {
      // Generate AI response for next question
      const toolName = tools.find(t => t.id === currentFlow)?.title;
      const nextQuestion = flow.questions[currentStep + 1];
      
      try {
        const aiResponse = await OpenAIService.generateChatResponse(
          `User answered: "${userMessage}". Now ask them: ${nextQuestion.question}`,
          {
            conversationHistory,
            currentTool: toolName
          }
        );
        
        setCurrentStep(currentStep + 1);
        
        setTimeout(() => {
          addMessage(aiResponse, false);
          setConversationHistory(prev => [...prev, 
            { role: 'assistant', content: aiResponse }
          ]);
        }, 500);
        
      } catch (error) {
        // Fallback to direct question
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          addMessage(`Great! ${nextQuestion.question}`, false);
        }, 500);
      }
    } else {
      // All questions answered, execute the action
      await executeFlowAction(currentFlow, newFlowData);
    }
  };

  const executeFlowAction = async (toolId, data) => {
    try {
      setLoading(true);
      
      // Generate AI response about starting the generation
      const toolName = tools.find(t => t.id === toolId)?.title;
      const startResponse = await OpenAIService.generateChatResponse(
        `User has provided all information for ${toolName}. Tell them you're now generating their deliverable.`,
        {
          conversationHistory,
          currentTool: toolName
        }
      );
      
      addMessage(startResponse, false);
      
      let result = '';
      
      switch (toolId) {
        case 'strategy':
          result = await OpenAIService.generateProductIdeas(data);
          break;
        case 'prd':
          result = await OpenAIService.generatePRD(data);
          break;
        case 'research':
          const feedbackItems = data.feedback.split('\n').filter(f => f.trim()).map((text, index) => ({
            id: index,
            text: text.trim(),
            rating: null
          }));
          result = await OpenAIService.analyzeFeedback(feedbackItems);
          break;
        case 'gtm':
          result = await OpenAIService.generateGTMPlan(data);
          break;
      }

      // Save document to storage
      await saveDocument(toolId, toolName, result, data);

      // Generate AI response for presenting the results
      const resultResponse = await OpenAIService.generateChatResponse(
        `Present this generated content to the user and ask if they want to work on something else: ${result}`,
        {
          conversationHistory,
          currentTool: toolName
        }
      );

      setTimeout(() => {
        addMessage(`${resultResponse}\n\n---\n\n${result}`, false, 
          tools.map(tool => ({
            id: tool.id,
            title: tool.title,
            icon: tool.icon,
            description: tool.description
          }))
        );
        
        setConversationHistory(prev => [...prev, 
          { role: 'assistant', content: resultResponse }
        ]);
      }, 1000);

    } catch (error) {
      console.error('Error executing flow:', error);
      addMessage('I apologize, but I encountered an error while generating your content. Please try again.', false);
    } finally {
      setLoading(false);
      setCurrentFlow(null);
      setCurrentStep(0);
      setFlowData({});
    }
  };

  const saveDocument = async (type, toolName, content, data) => {
    try {
      // Create document object
      const document = {
        id: Date.now() + Math.random(),
        type: type,
        title: getDocumentTitle(type, data),
        content: content,
        createdAt: Date.now(),
        toolName: toolName
      };

      // Load existing documents
      const existingDocsJson = await AsyncStorage.getItem('prodigypm_documents');
      const existingDocs = existingDocsJson ? JSON.parse(existingDocsJson) : [];
      
      // Add new document
      const updatedDocs = [document, ...existingDocs];
      
      // Save back to storage
      await AsyncStorage.setItem('prodigypm_documents', JSON.stringify(updatedDocs));
      
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const getDocumentTitle = (type, data) => {
    switch (type) {
      case 'strategy':
        return `Product Ideas - ${data.business || 'Strategy Session'}`;
      case 'prd':
        return `PRD - ${data.name || 'Product Requirements'}`;
      case 'research':
        return 'Customer Feedback Analysis';
      case 'gtm':
        return `GTM Plan - ${data.name || 'Go-to-Market Strategy'}`;
      default:
        return 'Generated Document';
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner message="AI is thinking..." />;
  }

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" backgroundColor={colors.pnc.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ProdigyPM Assistant</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.ttsButton, isSpeaking && styles.ttsButtonActive]}
            onPress={isSpeaking ? stopSpeaking : toggleTTS}
          >
            <Text style={styles.ttsIcon}>
              {isSpeaking ? '🔇' : ttsEnabled ? '🔊' : '🔇'}
            </Text>
            <Text style={styles.ttsText}>
              {isSpeaking ? 'Stop' : ttsEnabled ? 'TTS' : 'TTS'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.documentsButton}
            onPress={() => navigation.navigate('Documents')}
          >
            <Text style={styles.documentsIcon}>📄</Text>
            <Text style={styles.documentsText}>Docs</Text>
          </TouchableOpacity>
          
          <ButtonPrimary
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isUser={message.isUser}
            onOptionPress={handleOptionPress}
            onSpeakPress={!message.isUser ? speak : undefined}
          />
        ))}
        
        {loading && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>ProdigyPM Assistant is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Chat Input */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
        disabled={loading || !currentFlow}
        placeholder={currentFlow ? "Type your answer..." : "Select a tool from the options above"}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.pnc.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ttsButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  ttsIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  ttsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  documentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  documentsIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  documentsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.text.secondary,
  },
});

export default ChatScreen;