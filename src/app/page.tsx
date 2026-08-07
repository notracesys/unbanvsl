
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Componente que revela o texto palavra por palavra com animação suave.
 */
function SoftReveal({ text, onComplete, delay = 0 }: { text: string; onComplete?: () => void; delay?: number }) {
  const words = text.split(' ');
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= words.length) {
            clearInterval(interval);
            if (onComplete) setTimeout(onComplete, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Velocidade da revelação das palavras
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [words.length, onComplete, delay]);

  return (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
      {words.map((word, i) => (
        <span
          key={i}
          className={cn(
            "opacity-0 blur-md translate-y-2 transition-all duration-700",
            i < visibleCount && "opacity-100 blur-0 translate-y-0"
          )}
          style={{ transitionDelay: `${i * 30}ms` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showButton, setShowButton] = useState(false);

  const introTexts = [
    "Você sabia que seus dados pessoais podem estar visíveis para qualquer pessoa agora mesmo?",
    "Enquanto você navega nas redes sociais, 8 de cada 10 brasileiros têm sua privacidade exposta sem saber.",
    "A internet não esquece... e ela sabe mais sobre você do que deveria."
  ];

  return (
    <div className="min-h-screen bg-[#050706] text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Grid de fundo muito sutil */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      <div className="max-w-4xl w-full z-10 text-center">
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-12">
          
          {step >= 1 && (
            <div className={cn("transition-all duration-1000", step > 1 ? "opacity-30 blur-sm scale-95" : "opacity-100")}>
              <h1 className="text-2xl md:text-4xl font-heading-cyber font-medium leading-tight text-white/90 tracking-tight italic">
                <SoftReveal 
                  text={introTexts[0]} 
                  onComplete={() => setStep(2)} 
                />
              </h1>
            </div>
          )}

          {step >= 2 && (
            <div className={cn("transition-all duration-1000", step > 2 ? "opacity-30 blur-sm scale-95" : "opacity-100")}>
              <h2 className="text-3xl md:text-5xl font-heading-cyber font-bold leading-tight text-primary glow-text tracking-tighter italic">
                <SoftReveal 
                  text={introTexts[1]} 
                  onComplete={() => setStep(3)} 
                />
              </h2>
            </div>
          )}

          {step >= 3 && (
            <div className="transition-all duration-1000">
              <h3 className="text-2xl md:text-4xl font-heading-cyber font-medium leading-tight text-white/90 tracking-tight italic">
                <SoftReveal 
                  text={introTexts[2]} 
                  onComplete={() => setShowButton(true)} 
                />
              </h3>
            </div>
          )}
        </div>

        {showButton && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center gap-6">
            <Button 
              size="lg"
              onClick={() => router.push('/scan')}
              className="bg-primary hover:bg-primary/90 text-black font-black px-12 h-16 rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg glow-primary"
            >
              ESCANEAR MINHA EXPOSIÇÃO <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <div className="flex gap-8 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.4em] opacity-40">
               <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure Protocol</span>
               <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Live Analysis</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
