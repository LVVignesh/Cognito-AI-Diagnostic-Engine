import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import DiagnosisResult from './components/DiagnosisResult';
import { DiagnosisResponse } from './types';
import { diagnoseConcept } from './services/geminiService';

const App: React.FC = () => {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleDiagnose = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);
    setCurrentQuery(query);

    try {
      const result = await diagnoseConcept(query);
      setDiagnosis(result);
    } catch (err) {
      setError("Unable to complete diagnosis. Please try again or check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
             <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
               Resolve Your Confusion. <span className="text-teal-600">Instantly.</span>
             </h2>
             <p className="text-lg text-slate-600">
               ConceptFix AI identifies the exact root cause of your misunderstanding and prescribes a precise fix, without re-teaching the whole topic.
             </p>
        </div>

        <InputSection onDiagnose={handleDiagnose} isLoading={isLoading} />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-8 flex items-center gap-3 fade-in">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
             </svg>
            {error}
          </div>
        )}

        {diagnosis && (
          <DiagnosisResult diagnosis={diagnosis} originalQuery={currentQuery} />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ConceptFix AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;