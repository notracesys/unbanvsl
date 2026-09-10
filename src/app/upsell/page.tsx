'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function UpsellPage() {
  const firestore = useFirestore();

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig } = useDoc(configRef);

  // Link de checkout forçado para a nova URL solicitada
  const upsellUrl = appConfig?.upsellCheckoutUrl || 'https://comprasseguras.org.ua/c/f901da2ee5';

  const handleCtaClick = () => {
    window.location.href = upsellUrl;
  };

  const handleSkip = () => {
    window.location.href = 'https://unbansstrategy.netlify.app/';
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 border border-white/20 animate-pulse">
        <ShieldAlert className="w-3 h-3" />
        Risco de bloqueio irreversível
      </div>

      <div className="w-full max-w-[420px] bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(234,179,8,0.1)] relative">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl border-2 border-orange-500/30 flex items-center justify-center bg-orange-500/5">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
            VOCÊ VAI SER <br />
            <span className="text-zinc-100">BANIDO DE NOVO!</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium">
            O protocolo de segurança avançada é a única forma de garantir o desbanimento permanente.
          </p>
        </div>

        <div className="space-y-6">
          <Button onClick={handleCtaClick} className="w-full h-16 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-black text-lg font-black uppercase italic tracking-tighter rounded-2xl orange-glow-btn gap-2 group">
            ATIVAR BYPASS ANTI-BAN 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button onClick={handleSkip} className="w-full text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
            NÃO, EU QUERO ARRISCAR SER BANIDO DE NOVO
          </button>
        </div>

        <div className="my-8 h-px bg-zinc-900 w-full" />

        <div className="flex items-center justify-center gap-6 opacity-40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-zinc-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">BYPASS V4.0 ATIVO</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse-orange { 0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(251, 146, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0); } } .orange-glow-btn { animation: pulse-orange 2s infinite; }`}} />
    </main>
  );
}
