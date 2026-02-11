/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, CalculatorIcon, PuzzlePieceIcon, ClipboardDocumentCheckIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { CursorArrowRaysIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/solid';

// Component that simulates drawing a wireframe then filling it with life
const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); // Start drawing
      setTimeout(() => setStage(2), 3500); // Come alive
    };

    // Initial delay
    const startTimeout = setTimeout(() => {
      cycle();
      // Repeat cycle
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-20 h-28 md:w-28 md:h-40 rounded-lg backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-zinc-800/40 border-zinc-500/50 shadow-xl scale-110 -translate-y-4' : 'bg-zinc-900/10 border-zinc-800 scale-100 border border-dashed'}`}>
        
        {/* Label tag that appears in stage 2 */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-100 text-zinc-900 border border-zinc-200 text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          {/* Stage 1: Wireframe Drawing Effect */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-500 stroke-1" />
             {/* Technical corner markers instead of dash drawing */}
             <div className="absolute -inset-2 border border-zinc-700/30 opacity-50"></div>
             <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-500"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-500"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-500"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-500"></div>
          </div>

          {/* Stage 2: Alive/Interactive */}
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <FinalIcon className="w-10 h-10 md:w-14 md:h-14 text-blue-500" />
             {stage === 2 && (
               <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-zinc-900/80 rounded-full border border-zinc-700/50">
                 <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                 <div className="w-8 h-0.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 animate-[pulse_1s_infinite]"></div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      {/* Background Transformation Elements - Fixed to Viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left: Patent -> Validated */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={ClipboardDocumentCheckIcon} 
            finalIcon={SparklesIcon} 
            label="PATENT"
            delay={0} 
            x="4%" 
            y="8%"
            rotation={-3} 
            />
        </div>

        {/* Bottom Right: Board Game -> Playable */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={PuzzlePieceIcon} 
            finalIcon={CursorArrowRaysIcon} 
            label="GAME"
            delay={3000} 
            x="88%" 
            y="75%"
            rotation={2} 
            />
        </div>

        {/* Top Right: Data/Paper -> Dashboard */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={NewspaperIcon} 
            finalIcon={ChartBarIcon} 
            label="DATA"
            delay={6000} 
            x="88%" 
            y="12%"
            rotation={1} 
            />
        </div>

        {/* Bottom Left: Sketch -> App */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={DocumentTextIcon} 
            finalIcon={CalculatorIcon} 
            label="APP"
            delay={4500} 
            x="5%" 
            y="72%"
            rotation={-2} 
            />
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
          Bring anything <br/>
          to <span className="underline decoration-4 decoration-blue-500 underline-offset-4 md:underline-offset-8 text-white">life</span>.
        </h1>
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          Gemini sees the code in everything. Drop in an old map, a floor plan, a diagram, or a doodle, and watch it turn into a working interactive experience instantly.
        </p>
      </div>
    </>
  );
};