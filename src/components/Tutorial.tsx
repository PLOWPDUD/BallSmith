import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Sparkles, Wand2, Palette, Globe, Eye } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Welcome to BallSmith!",
    description: "Create your own custom Countryball characters with ease. Let's walk you through the basics.",
    icon: <Sparkles className="w-8 h-8 text-amber-500" />
  },
  {
    title: "Choose Your Nation",
    description: "Start by picking a flag. We have modern, historical, and even support for custom URL uploads!",
    icon: <Globe className="w-8 h-8 text-blue-500" />
  },
  {
    title: "Express Yourself",
    description: "Change the eyes to give your ball a unique personality. Adjust position and scale in the 'Adjust' tab.",
    icon: <Eye className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Accessorize",
    description: "Add up to two hats at the same time! Perfect for that double-decked fancy look.",
    icon: <Palette className="w-8 h-8 text-pink-500" />
  },
  {
    title: "Master the Studio",
    description: "Use the 3D rotation controls to pose your character. When ready, click 'Export' to save your creation!",
    icon: <Wand2 className="w-8 h-8 text-green-500" />
  }
];

export function Tutorial() {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('ballsmith_tutorial_seen');
    if (!hasSeenTutorial) {
      setShow(true);
    }
  }, []);

  const closeTutorial = () => {
    setShow(false);
    localStorage.setItem('ballsmith_tutorial_seen', 'true');
  };

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#16181D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 pb-4 flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-white/5 rounded-2xl">
                {STEPS[currentStep].icon}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                {STEPS[currentStep].description}
              </p>
            </div>

            <div className="px-8 pb-8 pt-6">
              <div className="flex gap-1 justify-center mb-8">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-amber-500' : 'w-2 bg-white/10'}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={closeTutorial}
                  className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Skip
                </button>
                
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <button 
                      onClick={prev}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <button 
                    onClick={next}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 rounded-xl text-white font-black uppercase tracking-widest hover:bg-amber-700 transition-all active:scale-95 shadow-lg shadow-amber-900/20"
                  >
                    {currentStep === STEPS.length - 1 ? "Finish" : "Next"}
                    {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={closeTutorial}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
