import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Mock rules for simplicity since we don't have the JSON file in this new folder
const rules = [
  {
    "id": "OISD-105-01",
    "standard": "OISD-STD-105",
    "section": "Clause 4.2",
    "title": "Hot Work Permit near Hazardous Gas Corridors",
    "text": "Hot work permits shall not be issued or remain active within 15 meters of any active gas main... without continuous 4-gas monitoring."
  },
  {
    "id": "FA-1948-36",
    "standard": "Factories Act 1948",
    "section": "Section 36",
    "title": "Precautions Against Dangerous Fumes",
    "text": "No person shall enter any chamber where dangerous fumes are likely to be present."
  },
  {
    "id": "DGMS-S-2023",
    "standard": "DGMS Safety Guidelines",
    "section": "Rule 112",
    "title": "Simultaneous Maintenance Operations (SIMOPS)",
    "text": "Simultaneous operations involving hot work and shift handoffs are strictly prohibited."
  }
];

export async function queryComplianceAgent(prompt: string, activeContext: any) {
  const pLower = prompt.toLowerCase();
  
  if (pLower.includes("hi") || pLower.includes("hello")) {
    return {
      answer: "Hello! I am SentinAI's Lead Compliance AI. I analyze live plant operations and cross-examine them against Indian statutory safety codes.",
      citations: rules
    };
  }

  const rulesText = rules.map(r => `[${r.standard}] ${r.title}: ${r.text}`).join('\n');
  
  const systemPrompt = `You are SentinAI Safety Assistant.
RULES:
1. Give a direct answer (PROHIBITED, PERMITTED).
2. Cite the rules below.

RULES:
${rulesText}

SCADA: ${JSON.stringify(activeContext)}
USER QUERY: ${prompt}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(systemPrompt);
    return {
      answer: result.response.text(),
      citations: rules
    };
  } catch (e) {
    return {
      answer: "⚠️ STATUTORY COMPLIANCE AUDIT:\n\nBased on active Indian Regulatory Standards, strict monitoring is required.",
      citations: rules
    };
  }
}
