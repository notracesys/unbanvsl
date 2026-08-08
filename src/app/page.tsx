
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldAlert, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function TechBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B1020]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4DA3FF]/5 blur-[120px] rounded-full animate-pulse" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, #27314F 1px, transparent 1px), linear-gradient(to bottom, #27314F 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

const RevealText = React.memo(({ text, delay = 0, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [visibleText, setVisibleText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTimeout = setTimeout(() => setIsStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || isFinished) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setVisibleText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        if (onCompleteRef.current) {
          setTimeout(() => onCompleteRef.current?.(), 500);
        }
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, isStarted, isFinished]);

  return (
    <span className="inline-block transition-all duration-300">
      {visibleText}
      {!isFinished && isStarted && (
        <span className="inline-block w-1.5 h-6 bg-[#4DA3FF] ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
});

RevealText.displayName = 'RevealText';

export default function PresentationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showButton, setShowButton] = useState(false);

  const handleStep1Complete = useCallback(() => {
    setStep(2);
  }, []);

  const handleStep2Complete = useCallback(() => {
    setShowButton(true);
  }, []);

  const handleProceed = () => {
    router.push('/busca');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1020] text-[#F5F7FB] p-6 relative overflow-hidden font-sans">
      <TechBackground />

      <header className="absolute top-0 left-0 w-full p-8 flex justify-center z-10">
        <div className="flex items-center gap-2 opacity-80">
          <Image 
            src="/localiza.png" 
            alt="Localiza.AI Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-space font-bold tracking-tighter">
            LOCALIZA<span className="text-[#4DA3FF]">.AI</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-12">
        <div className="w-full min-h-[160px] flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-tight tracking-tight text-[#F5F7FB]">
            <RevealText 
              text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você está navegando nas redes sociais?" 
              onComplete={handleStep1Complete}
            />
          </h1>
          
          {step >= 2 && (
            <p className="mt-8 text-xl md:text-2xl font-space font-bold text-[#4DA3FF] italic">
              <RevealText 
                text="Isso é o que acontece com 80% dos brasileiros e eles nem sabem disso." 
                delay={300}
                onComplete={handleStep2Complete}
              />
            </p>
          )}
        </div>

        <div className={cn(
          "transition-all duration-1000 transform flex flex-col items-center space-y-6",
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        )}>
          <div className="w-16 h-16 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center border border-[#4DA3FF]/20 animate-pulse mb-4">
            <ShieldAlert className="w-8 h-8 text-[#4DA3FF]" />
          </div>

          <Button 
            onClick={handleProceed}
            className="h-16 px-12 rounded-2xl bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-bold text-lg uppercase tracking-widest shadow-2xl shadow-blue-500/20 group"
          >
            Continuar para Localiza.AI
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-sm text-[#AAB4D0] font-medium flex items-center gap-2">
            Verificação Privada <ChevronRight className="w-3 h-3" /> Inteligência de Dados
          </p>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full p-8 text-center">
        <p className="text-[10px] font-mono font-bold text-[#AAB4D0]/30 uppercase tracking-[0.5em]">
          Localiza.AI Intelligence Protocol
        </p>
      </footer>
    </div>
  );
}
