
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, ShieldCheck, Key, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            if (onComplete) setTimeout(onComplete, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 25);
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
            "inline-block transition-all duration-500 ease-out whitespace-pre",
            i < visibleChars 
              ? "opacity-100 blur-0 translate-y-0" 
              : "opacity-0 blur-md translate-y-6"
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
  const [showCard, setShowCard] = useState(false);

  // Get current weekday in Portuguese
  const getWeekday = () => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return days[new Date().getDay()];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix-like Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex justify-around text-[10px] font-mono leading-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-matrix whitespace-pre">
            {Array(50).fill("STALKEA LOCALIZA PRIVATE SECURE DATA SCAN ").join("\n")}
          </div>
        ))}
      </div>

      {!showCard ? (
        <div className="max-w-2xl w-full text-center relative z-10 px-4 space-y-12">
          {step >= 1 && (
            <div className={cn("transition-all duration-1000", step > 1 ? "opacity-20 scale-95 blur-sm" : "opacity-100")}>
              <h1 className="text-xl md:text-2xl font-medium tracking-tight italic text-zinc-400">
                <RevealText 
                  text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você está navegando nas redes sociais?" 
                  onComplete={() => setStep(2)} 
                />
              </h1>
            </div>
          )}

          {step >= 2 && (
            <div className={cn("transition-all duration-1000", step > 3 ? "opacity-20 scale-95 blur-sm" : "opacity-100")}>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.95] text-white">
                <RevealText 
                  text="Isso é o que acontece com 8 de cada 10 brasileiros e eles nem sabem disso." 
                  onComplete={() => setStep(3)} 
                />
              </h2>
            </div>
          )}

          {step >= 3 && (
            <div className="transition-all duration-1000">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#A855F7] italic">
                <RevealText 
                  text="A internet não esquece... e ela sabe mais sobre você do que deveria." 
                  onComplete={() => setShowCard(true)} 
                />
              </h3>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[400px] animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 z-20">
          {/* Main Card - Style inspired by STALKEA.AI */}
          <div className="bg-[#0D0D0D] border border-zinc-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(168,85,247,0.15)] flex flex-col items-center text-center space-y-8">
            
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#6366F1] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xs tracking-[0.3em] uppercase text-zinc-400">
                LOCALIZA<span className="text-[#A855F7]">.AI</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.8rem] leading-[0.9] font-black text-white tracking-tighter">
              O que seus <br />
              <span className="text-[#A855F7]">Dados</span> revelam <br />
              sobre você?
            </h1>

            {/* Subheadline */}
            <p className="text-zinc-400 text-sm font-medium leading-tight px-4">
              Descubra a verdade sobre sua <span className="text-white font-bold">exposição digital</span>, acessando seu relatório completo!
            </p>

            {/* Main Button */}
            <Button 
              size="lg"
              onClick={() => router.push('/scan')}
              className="w-full h-20 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:opacity-90 text-white font-black text-xl rounded-3xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-500/20 gap-3"
            >
              <Eye className="w-6 h-6" /> Escanear Agora
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A855F7]" /> 100% Seguro
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                <Key className="w-3.5 h-3.5 text-[#A855F7]" /> Sem Cadastro
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                <Zap className="w-3.5 h-3.5 text-[#A855F7]" /> Análise Grátis
              </div>
            </div>
          </div>

          {/* Social Proof Counter */}
          <div className="mt-8 text-center space-y-1">
            <p className="text-[12px] font-bold text-zinc-500 tracking-tight">
              <span className="text-[#A855F7]">+85.234</span> scans realizados hoje ({getWeekday()})
            </p>
            <div className="flex justify-center -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#050505] overflow-hidden bg-zinc-800">
                  <img src={`https://picsum.photos/seed/${i + 20}/50/50`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
