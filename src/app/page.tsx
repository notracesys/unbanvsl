
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

function RevealText({ text, delay = 0, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const chars = text.split('');

  // Controla o surgimento letra por letra
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev < chars.length) {
            return prev + 1;
          }
          clearInterval(intervalId);
          return prev;
        });
      }, 35); // Velocidade de digitação premium
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [chars.length, delay]);

  // Dispara o callback de conclusão de forma segura fora do render
  useEffect(() => {
    if (visibleChars === chars.length && onComplete) {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, chars.length, onComplete]);

  return (
    <div className="flex flex-wrap justify-center leading-tight">
      {chars.map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-500 ease-out whitespace-pre transform",
            i < visibleChars 
              ? "opacity-100 blur-0 translate-y-0 scale-100" 
              : "opacity-0 blur-sm translate-y-4 scale-90"
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#050505] text-[#7CFF6B] flex flex-col items-center justify-center p-6 text-center overflow-hidden font-sans">
      {/* Scanline sutil para profundidade tecnológica */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="w-full max-w-2xl space-y-16 relative z-10">
        {step >= 1 && (
          <div className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você navega?" 
              onComplete={() => setStep(2)} 
            />
          </div>
        )}

        {step >= 2 && (
          <div className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="Isso acontece com 8 de cada 10 brasileiros agora mesmo... e eles nem imaginam o risco." 
              delay={300}
              onComplete={() => setStep(3)} 
            />
          </div>
        )}

        {step >= 3 && (
          <div className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="A internet não esquece. E ela sabe muito mais sobre você do que deveria." 
              delay={300}
              onComplete={() => setStep(4)}
            />
          </div>
        )}

        {step >= 4 && (
          <div className="pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <button 
              onClick={() => window.location.href = '/scan'}
              className="group relative px-12 py-6 bg-[#7CFF6B] text-[#050505] font-black text-xl uppercase italic tracking-tighter overflow-hidden hover:scale-105 transition-all shadow-[0_0_40px_rgba(124,255,107,0.5)] active:scale-95"
            >
              <span className="relative z-10">Iniciar Análise agora →</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
