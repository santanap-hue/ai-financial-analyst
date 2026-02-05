import { GoogleGenAI } from "@google/genai";
import type { ChatHistoryTurn } from "../types";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.API_KEY ?? "";

function getClient() {
  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    throw new Error("GEMINI_API_KEY is not set or invalid. Set it in .env.local.");
  }
  return new GoogleGenAI({ apiKey });
}

const FALLBACK_INSIGHT =
  "AI Insight: ลองตรวจสอบค่าใช้จ่ายในหมวดอาหารที่ดูเหมือนจะสูงขึ้นในสัปดาห์นี้";
const FALLBACK_CHAT = "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI โปรดลองอีกครั้งภายหลัง";

function normalizeApiText(value: unknown): string | null {
  if (value == null) return null;
  const s = typeof value === "string" ? value : String(value);
  return s.trim() || null;
}

export const getFinancialInsight = async (summary: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this financial summary: "${summary}", provide a single, short, actionable advice for a student in Thai language. Start with "AI Insight: ".`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });
    const text = normalizeApiText(response?.text);
    return text ?? FALLBACK_INSIGHT;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) throw error;
      console.error("Gemini Error:", error.message);
    } else {
      console.error("Gemini Error:", error);
    }
    return FALLBACK_INSIGHT;
  }
};

export type { ChatHistoryTurn } from "../types";

export const chatWithAI = async (
  message: string,
  history: ChatHistoryTurn[]
): Promise<string> => {
  try {
    const ai = getClient();
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history.length > 0 ? history : undefined,
      config: {
        systemInstruction:
          "You are a helpful AI Financial Analyst specialized in helping students manage their money. You speak Thai primarily. Be encouraging, precise, and professional.",
      },
    });

    const response = await chat.sendMessage({ message });
    const text = normalizeApiText(response?.text);
    return text ?? FALLBACK_CHAT;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) throw error;
      console.error("Chat Error:", error.message);
    } else {
      console.error("Chat Error:", error);
    }
    return FALLBACK_CHAT;
  }
};
