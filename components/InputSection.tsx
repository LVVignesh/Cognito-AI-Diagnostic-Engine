import React, { useState, useEffect } from 'react';

interface InputSectionProps {
  onDiagnose: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  "I studied the Big Bang, but I don't get how everything came from a tiny point.",
  "I know how backpropagation works mathematically, but I don't intuitively get the 'gradient' part.",
  "Why does 'correlation does not imply causation' if they are related?",
  "I don't understand why we need React useEffect if the component re-renders anyway."
];

const InputSection: React.FC<InputSectionProps> = ({ onDiagnose, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onDiagnose(query);
    }
  };

  const useExample = (text: string) => {
      setQuery(text);
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-12">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">What are you confused about?</h2>
        <p className="text-slate-500 mb-6">Describe the concept and what specifically doesn't click.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              className="w-full p-4 pr-32 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
              rows={3}
              placeholder="e.g. I understand X, but I don't get why Y happens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`absolute bottom-3 right-3 px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isLoading ? 'animate-pulse' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Diagnosing...</span>
                </>
              ) : (
                <>
                  <span>Diagnose</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Try these examples</p>
            <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                    <button 
                        key={i} 
                        onClick={() => useExample(ex)}
                        className="text-left text-sm px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-200 rounded-lg transition-colors"
                    >
                        {ex.length > 50 ? ex.substring(0, 50) + "..." : ex}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;