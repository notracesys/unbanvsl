
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Componente que revela o texto caractere por caractere com uma animação de subida e desfoque.
 */
function RevealText({ text, delay = 0, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0);
  const chars = text.split('');

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= chars.length) {
            clearInterval(interval);
            if (onComplete) setTimeout(onComplete, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 30); // Velocidade da digitação (ms por letra)
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [chars.length, onComplete, delay]);

  return (
    <div className="flex flex-wrap justify-center leading-relaxed">
      {chars.map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-700 ease-out whitespace-pre",
            i < visibleChars 
              ? "opacity-100 blur-0 translate-y-0" 
              : "opacity-0 blur-sm translate-y-4"
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showButton, setShowButton] = useState(false);

  return (
    <div className="min-h-screen bg-[#050706] text-white flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="min-h-[450px] flex flex-col items-center justify-center gap-16">
          
          {step >= 1 && (
            <div className={cn("transition-all duration-1000", step > 1 ? "opacity-30 scale-95" : "opacity-100")}>
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight italic">
                <RevealText 
                  text="Você sabia que seus dados pessoais podem estar visíveis para qualquer pessoa agora mesmo?" 
                  onComplete={() => setStep(2)} 
                />
              </h1>
            </div>
          )}

          {step >= 2 && (
            <div className={cn("transition-all duration-1000", step > 2 ? "opacity-30 scale-95" : "opacity-100")}>
              <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tighter italic leading-tight">
                <RevealText 
                  text="Enquanto você navega nas redes sociais, 8 de cada 10 brasileiros têm sua privacidade exposta sem saber." 
                  onComplete={() => setStep(3)} 
                />
              </h2>
            </div>
          )}

          {step >= 3 && (
            <div className="transition-all duration-1000">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight italic">
                <RevealText 
                  text="A internet não esquece... e ela sabe mais sobre você do que deveria." 
                  onComplete={() => setShowButton(true)} 
                />
              </h3>
            </div>
          )}
        </div>

        {showButton && (
          <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
            <Button 
              size="lg"
              onClick={() => router.push('/scan')}
              className="bg-primary hover:bg-primary/90 text-black font-black px-16 h-20 rounded-2xl transition-all hover:scale-105 active:scale-95 text-xl shadow-[0_0_50px_rgba(124,255,107,0.3)]"
            >
              ESCANEAR MINHA EXPOSIÇÃO <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <p className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">
              Iniciando Protocolo de Análise Digital
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
