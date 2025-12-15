import React, { useState } from 'react';

interface InputSectionProps {
  onDiagnose: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  "Big Bang: How did everything come from a dot?",
  "Math: I don't get 'gradients' intuitively.",
  "Logic: Correlation vs Causation confusion.",
  "React: Why useEffect if it re-renders?"
];

const InputSection: React.FC<InputSectionProps> = ({ onDiagnose, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onDiagnose(query);
    }
  };

  const useExample = (text: string) => {
      setQuery(text);
  }

  return (
    <>
      <div className="w-full bg-slate-900/40 backdrop-blur-lg rounded-3xl md:shadow-2xl md:shadow-black/20 border border-white/10 ring-1 ring-white/5 overflow-hidden mb-6 md:mb-16 relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        <div className="p-5 md:p-10 relative">
          <label htmlFor="concept-input" className="block text-xl md:text-2xl font-bold text-white mb-3">
              What are you confused about?
          </label>
          <p className="text-slate-400 mb-6 text-sm md:text-base">
              Describe the concept and where you're getting stuck.
          </p>
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group/input">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl opacity-0 group-focus-within/input:opacity-30 transition duration-500 blur"></div>
              <textarea
                id="concept-input"
                className="relative w-full p-5 text-base md:text-lg bg-slate-950/50 border-0 ring-1 ring-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-slate-950 transition-all resize-none text-white placeholder:text-slate-500 min-h-[160px] md:min-h-[180px] md:pr-40 shadow-inner"
                rows={4}
                placeholder="e.g. I understand backpropagation math, but I don't get what the 'gradient' actually represents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
              
              {/* Desktop Button */}
              <div className="hidden md:block absolute bottom-4 right-4">
                  <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}
                  >
                  {isLoading ? (
                      <>
                      <svg className="animate-spin h-5 w-5 text-indigo-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                      </>
                  ) : (
                      <>
                      <span>Diagnose</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                      </svg>
                      </>
                  )}
                  </button>
              </div>
            </div>
          </form>

          <div className="mt-8">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Popular Confusions</p>
              <div className="flex flex-wrap gap-3">
                  {EXAMPLES.map((ex, i) => (
                      <button 
                          key={i} 
                          onClick={() => useExample(ex)}
                          className="text-left text-sm font-medium px-4 py-2.5 bg-slate-800/50 text-slate-300 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:bg-slate-800"
                      >
                          {ex}
                      </button>
                  ))}
              </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-50 safe-area-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
          className={`w-full h-14 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale ${isLoading ? 'animate-pulse' : ''}`}
        >
            {isLoading ? (
                <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
                </>
            ) : (
                <>
                <span>Diagnose Confusion</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                </svg>
                </>
            )}
        </button>
      </div>
    </>
  );
};

export default InputSection;