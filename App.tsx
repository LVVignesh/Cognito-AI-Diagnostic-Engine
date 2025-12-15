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
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      {/* Added pb-32 on mobile to account for the sticky button in InputSection when active */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-16 pb-32 md:pb-16">
        <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
             <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-500/20">
                🚀 Educational Psychology Engine
             </div>
             <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
               Confused? Let's fix your <br className="hidden md:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 animate-gradient-x">Mental Model.</span>
             </h2>
             <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
               Don't just re-read the textbook. We diagnose the <em>exact</em> missing piece of your understanding and fix it instantly.
             </p>
        </div>

        <InputSection onDiagnose={handleDiagnose} isLoading={isLoading} />

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-xl mb-8 flex items-start gap-3 fade-in shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
             </svg>
             <span className="text-sm md:text-base font-medium">{error}</span>
          </div>
        )}

        {diagnosis && (
          <DiagnosisResult diagnosis={diagnosis} originalQuery={currentQuery} />
        )}
      </main>
      
      <footer className="bg-slate-950/50 backdrop-blur-sm border-t border-white/5 py-8 mt-auto hidden md:block">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Cognito AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;