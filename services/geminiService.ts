import { GoogleGenAI } from "@google/genai";
import type { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are 'ShieldBot', a friendly and expert cybersecurity assistant for ShieldNet VPN. 
Your goal is to provide users with clear, concise, and actionable advice on online security, privacy, and best practices for using a VPN. 
Do not answer questions unrelated to cybersecurity, privacy, or VPNs. 
If asked an off-topic question, politely state your purpose and offer to help with a relevant topic.
Format your responses using simple markdown for readability (e.g., bullet points with *).`;

export async function getSecurityAdvice(history: ChatMessage[]): Promise<string> {
  try {
    // Convert our ChatMessage format to Gemini's history format
    const geminiHistory = history.map(msg => ({
      role: msg.role === 'system' ? 'model' : msg.role,
      parts: [{text: msg.text}]
    }));

    // The last message in history is the new user prompt
    const lastMessage = geminiHistory.pop();
    if (!lastMessage || lastMessage.role !== 'user') {
      return "I'm sorry, I couldn't process that. Please try again.";
    }

    // FIX: The `history` parameter is not valid for `chat.sendMessage`.
    // The chat history should be provided when creating the chat session.
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: geminiHistory,
    });

    const result = await chat.sendMessage({ 
        message: lastMessage.parts[0].text,
    });
    
    return result.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}
