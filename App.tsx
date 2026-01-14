
import React, { useState, useMemo, useRef } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import { generateHairstyle } from './services/geminiService';
import { 
  Gender, 
  HairLength, 
  AppState, 
  MALE_STYLES, 
  FEMALE_STYLES,
  GenerationResult,
  Hairstyle
} from './types';

const MAX_BATCH_SIZE = 5;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    gender: null,
    uploadedImage: null,
    results: [],
    selectedStyle: 'multiple',
    multiSelectedStyles: [],
    selectedLength: HairLength.MEDIUM,
    isGenerating: false,
    error: null,
    previewResult: null
  });

  const stopSignal = useRef<boolean>(false);

  const availableStyles = useMemo(() => {
    return state.gender === Gender.MALE ? MALE_STYLES : FEMALE_STYLES;
  }, [state.gender]);

  const groupedStyles = useMemo(() => {
    const groups: Record<HairLength, Hairstyle[]> = {
      [HairLength.SHORT]: [],
      [HairLength.MEDIUM]: [],
      [HairLength.LONG]: []
    };
    availableStyles.forEach(style => {
      groups[style.category].push(style);
    });
    return groups;
  }, [availableStyles]);

  const handleSelectGender = (gender: Gender) => {
    setState(prev => ({ 
      ...prev, 
      gender, 
      selectedStyle: 'multiple', 
      multiSelectedStyles: [],
      results: [] 
    }));
  };

  const toggleMultiStyle = (id: string) => {
    setState(prev => {
      const isSelected = prev.multiSelectedStyles.includes(id);
      if (isSelected) {
        return { ...prev, multiSelectedStyles: prev.multiSelectedStyles.filter(sid => sid !== id) };
      }
      if (prev.multiSelectedStyles.length >= MAX_BATCH_SIZE) {
        return { ...prev, error: `Batch limit reached: Max ${MAX_BATCH_SIZE} styles.` };
      }
      return { ...prev, multiSelectedStyles: [...prev.multiSelectedStyles, id], error: null };
    });
  };

  const handleGenerate = async () => {
    if (!state.uploadedImage) {
      setState(prev => ({ ...prev, error: "Please upload your photo first." }));
      return;
    }

    const stylesToGenerate = state.selectedStyle === 'multiple' 
      ? availableStyles.filter(s => state.multiSelectedStyles.includes(s.id))
      : availableStyles.filter(s => s.id === state.selectedStyle);

    if (stylesToGenerate.length === 0) {
      setState(prev => ({ ...prev, error: "Please select at least one hairstyle." }));
      return;
    }

    stopSignal.current = false;
    setState(prev => ({ ...prev, isGenerating: true, error: null, results: [] }));

    try {
      for (const style of stylesToGenerate) {
        if (stopSignal.current) break;

        try {
          const resultUrl = await generateHairstyle(
            state.uploadedImage,
            state.gender!,
            style.name,
            state.selectedLength
          );
          
          const newResult: GenerationResult = {
            imageUrl: resultUrl,
            styleName: style.name
          };

          setState(prev => ({ 
            ...prev, 
            results: [...prev.results, newResult] 
          }));
        } catch (styleErr) {
          console.error(`Failed to generate ${style.name}:`, styleErr);
          if (state.selectedStyle !== 'multiple') throw styleErr;
        }
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Simulation failed. Please try again." }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleStop = () => {
    stopSignal.current = true;
    setState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleReset = () => {
    setState({
      gender: null,
      uploadedImage: null,
      results: [],
      selectedStyle: 'multiple',
      multiSelectedStyles: [],
      selectedLength: HairLength.MEDIUM,
      isGenerating: false,
      error: null,
      previewResult: null
    });
  };

  const getButtonText = () => {
    if (state.selectedStyle === 'multiple') {
      const count = state.multiSelectedStyles.length;
      return count > 0 ? `Generate ${count} Variation${count > 1 ? 's' : ''}` : 'Pick Styles Below';
    }
    return 'Generate Preview';
  };

  if (!state.gender) {
    return <WelcomeScreen onSelectGender={handleSelectGender} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between mb-8">
        <button 
          onClick={handleReset}
          className="glass flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14 0"/><path d="M5 12l6 6"/><path d="M5 12l6 -6"/></svg>
          Change Gender
        </button>
        <div className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">
          Virtual Hairstyle Studio
        </div>
        <div className="hidden sm:block glass px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest border-white/10">
          {state.gender} Mode
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        
        {/* Control Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="glass rounded-[32px] p-8 space-y-6 sticky top-8 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">Configure Look</h2>
            
            <div className="space-y-6">
              <ImageUploader 
                onImageUpload={(base64) => setState(prev => ({ ...prev, uploadedImage: base64, results: [] }))}
                previewUrl={state.uploadedImage} 
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Hairstyle Mode</label>
                  <select 
                    value={state.selectedStyle}
                    onChange={(e) => setState(prev => ({ ...prev, selectedStyle: e.target.value }))}
                    className="w-full h-14 px-5 glass-dark rounded-2xl text-white font-bold focus:ring-2 focus:ring-white/20 outline-none appearance-none cursor-pointer transition-all mb-4"
                  >
                    <option value="multiple" className="bg-slate-900 font-bold text-indigo-400">✨ Generate Multiple (Max {MAX_BATCH_SIZE})</option>
                    
                    {Object.entries(groupedStyles).map(([length, styles]) => (
                      styles.length > 0 && (
                        <optgroup key={length} label={`${length} Hairstyles`} className="bg-slate-900 text-white/60 text-xs italic uppercase tracking-wider">
                          {styles.map(s => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-white font-bold not-italic capitalize">
                              {s.name}
                            </option>
                          ))}
                        </optgroup>
                      )
                    ))}
                  </select>

                  {/* Batch Selection Studio */}
                  {state.selectedStyle === 'multiple' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Batch Selection ({state.multiSelectedStyles.length}/{MAX_BATCH_SIZE})</span>
                        {state.multiSelectedStyles.length > 0 && (
                          <button onClick={() => setState(p => ({...p, multiSelectedStyles: []}))} className="text-[9px] font-bold text-rose-400 uppercase tracking-widest hover:text-rose-300">Clear All</button>
                        )}
                      </div>
                      <div className="glass-dark rounded-2xl h-48 overflow-y-auto custom-scrollbar border border-white/5 p-2">
                        <div className="grid grid-cols-1 gap-1">
                          {availableStyles.map(style => {
                            const isSelected = state.multiSelectedStyles.includes(style.id);
                            const isDisabled = !isSelected && state.multiSelectedStyles.length >= MAX_BATCH_SIZE;
                            return (
                              <button 
                                key={style.id}
                                onClick={() => toggleMultiStyle(style.id)}
                                disabled={isDisabled}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                                  isSelected 
                                  ? 'bg-white/10 text-white border border-white/20' 
                                  : isDisabled ? 'opacity-20 grayscale cursor-not-allowed' : 'text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span className="text-xs font-bold">{style.name}</span>
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Refine Length</label>
                  <select 
                    value={state.selectedLength}
                    onChange={(e) => setState(prev => ({ ...prev, selectedLength: e.target.value as HairLength }))}
                    className="w-full h-14 px-5 glass-dark rounded-2xl text-white font-bold focus:ring-2 focus:ring-white/20 outline-none appearance-none cursor-pointer transition-all"
                  >
                    {Object.values(HairLength).map(l => (
                      <option key={l} value={l} className="bg-slate-900">{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {state.isGenerating ? (
                <button
                  onClick={handleStop}
                  className="w-full py-5 rounded-2xl text-lg font-black tracking-tight transition-all transform active:scale-[0.98] bg-rose-500/80 text-white hover:bg-rose-600 shadow-xl"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Stop ({state.results.length} / {state.selectedStyle === 'multiple' ? state.multiSelectedStyles.length : 1})</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!state.uploadedImage || (state.selectedStyle === 'multiple' && state.multiSelectedStyles.length === 0)}
                  className={`w-full py-5 rounded-2xl text-lg font-black tracking-tight transition-all transform active:scale-[0.98] ${
                    (!state.uploadedImage || (state.selectedStyle === 'multiple' && state.multiSelectedStyles.length === 0))
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:-translate-y-1 shadow-2xl shadow-indigo-500/20'
                  }`}
                >
                  {getButtonText()}
                </button>
              )}

              {state.error && (
                <div className="bg-rose-500/20 text-rose-100 p-4 rounded-xl text-xs font-bold border border-rose-500/30">
                  {state.error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full">
          <div className="glass rounded-[32px] overflow-hidden flex-grow flex flex-col border-white/10 shadow-lg">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/5">
              <span className="text-white font-bold">
                {state.results.length > 0 ? `Results (${state.results.length})` : 'Studio Results'}
              </span>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Minimalist AI Mirror</p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              {state.results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.results.map((res, idx) => (
                    <ResultCard 
                      key={idx} 
                      result={res} 
                      onPreview={(r) => setState(prev => ({ ...prev, previewResult: r }))} 
                    />
                  ))}
                  {state.isGenerating && (
                    <div className="aspect-square glass rounded-2xl flex flex-col items-center justify-center animate-pulse gap-3 border border-white/5">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Processing...</span>
                    </div>
                  )}
                </div>
              ) : state.uploadedImage ? (
                <div className="h-full flex items-center justify-center flex-col gap-6">
                  <div className="relative max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <img 
                      src={state.uploadedImage} 
                      alt="Uploaded" 
                      className="w-full rounded-3xl opacity-60 grayscale-[0.2] border border-white/10 shadow-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl text-white font-black text-sm shadow-2xl border border-white/10 uppercase tracking-widest">
                        Ready for Preview
                      </span>
                    </div>
                  </div>
                  {state.isGenerating && (
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full animate-pulse border border-white/10">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Synthesizing Frames...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-6 max-w-sm animate-in zoom-in duration-500">
                    <div className="w-32 h-32 mx-auto bg-white/5 rounded-[40px] flex items-center justify-center text-5xl shadow-inner border border-white/5 group">
                      <span className="animate-bounce group-hover:scale-125 transition-transform cursor-default">✂️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white/80 mb-2 uppercase tracking-tight">AI Preview Engine</h3>
                      <p className="text-white/40 text-sm leading-relaxed font-medium">
                        Upload your photo and select multiple styles (at least 1, max 5) to see your AI transformation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Full Screen Modal */}
      {state.previewResult && (
        <div 
          className="fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setState(prev => ({ ...prev, previewResult: null }))}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
            <div className="relative w-full flex justify-center">
              <img 
                src={state.previewResult.imageUrl} 
                alt="Full Preview" 
                className="max-h-[75vh] w-auto rounded-[40px] shadow-[0_0_120px_rgba(255,255,255,0.1)] border border-white/10 animate-in zoom-in-95 duration-500"
              />
              <button 
                onClick={() => setState(prev => ({ ...prev, previewResult: null }))}
                className="absolute -top-6 -right-6 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center text-white transition-all shadow-2xl border border-white/20 active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="flex flex-col items-center gap-6 text-center">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl mb-1 uppercase">
                  {state.previewResult.styleName}
                </h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Optimized Transformation</p>
              </div>
              <div className="flex gap-4">
                <button 
                  className="px-12 py-5 bg-white text-indigo-900 font-black rounded-3xl hover:bg-indigo-50 transition-all hover:scale-105 shadow-[0_15px_40px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-3"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = state.previewResult!.imageUrl;
                    a.download = `stylemirror-${state.previewResult!.styleName.toLowerCase().replace(/\s+/g, '-')}.png`;
                    a.click();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 11l5 5l5 -5"/><path d="M12 4l0 12"/></svg>
                  Save Look
                </button>
                <button 
                  className="px-12 py-5 bg-white/10 text-white font-black rounded-3xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md"
                  onClick={() => setState(prev => ({ ...prev, previewResult: null }))}
                >
                  Back to Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto w-full py-8 text-center mt-auto">
        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.8em]">
          Powered by StyleMirror Studio &bull; {new Date().getFullYear()}
        </p>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
};

export default App;
