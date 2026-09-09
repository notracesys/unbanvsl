'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Volume2, Lock, AlertTriangle } from 'lucide-react';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(247);

  useEffect(() => {
    setHasMounted(true);
    
    // Inicia com um número aleatório entre 230 e 280
    setRecoveryCount(Math.floor(Math.random() * (280 - 230 + 1)) + 230);

    // Incrementa o número aleatoriamente para parecer "ao vivo"
    const interval = setInterval(() => {
      setRecoveryCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      <div className="w-full max-w-[450px] mx-auto px-5 py-8 flex flex-col items-center">
        
        {/* Hook Agressivo com Foco em Escassez Extrema */}
        <header className="text-center space-y-4 mb-8">
          <h1 className="text-[26px] leading-[1.1] font-black italic uppercase tracking-tighter">
            ASSISTA AGORA ANTES QUE <br />
            ESSE VÍDEO SEJA <span className="text-red-600 text-glow-red">RETIRADO DO AR.</span>
          </h1>

          <p className="text-zinc-300 text-[13px] font-medium leading-tight px-2">
            A Garena já solicitou a queda deste site. Recupere sua conta enquanto há tempo.
          </p>
        </header>

        {/* VSL - Formato Vertical */}
        <section className="w-full relative group max-w-[320px]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-300 uppercase">+{recoveryCount} RECUPERAÇÕES HOJE!</span>
          </div>

          <div className="w-full aspect-[9/16] bg-zinc-900 rounded-2xl border-2 border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.3)] relative overflow-hidden">
            {/* Fake Play Button & Volume Warning */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 transition-all active:bg-black/40">
              
              <div className="flex flex-col items-center animate-bounce-slow">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)] mb-6">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                </div>
              </div>

              <div className="px-6 py-4 bg-red-600/90 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center gap-2 shadow-2xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-8 h-8 text-white animate-pulse" />
                  <span className="text-lg font-black uppercase italic tracking-tighter text-white">LIGUE O SOM!</span>
                </div>
                <p className="text-[10px] font-bold text-white/90 uppercase text-center leading-tight">
                  INSTRUÇÕES DE DESBANIMENTO <br /> EXPOSTAS NESTE VÍDEO
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Toque para iniciar agora
                </p>
              </div>
            </div>
            
            <img 
              src="https://picsum.photos/seed/vsl-ff-extreme/720/1280" 
              alt="FF VSL Vertical"
              className="w-full h-full object-cover opacity-40 blur-[2px]"
              data-ai-hint="action shooter intense"
            />
          </div>
          
          {/* Fake progress bar */}
          <div className="w-full h-1.5 bg-zinc-800 mt-2 rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          </div>
        </section>

        {/* CTA e Escassez Agressiva */}
        <section className="w-full mt-10 flex flex-col items-center space-y-6">
          
          <Button 
            className="w-full py-10 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none button-pulse"
          >
            QUERO DESBANIR AGORA!
            <span className="text-[10px] mt-1 not-italic tracking-normal">Acesso vitalício ao sistema bypass</span>
          </Button>

          {/* Segurança e Prova Social */}
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <div className="flex items-center gap-4 grayscale opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Garena_logo.svg" alt="Garena" className="h-4" />
              <div className="w-px h-4 bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                <Lock className="w-3 h-3" /> BYPASS ANTIBAN ATIVO
              </div>
            </div>
          </div>
        </section>

        {/* Footer Minimalista */}
        <footer className="mt-12 text-[8px] text-zinc-700 text-center uppercase tracking-[0.15em] space-y-2 border-t border-zinc-900 pt-8 w-full">
          <p>ESTE SITE NÃO POSSUI VÍNCULO COM A GARENA. USE POR SUA CONTA E RISCO.</p>
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
        @keyframes pulse-cta {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .button-pulse {
          animation: pulse-cta 2s infinite;
        }
        .text-glow-red {
          text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
        }
      `}</style>
    </main>
  );
}
