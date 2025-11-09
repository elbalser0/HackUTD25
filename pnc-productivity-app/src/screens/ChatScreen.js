import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
  Modal,
  FlatList,
	Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import LoadingSpinner from "../components/LoadingSpinner";
// Deprecated WebView speech component (not functional on mobile); retained for fallback removal later
// import SpeechRecognitionComponent from '../components/SpeechRecognition';
import colors from "../constants/colors";
import globalStyles from "../styles/globalStyles";
import OpenAIService from "../api/openai/service";
import { CATEGORY_DEFINITIONS, ALL_CATEGORIES } from "../constants/pmCategories";
import { createDocument } from "../api/firebase/firestore";

const ChatScreen = ({ navigation }) => {
	const { user, signOut } = useAuth();
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentFlow, setCurrentFlow] = useState(null);
	const [flowData, setFlowData] = useState({});
	const [currentStep, setCurrentStep] = useState(0);
	const [conversationHistory, setConversationHistory] = useState([]);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [ttsEnabled, setTtsEnabled] = useState(true);
	const [isListening, setIsListening] = useState(false);
	const [currentTranscript, setCurrentTranscript] = useState("");
	const [recordingSeconds, setRecordingSeconds] = useState(0);
	const recordingTimerRef = useRef(null);
	const [categoryModalVisible, setCategoryModalVisible] = useState(false);
	const [categoryOverrideMessage, setCategoryOverrideMessage] = useState(null);
	const [menuModalVisible, setMenuModalVisible] = useState(false);
	const scrollViewRef = useRef();
	const speechRecognitionRef = useRef();
	const recordingRef = useRef(null);

	const tools = [
		{
			id: "product_strategy",
			title: "Product Strategy & Ideation",
			icon: "💡",
			iconName: "lightbulb-outline",
			description: "Brainstorming, market sizing, scenario planning, and aligning customer needs with business goals.",
		},
		{
			id: "requirements_development",
			title: "Requirements & Development",
			icon: "📝",
			iconName: "description",
			description: "Drafting user stories, acceptance criteria, and backlog grooming with AI-assisted clarity and prioritization.",
		},
		{
			id: "customer_market_research",
			title: "Customer & Market Research",
			icon: "�",
			description: "Synthesizing customer feedback, competitor activity, and industry trends into actionable insights.",
		},
		{
			id: "prototyping_testing",
			title: "Prototyping & Testing",
			icon: "🎨",
			iconName: "palette",
			description: "Generating wireframes, mockups, or test cases and iterating with synthetic or real user feedback.",
		},
		{
			id: "go_to_market",
			title: "Go-to-Market Execution",
			icon: "🚀",
			iconName: "rocket-launch",
			description: "Assisting in persona development, Go-to-Market (GTM) strategy, release notes, and stakeholder communication.",
		},
		{
			id: "automation_agents",
			title: "Automation & Intelligent Agents",
			icon: "🤖",
			iconName: "smart-toy",
			description: "Automating repetitive Product Manager workflows such as sprint planning, reporting, and cross-team updates.",
		},
	];

	const conversationFlows = {
		strategy: {
			questions: [
				{
					key: "business",
					question: "What industry or business area are you working in?",
				},
				{ key: "audience", question: "Who is your target audience?" },
				{
					key: "problems",
					question: "What problem areas or pain points should we address?",
				},
				{
					key: "goals",
					question: "What are your main business goals? (optional)",
				},
				{
					key: "constraints",
					question:
						"Any constraints I should know about? (budget, timeline, regulations, etc.)",
				},
			],
			finalAction: "generateIdeas",
		},
		prd: {
			questions: [
				{ key: "name", question: "What's the name of your product?" },
				{
					key: "audience",
					question: "Who is the target audience for this product?",
				},
				{ key: "problem", question: "What problem does this product solve?" },
				{ key: "solution", question: "What's your proposed solution?" },
				{ key: "features", question: "What are the key features? (optional)" },
				{
					key: "metrics",
					question: "How will you measure success? (optional)",
				},
			],
			finalAction: "generatePRD",
		},
		research: {
			questions: [
				{
					key: "feedback",
					question:
						"Please share the customer feedback you'd like me to analyze. You can provide multiple pieces of feedback.",
				},
			],
			finalAction: "analyzeFeedback",
		},
		gtm: {
			questions: [
				{ key: "name", question: "What's the name of your product?" },
				{ key: "audience", question: "Who is your target audience?" },
				{ key: "timeline", question: "What's your launch timeline?" },
				{ key: "features", question: "What are the key features?" },
				{ key: "metrics", question: "How will you measure success?" },
			],
			finalAction: "generateGTMPlan",
		},
	};

	useEffect(() => {
		// Generate AI welcome message
		const generateWelcome = async () => {
			try {
				setLoading(true);
				const welcomeText = await OpenAIService.generateWelcomeMessage(
					user?.displayName
				);

				const welcomeMessage = {
					id: Date.now(),
					text: welcomeText,
					isUser: false,
					options: tools.map((tool) => ({
						id: tool.id,
						title: tool.title,
						icon: tool.icon,
						iconName: tool.iconName,
						description: tool.description,
					})),
				};
				setMessages([welcomeMessage]);

				// Initialize conversation history
				setConversationHistory([{ role: "assistant", content: welcomeText }]);
			} catch (error) {
				console.error("Error generating welcome:", error);
				// Fallback message
				const fallbackMessage = {
					id: Date.now(),
					text: `Hello ${
						user?.displayName || "there"
					}! I'm your ProdigyPM Assistant. How can I help you today?`,
					isUser: false,
					options: tools.map((tool) => ({
						id: tool.id,
						title: tool.title,
						icon: tool.icon,
						iconName: tool.iconName,
						description: tool.description,
					})),
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
				.replace(/[*_#]/g, "") // Remove markdown
				.replace(/\n{2,}/g, ". ") // Replace multiple newlines
				.replace(/---/g, "") // Remove separators
				.trim();

			if (cleanText) {
				await Speech.speak(cleanText, {
					language: "en-US",
					pitch: 1.0,
					rate: 0.9,
					onDone: () => setIsSpeaking(false),
					onStopped: () => setIsSpeaking(false),
					onError: () => setIsSpeaking(false),
				});
			} else {
				setIsSpeaking(false);
			}
		} catch (error) {
			console.error("Speech error:", error);
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

	// Real Speech Recognition functions using WebView
	const handleSpeechStart = () => {
		setIsListening(true);
		setInputText("Listening...");
	};

	const handleSpeechResult = (transcript) => {
		setInputText(transcript);
		setCurrentTranscript(transcript);
	};

	const handleSpeechError = (error) => {
		console.error("Speech recognition error:", error);
		setIsListening(false);
		setInputText("");

		let title = "Speech Error";
		let message = "";

		switch (error) {
			case "microphone-permission-denied":
				title = "Microphone Permission Required";
				message =
					"Please allow microphone access in your browser settings to use speech recognition.";
				break;
			case "network-error":
				title = "Network Error";
				message = "Please check your internet connection and try again.";
				break;
			case "audio-capture-failed":
				title = "Audio Capture Failed";
				message =
					"Unable to access microphone. Please check your device settings.";
				break;
			case "no-speech-detected":
				title = "No Speech Detected";
				message = "Try speaking louder or closer to the microphone.";
				break;
			case "Speech recognition not supported":
				title = "Feature Not Available";
				message = "Speech recognition is not supported on this device.";
				break;
			default:
				message = `Speech recognition failed: ${error}`;
		}

		Alert.alert(title, message);
	};

	const handleSpeechEnd = () => {
		setIsListening(false);
	};

	const startListening = async () => {
		// New flow: record audio with expo-av, then transcribe with OpenAI
		try {
			console.log("Starting audio recording for transcription...");
			const perm = await Audio.requestPermissionsAsync();
			if (!perm.granted) {
				Alert.alert(
					"Microphone Permission",
					"Please allow microphone access to use voice input."
				);
				return;
			}

			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
				staysActiveInBackground: false,
				interruptionModeIOS: 1,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false,
			});

			const recording = new Audio.Recording();
			await recording.prepareToRecordAsync(
				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
			);
			await recording.startAsync();
			recordingRef.current = recording;
			setIsListening(true);
			setRecordingSeconds(0);
			if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
			recordingTimerRef.current = setInterval(() => {
				setRecordingSeconds((s) => s + 1);
			}, 1000);
			setCurrentTranscript("");
			console.log("Recording started");
		} catch (error) {
			console.error("Error starting recording:", error);
			setIsListening(false);
			Alert.alert("Error", "Failed to start recording.");
		}
	};

	const stopListening = async () => {
		// New flow: stop recording and transcribe
		try {
			const recording = recordingRef.current;
			if (!recording) {
				setIsListening(false);
				return;
			}

			console.log("Stopping recording...");
			await recording.stopAndUnloadAsync();
			const uri = recording.getURI();
			recordingRef.current = null;
			setIsListening(false);
			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
				recordingTimerRef.current = null;
			}
			console.log("Recording stopped, file:", uri);

			if (!uri) {
				Alert.alert("Error", "No audio captured.");
				return;
			}

			// Transcribe with OpenAI
			setLoading(true);
			const text = await OpenAIService.transcribeAudio(uri, { language: "en" });
			console.log("Transcription result:", text);
			
			if (text && text.trim()) {
				// Automatically send the transcribed message
				setInputText("");
				addMessage(text.trim(), true);
				setConversationHistory((prev) => [...prev, { role: "user", content: text.trim() }]);
				
				// Process the message
				try {
					if (currentFlow) {
						await handleToolConversation(text.trim());
					} else {
						// Category classification + specialized generation
						const { classifyUserMessage } = await import("../utils/classifier.js");
						const classification = await classifyUserMessage(text.trim());
						console.log("Classification result", classification);
						if (classification.category) {
							// Map PRD_creation to existing PRD flow for a guided experience
							if (classification.category === 'PRD_creation') {
								await startConversationFlow('prd');
								return;
							}
							const aiPayload = await OpenAIService.generateCategoryResponse(
								classification.category,
								text.trim(),
								{ conversationHistory }
							);
							// Attach group and source text for override/regeneration and logging
							const group = CATEGORY_DEFINITIONS[classification.category]?.group || null;
							addMessage(aiPayload.text, false, null, { category: classification.category, group, structured: aiPayload.structured, exportable: true, sourceUserText: text.trim(), confidence: classification.confidence, via: classification.via });
							setConversationHistory((prev) => [
								...prev,
								{ role: "assistant", content: aiPayload.text },
							]);
						} else {
							const fallback = await OpenAIService.generateChatResponse(text.trim(), {
								conversationHistory,
								availableTools: tools,
							});
							addMessage(fallback, false);
							setConversationHistory((prev) => [
								...prev,
								{ role: "assistant", content: fallback },
							]);
						}
					}
				} catch (processingError) {
					console.error("Error processing transcribed message:", processingError);
					addMessage("I apologize, but I encountered an error. Please try again.", false);
				}
			} else {
				setInputText("");
			}
		} catch (error) {
			console.error("Error stopping/processing recording:", error);
			Alert.alert("Transcription Error", "Could not transcribe your audio.");
		} finally {
			setLoading(false);
			try {
				await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
			} catch {}
		}
	};

	const handleMicPress = () => {
		console.log("Microphone button pressed, isListening:", isListening);
		if (isListening) {
			console.log("Stopping speech recognition");
			stopListening();
		} else {
			console.log("Starting speech recognition");
			startListening();
		}
	};

	const handleCancelRecording = () => {
		if (isListening) {
			stopListening();
		}
	};

	const addMessage = (text, isUser = false, options = null, meta = null) => {
		const newMessage = {
			id: Date.now() + Math.random(),
			text,
			isUser,
			options,
			meta,
		};
		setMessages((prev) => [...prev, newMessage]);

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
		addMessage(`I'd like help with: ${option.title}`, true);

		// Add to conversation history
		setConversationHistory((prev) => [
			...prev,
			{ role: "user", content: `I'd like help with: ${option.title}` },
		]);

		// Generate AI response explaining the category group capabilities
		try {
			setLoading(true);
			const aiResponse = await OpenAIService.generateChatResponse(
				`User selected "${option.title}". Briefly explain what you can help them with in this area (2-3 sentences), then ask what specific task they'd like to work on.`,
				{
					conversationHistory,
					availableTools: tools,
				}
			);
			addMessage(aiResponse, false);
			setConversationHistory((prev) => [
				...prev,
				{ role: "assistant", content: aiResponse },
			]);
		} catch (error) {
			console.error("Error responding to category selection:", error);
			addMessage(
				`Great! I can help you with ${option.title}. What would you like to work on?`,
				false
			);
		} finally {
			setLoading(false);
		}
	};

	const startConversationFlow = async (toolId) => {
		// Legacy flow support - only for old 'prd' flow trigger
		setCurrentFlow(toolId);
		setCurrentStep(0);
		setFlowData({});

		try {
			setLoading(true);

			// Generate AI response for starting the tool
			const toolName = tools.find((t) => t.id === toolId)?.title || toolId;
			const aiResponse = await OpenAIService.generateChatResponse(
				`User wants to use ${toolName}. Start helping them with this tool.`,
				{
					conversationHistory,
					currentTool: toolName,
					availableTools: tools,
				}
			);

			addMessage(aiResponse, false);
			setConversationHistory((prev) => [
				...prev,
				{ role: "assistant", content: aiResponse },
			]);
		} catch (error) {
			console.error("Error starting flow:", error);
			addMessage(
				"I'd be happy to help you with that! Let's get started.",
				false
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!inputText.trim()) return;
		const userMessage = inputText.trim();
		setInputText("");
		addMessage(userMessage, true);
		// Track user message in history
		setConversationHistory((prev) => [...prev, { role: "user", content: userMessage }]);
		try {
			setLoading(true);
			if (currentFlow) {
				await handleToolConversation(userMessage);
			} else {
				// Category classification + specialized generation
				const { classifyUserMessage } = await import("../utils/classifier.js");
				const classification = await classifyUserMessage(userMessage);
				console.log("Classification result", classification);
				if (classification.category) {
					// Map PRD_creation to existing PRD flow for a guided experience
					if (classification.category === 'PRD_creation') {
						await startConversationFlow('prd');
						return;
					}
					const aiPayload = await OpenAIService.generateCategoryResponse(
						classification.category,
						userMessage,
						{ conversationHistory }
					);
					// Attach group and source text for override/regeneration and logging
					const group = CATEGORY_DEFINITIONS[classification.category]?.group || null;
					addMessage(aiPayload.text, false, null, { category: classification.category, group, structured: aiPayload.structured, exportable: true, sourceUserText: userMessage, confidence: classification.confidence, via: classification.via });
					setConversationHistory((prev) => [
						...prev,
						{ role: "assistant", content: aiPayload.text },
					]);
				} else {
					const fallback = await OpenAIService.generateChatResponse(userMessage, {
						conversationHistory,
						availableTools: tools,
					});
					addMessage(fallback, false);
					setConversationHistory((prev) => [
						...prev,
						{ role: "assistant", content: fallback },
					]);
				}
			}
		} catch (error) {
			console.error("Error handling message:", error);
			addMessage("I apologize, but I encountered an error. Please try again.", false);
		} finally {
			setLoading(false);
		}
	};

  const handleCategoryPress = (message) => {
    setCategoryOverrideMessage(message);
    setCategoryModalVisible(true);
  };

  const handleSelectCategory = async (newCategory) => {
    if (!categoryOverrideMessage) return;
    try {
      setLoading(true);
      const sourceText = categoryOverrideMessage.meta?.sourceUserText || '';
      const aiPayload = await OpenAIService.generateCategoryResponse(
        newCategory,
        sourceText,
        { conversationHistory }
      );
      const group = CATEGORY_DEFINITIONS[newCategory]?.group || null;
      setMessages(prev => prev.map(m => m.id === categoryOverrideMessage.id ? {
        ...m,
        text: aiPayload.text,
        meta: { ...(m.meta || {}), category: newCategory, group, structured: aiPayload.structured, exportable: true }
      } : m));
    } catch (e) {
      Alert.alert('Category Update Failed', 'Could not regenerate the response for the selected category.');
    } finally {
      setLoading(false);
      setCategoryModalVisible(false);
      setCategoryOverrideMessage(null);
    }
  };

	const handleToolConversation = async (userMessage) => {
		const flow = conversationFlows[currentFlow];
		if (!flow) return;
		const currentQuestion = flow.questions[currentStep];
		const newFlowData = { ...flowData, [currentQuestion.key]: userMessage };
		setFlowData(newFlowData);
		const requiredFields = flow.questions
			.filter((q) => !q.question.includes("optional"))
			.map((q) => q.key);
		const hasAllRequired = requiredFields.every((field) => newFlowData[field]);
		if (currentStep < flow.questions.length - 1 && !hasAllRequired) {
			const toolName = tools.find((t) => t.id === currentFlow)?.title;
			const nextQuestion = flow.questions[currentStep + 1];
			try {
				const aiResponse = await OpenAIService.generateChatResponse(
					`User answered: "${userMessage}". Now ask them: ${nextQuestion.question}`,
					{ conversationHistory, currentTool: toolName }
				);
				setCurrentStep(currentStep + 1);
				addMessage(aiResponse, false);
				setConversationHistory((prev) => [
					...prev,
					{ role: "assistant", content: aiResponse },
				]);
			} catch (error) {
				setCurrentStep(currentStep + 1);
				addMessage(`Great! ${nextQuestion.question}`, false);
			}
		} else {
			await executeFlowAction(currentFlow, newFlowData);
		}
	};

	const executeFlowAction = async (toolId, data) => {
		try {
			setLoading(true);
			const toolName = tools.find((t) => t.id === toolId)?.title || toolId;
			const startResponse = await OpenAIService.generateChatResponse(
				`User has provided all information for ${toolName}. Tell them you're now generating their deliverable.`,
				{ conversationHistory, currentTool: toolName }
			);
			addMessage(startResponse, false);
			let result = "";
			let shouldExportPDF = false;
			switch (toolId) {
				case "strategy":
					result = await OpenAIService.generateProductIdeas(data);
					shouldExportPDF = true;
					break;
				case "prd":
					result = await OpenAIService.generatePRD(data);
					shouldExportPDF = true;
					break;
				case "research":
					const feedbackItems = data.feedback
						.split("\n")
						.filter((f) => f.trim())
						.map((text, index) => ({ id: index, text: text.trim(), rating: null }));
					result = await OpenAIService.analyzeFeedback(feedbackItems);
					shouldExportPDF = true;
					break;
				case "gtm":
					result = await OpenAIService.generateGTMPlan(data);
					shouldExportPDF = true;
					break;
				default:
					result = "";
			}
			await saveDocument(toolId, toolName, result, data);
			
			// Auto-generate PDF for important documents
			if (shouldExportPDF && result) {
				try {
					const { exportTextToPDF } = await import("../utils/pdfExport.js");
					const docTitle = getDocumentTitle(toolId, data);
					const pdfTitle = `ProdigyPM_${toolId}_${new Date().toISOString().slice(0,10)}`;
					await exportTextToPDF({ 
						text: result, 
						title: pdfTitle,
						category: toolId 
					});
					console.log(`PDF exported successfully for ${docTitle}`);
				} catch (pdfError) {
					console.error('Auto PDF export failed:', pdfError);
					// Don't block the flow if PDF fails
				}
			}
			
			const resultResponse = await OpenAIService.generateChatResponse(
				`Present this generated content to the user and ask if they want to work on something else: ${result}`,
				{ conversationHistory, currentTool: toolName }
			);
			
			const resultMessage = shouldExportPDF 
				? `${resultResponse}\n\n---\n\n${result}\n\n📄 PDF exported and ready to share!`
				: `${resultResponse}\n\n---\n\n${result}`;
			
			addMessage(
				resultMessage,
				false,
				tools.map((tool) => ({
					id: tool.id,
					title: tool.title,
					icon: tool.icon,
					description: tool.description,
				})),
				{ exportable: shouldExportPDF, category: toolId }
			);
			setConversationHistory((prev) => [...prev, { role: "assistant", content: resultResponse }]);
		} catch (error) {
			console.error("Error executing flow:", error);
			addMessage(
				"I apologize, but I encountered an error while generating your content. Please try again.",
				false
			);
		} finally {
			setLoading(false);
			setCurrentFlow(null);
			setCurrentStep(0);
			setFlowData({});
		}
	};

	const saveDocument = async (type, toolName, content, data) => {
		if (!user?.uid) {
			console.error("Cannot save document: user not authenticated");
			return;
		}

		try {
			const documentData = {
				type,
				title: getDocumentTitle(type, data),
				content,
				toolName,
			};
			await createDocument(user.uid, documentData);
		} catch (error) {
			console.error("Error saving document:", error);
		}
	};

	const getDocumentTitle = (type, data) => {
		switch (type) {
			case "strategy":
				return `Product Ideas - ${data.business || "Strategy Session"}`;
			case "prd":
				return `PRD - ${data.name || "Product Requirements"}`;
			case "research":
				return "Customer Feedback Analysis";
			case "gtm":
				return `GTM Plan - ${data.name || "Go-to-Market Strategy"}`;
			default:
				return "Generated Document";
		}
	};

	const handleExportMessage = async (message) => {
		try {
			const { exportTextToPDF } = await import("../utils/pdfExport.js");
			const title = `ProdigyPM_${message.meta?.category || 'assistant'}_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}`;
			const result = await exportTextToPDF({ text: message.text, title, category: message.meta?.category });
			// Update message with pdf uri
			setMessages(prev => prev.map(m => m.id === message.id ? { ...m, meta: { ...m.meta, pdf: result.uri, exported: true } } : m));
		} catch (error) {
			console.error('PDF export failed', error);
			Alert.alert('Export Error', 'Failed to export PDF.');
		}
	};

	const handleLogout = async () => {
		Alert.alert("Logout", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					try {
						await signOut();
					} catch (error) {
						Alert.alert("Error", "Failed to sign out");
					}
				},
			},
		]);
	};

	if (loading && messages.length === 0) {
		return <LoadingSpinner message="AI is thinking..." />;
	}

	return (
		<KeyboardAvoidingView
			style={globalStyles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
		>
			<StatusBar style="light" backgroundColor={colors.pnc.primary} />

			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerTitleContainer}>
					<Image
						source={require("../../assets/logo.png")}
						style={styles.logo}
						resizeMode="contain"
					/>
					<Text style={styles.headerTitle} numberOfLines={1}>
						ProdigyPM Assistant
					</Text>
				</View>

				<TouchableOpacity
					style={styles.menuButton}
					onPress={() => setMenuModalVisible(true)}
					activeOpacity={0.7}
				>
					<View style={styles.hamburgerIcon}>
						<View style={styles.hamburgerLine} />
						<View style={styles.hamburgerLine} />
						<View style={styles.hamburgerLine} />
					</View>
				</TouchableOpacity>
			</View>

			{/* Chat Messages */}
			<ScrollView
				ref={scrollViewRef}
				style={styles.chatContainer}
				showsVerticalScrollIndicator={false}
				onContentSizeChange={() =>
					scrollViewRef.current?.scrollToEnd({ animated: true })
				}
			>
				{messages.map((message) => (
					<ChatMessage
						key={message.id}
						message={message}
						isUser={message.isUser}
						onOptionPress={handleOptionPress}
						onSpeakPress={!message.isUser ? speak : undefined}
						onExportPress={!message.isUser && message.meta?.exportable ? handleExportMessage : undefined}
						onCategoryPress={!message.isUser ? handleCategoryPress : undefined}
					/>
				))}

				{loading && (
					<View style={styles.typingBubbleContainer}>
						<View style={styles.typingBubble}>
							<Text style={styles.typingDots}>●●●</Text>
						</View>
					</View>
				)}
			</ScrollView>

			{/* Chat Input anchored at bottom */}
			<View style={styles.inputWrapper}>
				<ChatInput
					value={inputText}
					onChangeText={setInputText}
					onSend={handleSendMessage}
					disabled={loading}
					placeholder={
						currentFlow ? "Type your answer..." : (isListening ? `Listening ${formatSeconds(recordingSeconds)}` : "Select an option above")
					}
					onMicPress={handleMicPress}
					isListening={isListening}
					ttsEnabled={ttsEnabled}
					onTTSToggle={toggleTTS}
					isSpeaking={isSpeaking}
          onCancelRecording={handleCancelRecording}
				/>
			</View>

			{/* Category override modal */}
			<Modal
				transparent
				visible={categoryModalVisible}
				animationType="fade"
				onRequestClose={() => setCategoryModalVisible(false)}
			>
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Change category</Text>
						<FlatList
							data={ALL_CATEGORIES}
							keyExtractor={(item) => item}
							renderItem={({ item }) => (
								<TouchableOpacity style={styles.modalItem} onPress={() => handleSelectCategory(item)}>
									<Text style={styles.modalItemText}>{item.replace(/_/g,' ')}</Text>
								</TouchableOpacity>
							)}
						/>
						<TouchableOpacity style={styles.modalCancel} onPress={() => setCategoryModalVisible(false)}>
							<Text style={styles.modalCancelText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

			{/* Menu Modal */}
			<Modal
				transparent
				visible={menuModalVisible}
				animationType="fade"
				onRequestClose={() => setMenuModalVisible(false)}
			>
				<TouchableOpacity
					style={styles.menuModalBackdrop}
					activeOpacity={1}
					onPress={() => setMenuModalVisible(false)}
				>
					<View style={styles.menuModalCard}>
						<TouchableOpacity
							style={styles.menuItem}
							onPress={() => {
								setMenuModalVisible(false);
								navigation.navigate("Documents");
							}}
						>
							<Text style={styles.menuItemText}>Documents</Text>
						</TouchableOpacity>
						<View style={styles.menuDivider} />
						<TouchableOpacity
							style={styles.menuItem}
							onPress={() => {
								setMenuModalVisible(false);
								handleLogout();
							}}
						>
							<Text style={[styles.menuItemText, styles.menuItemDanger]}>Sign Out</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			{/* WebView speech recognition removed in favor of native audio recording + server transcription */}
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	inputWrapper: {
		backgroundColor: colors.white,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingBottom: Platform.OS === "ios" ? 20 : 8,
	},
	header: {
		backgroundColor: colors.pnc.primary,
		paddingHorizontal: 12,
		paddingVertical: 12,
		paddingTop: 60,
		flexDirection: "row",
		justifyContent: "space-between", // left title, right actions
		alignItems: "center",
	},
	headerTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	logo: {
		width: 32,
		height: 32,
		marginRight: 8,
	},
	headerTitle: {
		// move title to the left and keep vertically centered
		fontSize: 20,
		fontWeight: "600",
		color: colors.white,
		textAlign: "left",
		alignSelf: "center",
	},
	menuButton: {
		padding: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	hamburgerIcon: {
		width: 24,
		height: 18,
		justifyContent: "space-between",
	},
	hamburgerLine: {
		width: 24,
		height: 2,
		backgroundColor: colors.white,
		borderRadius: 1,
	},
	menuModalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-start",
		alignItems: "flex-end",
		paddingTop: 60,
		paddingRight: 12,
	},
	menuModalCard: {
		backgroundColor: colors.white,
		borderRadius: 12,
		minWidth: 180,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 8,
		overflow: "hidden",
	},
	menuItem: {
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	menuItemText: {
		fontSize: 16,
		fontWeight: "500",
		color: colors.text.primary,
	},
	menuItemDanger: {
		color: colors.error,
	},
	menuDivider: {
		height: 1,
		backgroundColor: colors.gray.light,
		marginHorizontal: 12,
	},
	chatContainer: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	typingBubbleContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		alignItems: 'flex-start',
	},
	typingBubble: {
		backgroundColor: colors.white,
		borderWidth: 2,
		borderColor: colors.pnc.secondary, // PNC Orange border for AI typing
		borderRadius: 20,
		borderBottomLeftRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	typingDots: {
		fontSize: 24,
		color: colors.pnc.secondary, // PNC Orange dots
		letterSpacing: 2,
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalCard: {
		width: '80%',
		maxHeight: '70%',
		backgroundColor: colors.white,
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: colors.border
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 12,
		color: colors.text.primary
	},
	modalItem: {
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: colors.border
	},
	modalItemText: {
		fontSize: 14,
		color: colors.text.primary,
		textTransform: 'capitalize'
	},
	modalCancel: {
		marginTop: 12,
		alignSelf: 'flex-end',
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: colors.pnc.secondary, // PNC Orange for action button
		borderRadius: 8
	},
	modalCancelText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600'
	}
});

export default ChatScreen;

// util within module (kept simple; not exported)
function formatSeconds(total) {
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${s.toString().padStart(2,'0')}`;
}
