
import React from 'react';
import { GenerationResult } from '../types';

interface ResultCardProps {
  result: GenerationResult;
  onPreview: (result: GenerationResult) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onPreview }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger the preview modal
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `stylemirror-${result.styleName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={() => onPreview(result)}
      className="wavy-dark-container relative rounded-[24px] shadow-xl overflow-hidden group cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10"
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px] m-1">
        <img 
          src={result.imageUrl} 
          alt={result.styleName} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.5]"
        />
        
        {/* Hover Overlay with Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
          <div className="flex items-center justify-between gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex-grow">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-2 inline-block">
                Preview
              </span>
              <p className="text-white font-black text-sm drop-shadow-lg leading-tight">{result.styleName}</p>
            </div>
            <button 
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white backdrop-blur-xl text-white hover:text-indigo-600 p-2.5 rounded-xl transition-all shadow-2xl border border-white/20 active:scale-90"
              title="Download Transformation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Permanent Footer Info */}
      <div className="p-3 bg-black/40 backdrop-blur-md border-t border-white/5 flex flex-col items-center group-hover:bg-indigo-900/40 transition-colors duration-500">
        <p className="text-white text-center font-bold text-xs truncate max-w-full drop-shadow-sm">{result.styleName}</p>
        <div className="w-8 h-1 bg-white/20 rounded-full mt-2 group-hover:w-16 group-hover:bg-white/40 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default ResultCard;
