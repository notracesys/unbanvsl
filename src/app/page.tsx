'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// --- Background Animation (Digital Rain) ---
function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      ctx!.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.fillStyle = '#1a331a';
      ctx!.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        if (Math.random() > 0.95) {
          ctx!.fillStyle = '#7CFF6B';
        } else {
          ctx!.fillStyle = '#1a4d1a';
        }

        ctx!.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 z-0"
    />
  );
}

// --- Reveal Text Component with Word Wrapping Fix ---
function RevealText({ 
  text, 
  highlightWords = [], 
  delay = 0, 
  onComplete 
}: { 
  text: string; 
  highlightWords?: string[]; 
  delay?: number; 
  onComplete?: () => void 
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const charsCount = text.length;

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev < charsCount) return prev + 1;
          clearInterval(intervalId);
          return prev;
        });
      }, 30);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [charsCount, delay]);

  useEffect(() => {
    if (visibleChars === charsCount && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, charsCount, onComplete]);

  // Function to check if a specific index is highlighted
  const isHighlighted = (index: number) => {
    return highlightWords.some(phrase => {
      const start = text.indexOf(phrase);
      if (start === -1) return false;
      const end = start + phrase.length;
      return index >= start && index < end;
    });
  };

  // Split text by spaces but keep the words together as inline-blocks
  const parts = text.split(/(\s+)/);
  let globalIdx = 0;

  return (
    <div className="flex flex-wrap justify-center leading-relaxed text-lg md:text-xl font-medium tracking-tight px-2 text-center">
      {parts.map((part, pIdx) => {
        if (/^\s+$/.test(part)) {
          // It's a space or group of spaces
          return part.split('').map((space, sIdx) => {
            const currentGlobalIdx = globalIdx++;
            if (currentGlobalIdx >= visibleChars) return null;
            return <span key={`${pIdx}-${sIdx}`} className="whitespace-pre"> </span>;
          });
        } else {
          // It's a word
          const wordChars = part.split('').map((char, cIdx) => {
            const currentGlobalIdx = globalIdx++;
            if (currentGlobalIdx >= visibleChars) return null;
            const highlighted = isHighlighted(currentGlobalIdx);
            return (
              <span
                key={cIdx}
                className={cn(
                  "inline-block transition-all duration-300 ease-out transform",
                  highlighted ? "text-[#7CFF6B] font-bold" : "text-white"
                )}
              >
                {char}
              </span>
            );
          });
          return (
            <span key={pIdx} className="inline-block whitespace-nowrap">
              {wordChars}
            </span>
          );
        }
      })}
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <DigitalRain />

      {/* Main Container com Glow Esverdeado */}
      <div className="w-full max-w-sm md:max-w-md bg-black/80 backdrop-blur-xl border border-[#7CFF6B]/30 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_60px_-15px_rgba(124,255,107,0.25)] relative z-10 space-y-10 animate-in fade-in zoom-in duration-1000">
        
        <div className="min-h-[300px] flex flex-col justify-center gap-8">
          {step >= 1 && (
            <RevealText 
              text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você navega?" 
              highlightWords={["visíveis para todo mundo"]}
              onComplete={() => setStep(2)} 
            />
          )}

          {step >= 2 && (
            <RevealText 
              text="Isso acontece com 8 de cada 10 brasileiros agora mesmo... e eles nem imaginam o risco." 
              highlightWords={["8 de cada 10 brasileiros"]}
              delay={300}
              onComplete={() => setStep(3)} 
            />
          )}

          {step >= 3 && (
            <RevealText 
              text="A internet não esquece. E ela sabe muito mais sobre você do que deveria." 
              highlightWords={["sabe muito mais sobre você"]}
              delay={300}
              onComplete={() => setStep(4)}
            />
          )}
        </div>

        {step >= 4 && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <button 
              onClick={() => window.location.href = '/scan'}
              className="w-full py-5 bg-[#7CFF6B] text-[#050505] font-black text-sm uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(124,255,107,0.5)] active:scale-95 flex items-center justify-center gap-2 group"
            >
              Iniciar Análise agora
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer minimalista */}
      <div className="absolute bottom-8 left-0 w-full text-center z-10">
        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
          Localiza.AI // Privacy Protocol
        </p>
      </div>
    </div>
  );
}
