
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getShoppingAdvice(
    prompt: string, 
    contextProducts: Product[],
    chatHistory: { role: 'user' | 'model'; parts: { text?: string; inlineData?: any }[] }[] = [],
    image?: string // Base64 image
  ): Promise<{ text: string; sources?: any[] }> {
    try {
      const productContext = `Current available products in store: ${JSON.stringify(contextProducts.map(p => ({
        name: p.name,
        price: p.price,
        description: p.description,
        tags: p.tags
      })))}`;

      const parts: any[] = [{ text: `${productContext}\n\nUser Question: ${prompt}` }];
      
      if (image) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image.split(',')[1] || image
          }
        });
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...chatHistory,
          { role: 'user', parts }
        ],
        config: {
          systemInstruction: `You are a helpful and charismatic AI shopping assistant for "হঠাৎ পাওয়া" (Hothat Pawa), based in Bangladesh. 
          Your goal is to help users find the best products from our catalog. 
          All prices are in Bangladeshi Taka (BDT/TK). Use the symbol ৳ or the word "TK" when referring to money.
          If a user uploads an image, analyze it and see if it matches any of our products or if we have similar alternatives.
          If a user asks about external market comparisons or trending news, use the Google Search tool.
          Always be polite, concise, and professional. You can speak in both English and Bengali as per user preference.
          If you suggest a product, mention why it fits the user's needs.`,
          tools: [{ googleSearch: {} }]
        }
      });

      return {
        text: response.text || "দুঃখিত, আমি আপনার অনুরোধটি প্রসেস করতে পারছি না।",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "আমার সিস্টেমে কিছুটা সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন!" };
    }
  }
}

export const geminiService = new GeminiService();
