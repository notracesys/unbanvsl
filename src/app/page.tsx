
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, Zap, ShieldAlert, Timer } from 'lucide-react';

export default function SalesPage() {
  const [timeLeft, setTimeLeft] = useState(595); // 9m 55s

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-red-600">
      {/* Barra de Urgência Máxima */}
      <div className="bg-red-700 py-2 px-4 text-center text-xs font-bold uppercase tracking-tighter flex items-center justify-center gap-2 animate-pulse">
        <ShieldAlert className="w-4 h-4" />
        Atenção: Este site será removido por pressão da Garena em breve.
        <ShieldAlert className="w-4 h-4" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Hook Agressivo */}
        <header className="text-center mb-10 space-y-6">
          <h2 className="text-red-500 font-bold text-sm md:text-base uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 fill-current" /> Método Proibido Revelado
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight italic uppercase">
            Sua conta foi <span className="text-red-600 underline decoration-8">Banida?</span> <br />
            Recupere ela em <span className="text-yellow-400">7 Minutos</span> ou ela será <span className="text-red-600">Apagada Para Sempre.</span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Assista o vídeo abaixo agora para injetar o seu ID diretamente no servidor e recuperar suas <span className="text-white">Skins, Diamantes e Patente.</span>
          </p>
        </header>

        {/* Container da VSL */}
        <section className="w-full aspect-video bg-zinc-900 rounded-lg border-2 border-zinc-800 shadow-[0_0_50px_rgba(220,38,38,0.2)] relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/40 transition-all cursor-pointer">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-bounce">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
            <p className="absolute bottom-8 text-sm font-bold uppercase tracking-widest text-zinc-300">
              Clique para ativar o áudio e começar a recuperação
            </p>
          </div>
          
          {/* Placeholder da VSL */}
          <div className="w-full h-full bg-gradient-to-tr from-zinc-950 to-zinc-900 flex items-center justify-center">
             <img 
               src="https://picsum.photos/seed/freefire/1280/720" 
               alt="Video Placeholder"
               className="opacity-30 object-cover w-full h-full blur-sm"
               data-ai-hint="action game screenshot"
             />
          </div>
        </section>

        {/* CTA e Escassez */}
        <section className="w-full mt-12 flex flex-col items-center space-y-8">
          
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
               <Timer className="w-6 h-6" />
               O seu acesso expira em: <span className="font-mono">{formatTime(timeLeft)}</span>
             </div>
             <p className="text-zinc-500 text-sm italic">
               *Apenas 3 vagas restantes para o suporte manual hoje.
             </p>
          </div>

          <Button 
            className="w-full max-w-xl py-10 text-2xl md:text-3xl font-black uppercase italic tracking-tighter bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-[0_10px_0_rgb(22,101,52)] active:translate-y-2 active:shadow-none transition-all duration-75"
          >
            QUERO MINHA CONTA DE VOLTA AGORA!
          </Button>

          <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Garena_logo.svg" alt="Garena" className="h-6" />
             <div className="w-px h-6 bg-zinc-800" />
             <div className="flex items-center gap-2 text-xs font-bold uppercase">
               <Lock className="w-3 h-3" /> Conexão Segura SSL
             </div>
          </div>
        </section>

        {/* Footer Minimalista */}
        <footer className="mt-24 text-[10px] text-zinc-600 text-center uppercase tracking-widest leading-loose">
          Este site não tem afiliação com a Garena Free Fire. <br />
          Termos de Uso | Políticas de Privacidade | Suporte <br />
          © 2024 - Recovery Elite Inc. Todos os direitos reservados.
        </footer>

      </div>
    </main>
  );
}
