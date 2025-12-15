import React, { useState } from 'react';
import { DiagnosisResponse, RootCauseCode, EvaluationResponse } from '../types';
import { evaluateUnderstanding } from '../services/geminiService';

interface DiagnosisResultProps {
  diagnosis: DiagnosisResponse;
  originalQuery: string;
}

const getRootCauseStyle = (code: RootCauseCode) => {
  switch (code) {
    case RootCauseCode.MP: return 'bg-rose-500/10 text-rose-300 border-rose-500/20 ring-rose-500/10';
    case RootCauseCode.WMM: return 'bg-amber-500/10 text-amber-300 border-amber-500/20 ring-amber-500/10';
    case RootCauseCode.LC: return 'bg-sky-500/10 text-sky-300 border-sky-500/20 ring-sky-500/10';
    case RootCauseCode.PU: return 'bg-violet-500/10 text-violet-300 border-violet-500/20 ring-violet-500/10';
    default: return 'bg-slate-500/10 text-slate-300 border-slate-500/20 ring-slate-500/10';
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
    <div className="space-y-8 fade-in pb-24 md:pb-12">
      {/* 1. The Diagnosis Header */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl shadow-xl shadow-black/20 border border-white/5 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              Analysis
            </h2>
            <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ring-4 ring-opacity-20 ${getRootCauseStyle(diagnosis.rootCauseCode)}`}>
              {diagnosis.rootCauseExplanation}
            </span>
          </div>
          <p className="text-slate-300 leading-8 text-lg font-medium">
            {diagnosis.empatheticSummary}
          </p>
        </div>
      </div>

      {/* 2. The Prescription (Fix) */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-2xl shadow-indigo-600/10 text-white relative overflow-hidden border border-white/10">
         {/* Decorative circles */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-fuchsia-500 opacity-20 rounded-full blur-3xl"></div>
         
         <div className="p-6 md:p-10 relative z-10">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                The Conceptual Fix
            </h3>
            <div className="prose prose-lg prose-invert max-w-none text-indigo-50 leading-relaxed font-light">
                {diagnosis.prescribedFix}
            </div>
         </div>
      </div>

      {/* 3. Check Understanding (Interactive) */}
      <div className="bg-black/40 backdrop-blur-md rounded-3xl shadow-xl shadow-black/20 border border-white/5 text-white overflow-hidden">
        <div className="p-6 md:p-10">
            <div className="mb-8">
                <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Verification</h4>
                <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
                    "{diagnosis.checkQuestion}"
                </p>
            </div>
            
            {!evaluation ? (
                <form onSubmit={handleVerify} className="relative mt-6">
                    <div className="flex flex-col md:flex-row gap-3">
                         <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your explanation in your own words..."
                            className="w-full h-14 bg-slate-800/50 text-white placeholder-slate-500 border border-white/10 rounded-xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 focus:border-transparent transition-all"
                            disabled={isEvaluating}
                         />
                         <button 
                            type="submit" 
                            disabled={!answer.trim() || isEvaluating}
                            className="h-14 md:w-auto px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/20 active:translate-y-0.5"
                         >
                            {isEvaluating ? (
                                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Verify"
                            )}
                         </button>
                    </div>
                </form>
            ) : (
                <div className={`mt-6 p-6 rounded-2xl border-l-4 ${evaluation.isCorrect ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-rose-900/20 border-rose-500/50'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className="flex gap-4">
                        <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${evaluation.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {evaluation.isCorrect ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            )}
                        </div>
                        <div>
                            <h5 className={`text-lg font-bold mb-2 ${evaluation.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {evaluation.isCorrect ? 'That’s it!' : 'Not quite there yet'}
                            </h5>
                            <p className="text-slate-300 text-base leading-relaxed">{evaluation.feedback}</p>
                            {!evaluation.isCorrect && (
                                <button 
                                    onClick={() => setEvaluation(null)}
                                    className="mt-4 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:underline"
                                >
                                    Try Again
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