export enum RootCauseCode {
  MP = 'MP',   // Missing Prerequisite
  WMM = 'WMM', // Wrong Mental Model
  LC = 'LC',   // Language Confusion
  PU = 'PU'    // Partial Understanding
}

export interface DiagnosisResponse {
  rootCauseCode: RootCauseCode;
  rootCauseExplanation: string;
  empatheticSummary: string;
  prescribedFix: string;
  checkQuestion: string;
}

export interface EvaluationResponse {
  isCorrect: boolean;
  feedback: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  diagnosis: DiagnosisResponse;
  timestamp: number;
}