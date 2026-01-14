
import React from 'react';
import { Gender } from '../types';

interface WelcomeScreenProps {
  onSelectGender: (gender: Gender) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectGender }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6">
      <div className="glass max-w-2xl w-full rounded-[40px] p-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Virtual Hairstyle Studio
          </h1>
          <p className="text-xl text-white/80 font-medium">
            See how different hairstyles look on you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          <button
            onClick={() => onSelectGender(Gender.MALE)}
            className="group relative flex flex-col items-center p-8 bg-white/20 hover:bg-white/30 rounded-[32px] border border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
          >
            <div className="w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"/></svg>
            </div>
            <span className="text-2xl font-bold text-white">Male</span>
            <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 pointer-events-none"></div>
          </button>

          <button
            onClick={() => onSelectGender(Gender.FEMALE)}
            className="group relative flex flex-col items-center p-8 bg-white/20 hover:bg-white/30 rounded-[32px] border border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
          >
            <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-rose-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z"/><path d="M12 16.5a4.5 4.5 0 0 1 4.5 4.5"/><path d="M12 16.5a4.5 4.5 0 0 0 -4.5 4.5"/><path d="M12 13v3.5"/></svg>
            </div>
            <span className="text-2xl font-bold text-white">Female</span>
            <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 pointer-events-none"></div>
          </button>
        </div>
        
        <div className="mt-12 text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
          StyleMirror &bull; AI Powered
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
