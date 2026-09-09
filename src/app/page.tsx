'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Timer, Lock, ChevronRight, Volume2 } from 'lucide-react';

export default function MobileSalesPage() {
  const [timeLeft, setTimeLeft] = useState(415); // 6m 55s
  const [viewers, setViewers] = useState(1432);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      {/* Barra de Urgência de Topo - Sticky */}
      <div className="sticky top-0 z-50 bg-red-600 py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 border-b border-red-500 shadow-2xl">
        <ShieldAlert className="w-3 h-3 animate-pulse" />
        SISTEMA DE RECUPERAÇÃO ATIVO: {formatTime(timeLeft)}
        <ShieldAlert className="w-3 h-3 animate-pulse" />
      </div>

      <div className="w-full max-w-[450px] mx-auto px-5 py-8 flex flex-col items-center">
        
        {/* Hook Agressivo */}
        <header className="text-center space-y-4 mb-8">
          <h1 className="text-[26px] leading-[1.1] font-black italic uppercase tracking-tighter">
            RECUPERE SUA CONTA <span className="text-red-600 underline decoration-[6px]">BANIDA</span><br />
            <span className="text-white">EM MENOS DE</span> <span className="text-yellow-400 text-[32px]">5 MINUTOS</span><br />
            <span className="text-white">OU PERCA</span> <span className="text-red-600">TUDO HOJE.</span>
          </h1>

          <p className="text-zinc-400 text-sm font-medium leading-relaxed px-2">
            Assista o vídeo abaixo agora para entender como injetar seu ID diretamente no servidor e resgatar suas <span className="text-white">Skins e Patente.</span>
          </p>
        </header>

        {/* VSL - Formato Vertical (TikTok/Reels Style) */}
        <section className="w-full relative group max-w-[320px]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-300 uppercase">{viewers} JOGADORES ESTÃO RECUPERANDO AGORA</span>
          </div>

          <div className="w-full aspect-[9/16] bg-zinc-900 rounded-2xl border-2 border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.3)] relative overflow-hidden">
            {/* Fake Play Button Over Image */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 transition-all active:bg-black/40">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-bounce-slow">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2" />
              </div>
              
              <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Toque para ativar o som
                </p>
              </div>
            </div>
            
            <img 
              src="https://picsum.photos/seed/vsl-ff-vertical/720/1280" 
              alt="FF VSL Vertical"
              className="w-full h-full object-cover opacity-50 blur-[1px]"
              data-ai-hint="action shooter vertical"
            />
          </div>
          
          {/* Barra de progresso falsa do vídeo */}
          <div className="w-full h-1.5 bg-zinc-800 mt-2 rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-red-600" />
          </div>
        </section>

        {/* CTA e Escassez Agressiva */}
        <section className="w-full mt-10 flex flex-col items-center space-y-6">
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-500 font-black text-xl italic">
              <Timer className="w-5 h-5" />
              LICENÇA EXPIRA EM: {formatTime(timeLeft)}
            </div>
            <p className="text-red-500 text-[11px] font-bold mt-1 animate-pulse uppercase">
              ⚠️ ÚLTIMAS 4 VAGAS DISPONÍVEIS NO SERVIDOR
            </p>
          </div>

          <Button 
            className="w-full py-10 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none"
          >
            QUERO DESBANIR AGORA!
            <span className="text-[10px] mt-1 not-italic tracking-normal">Acesso imediato ao sistema de injeção</span>
          </Button>

          {/* Social Proof Sutil de Segurança */}
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <div className="flex items-center gap-4 grayscale opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Garena_logo.svg" alt="Garena" className="h-4" />
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                <Lock className="w-3 h-3" /> BYPASS ANTIBAN V2.4
              </div>
            </div>
          </div>
        </section>

        {/* Footer Minimalista de Medo */}
        <footer className="mt-12 text-[8px] text-zinc-700 text-center uppercase tracking-[0.15em] space-y-2 border-t border-zinc-900 pt-8 w-full">
          <p>O USO INDEVIDO DESTE SISTEMA PODE RESULTAR EM BLOQUEIO DE IP.</p>
          <p>UNBAN ELITE SYSTEM - © 2024</p>
        </footer>

      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
