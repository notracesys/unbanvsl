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
            if (onComplete) onComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 30);
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
              : "opacity-0 blur-md translate-y-4"
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
  const [showUI, setShowUI] = useState(false);

  const getWeekday = () => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return days[new Date().getDay()];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-[420px] z-20">
        <div className={cn(
          "bg-[#0D0D0D] border border-zinc-800/50 rounded-[2.5rem] p-8 md:p-10 transition-all duration-1000 flex flex-col items-center text-center",
          showUI ? "shadow-[0_0_80px_rgba(168,85,247,0.15)]" : "shadow-none"
        )}>
          
          {/* Persuasion Intro - Always Green & Inside Div */}
          <div className="space-y-6 w-full mb-4">
            {step >= 1 && (
              <div className="text-lg md:text-xl font-medium tracking-tight italic text-[#7CFF6B]">
                <RevealText 
                  text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você navega?" 
                  onComplete={() => setStep(2)} 
                />
              </div>
            )}

            {step >= 2 && (
              <div className="text-xl md:text-2xl font-black tracking-tighter leading-none text-[#7CFF6B]">
                <RevealText 
                  text="Isso acontece com 8 de cada 10 brasileiros e eles nem sabem disso." 
                  onComplete={() => setStep(3)} 
                />
              </div>
            )}

            {step >= 3 && (
              <div className="text-lg md:text-xl font-bold tracking-tight text-[#7CFF6B] italic">
                <RevealText 
                  text="A internet não esquece... e ela sabe mais sobre você do que deveria." 
                  onComplete={() => setTimeout(() => setShowUI(true), 500)} 
                />
              </div>
            )}
          </div>

          {/* Main UI Elements - Fade In After Intro */}
          <div className={cn(
            "w-full space-y-8 transition-all duration-1000 overflow-hidden",
            showUI ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
          )}>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            {/* Logo */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#6366F1] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xs tracking-[0.3em] uppercase text-zinc-400">
                LOCALIZA<span className="text-[#A855F7]">.AI</span>
              </span>
            </div>

            <h2 className="text-[2.5rem] leading-[0.9] font-black text-white tracking-tighter">
              O que seus <br />
              <span className="text-[#A855F7]">Dados</span> revelam <br />
              sobre você?
            </h2>

            <Button 
              size="lg"
              onClick={() => router.push('/scan')}
              className="w-full h-20 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:opacity-90 text-white font-black text-xl rounded-3xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-500/20 gap-3"
            >
              <Eye className="w-6 h-6" /> Escanear Agora
            </Button>

            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A855F7]" /> 100% Seguro
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                <Key className="w-3.5 h-3.5 text-[#A855F7]" /> Sem Cadastro
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
                <Zap className="w-3.5 h-3.5 text-[#A855F7]" /> Análise Grátis
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Counter */}
        <div className={cn(
          "mt-8 text-center space-y-3 transition-all duration-1000",
          showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <p className="text-[12px] font-bold text-zinc-500 tracking-tight">
            <span className="text-[#A855F7]">+85.234</span> scans realizados hoje ({getWeekday()})
          </p>
          <div className="flex justify-center -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050505] overflow-hidden bg-zinc-800">
                <img src={`https://picsum.photos/seed/${i + 50}/60/60`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
