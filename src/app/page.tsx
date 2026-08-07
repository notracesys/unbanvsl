
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Search, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

function TechBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0 tech-grid" />
      
      {/* Central Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#72FF5D]/5 blur-[120px] rounded-full" />
      
      {/* Radar Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#72FF5D]/10 rounded-full">
        <div className="absolute inset-0 border border-[#72FF5D]/5 rounded-full scale-75" />
        <div className="absolute inset-0 border border-[#72FF5D]/5 rounded-full scale-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full animate-scan-radar">
          <div className="w-1/2 h-1/2 bg-gradient-to-tr from-[#72FF5D]/10 to-transparent rounded-tl-full origin-bottom-right" />
        </div>
      </div>

      {/* Random Lights */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#72FF5D] rounded-full blur-[2px] opacity-20" />
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-[#72FF5D] rounded-full blur-[2px] opacity-30" />
    </div>
  );
}

function RevealText({ 
  text, 
  onComplete,
  delay = 0 
}: { 
  text: string; 
  onComplete?: () => void;
  delay?: number;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev < text.length) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (visibleChars === text.length && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, text.length, onComplete]);

  return (
    <div className="flex flex-wrap justify-center text-center">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-300 ease-out transform translate-y-2 opacity-0 blur-sm",
            i < visibleChars && "translate-y-0 opacity-100 blur-0 text-[#72FF5D]"
          )}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => setShowCard(true), 500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#050706] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <TechBackground />

      <div className="relative z-10 w-full max-w-lg">
        {!showCard ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center gap-6 text-xl md:text-2xl font-medium tracking-tight px-4 leading-relaxed">
            {step >= 1 && (
              <RevealText 
                text="Você sabia que seus dados podem estar visíveis para todo mundo enquanto você navega?" 
                onComplete={() => setStep(2)} 
              />
            )}
            {step >= 2 && (
              <RevealText 
                text="Isso acontece com 8 de cada 10 brasileiros agora mesmo... e eles nem imaginam o risco." 
                delay={300}
                onComplete={() => setStep(3)} 
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000">
            <div className="bg-[#0B0F0D] border border-[#1F2A22] rounded-[2.5rem] p-8 md:p-10 green-glow relative overflow-hidden group">
              {/* Scan Status Badge (Subtle) */}
              <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="flex flex-col items-end gap-1 font-mono text-[8px] tracking-tighter text-[#72FF5D]">
                  <span>SCAN_STATUS: READY</span>
                  <span>ENCRYPTION: AES-256</span>
                </div>
              </div>

              {/* Top Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#72FF5D]/5 border border-[#72FF5D]/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#72FF5D]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#72FF5D]">Inteligência de Privacidade Digital</span>
                </div>
              </div>

              {/* Headline */}
              <div className="text-center space-y-4 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-[#F2F5F2]">
                  Descubra se seus dados estão <span className="text-[#72FF5D]">públicos na internet</span>
                </h1>
                <p className="text-sm md:text-base text-[#9BA89C] leading-relaxed max-w-sm mx-auto">
                  Verifique e-mail, telefone ou username em fontes públicas e veja o que pode estar exposto sobre você.
                </p>
              </div>

              {/* Mini Proof Points */}
              <div className="grid grid-cols-3 gap-2 mb-10">
                {[
                  { icon: Zap, text: "Segundos" },
                  { icon: Search, text: "Público" },
                  { icon: CheckCircle2, text: "Privado" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <item.icon className="w-4 h-4 text-[#72FF5D]/60" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#9BA89C]">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#72FF5D]/40">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text"
                    placeholder="E-mail, telefone ou @username" 
                    className="w-full h-16 bg-[#050706] border border-[#1F2A22] rounded-2xl pl-14 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-[#72FF5D]/20 transition-all placeholder:text-[#9BA89C]/40"
                  />
                </div>
                
                <button 
                  onClick={() => window.location.href = '/scan'}
                  className="w-full h-16 bg-[#72FF5D] text-[#050706] font-black text-sm uppercase italic tracking-widest rounded-2xl hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(114,255,93,0.3)] group"
                >
                  VERIFICAR MEUS DADOS
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Trust Footer */}
              <div className="mt-8 pt-8 border-t border-[#1F2A22] text-center">
                <p className="text-[9px] font-bold text-[#9BA89C]/40 uppercase tracking-[0.4em]">
                  Localiza.AI // Secure Intelligence Protocol
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
