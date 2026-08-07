
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Radar, ArrowRight, ShieldAlert, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Typewriter({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return (
    <span className="leading-relaxed">
      {displayedText}
      {index < text.length && (
        <span className="inline-block w-2 h-6 bg-primary ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(1);
  const [showButton, setShowButton] = useState(false);

  const introTexts = [
    "Você sabia que seus dados pessoais podem estar visíveis para qualquer pessoa agora mesmo?",
    "Enquanto você navega nas redes sociais, 8 de cada 10 brasileiros têm sua privacidade exposta em fontes públicas sem saber.",
    "A internet não esquece... e ela sabe mais sobre você do que deveria."
  ];

  const handleStart = () => {
    router.push('/scan');
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Grids & FX */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="scanline" />

      <div className="max-w-3xl w-full relative z-10 text-center space-y-12">
        {showIntro && (
          <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive mb-4">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Alerta de Exposição Ativa</span>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
              <h1 className="text-2xl md:text-4xl font-heading-cyber font-bold leading-tight text-white/90 italic tracking-tight">
                {step >= 1 && (
                  <div className="mb-6">
                    <Typewriter 
                      text={introTexts[0]} 
                      onComplete={() => setTimeout(() => setStep(2), 1000)} 
                    />
                  </div>
                )}
                {step >= 2 && (
                  <div className="mb-6 text-primary glow-text">
                    <Typewriter 
                      text={introTexts[1]} 
                      onComplete={() => setTimeout(() => setStep(3), 1000)} 
                    />
                  </div>
                )}
                {step >= 3 && (
                  <div className="mb-6">
                    <Typewriter 
                      text={introTexts[2]} 
                      onComplete={() => setShowButton(true)} 
                    />
                  </div>
                )}
              </h1>
            </div>

            {showButton && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 flex flex-col items-center gap-6">
                <Button 
                  size="lg"
                  onClick={handleStart}
                  className="bg-primary hover:bg-primary-strong text-background font-black px-12 h-16 rounded-2xl transition-all hover:scale-105 active:scale-95 text-lg shadow-[0_0_30px_rgba(124,255,107,0.3)] glow-primary"
                >
                  VERIFICAR MEUS DADOS <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="flex gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-50">
                   <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Criptografado</span>
                   <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Real-time Scan</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Radar Decorator */}
        <div className="fixed -bottom-20 -right-20 w-80 h-80 opacity-20 pointer-events-none">
          <div className="animate-radar w-full h-full border border-primary/30 rounded-full" />
          <div className="animate-radar w-full h-full border border-primary/30 rounded-full" style={{ animationDelay: '1s' }} />
          <Radar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-primary" />
        </div>
      </div>
    </div>
  );
}
