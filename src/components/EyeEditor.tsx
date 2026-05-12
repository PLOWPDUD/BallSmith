import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Wand2, Sliders, RotateCcw, Layers } from 'lucide-react';

interface EyeEditorProps {
  src: string;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export function EyeEditor({ src, onSave, onCancel }: EyeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tolerance, setTolerance] = useState(30);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size to reasonable limit while maintaining aspect ratio
      const maxDim = 512;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (maxDim / width) * height;
          width = maxDim;
        } else {
          width = (maxDim / height) * width;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const initialData = ctx.getImageData(0, 0, width, height);
      setHistory([initialData]);
      setHistoryIndex(0);
    };
    img.src = src;
  }, [src]);

  const pushToHistory = (data: ImageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(data);
    if (newHistory.length > 10) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevData = history[historyIndex - 1];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && prevData) {
        ctx.putImageData(prevData, 0, 0);
        setHistoryIndex(historyIndex - 1);
      }
    }
  };

  const reset = () => {
    if (history.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.putImageData(history[0], 0, 0);
        setHistory([history[0]]);
        setHistoryIndex(0);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isProcessing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    setIsProcessing(true);
    
    // Use a small timeout to allow UI to show processing state if needed
    setTimeout(() => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const targetIdx = (y * canvas.width + x) * 4;
      const targetR = data[targetIdx];
      const targetG = data[targetIdx + 1];
      const targetB = data[targetIdx + 2];
      const targetA = data[targetIdx + 3];

      // Don't flood fill already transparent areas
      if (targetA === 0) {
        setIsProcessing(false);
        return;
      }

      const visited = new Uint8Array(canvas.width * canvas.height);
      const queue: [number, number][] = [[x, y]];
      const width = canvas.width;
      const height = canvas.height;

      while (queue.length > 0) {
        const [cx, cy] = queue.shift()!;
        const idx = (cy * width + cx) * 4;

        if (visited[cy * width + cx]) continue;
        visited[cy * width + cx] = 1;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        const diff = Math.sqrt(
          Math.pow(r - targetR, 2) +
          Math.pow(g - targetG, 2) +
          Math.pow(b - targetB, 2)
        );

        if (diff <= tolerance && a > 0) {
          data[idx + 3] = 0; // Make transparent

          // Add neighbors
          if (cx > 0) queue.push([cx - 1, cy]);
          if (cx < width - 1) queue.push([cx + 1, cy]);
          if (cy > 0) queue.push([cx, cy - 1]);
          if (cy < height - 1) queue.push([cx, cy + 1]);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      pushToHistory(imageData);
      setIsProcessing(false);
    }, 10);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#16181D] border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[85vh] shadow-2xl"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Wand2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Eye Transparency Editor</h2>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Click on backgrounds or unwanted colors to make them transparent.</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Workspace */}
          <div className="flex-1 bg-black/40 flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative group p-1 bg-white/5 rounded-xl border border-white/10 shadow-2xl">
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className={`max-w-full max-h-full cursor-crosshair shadow-2xl transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'}`}
                style={{ imageRendering: 'pixelated', backgroundImage: 'conic-gradient(#222 25%, #333 0 50%, #222 0 75%, #333 0)', backgroundSize: '20px 20px' }}
              />
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Wand2 className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-white/10 bg-black/20 p-6 flex flex-col gap-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Sliders className="w-4 h-4 text-purple-400" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Magic Wand Settings</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase font-black text-slate-500">
                  <span>Color Tolerance</span>
                  <span className="text-purple-400 font-mono">{tolerance}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="255" 
                  value={tolerance} 
                  onChange={(e) => setTolerance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-[9px] text-slate-600 italic">Higher tolerance selects more similar colors.</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Actions</h3>
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all disabled:opacity-30 group"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[11px] font-bold text-slate-300">Undo Action</span>
                </div>
                <span className="text-[9px] font-mono text-slate-600">CTRL+Z</span>
              </button>
              
              <button 
                onClick={reset}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-[11px] font-bold text-slate-300">Reset Initial</span>
              </button>
            </div>

            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button 
                onClick={handleSave}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                Apply & Save
              </button>
              <button 
                onClick={onCancel}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
