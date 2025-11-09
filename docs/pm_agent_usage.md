# ProdigyPM Agent – Usage Guide

This guide outlines how to use the Product Manager Agent features in the app.

## Key capabilities
- Category-aware assistance across strategy, requirements, research, prototyping/testing, GTM, automation, and PRD creation
- Voice input with on-device recording and cloud transcription
- PDF export for structured outputs

## Using the assistant
1. Open the chat and pick a tool or type a question.
2. Speak using the mic. While recording, you can cancel. The placeholder shows a live timer.
3. The assistant classifies your request and responds in a structured, concise format.
4. Tap the category pill on AI messages to override the category and regenerate.
5. Tap the 📄 icon to export as a PDF and share.

## Categories
See `src/constants/pmCategories.js` for taxonomy and `src/constants/pmPrompts.js` for response templates.

## Tips
- For PRD requests, the app switches to a guided PRD flow.
- Use fast mode for quicker, concise answers (enabled by default).

## Troubleshooting
- If transcription fails, check microphone permissions.
- If export fails, try again or ensure storage permissions are granted on Android.
