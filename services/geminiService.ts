import { GoogleGenAI } from "@google/genai";
import type { UploadedFile, ChatMessage } from '../types';

const fileToGenerativePart = async (file: UploadedFile) => {
  const base64String = file.dataUrl.split(',')[1];
  return {
    inlineData: {
      data: base64String,
      mimeType: file.file.type,
    },
  };
};

export const getAiChatResponse = async (history: ChatMessage[], prompt: string, images: UploadedFile[]) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const language = 'Arabic'; // Hardcoded language

  const systemInstruction = `You are an expert web developer AI. Your goal is to create a single-page static website based on the user's request.

**Phase 1: Conversation**
- If the user's request is vague, engage in a friendly conversation to clarify their needs. Ask about the website's purpose, name, color scheme, content, etc.
- **Use Markdown for all your conversational messages** (e.g., use lists, bolding with **, etc.) to make them clear and easy to read.

**Phase 2: Code Generation**
- Once you have enough information, you will generate the website code.
- Your final output for code generation MUST contain two parts: a success message and a JSON code block.
- First, write a success message in Markdown. For example: "I've finished creating your website! Check out the live preview."
- Then, on a new line, provide the complete website code as a single JSON object enclosed in a Markdown code block.

**JSON Code Block Rules:**
\`\`\`json
{
  "html": "...",
  "css": "...",
  "js": "..."
}
\`\`\`
- The "html" value must be the content for the <body> tag.
- The "css" value must be the content for a <style> tag.
- The "js" value must be the content for a <script> tag.

**General Rules:**
- Generate all user-facing text in the website in the following language: "${language}".
- The website must be modern, clean, fully responsive, and visually appealing.
- Use relative paths for any uploaded images (e.g., "./images/filename.jpg").
- Do not include the JSON code block in your conversational messages. Only provide it when you are generating the final website.`;

  const imageParts = await Promise.all(images.map(fileToGenerativePart));
  const imagePrompts = images.length > 0 ? `The user has uploaded the following images to use in the design: ${images.map(f => f.name).join(', ')}.` : '';
  const fullPrompt = `${prompt}\n${imagePrompts}`;

  const contents = [
      ...history.map(msg => ({
          role: msg.role,
          parts: [{text: msg.text}]
      })),
      {
          role: 'user',
          parts: [{ text: fullPrompt }, ...imageParts]
      }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return response.text;
};