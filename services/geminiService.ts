
import { GoogleGenAI } from "@google/genai";
import { Event, User } from '../types';

export const getAssistantResponse = async (
    query: string,
    userName: string,
    events: Event[],
    users: User[]
): Promise<string> => {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        throw new Error("API_KEY_MISSING_ENV");
    }

    // Check if an API key has been selected via the aistudio dialog, if available.
    if (typeof window !== 'undefined' && typeof window.aistudio !== 'undefined') {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          throw new Error("API_KEY_NOT_SELECTED");
        }
      } catch (e) {
        // If hasSelectedApiKey itself throws (e.g., due to an environment issue),
        // we'll treat it as if no key was selected.
        console.warn("Failed to check API key selection status via window.aistudio:", e);
        throw new Error("API_KEY_NOT_SELECTED");
      }
    }

    // Initialize GoogleGenAI right before making an API call to ensure it always uses
    // the most up-to-date API key from the dialog.
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const model = 'gemini-2.5-flash';
    const players = users.filter(u => u.position);

    const prompt = `
        You are a helpful, friendly, and concise assistant for the "Dragons" soccer team.
        Your name is "Team Assistant".
        The current date is ${new Date().toDateString()}.
        
        Here is the current schedule of events:
        ${JSON.stringify(events, null, 2)}

        Here is the list of players on the team:
        ${JSON.stringify(players.map(p => ({name: p.name, position: p.position, jerseyNumber: p.jerseyNumber})), null, 2)}
        
        A user named "${userName}" asked the following question: "${query}".
        
        Answer their question based ONLY on the data provided above.
        If the question is about who is attending an event, list the names of the players who have RSVP'd 'yes'.
        If the question cannot be answered with the given data, politely say so.
        Be friendly and use emojis where appropriate.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text.trim();
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        // Handle specific error for an invalid API key based on the error message.
        if (error.message && error.message.includes("Requested entity was not found.")) {
            throw new Error("API_KEY_INVALID");
        }
        // Throw a generic API error for other issues.
        throw new Error("GENERIC_API_ERROR");
    }
};
