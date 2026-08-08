'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
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
  const [counter, setCounter] = useState(94538);
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);

  useEffect(() => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    setDayOfWeek(days[new Date().getDay()]);

    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

      <header className="absolute top-0 left-0 w-full p-4 flex justify-center z-10">
        <div className="flex items-center">
          <Image 
            src="/localiza.png" 
            alt="Localiza.AI Logo" 
            width={220} 
            height={220} 
            className="w-48 md:w-64 h-auto object-contain"
            priority
          />
        </div>
      </header>

      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center space-y-12 mt-12">
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
          "transition-all duration-1000 transform flex flex-col items-center space-y-6 w-full px-4",
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        )}>
          <Button 
            onClick={handleProceed}
            className="w-full h-16 md:w-auto md:px-12 rounded-2xl bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-bold text-lg uppercase tracking-widest shadow-2xl shadow-blue-500/20 group"
          >
            Prosseguir
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-bold text-[#AAB4D0] tracking-tight">
              <span className="text-[#7C6CFF]">+{counter.toLocaleString('pt-BR')}</span> perfis analisados hoje {dayOfWeek ? `(${dayOfWeek})` : ''}
            </p>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full p-6 text-center">
        <p className="text-[10px] font-mono font-bold text-[#AAB4D0]/30 uppercase tracking-[0.5em]">
          Localiza.AI // Secure Intelligence Protocol
        </p>
      </footer>
    </div>
  );
}