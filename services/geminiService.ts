import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisResponse, RootCauseCode, EvaluationResponse } from "../types";

// Helper to get the API client
const getGenAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are ConceptFix AI, a Senior Cognitive Diagnostic Specialist and Educational Psychologist. Your goal is to pinpoint and resolve the exact root cause of a student's confusion on any subject before providing any instruction.

PROTOCOL: DIAGNOSE, THEN FIX

1. Analyze (The Input): The user will state a concept they studied but still don't understand.
2. Diagnose (The Magic): Identify one root cause:
    * Missing Prerequisite (MP): Missing a fundamental prior concept.
    * Wrong Mental Model (WMM): Flawed or incorrect understanding of a core principle.
    * Language Confusion (LC): Confused by specific jargon.
    * Partial Understanding (PU): Understands parts but not the connection.
3. Output Diagnosis: Provide a professional diagnosis and empathetic summary.
4. Prescribe the Fix: Targeted explanation focused ONLY on the missing element. Use analogies.
5. Check Understanding: Ask the student to re-explain.

Your output must be strictly JSON matching the specified schema.
`;

const DIAGNOSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    rootCauseCode: {
      type: Type.STRING,
      enum: [RootCauseCode.MP, RootCauseCode.WMM, RootCauseCode.LC, RootCauseCode.PU],
      description: "The code identifying the root cause category."
    },
    rootCauseExplanation: {
      type: Type.STRING,
      description: "A short label for the root cause (e.g., 'Wrong Mental Model')."
    },
    empatheticSummary: {
      type: Type.STRING,
      description: "A professional, empathetic summary of what they understand vs where the gap is."
    },
    prescribedFix: {
      type: Type.STRING,
      description: "The targeted one-paragraph explanation or analogy to fix the specific gap."
    },
    checkQuestion: {
      type: Type.STRING,
      description: "A question asking the student to re-explain the concept in their own words."
    }
  },
  required: ["rootCauseCode", "rootCauseExplanation", "empatheticSummary", "prescribedFix", "checkQuestion"]
};

export const diagnoseConcept = async (userQuery: string): Promise<DiagnosisResponse> => {
  const ai = getGenAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: DIAGNOSIS_SCHEMA,
        temperature: 0.4, // Keep it precise but slightly creative for analogies
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text received from Gemini.");
    }
    
    return JSON.parse(text) as DiagnosisResponse;
  } catch (error) {
    console.error("Diagnosis failed:", error);
    throw error;
  }
};

const EVALUATION_SYSTEM_INSTRUCTION = `
You are a supportive tutor evaluating a student's answer to a check question derived from a diagnosis.
Context:
1. Student was confused about a concept.
2. A specific root cause was diagnosed.
3. A targeted fix was provided.
4. A check question was asked to verify understanding.

Task:
Determine if the student's answer demonstrates they have grasped the specific missing element or corrected the mental model.
Output JSON with:
- isCorrect: boolean (True if they get the core idea, even if imperfectly phrased).
- feedback: string (One or two sentences. If correct, validate them warmly. If incorrect, gently point out what's still missing based on the original fix.)
`;

const EVALUATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: { type: Type.BOOLEAN },
    feedback: { type: Type.STRING }
  },
  required: ["isCorrect", "feedback"]
};

export const evaluateUnderstanding = async (
  originalQuery: string,
  diagnosis: DiagnosisResponse,
  userAnswer: string
): Promise<EvaluationResponse> => {
  const ai = getGenAIClient();
  
  const prompt = `
    Original Confusion: "${originalQuery}"
    Root Cause: ${diagnosis.rootCauseExplanation}
    Fix Provided: "${diagnosis.prescribedFix}"
    Check Question: "${diagnosis.checkQuestion}"
    Student Answer: "${userAnswer}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: EVALUATION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EVALUATION_SCHEMA,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from evaluation");
    return JSON.parse(text) as EvaluationResponse;
  } catch (error) {
    console.error("Evaluation failed", error);
    throw error;
  }
};