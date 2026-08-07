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

      ctx!.fillStyle = '#1a331a'; // Verde bem escuro para o rastro
      ctx!.font = `${fontSize}px JetBrains Mono`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Algumas letras brilham mais (verde primário)
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

// --- Reveal Text Component ---
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
  const chars = text.split('');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev < chars.length) return prev + 1;
          clearInterval(intervalId);
          return prev;
        });
      }, 30);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [chars.length, delay]);

  useEffect(() => {
    if (visibleChars === chars.length && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, chars.length, onComplete]);

  // Função para verificar se o caractere atual faz parte de uma palavra destacada
  const renderText = () => {
    let currentText = '';
    return chars.map((char, i) => {
      if (i >= visibleChars) return null;
      
      currentText += char;
      let isHighlighted = false;
      
      // Checagem simples de highlight por palavras
      for (const word of highlightWords) {
        if (text.includes(word)) {
          const startIndex = text.indexOf(word);
          const endIndex = startIndex + word.length;
          if (i >= startIndex && i < endIndex) {
            isHighlighted = true;
            break;
          }
        }
      }

      return (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-300 ease-out whitespace-pre transform",
            isHighlighted ? "text-[#7CFF6B] font-bold" : "text-white",
            i < visibleChars ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-wrap justify-center leading-tight text-lg md:text-xl font-medium tracking-tight px-2">
      {renderText()}
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <DigitalRain />

      {/* Main Container com Glow Esverdeado */}
      <div className="w-full max-w-sm md:max-w-md bg-black/60 backdrop-blur-md border border-[#7CFF6B]/20 rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(124,255,107,0.15)] relative z-10 space-y-8 animate-in fade-in zoom-in duration-1000">
        
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

        {step >= 4 && (
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <button 
              onClick={() => window.location.href = '/scan'}
              className="w-full py-5 bg-[#7CFF6B] text-[#050505] font-black text-sm uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(124,255,107,0.4)] active:scale-95 flex items-center justify-center gap-2 group"
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
