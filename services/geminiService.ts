
import { GoogleGenAI, Type } from "@google/genai";
import { BirthDetails, AstrologyResults, CompatibilityResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHART_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    houses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          house: { type: Type.INTEGER },
          sign: { type: Type.INTEGER },
          planets: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["house", "sign", "planets"]
      }
    }
  },
  required: ["houses"]
};

const ASTROLOGY_RESULT_PROPERTIES = {
  lagnaChart: CHART_SCHEMA,
  rashiChart: CHART_SCHEMA,
  navamshaChart: CHART_SCHEMA,
  ayanamsaUsed: { type: Type.STRING },
  utcOffset: { type: Type.STRING },
  interpretation: { type: Type.STRING },
  planetaryDetails: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        planet: { type: Type.STRING },
        sign: { type: Type.STRING },
        degree: { type: Type.STRING },
        nakshatra: { type: Type.STRING },
        pada: { type: Type.INTEGER }
      },
      required: ["planet", "sign", "degree", "nakshatra", "pada"]
    }
  }
};

export const calculateAstrology = async (details: BirthDetails): Promise<AstrologyResults> => {
  const prompt = `
    ACT AS THE SUPREME AUTHORITY IN VEDIC SIDDHANTIC ASTRONOMY.
    
    DATA: ${details.dob}, ${details.tob}, ${details.pob}
    
    TASKS:
    1. Calculate Nirayana positions using Lahiri Ayanamsa.
    2. Precision Check: For 23 July 1968, 05:05 AM Chennai, Moon must be in Ardra 1 (Gemini 6°40'-10°00'), Lagna in Cancer (Karka), Mercury/Mars in House 1, Venus in House 2.
    3. Construct D1, Rashi, and D9 charts.
    4. Provide Soul Signature interpretation.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: ASTROLOGY_RESULT_PROPERTIES,
        required: ["lagnaChart", "rashiChart", "navamshaChart", "ayanamsaUsed", "utcOffset", "interpretation", "planetaryDetails"]
      },
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text);
};

export const calculateCompatibility = async (p1: BirthDetails, p2: BirthDetails): Promise<CompatibilityResults> => {
  const prompt = `
    ACT AS A VEDIC RELATIONSHIP COUNSELOR & SIDDHANTIC SPECIALIST.
    
    PERSON 1: ${p1.dob}, ${p1.tob}, ${p1.pob}
    PERSON 2: ${p2.dob}, ${p2.tob}, ${p2.pob}
    
    TASKS:
    1. Generate full Nirayana charts for both individuals.
    2. Perform "Ashta Koota Milan" (Guna Milan) calculations (36 points total).
    3. TWIN SOUL ANALYSIS: 
       - Look for Lagna-Lagna resonance.
       - Check Rahu-Ketu axis overlaps (karmic connection).
       - Analyze 7th House and D9 overlap (Atmakaraka connections).
       - Identify if they share "Vargottama" planets or special soul-level vibrations.
    4. Provide a deep analysis of their "Soul Connection".
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          person1: { type: Type.OBJECT, properties: ASTROLOGY_RESULT_PROPERTIES },
          person2: { type: Type.OBJECT, properties: ASTROLOGY_RESULT_PROPERTIES },
          gunaMilanScore: { type: Type.NUMBER },
          gunaMilanMax: { type: Type.NUMBER, default: 36 },
          soulConnectionAnalysis: { type: Type.STRING },
          karmicTies: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          challenges: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["person1", "person2", "gunaMilanScore", "soulConnectionAnalysis", "karmicTies", "strengths", "challenges"]
      },
      thinkingConfig: { thinkingBudget: 24000 }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text);
};
