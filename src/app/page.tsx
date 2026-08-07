'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

function RevealText({ text, delay = 0, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const chars = text.split('');

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= chars.length) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 35); // Velocidade da letra
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [chars.length, onComplete, delay]);

  return (
    <div className="flex flex-wrap justify-center leading-tight">
      {chars.map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-300 ease-out whitespace-pre",
            i < visibleChars 
              ? "opacity-100 blur-0 translate-y-0" 
              : "opacity-0 blur-sm translate-y-2"
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
    <div className="min-h-screen bg-[#050505] text-[#7CFF6B] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="w-full max-w-2xl space-y-16">
        {step >= 1 && (
          <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você navega?" 
              onComplete={() => setStep(2)} 
            />
          </div>
        )}

        {step >= 2 && (
          <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="Isso acontece com 8 de cada 10 brasileiros e eles nem sabem disso." 
              delay={500}
              onComplete={() => setStep(3)} 
            />
          </div>
        )}

        {step >= 3 && (
          <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">
            <RevealText 
              text="A internet não esquece... e ela sabe mais sobre você do que deveria." 
              delay={500}
            />
          </div>
        )}
      </div>
    </div>
  );
}
