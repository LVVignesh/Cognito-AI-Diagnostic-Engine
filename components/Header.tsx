import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
              <path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">Cognito<span className="text-indigo-400"> AI</span></h1>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Cognitive Diagnostic Tool</p>
          </div>
        </div>
        <a href="#" className="hidden md:inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-full transition-colors">
          Protocol Beta
        </a>
      </div>
    </header>
  );
};

export default Header;