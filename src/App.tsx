/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import 'flag-icons/css/flag-icons.min.css';
import { 
  Download, 
  RefreshCcw, 
  Palette, 
  Eye as EyeIcon, 
  PlusCircle, 
  ChevronRight,
  Globe,
  Sparkles,
  Wand2,
  Info,
  FlipHorizontal,
  FlipVertical,
  Search,
  X,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  Bookmark,
  Trash2,
  Undo,
  Redo
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Countryball } from './components/Countryball';
import { Tooltip } from './components/Tooltip';
import { Tutorial } from './components/Tutorial';
import { EyeEditor } from './components/EyeEditor';
import { SHAPES, Shape, EYES, EyeSet, ACCESSORIES, COUNTRIES, HISTORICAL_COUNTRIES } from './constants/assets';
import { moderateImage } from './services/moderationService';

type Tab = 'flag' | 'eyes' | 'accessories' | 'adjust' | 'shape' | 'saved';
type FlagMode = 'modern' | 'historical' | 'custom';

interface Offset {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  state: any;
  previewUrl?: string;
}

export default function App() {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [eyes, setEyes] = useState(EYES[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [accessory2, setAccessory2] = useState(ACCESSORIES[0]);
  const [eyesOffset, setEyesOffset] = useState<Offset>({ x: 0, y: 5, scale: 1, rotation: 0 });
  const [hatOffset, setHatOffset] = useState<Offset>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [hat2Offset, setHat2Offset] = useState<Offset>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [ballRotation, setBallRotation] = useState(0);
  const [ballRotationX, setBallRotationX] = useState(0);
  const [ballRotationY, setBallRotationY] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [ballColor, setBallColor] = useState('#ffffff');
  const [useFlag, setUseFlag] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('flag');
  const [flagMode, setFlagMode] = useState<FlagMode>('modern');
  const [eyeMode, setEyeMode] = useState<'preset' | 'custom'>('preset');
  const [shape, setShape] = useState<Shape>(SHAPES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // Custom Flag State
  const [customFlagUrl, setCustomFlagUrl] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [savedFlags, setSavedFlags] = useState<any[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eyeFileInputRef = useRef<HTMLInputElement>(null);
  const [customEyeUrl, setCustomEyeUrl] = useState('');
  const [savedEyes, setSavedEyes] = useState<EyeSet[]>([]);
  const [isModeratingEyes, setIsModeratingEyes] = useState(false);
  const [editingEyeSource, setEditingEyeSource] = useState<string | null>(null);

  const ballRef = useRef<HTMLDivElement>(null);

  // History Management
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalUpdate = useRef(false);

  const getCurrentState = () => ({
    country,
    eyes,
    accessory,
    accessory2,
    eyesOffset,
    hatOffset,
    hat2Offset,
    ballRotation,
    ballRotationX,
    ballRotationY,
    flipX,
    flipY,
    ballColor,
    useFlag,
    shape
  });

  const applyState = (s: any) => {
    setCountry(s.country);
    setEyes(s.eyes);
    setAccessory(s.accessory);
    setAccessory2(s.accessory2);
    setEyesOffset(s.eyesOffset);
    setHatOffset(s.hatOffset);
    setHat2Offset(s.hat2Offset);
    setBallRotation(s.ballRotation);
    setBallRotationX(s.ballRotationX);
    setBallRotationY(s.ballRotationY);
    setFlipX(s.flipX);
    setFlipY(s.flipY);
    setBallColor(s.ballColor);
    setUseFlag(s.useFlag);
    setShape(s.shape);
  };

  // Capture current state to history (debounced)
  React.useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const currentState = getCurrentState();
      
      // Only push if it's different from the head of the history
      if (historyIndex === -1 || JSON.stringify(history[historyIndex]) !== JSON.stringify(currentState)) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        
        // Limit history size to 50
        if (newHistory.length > 50) newHistory.shift();
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    country, eyes, accessory, accessory2, eyesOffset, 
    hatOffset, hat2Offset, ballRotation, ballRotationX, 
    ballRotationY, flipX, flipY, ballColor, useFlag, shape
  ]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isInternalUpdate.current = true;
      const prevState = history[historyIndex - 1];
      applyState(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalUpdate.current = true;
      const nextState = history[historyIndex + 1];
      applyState(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history]);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if inside an input/textarea
      if (document.activeElement instanceof HTMLInputElement || 
          document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Load saved flags and designs from local storage
  React.useEffect(() => {
    const storedFlags = localStorage.getItem('ballsmith_saved_flags');
    if (storedFlags) {
      try {
        setSavedFlags(JSON.parse(storedFlags));
      } catch (e) {
        console.error("Failed to load saved flags", e);
      }
    }

    const storedDesigns = localStorage.getItem('ballsmith_saved_designs');
    if (storedDesigns) {
      try {
        setSavedDesigns(JSON.parse(storedDesigns));
      } catch (e) {
        console.error("Failed to load saved designs", e);
      }
    }

    const storedEyes = localStorage.getItem('ballsmith_saved_eyes');
    if (storedEyes) {
      try {
        setSavedEyes(JSON.parse(storedEyes));
      } catch (e) {
        console.error("Failed to load saved eyes", e);
      }
    }
  }, []);

  const saveFlagLocally = (newFlag: any) => {
    const updated = [newFlag, ...savedFlags.filter(f => f.url !== newFlag.url)].slice(0, 20); // Keep last 20
    setSavedFlags(updated);
    localStorage.setItem('ballsmith_saved_flags', JSON.stringify(updated));
  };

  const deleteSavedFlag = (code: string) => {
    const updated = savedFlags.filter(f => f.code !== code);
    setSavedFlags(updated);
    localStorage.setItem('ballsmith_saved_flags', JSON.stringify(updated));
  };

  const handleSaveDesign = async () => {
    if (!ballRef.current) return;
    setIsSavingDesign(true);

    try {
      const previewUrl = await toPng(ballRef.current, {
        pixelRatio: 0.5,
        backgroundColor: 'transparent'
      });

      const newDesign: SavedDesign = {
        id: 'design-' + Date.now(),
        name: country.name || 'Unnamed Ball',
        timestamp: Date.now(),
        state: getCurrentState(),
        previewUrl
      };

      const updated = [newDesign, ...savedDesigns].slice(0, 50);
      setSavedDesigns(updated);
      localStorage.setItem('ballsmith_saved_designs', JSON.stringify(updated));
      
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#10b981']
      });
      
      setActiveTab('saved');
    } catch (err) {
      console.error('Failed to save design:', err);
    } finally {
      setIsSavingDesign(false);
    }
  };

  const handleLoadDesign = (design: SavedDesign) => {
    isInternalUpdate.current = true;
    applyState(design.state);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#3b82f6']
    });
  };

  const deleteSavedDesign = (id: string) => {
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem('ballsmith_saved_designs', JSON.stringify(updated));
  };

  const handleCustomEyeImport = async (dataUrl: string, mimeType: string = 'image/png') => {
    setIsModeratingEyes(true);
    setModerationError(null);
    
    try {
      let processUrl = dataUrl;
      let processMime = mimeType;

      if (mimeType === 'image/svg+xml') {
        processUrl = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 512;
            canvas.height = img.height || 512;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Failed to get context');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => reject('Failed to load SVG for conversion');
          img.src = dataUrl;
        });
        processMime = 'image/png';
      }

      const base64Data = processUrl.split(',')[1];
      const result = await moderateImage(base64Data, processMime);
      
      if (result.safe) {
        const customEye: EyeSet = {
          id: 'custom-eye-' + Date.now(),
          name: 'Custom Eyes',
          customUrl: dataUrl,
          render: () => <g /> // Not used for customUrl
        };
        setEyes(customEye);
        const updated = [customEye, ...savedEyes.filter(e => e.customUrl !== customEye.customUrl)].slice(0, 20);
        setSavedEyes(updated);
        localStorage.setItem('ballsmith_saved_eyes', JSON.stringify(updated));
        setCustomEyeUrl('');
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#a855f7']
        });
      } else {
        setModerationError(result.reason);
      }
    } catch (err) {
      console.error(err);
      setModerationError("Failed to analyze eyes. Please try another image.");
    } finally {
      setIsModeratingEyes(false);
    }
  };

  const handleUrlEyeImport = async () => {
    if (!customEyeUrl) return;
    setIsModeratingEyes(true);
    setModerationError(null);
    try {
      const response = await fetch(customEyeUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCustomEyeImport(reader.result as string, blob.type);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setModerationError("Cannot access eye URL. Try uploading it instead.");
      setIsModeratingEyes(false);
    }
  };

  const deleteSavedEye = (id: string) => {
    const updated = savedEyes.filter(e => e.id !== id);
    setSavedEyes(updated);
    localStorage.setItem('ballsmith_saved_eyes', JSON.stringify(updated));
  };

  const handleCustomImport = async (dataUrl: string, mimeType: string = 'image/png') => {
    setIsModerating(true);
    setModerationError(null);
    
    try {
      let processUrl = dataUrl;
      let processMime = mimeType;

      // Gemini doesn't support image/svg+xml, convert to PNG if needed
      if (mimeType === 'image/svg+xml') {
        processUrl = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 512;
            canvas.height = img.height || 512;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Failed to get context');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = () => reject('Failed to load SVG for conversion');
          img.src = dataUrl;
        });
        processMime = 'image/png';
      }

      // Extract base64 part
      const base64Data = processUrl.split(',')[1];
      const result = await moderateImage(base64Data, processMime);
      
      if (result.safe) {
        const customCountry = {
          code: 'custom-' + Date.now(),
          name: 'Custom Flag',
          url: dataUrl, // We keep the original URL (can be SVG) for display quality
          isCustom: true
        };
        setCountry(customCountry);
        saveFlagLocally(customCountry);
        setCustomFlagUrl('');
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#fbbf24']
        });
      } else {
        setModerationError(result.reason);
      }
    } catch (err) {
      console.error(err);
      setModerationError("Failed to analyze image. Please try another one.");
    } finally {
      setIsModerating(false);
    }
  };

  const handleUrlImport = async () => {
    if (!customFlagUrl) return;
    
    setIsModerating(true);
    setModerationError(null);
    
    try {
      const response = await fetch(customFlagUrl);
      const blob = await response.blob();
      
      if (!blob.type.startsWith('image/')) {
        throw new Error("URL is not an image");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        handleCustomImport(reader.result as string, blob.type);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setModerationError("Cannot access image URL. Try saving it and uploading instead (CORS protection).");
      setIsModerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleCustomImport(reader.result as string, file.type);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleEyeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleCustomEyeImport(reader.result as string, file.type);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRandomize = () => {
    const randomCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const randomEyes = EYES[Math.floor(Math.random() * EYES.length)];
    const randomAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    
    setCountry(randomCountry);
    setEyes(randomEyes);
    setAccessory(randomAccessory);
    setAccessory2(ACCESSORIES[0]);
    setShape(randomShape);
    setEyesOffset({ x: 0, y: 5, scale: 1, rotation: 0 });
    setHatOffset({ x: 0, y: 0, scale: 1, rotation: 0 });
    setHat2Offset({ x: 0, y: 0, scale: 1, rotation: 0 });
    setBallRotation(0);
    setBallRotationX(0);
    setBallRotationY(0);
    setFlipX(false);
    setFlipY(false);
    setBallColor('#ffffff');
    setUseFlag(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
    });
  };

  const handleExport = async () => {
    if (!ballRef.current) return;
    setIsExporting(true);
    setModerationError(null); // Reuse this for export errors

    try {
      // Ensure fonts are loaded before capturing
      if (document.fonts) {
        await document.fonts.ready;
      }

      const dataUrl = await toPng(ballRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        skipFonts: false,
        backgroundColor: 'transparent'
      });
      
      const link = document.createElement('a');
      link.download = `countryball-${country.code}.png`;
      link.href = dataUrl;
      link.click();
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('Export failed:', err);
      let errorMessage = "Export failed. This usually happens due to browser security restrictions on external images.";
      
      if (err instanceof Error) {
        errorMessage += ` (${err.message})`;
      } else if (typeof err === 'object') {
        try {
          errorMessage += ` [${JSON.stringify(err)}]`;
        } catch (e) {
          errorMessage += " [Inaccessible error object]";
        }
      }
      
      setModerationError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen bg-[#0F1115] text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#16181D] z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-black">B</div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-baseline gap-2">
            BALLSMITH 
            <span className="hidden sm:inline text-[10px] font-normal text-slate-500 uppercase tracking-widest">Studio v1.2</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 mr-2">
            <Tooltip content="Undo change (Ctrl+Z)" position="bottom">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
              >
                <Undo className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Redo change (Ctrl+Y)" position="bottom">
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
              >
                <Redo className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          <Tooltip content="Save current design to Gallery" position="bottom">
            <button 
              onClick={handleSaveDesign}
              disabled={isSavingDesign}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600/30 transition-all active:scale-95 disabled:opacity-50 font-sans"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSavingDesign ? 'animate-pulse' : ''}`} />
              {isSavingDesign ? 'Saving' : 'Save Design'}
            </button>
          </Tooltip>
          <Tooltip content="Reset all changes" position="bottom">
            <button 
              onClick={() => {
                setCountry(COUNTRIES[0]);
                setEyes(EYES[0]);
                setAccessory(ACCESSORIES[0]);
                setAccessory2(ACCESSORIES[0]);
                setEyesOffset({ x: 0, y: 5, scale: 1, rotation: 0 });
                setHatOffset({ x: 0, y: 0, scale: 1, rotation: 0 });
                setHat2Offset({ x: 0, y: 0, scale: 1, rotation: 0 });
                setBallRotation(0);
                setBallRotationX(0);
                setBallRotationY(0);
                setFlipX(false);
                setFlipY(false);
                setBallColor('#ffffff');
                setUseFlag(true);
              }}
              className="px-4 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95"
            >
              Reset
            </button>
          </Tooltip>
          <Tooltip content="Export character as PNG" position="bottom">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2 rounded bg-amber-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-amber-900/20"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Character'}
            </button>
          </Tooltip>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Navigation: Categories */}
        <nav className="w-20 border-r border-white/10 bg-[#16181D] flex flex-col items-center py-8 gap-10 shrink-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <SidebarButton 
            active={activeTab === 'flag'} 
            onClick={() => setActiveTab('flag')} 
            icon={<Globe className="w-5 h-5" />} 
            label="Flags" 
            tooltip="Choose your nation's flag"
          />
          <SidebarButton 
            active={activeTab === 'eyes'} 
            onClick={() => setActiveTab('eyes')} 
            icon={<EyeIcon className="w-5 h-5" />} 
            label="Eyes" 
            tooltip="Select character expression"
          />
          <SidebarButton 
            active={activeTab === 'accessories'} 
            onClick={() => setActiveTab('accessories')} 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Hats" 
            tooltip="Add hats and accessories"
          />
          <SidebarButton 
            active={activeTab === 'shape'} 
            onClick={() => setActiveTab('shape')} 
            icon={<Globe className="w-5 h-5" />} 
            label="Shape" 
            tooltip="Change ball silhouette"
          />
          <SidebarButton 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')} 
            icon={<Bookmark className="w-5 h-5" />} 
            label="Gallery" 
            tooltip="View your saved designs"
          />
          <SidebarButton 
            active={activeTab === 'adjust'} 
            onClick={() => setActiveTab('adjust')} 
            icon={<Palette className="w-5 h-5" />} 
            label="Adjust" 
            tooltip="Fine-tune position and pose"
          />
          <div className="mt-auto pb-4">
             <Tooltip content="Randomize design" position="right">
               <button 
                onClick={handleRandomize}
                className="p-3 text-slate-500 hover:text-amber-500 transition-colors"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
             </Tooltip>
          </div>
        </nav>

        {/* Center Stage: The Ball */}
        <section className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#242831_0%,_#0F1115_70%)] overflow-hidden">
          {/* Studio Backdrop Lights */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/5 blur-3xl rounded-full"></div>
          
          <motion.div
            key={`${country.code}-${eyes.id}-${accessory.id}`}
            initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            className="z-10"
          >
            <Countryball 
              innerRef={ballRef}
              countryCode={country.code} 
              flagUrlOverride={(country as any).url}
              eyes={eyes} 
              accessory={accessory} 
              accessory2={accessory2}
              shape={shape}
              size={360}
              eyesOffset={eyesOffset}
              hatOffset={hatOffset}
              hat2Offset={hat2Offset}
              rotation={ballRotation}
              rotationX={ballRotationX}
              rotationY={ballRotationY}
              flipX={flipX}
              flipY={flipY}
              ballColor={ballColor}
              useFlag={useFlag}
            />
          </motion.div>

          {/* Ground Shadow */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/40 blur-xl rounded-full -z-0"></div>

          {/* Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-2xl">
            <div className="w-6 h-4 overflow-hidden rounded-sm outline outline-1 outline-white/10 bg-black/40">
              {country.url ? (
                <img 
                  src={country.url} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img 
                  src={`https://flagcdn.com/w80/${country.code}.png`} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-none">
              DRAFT NAME: <span className="text-white italic font-bold">"{country.name}"</span>
            </span>
          </div>
        </section>

        {/* Right Panel: Selection Grid */}
        <aside className="w-80 bg-[#16181D] border-l border-white/10 flex flex-col pt-0 shrink-0">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {activeTab === 'flag' ? 'Select Nation' : activeTab === 'eyes' ? 'Expression' : activeTab === 'shape' ? 'Select Shape' : activeTab === 'saved' ? 'Your Gallery' : 'Accessories'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {moderationError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 relative group">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-200 font-medium leading-relaxed pr-6">
                      {moderationError}
                    </p>
                    <button 
                      onClick={() => setModerationError(null)}
                      className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-3 h-3 text-amber-500" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Your Masterpieces</h3>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed italic">
                      Save your current design to edit it later. These designs are stored in your browser.
                    </p>
                  </div>

                  {savedDesigns.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {savedDesigns.map((d) => (
                        <div key={d.id} className="relative group">
                          <button
                            onClick={() => handleLoadDesign(d)}
                            className="w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-2 border-2 border-transparent bg-white/5 hover:bg-white/10 hover:border-blue-500/50"
                          >
                            <div className="w-full flex-1 rounded shadow-inner overflow-hidden flex items-center justify-center">
                              {d.previewUrl ? (
                                <img 
                                  src={d.previewUrl} 
                                  alt={d.name} 
                                  className="w-auto h-full object-contain" 
                                />
                              ) : (
                                <Globe className="w-8 h-8 text-slate-700" />
                              )}
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-400 truncate w-full text-center">
                              {d.name}
                            </span>
                            <span className="text-[7px] text-slate-600 font-mono">
                              {new Date(d.timestamp).toLocaleDateString()}
                            </span>
                          </button>
                          <Tooltip content="Delete design" position="top">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSavedDesign(d.id);
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg z-10"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                      <div className="p-4 bg-white/5 rounded-full">
                        <Bookmark className="w-8 h-8 text-slate-700" />
                      </div>
                      <div className="text-center px-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Gallery is Empty</p>
                        <p className="text-[9px] text-slate-600 font-medium">Create a masterpiece and click "Save Design" in the header to store it here.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'flag' && (
                <motion.div
                  key="flag"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setFlagMode('modern')}
                      className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${flagMode === 'modern' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      Modern
                    </button>
                    <button 
                      onClick={() => setFlagMode('historical')}
                      className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${flagMode === 'historical' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      History
                    </button>
                    <button 
                      onClick={() => setFlagMode('custom')}
                      className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${flagMode === 'custom' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      Saved
                    </button>
                  </div>

                  {flagMode === 'historical' && (
                    <div className="space-y-3 p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Import Custom Flag</h3>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Paste image URL..."
                            value={customFlagUrl}
                            onChange={(e) => setCustomFlagUrl(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-[10px] text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
                          />
                        </div>
                      <Tooltip content="Import from image URL" position="left">
                        <button 
                          onClick={handleUrlImport}
                          disabled={isModerating || !customFlagUrl}
                          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center min-w-[36px]"
                        >
                          {isModerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </Tooltip>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">OR</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                      </div>

                      <Tooltip content="Upload local image file" position="top">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isModerating}
                          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-lg py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 active:scale-[0.98] disabled:opacity-50"
                        >
                          {isModerating ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                              <span>Moderating Image...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 text-amber-500" />
                              <span>Upload from Gallery</span>
                            </>
                          )}
                        </button>
                      </Tooltip>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                    {searchQuery && (
                      <Tooltip content="Clear search" position="left">
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>

                  {flagMode === 'custom' && (
                    <div className="space-y-4">
                      {savedFlags.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {savedFlags.map((c) => (
                            <div key={c.code} className="relative group">
                              <button
                                onClick={() => setCountry(c)}
                                className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-3 border-2 ${
                                  country.code === c.code 
                                    ? 'border-amber-500 bg-white/10' 
                                    : 'border-transparent bg-white/5 hover:bg-white/10'
                                }`}
                              >
                                <div className="w-full h-10 rounded shadow-inner overflow-hidden border border-black/20 bg-black/40">
                                  <img 
                                    src={c.url} 
                                    alt={c.name} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                  />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 truncate w-full text-center">{c.name}</span>
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSavedFlag(c.code);
                                }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                              >
                                <Trash2 className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                          <Bookmark className="w-8 h-8 text-slate-700" />
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Saved Flags</p>
                            <p className="text-[9px] text-slate-600 font-medium px-6">Upload or import flags in the 'Historical' tab to save them here.</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-3">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-blue-200/60 leading-relaxed italic">
                          Saved flags are stored locally on your device. Clearing your browser cache may remove them.
                        </p>
                      </div>
                    </div>
                  )}

                  {flagMode !== 'custom' && (
                    <div className="grid grid-cols-2 gap-3">
                      {(flagMode === 'modern' ? COUNTRIES : HISTORICAL_COUNTRIES).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setCountry(c)}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-3 border-2 ${
                            country.code === c.code 
                              ? 'border-amber-500 bg-white/10' 
                              : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                           <div className="w-full h-10 rounded shadow-inner overflow-hidden border border-black/20 bg-black/40">
                             {flagMode === 'modern' ? (
                               <img 
                                 src={`https://flagcdn.com/w160/${c.code}.png`} 
                                 alt={c.name} 
                                 className="w-full h-full object-cover"
                                 referrerPolicy="no-referrer"
                                 loading="lazy"
                               />
                             ) : (
                               <img 
                                 src={c.url} 
                                 alt={c.name} 
                                 className="w-full h-full object-cover" 
                                 referrerPolicy="no-referrer"
                                 loading="lazy"
                               />
                             )}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 truncate w-full text-center">{c.name}</span>
                        </button>
                      ))}
                      {(flagMode === 'modern' ? COUNTRIES : HISTORICAL_COUNTRIES).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="col-span-2 py-8 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest italic">
                          No nations found
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'shape' && (
                <motion.div
                  key="shape"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {SHAPES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-3 border-2 ${
                        shape.id === s.id 
                          ? 'border-amber-500 bg-white/10' 
                          : 'border-transparent bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="w-12 h-12">
                        <path d={s.path} fill="white" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{s.name}</span>
                    </button>
                  ))}
                  <div className="col-span-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-[9px] text-slate-500 leading-relaxed italic">
                      <Info className="w-3 h-3 inline mr-1" />
                      Tip: Some countries use unique shapes by default (like Tringapore or Reichtangle), but you can override them here!
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'eyes' && (
                <motion.div
                  key="eyes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => setEyeMode('preset')}
                      className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${eyeMode === 'preset' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      Presets
                    </button>
                    <button 
                      onClick={() => setEyeMode('custom')}
                      className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border ${eyeMode === 'custom' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                    >
                      Import
                    </button>
                  </div>

                  {eyeMode === 'preset' ? (
                    <div className="grid grid-cols-2 gap-3">
                      {EYES.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setEyes(e)}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-3 transition-all p-4 border-2 ${
                            eyes.id === e.id 
                              ? 'border-amber-500 bg-white/10' 
                              : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <svg viewBox="0 0 100 80" className="w-12 h-auto opacity-80 group-hover:opacity-100">
                            {e.render('white')}
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{e.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Import Custom Eyes</h3>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input 
                              type="text" 
                              placeholder="Paste eye image URL..."
                              value={customEyeUrl}
                              onChange={(e) => setCustomEyeUrl(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-[10px] text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
                            />
                          </div>
                          <Tooltip content="Import eyes from URL" position="left">
                            <button 
                              onClick={handleUrlEyeImport}
                              disabled={isModeratingEyes || !customEyeUrl}
                              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center min-w-[36px]"
                            >
                              {isModeratingEyes ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </Tooltip>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-white/5"></div>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none">OR</span>
                          <div className="h-px flex-1 bg-white/5"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Tooltip content="Upload eye image file" position="top">
                            <button 
                              onClick={() => eyeFileInputRef.current?.click()}
                              disabled={isModeratingEyes}
                              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all rounded-lg py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 active:scale-[0.98] disabled:opacity-50"
                            >
                              {isModeratingEyes ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
                                  <span>...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3 text-purple-500" />
                                  <span>Upload</span>
                                </>
                              )}
                            </button>
                          </Tooltip>

                          <Tooltip content="Clean background from current" position="top">
                            <button 
                              onClick={() => {
                                if (eyes.customUrl) {
                                  setEditingEyeSource(eyes.customUrl);
                                } else {
                                  eyeFileInputRef.current?.click();
                                }
                              }}
                              className="w-full bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 transition-all rounded-lg py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-400 active:scale-[0.98]"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>Wand Editor</span>
                            </button>
                          </Tooltip>
                        </div>
                        
                        <input 
                          type="file" 
                          ref={eyeFileInputRef} 
                          onChange={handleEyeFileChange} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {savedEyes.map((e) => (
                          <div key={e.id} className="relative group">
                            <button
                              onClick={() => setEyes(e)}
                              className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all p-3 border-2 ${
                                eyes.id === e.id 
                                  ? 'border-amber-500 bg-white/10' 
                                  : 'border-transparent bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="w-full h-10 rounded shadow-inner overflow-hidden border border-black/20 bg-black/40 flex items-center justify-center">
                                <img 
                                  src={e.customUrl} 
                                  alt={e.name} 
                                  className="w-auto h-full object-contain" 
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 truncate w-full text-center">{e.name}</span>
                            </button>
                            <button 
                              onClick={(e_stop) => {
                                e_stop.stopPropagation();
                                deleteSavedEye(e.id);
                              }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {savedEyes.length === 0 && (
                        <div className="py-8 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                          <EyeIcon className="w-6 h-6 text-slate-700" />
                          <p className="text-[9px] text-slate-600 font-medium px-6 text-center italic">Use transparent PNG or SVG for best results.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'accessories' && (
                <motion.div
                  key="cssessories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Accessory 1</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {ACCESSORIES.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAccessory(a)}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-3 transition-all p-4 border-2 ${
                            accessory.id === a.id 
                              ? 'border-amber-500 bg-white/10' 
                              : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <svg viewBox="0 20 100 60" className="w-12 h-auto">
                            <g transform="scale(0.8) translate(12, 0)">
                               <circle cx="50" cy="80" r="45" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3" opacity="0.3" />
                               {a.render()}
                            </g>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{a.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Accessory 2</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {ACCESSORIES.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAccessory2(a)}
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-3 transition-all p-4 border-2 ${
                            accessory2.id === a.id 
                              ? 'border-amber-500 bg-white/10' 
                              : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <svg viewBox="0 20 100 60" className="w-12 h-auto">
                            <g transform="scale(0.8) translate(12, 0)">
                               <circle cx="50" cy="80" r="45" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3" opacity="0.3" />
                               {a.render()}
                            </g>
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{a.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'adjust' && (
                <motion.div
                  key="adjust"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Body Adjustments */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <RefreshCcw className="w-3 h-3 text-amber-500" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Ball Customization</h3>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Use Country Flag</span>
                        <span className="text-[9px] text-slate-500 font-medium">Toggle between flag and solid color</span>
                      </div>
                      <button 
                        onClick={() => setUseFlag(!useFlag)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${useFlag ? 'bg-amber-600' : 'bg-slate-700'}`}
                      >
                         <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useFlag ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    {!useFlag && (
                      <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Base Color</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{ballColor}</span>
                          <input 
                            type="color" 
                            value={ballColor} 
                            onChange={(e) => setBallColor(e.target.value)}
                            className="w-8 h-8 rounded border-none bg-transparent cursor-pointer p-0 block [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
                          />
                        </div>
                      </div>
                    )}
                    
                    <AdjustmentSlider 
                      label="Z-Axis (Flat)" 
                      value={ballRotation} 
                      min={-180} 
                      max={180} 
                      onChange={(v) => setBallRotation(v)} 
                    />
                    <AdjustmentSlider 
                      label="X-Axis (Tilt)" 
                      value={ballRotationX} 
                      min={-45} 
                      max={45} 
                      onChange={(v) => setBallRotationX(v)} 
                    />
                    <AdjustmentSlider 
                      label="Y-Axis (Spin)" 
                      value={ballRotationY} 
                      min={-45} 
                      max={45} 
                      onChange={(v) => setBallRotationY(v)} 
                    />

                    <div className="flex gap-2 pt-2">
                      <Tooltip content="Mirror horizontally" position="top">
                        <button 
                          onClick={() => setFlipX(!flipX)}
                          className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${flipX ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                          <FlipHorizontal className="w-3 h-3" />
                          <span>Flip X</span>
                        </button>
                      </Tooltip>
                      <Tooltip content="Mirror vertically" position="top">
                        <button 
                          onClick={() => setFlipY(!flipY)}
                          className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${flipY ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                          <FlipVertical className="w-3 h-3" />
                          <span>Flip Y</span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Eye Adjustments */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <EyeIcon className="w-3 h-3 text-amber-500" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Eyes Position</h3>
                    </div>
                    
                    <AdjustmentSlider 
                      label="Horizontal" 
                      value={eyesOffset.x} 
                      min={-30} 
                      max={30} 
                      onChange={(v) => setEyesOffset(prev => ({ ...prev, x: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Vertical" 
                      value={eyesOffset.y} 
                      min={-20} 
                      max={40} 
                      onChange={(v) => setEyesOffset(prev => ({ ...prev, y: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Scale" 
                      value={eyesOffset.scale} 
                      min={0.5} 
                      max={2} 
                      step={0.1}
                      onChange={(v) => setEyesOffset(prev => ({ ...prev, scale: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Rotation" 
                      value={eyesOffset.rotation} 
                      min={-180} 
                      max={180} 
                      onChange={(v) => setEyesOffset(prev => ({ ...prev, rotation: v }))} 
                    />
                  </div>

                  {/* Hat Adjustments */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <PlusCircle className="w-3 h-3 text-amber-500" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Hat 1 Position</h3>
                    </div>
                    
                    <AdjustmentSlider 
                      label="Horizontal" 
                      value={hatOffset.x} 
                      min={-40} 
                      max={40} 
                      onChange={(v) => setHatOffset(prev => ({ ...prev, x: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Vertical" 
                      value={hatOffset.y} 
                      min={-40} 
                      max={40} 
                      onChange={(v) => setHatOffset(prev => ({ ...prev, y: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Scale" 
                      value={hatOffset.scale} 
                      min={0.5} 
                      max={2} 
                      step={0.1}
                      onChange={(v) => setHatOffset(prev => ({ ...prev, scale: v }))} 
                    />
                    <AdjustmentSlider 
                      label="Rotation" 
                      value={hatOffset.rotation} 
                      min={-180} 
                      max={180} 
                      onChange={(v) => setHatOffset(prev => ({ ...prev, rotation: v }))} 
                    />
                  </div>

                  {/* Hat 2 Adjustments */}
                  {accessory2.id !== 'none' && (
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                         <PlusCircle className="w-3 h-3 text-amber-500" />
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Hat 2 Position</h3>
                      </div>
                      
                      <AdjustmentSlider 
                        label="Horizontal" 
                        value={hat2Offset.x} 
                        min={-40} 
                        max={40} 
                        onChange={(v) => setHat2Offset(prev => ({ ...prev, x: v }))} 
                      />
                      <AdjustmentSlider 
                        label="Vertical" 
                        value={hat2Offset.y} 
                        min={-40} 
                        max={40} 
                        onChange={(v) => setHat2Offset(prev => ({ ...prev, y: v }))} 
                      />
                      <AdjustmentSlider 
                        label="Scale" 
                        value={hat2Offset.scale} 
                        min={0.5} 
                        max={2} 
                        step={0.1}
                        onChange={(v) => setHat2Offset(prev => ({ ...prev, scale: v }))} 
                      />
                      <AdjustmentSlider 
                        label="Rotation" 
                        value={hat2Offset.rotation} 
                        min={-180} 
                        max={180} 
                        onChange={(v) => setHat2Offset(prev => ({ ...prev, rotation: v }))} 
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-black/20 border-t border-white/10">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Studio Metadata</h3>
            <div className="space-y-3">
              <MetadataRow label="Canvas Size" value="1024x1024" />
              <MetadataRow label="Active Layers" value="6" />
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Session Shared</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Status */}
      <footer className="h-8 bg-[#0F1115] border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest shrink-0">
        <div className="flex gap-6">
          <span>Countryball Engine v2.0</span>
          <span className="hidden sm:inline">Render: SVG-TO-PNG</span>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="Creative mode enabled" position="left">
            <span className="flex items-center gap-1.5 cursor-help">
              <Info className="w-3 h-3" /> Creative Mode
            </span>
          </Tooltip>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      <Tutorial />

      {editingEyeSource && (
        <EyeEditor 
          src={editingEyeSource}
          onSave={(dataUrl) => {
            handleCustomEyeImport(dataUrl);
            setEditingEyeSource(null);
          }}
          onCancel={() => setEditingEyeSource(null)}
        />
      )}
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label, tooltip }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tooltip?: string }) {
  return (
    <Tooltip content={tooltip || label} position="right">
      <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1.5 transition-all text-[10px] uppercase font-bold tracking-tighter ${
          active ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
          active 
            ? 'bg-amber-500/10 border-amber-500/30' 
            : 'bg-white/5 border-white/5 hover:border-white/10'
        }`}>
          {icon}
        </div>
        <span className="text-[8px] tracking-widest">{label}</span>
      </button>
    </Tooltip>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-[10px]">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-slate-300 font-bold">{value}</span>
    </div>
  );
}

function AdjustmentSlider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
        <span className="text-slate-500">{label}</span>
        <input 
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) onChange(val);
          }}
          className="w-10 bg-transparent text-right text-amber-500 focus:outline-none focus:text-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          step={step}
        />
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
    </div>
  );
}

