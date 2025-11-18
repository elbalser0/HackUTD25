# PRD – AI-Powered Product Management App

[Link to video demonstration](https://youtube.com/shorts/Nzir0v0KA9k?si=HdfX-uPyVgYdhOxy)


## 1. Overview

### Product Name

**ProdigyPM** – “AI-Driven Productivity for Product Managers”

### Purpose

ProdigyPM empowers Product Managers to plan, prioritize, and launch products faster through AI-assisted workflows. It embeds artificial intelligence across the entire product lifecycle—connecting strategy, research, development, and go-to-market execution—within one mobile workspace.

### Core Tech Stack
* **Frontend:** React Native (Expo)
* **Backend / Cloud:** Firebase (Auth, Firestore, Storage, Functions)
* **AI Engine:** OpenAI API (GPT-4 or GPT-4o)
* **Analytics & Monitoring:** Firebase Analytics, Crashlytics
* **Collaboration:** Firestore real-time sync, notifications

⠀
⸻

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher recommended)
* **npm** or **yarn** package manager
* **Expo CLI** (installed globally via `npm install -g expo-cli` or use `npx expo`)
* **Firebase account** with a project created
* **OpenAI API key** (get one from [OpenAI Platform](https://platform.openai.com/))
* **Google Cloud account** (optional, only needed for Text-to-Speech features)

### Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd HackUTD25/pnc-productivity-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `pnc-productivity-app` directory with the following variables:
   
   ```env
   # Firebase Configuration (required for production)
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # OpenAI API Configuration (required)
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key
   
   # Optional OpenAI Configuration
   EXPO_PUBLIC_OPENAI_MODEL=gpt-4
   EXPO_PUBLIC_OPENAI_FAST_MODEL=gpt-4o-mini
   EXPO_PUBLIC_FAST_MODE=true
   EXPO_PUBLIC_OPENAI_TIMEOUT_MS=15000
   
   # Text-to-Speech Proxy (optional, only if using TTS features)
   EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts
   
   # Development Mode (optional - enables mock Firebase for testing without real credentials)
   EXPO_PUBLIC_USE_MOCK_AUTH=false
   ```
   
   **Note:** To get your Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to Project Settings → General
   - Scroll down to "Your apps" and select the web app (or add one)
   - Copy the configuration values from the `firebaseConfig` object

4. **Start the Expo development server:**
   ```bash
   npm start
   # or
   expo start
   ```
   
   Then choose your platform:
   - Press `i` for iOS simulator (requires Xcode on macOS)
   - Press `a` for Android emulator (requires Android Studio)
   - Scan the QR code with Expo Go app on your physical device
   - Press `w` to open in web browser

   Or use platform-specific commands:
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

### Backend Setup (Optional - Text-to-Speech Proxy)

The TTS proxy server is only needed if you want to use Google Cloud Text-to-Speech features. This keeps your Google Cloud service account credentials secure on the server side.

1. **Set up Google Cloud Text-to-Speech:**
   - Create a Google Cloud project
   - Enable the Cloud Text-to-Speech API
   - Create a service account and download the JSON key file
   - Place the service account JSON file in `pnc-productivity-app/` directory (e.g., `pnc-productivity-app-f47d7b6f6c70.json`)

2. **Set up the TTS proxy server:**
   ```bash
   cd pnc-productivity-app
   ./setup-tts-proxy.sh
   ```
   
   Or manually:
   ```bash
   cd tts-proxy
   npm install
   export GOOGLE_APPLICATION_CREDENTIALS="../pnc-productivity-app-f47d7b6f6c70.json"
   npm start
   ```
   
   The server will run on `http://localhost:3000` by default.

3. **Update your `.env` file:**
   ```env
   EXPO_PUBLIC_TTS_PROXY_URL=http://localhost:3000/api/tts
   ```
   
   **Note:** If running on a physical device, replace `localhost` with your computer's IP address (e.g., `http://192.168.1.100:3000/api/tts`).

### Firebase Configuration

1. **Deploy Firestore Security Rules:**
   
   The app includes Firestore security rules in `firestore.rules`. Deploy them to your Firebase project:
   
   ```bash
   # Install Firebase CLI if you haven't already
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project (if not already done)
   cd pnc-productivity-app
   firebase init firestore
   
   # Deploy the rules
   firebase deploy --only firestore:rules
   ```
   
   **Important:** The Firestore rules enforce user authentication and data isolation. Users can only access their own documents and workspace data they're members of.

2. **Enable Firebase Authentication:**
   - Go to Firebase Console → Authentication
   - Enable Email/Password authentication (or other providers you want to use)

### Testing & Demo

1. **Test the app:**
   - Launch the app using `expo start`
   - Create a test account using the Sign Up flow
   - Try the AI chat assistant to generate PRDs, analyze feedback, or prioritize backlog items

2. **Mock Mode (Development without Firebase):**
   
   If you want to test the app without setting up Firebase, you can enable mock mode:
   
   ```env
   EXPO_PUBLIC_USE_MOCK_AUTH=true
   ```
   
   This will use mock Firebase services, but AI features will still require a valid OpenAI API key.

3. **Demo Account:**
   - Currently, there's no pre-seeded demo account
   - Create your own account through the Sign Up flow
   - All data is stored in your Firebase project


### Known Limitations & TODOs

**Current Limitations:**
- Text-to-Speech requires a separate proxy server setup (Google Cloud credentials needed)
- Firestore rules must be manually deployed
- No offline mode for AI features (requires internet connection)
- Mock auth mode has limited functionality (no real data persistence)


### Troubleshooting

**Common Issues:**
- **"OpenAI API error"**: Check that `EXPO_PUBLIC_OPENAI_API_KEY` is set correctly in your `.env` file
- **"Firebase not initialized"**: Ensure all Firebase environment variables are set, or enable mock mode
- **"TTS Proxy error"**: Make sure the TTS proxy server is running and `EXPO_PUBLIC_TTS_PROXY_URL` points to the correct address
- **Firestore permission errors**: Deploy the Firestore security rules using `firebase deploy --only firestore:rules`
- **Expo start fails**: Try clearing the cache with `expo start -c` or `npm start -- --clear`

**Need Help?**
- Check the [Expo documentation](https://docs.expo.dev/)
- Review [Firebase documentation](https://firebase.google.com/docs)
- Open an issue in the repository

⠀
⸻

## 2. Target Users
* **Primary:** Product Managers in financial and regulated industries (e.g., banking, fintech, insurance)
* **Secondary:** Product Analysts, UX Researchers, and Product Owners seeking AI-enhanced workflow support
* **Pain Points:**
  * Time-consuming documentation and backlog management
  * Scattered customer research and feedback
  * Difficulty aligning strategy, design, and delivery
  * Manual sprint planning and stakeholder updates

⠀
⸻

## 3. Problem Statement

Product Managers struggle to manage data-driven decisions and deliver faster in regulated environments. ProdigyPM leverages AI to unify ideation, research, development, and delivery into a single platform—reducing manual effort while maintaining compliance and accuracy.

⸻

## 4. Product Objectives
1. **Accelerate speed-to-market** with AI-assisted documentation and prioritization.
2. **Enhance decision quality** through AI-generated insights from customer and market data.
3. **Simplify collaboration** by integrating planning, research, and reporting tools.
4. **Enable scalability and compliance** for complex, regulated product lifecycles.

⠀
⸻

## 5. Key Features

### A. Product Strategy & Ideation
* AI brainstorm assistant: generate product ideas from goals or customer pain points
* Market sizing & scenario modeling (AI prompts for TAM/SAM/SOM, SWOT)
* Vision board: connect product vision → KPIs → roadmap milestones

⠀
### B. Requirements & Development
* AI user story generator: converts feature ideas into stories with acceptance criteria
* RICE or MoSCoW prioritization matrix with AI-calculated effort and impact scores
* Smart backlog: suggests grooming and sprint planning actions
* Firebase Firestore stores all stories, tasks, and RICE data

⠀
### C. Customer & Market Research
* Upload or import customer feedback (CSV, text, etc.)
* AI sentiment analysis and trend clustering (via OpenAI embeddings)
* Competitor summary cards and auto-generated insight reports

⠀
### D. Prototyping & Testing
* Generate wireframe suggestions (text → layout preview)
* AI-driven test case generation based on user stories
* Collect feedback in-app and summarize top UX insights

⠀
### E. Go-to-Market Execution
* Persona generator: AI creates personas from product data
* GTM checklist: tasks for marketing, compliance, and launch readiness
* Auto-draft release notes and stakeholder briefs

⠀
### F. Automation & Intelligent Agents
* Daily summary agent: compiles key updates from the workspace
* Auto sprint planner: assigns tasks based on capacity and RICE score
* Report bot: generates weekly PM reports from Firestore data
* Notification system via Firebase Cloud Messaging

⠀
⸻

## 6. User Flow (High-Level)
1. **Sign Up / Login** → Firebase Auth
2. **Create Project** → Firestore collection initialized
3. **AI Assistant Onboarding** → Suggests structure and templates
4. **Add Data Inputs** → Features, feedback, goals
5. **Generate Insights / Docs** → OpenAI API
6. **Collaborate & Automate** → Sprint updates, reports, GTM

⠀
⸻

## 7. Non-Functional Requirements
* **Performance:** < 1 sec response for UI actions; < 4 sec for AI responses
* **Scalability:** Supports 5000+ active users via Firebase Firestore + Cloud Functions
* **Security:** Firebase Auth + Firestore Rules + encrypted API keys
* **Compliance:** Data anonymization for regulated datasets
* **Offline support:** Firestore local cache for limited functionality

⠀
