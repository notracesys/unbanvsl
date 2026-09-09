
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Timer, Lock, Zap, ChevronRight } from 'lucide-react';

export default function MobileSalesPage() {
  const [timeLeft, setTimeLeft] = useState(415); // 6m 55s
  const [viewers, setViewers] = useState(1432);

  useEffect(() => {
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

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      {/* Barra de Urgência de Topo - Sticky */}
      <div className="sticky top-0 z-50 bg-red-600 py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 border-b border-red-500 shadow-2xl">
        <ShieldAlert className="w-3 h-3 animate-pulse" />
        ACESSO EXPIRA EM BREVE: {formatTime(timeLeft)}
        <ShieldAlert className="w-3 h-3 animate-pulse" />
      </div>

      <div className="w-full max-w-[450px] mx-auto px-5 py-8 flex flex-col items-center">
        
        {/* Hook Agressivo */}
        <header className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <Zap className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-yellow-500 text-[9px] font-bold uppercase tracking-widest">
              Método Injetor 2024
            </span>
          </div>
          
          <h1 className="text-[28px] leading-[1.1] font-black italic uppercase tracking-tighter">
            SUA CONTA FOI <span className="text-red-600 underline decoration-[6px]">BANIDA?</span><br />
            <span className="text-white">RECUPERE EM</span> <span className="text-yellow-400 text-[34px]">7 MINUTOS</span><br />
            <span className="text-red-600">OU PERCA TUDO.</span>
          </h1>

          <p className="text-zinc-400 text-sm font-medium leading-relaxed px-2">
            Assista o vídeo abaixo agora para injetar seu ID diretamente no servidor e resgatar suas <span className="text-white">Skins, Dima e Patente.</span>
          </p>
        </header>

        {/* VSL - O Protagonista */}
        <section className="w-full relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-300 uppercase">{viewers} PESSOAS ASSISTINDO</span>
          </div>

          <div className="w-full aspect-video bg-zinc-900 rounded-xl border-2 border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.25)] relative overflow-hidden">
            {/* Fake Play Button Over Image */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 transition-all active:bg-black/30">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-bounce-slow">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white animate-pulse">
                Clique para ativar o áudio
              </p>
            </div>
            
            <img 
              src="https://picsum.photos/seed/ffmobile/800/450" 
              alt="FF Gameplay"
              className="w-full h-full object-cover opacity-40 blur-[2px]"
              data-ai-hint="action shooter game"
            />
          </div>
          
          {/* Barra de progresso falsa do vídeo */}
          <div className="w-full h-1 bg-zinc-800 mt-0.5 rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-red-600" />
          </div>
        </section>

        {/* CTA e Escassez */}
        <section className="w-full mt-10 flex flex-col items-center space-y-6">
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-500 font-black text-lg italic">
              <Timer className="w-5 h-5" />
              O SEU ACESSO EXPIRA EM: {formatTime(timeLeft)}
            </div>
            <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse uppercase">
              ⚠️ Restam apenas 3 vagas de suporte manual hoje
            </p>
          </div>

          <Button 
            className="w-full py-9 text-xl font-black uppercase italic tracking-tight bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none"
          >
            QUERO MINHA CONTA DE VOLTA!
            <span className="text-[10px] mt-1 opacity-80 not-italic tracking-normal">Clique aqui para iniciar a recuperação</span>
          </Button>

          {/* Social Proof Sutil */}
          <div className="flex flex-col items-center gap-3 py-4 w-full">
            <div className="flex items-center gap-4 grayscale opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Garena_logo.svg" alt="Garena" className="h-4" />
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                <Lock className="w-3 h-3" /> Criptografia SSL 256-Bit
              </div>
            </div>
          </div>
        </section>

        {/* Footer Minimalista de Medo */}
        <footer className="mt-12 text-[8px] text-zinc-700 text-center uppercase tracking-[0.15em] space-y-2 border-t border-zinc-900 pt-8 w-full">
          <p>Este sistema utiliza injeção de pacotes via ID para recuperação forçada.</p>
          <p>Recovery Elite Inc. - Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 opacity-50">
             <span>Privacidade</span>
             <span>Termos</span>
             <span>Suporte</span>
          </div>
        </footer>

      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
