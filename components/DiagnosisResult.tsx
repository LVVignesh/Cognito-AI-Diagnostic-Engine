import React, { useState } from 'react';
import { DiagnosisResponse, RootCauseCode, EvaluationResponse } from '../types';
import { evaluateUnderstanding } from '../services/geminiService';

interface DiagnosisResultProps {
  diagnosis: DiagnosisResponse;
  originalQuery: string;
}

const getRootCauseColor = (code: RootCauseCode) => {
  switch (code) {
    case RootCauseCode.MP: return 'bg-red-100 text-red-700 border-red-200';
    case RootCauseCode.WMM: return 'bg-orange-100 text-orange-700 border-orange-200';
    case RootCauseCode.LC: return 'bg-blue-100 text-blue-700 border-blue-200';
    case RootCauseCode.PU: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ diagnosis, originalQuery }) => {
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsEvaluating(true);
    try {
      const result = await evaluateUnderstanding(originalQuery, diagnosis, answer);
      setEvaluation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 fade-in pb-12">
      {/* 1. The Diagnosis Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              Clinical Diagnosis
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getRootCauseColor(diagnosis.rootCauseCode)}`}>
              {diagnosis.rootCauseExplanation}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg">
            {diagnosis.empatheticSummary}
          </p>
        </div>
      </div>

      {/* 2. The Prescription (Fix) */}
      <div className="bg-white rounded-2xl shadow-lg shadow-teal-900/5 border border-teal-100 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
         <div className="p-8">
            <h3 className="text-xl font-bold text-teal-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                The Fix
            </h3>
            <div className="prose prose-slate max-w-none text-slate-700 leading-8 text-lg bg-teal-50/50 p-6 rounded-xl border border-teal-100">
                {diagnosis.prescribedFix}
            </div>
         </div>
      </div>

      {/* 3. Check Understanding (Interactive) */}
      <div className="bg-slate-800 rounded-2xl shadow-md border border-slate-700 text-white overflow-hidden">
        <div className="p-6 md:p-8">
            <div className="mb-6">
                <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Verification Step</h4>
                <p className="text-xl font-medium text-slate-100 leading-relaxed">
                    "{diagnosis.checkQuestion}"
                </p>
            </div>
            
            {!evaluation ? (
                <form onSubmit={handleVerify} className="relative mt-4">
                    <div className="relative flex items-center">
                         <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your explanation here..."
                            className="w-full bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                            disabled={isEvaluating}
                         />
                         <button 
                            type="submit" 
                            disabled={!answer.trim() || isEvaluating}
                            className="absolute right-2 p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {isEvaluating ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            )}
                         </button>
                    </div>
                </form>
            ) : (
                <div className={`mt-4 p-4 rounded-xl border ${evaluation.isCorrect ? 'bg-teal-900/30 border-teal-800' : 'bg-orange-900/30 border-orange-800'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className="flex gap-3">
                        <div className={`p-2 rounded-full h-fit ${evaluation.isCorrect ? 'bg-teal-500/20 text-teal-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {evaluation.isCorrect ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            )}
                        </div>
                        <div>
                            <h5 className={`font-bold mb-1 ${evaluation.isCorrect ? 'text-teal-400' : 'text-orange-400'}`}>
                                {evaluation.isCorrect ? 'Excellent!' : 'Not quite there yet'}
                            </h5>
                            <p className="text-slate-300 text-sm leading-relaxed">{evaluation.feedback}</p>
                            {!evaluation.isCorrect && (
                                <button 
                                    onClick={() => setEvaluation(null)}
                                    className="mt-3 text-xs font-semibold text-orange-400 hover:text-orange-300 hover:underline"
                                >
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;