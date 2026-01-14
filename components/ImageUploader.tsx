
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Your Photo</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-square rounded-[24px] overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed ${
          previewUrl ? 'border-white/20' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
        }`}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="User Upload" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 8h.01"/><path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5"/><path d="M18 16v6"/><path d="M15 19h6"/><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"/><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2.5 2.5"/></svg>
            </div>
            <p className="text-white font-bold">Tap to Upload</p>
            <p className="text-white/40 text-[10px] mt-2 font-bold uppercase tracking-widest">Selfie or Portrait</p>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
        />
        {previewUrl && (
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
            <span className="text-white text-xs font-black uppercase tracking-[0.2em] bg-white/20 px-6 py-3 rounded-full border border-white/20">Replace Photo</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
