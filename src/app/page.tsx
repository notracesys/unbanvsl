
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Lock, Play } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import MuxPlayer from '@mux/mux-player-react';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(247);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const visitorId = useRef(`vis_${Math.random().toString(36).substr(2, 9)}`);
  const trackedMilestones = useRef(new Set<number>());
  
  const { firestore } = initializeFirebase();

  useEffect(() => {
    setHasMounted(true);
    setRecoveryCount(Math.floor(Math.random() * (280 - 230 + 1)) + 230);

    const interval = setInterval(() => {
      setRecoveryCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const trackMetric = (milestone: number, currentTime: number = 0, duration: number = 0) => {
    if (!firestore) return;
    
    addDoc(collection(firestore, 'metrics'), {
      visitorId: visitorId.current,
      watchTime: currentTime,
      totalDuration: duration,
      percentage: milestone,
      device: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobi') ? 'mobile' : 'desktop',
      createdAt: serverTimestamp(),
    }).catch(err => {}); // Silent catch for metrics
  };

  const handlePlayVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
      trackMetric(0); // Play event
    }
  };

  const handleTimeUpdate = (e: any) => {
    const video = e.target;
    if (!video.duration) return;

    const progress = (video.currentTime / video.duration) * 100;
    const milestones = [25, 50, 75, 90, 100];

    milestones.forEach(m => {
      if (progress >= m && !trackedMilestones.current.has(m)) {
        trackedMilestones.current.add(m);
        trackMetric(m, video.currentTime, video.duration);
      }
    });
  };

  if (!hasMounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 overflow-x-hidden">
      <div className="w-full max-w-[450px] mx-auto px-5 py-8 flex flex-col items-center">
        
        <header className="text-center space-y-4 mb-8">
          <h1 className="text-[26px] leading-[1.1] font-black italic uppercase tracking-tighter">
            ASSISTA AGORA ANTES QUE <br />
            ESSE VÍDEO SEJA <span className="text-red-600 text-glow-red">RETIRADO DO AR.</span>
          </h1>
          <p className="text-zinc-300 text-[13px] font-medium leading-tight px-2 text-balance">
            A Garena já solicitou a queda deste site. Recupere sua conta enquanto há tempo.
          </p>
        </header>

        <section className="w-full relative group max-w-[320px]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-300 uppercase">+{recoveryCount} RECUPERAÇÕES HOJE!</span>
          </div>

          <div 
            className="w-full aspect-[9/16] bg-zinc-900 rounded-2xl border-2 border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.3)] relative overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            {!isPlaying && (
              <div 
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 transition-all active:bg-black/60 cursor-pointer"
                onClick={handlePlayVideo}
              >
                <div className="flex flex-col items-center animate-bounce-slow">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.8)] mb-6">
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                </div>

                <div className="px-6 py-4 bg-red-600/90 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col items-center gap-2 shadow-2xl mx-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-8 h-8 text-white animate-pulse" />
                    <span className="text-lg font-black uppercase italic tracking-tighter text-white text-center">LIGUE O SOM!</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/90 uppercase text-center leading-tight">
                    INSTRUÇÕES DE DESBANIMENTO <br /> EXPOSTAS NESTE VÍDEO
                  </p>
                </div>
              </div>
            )}
            
            <MuxPlayer
              ref={playerRef}
              playbackId="QDJSIlmrorxXFDYyElAGNofuG8lo01zgwpEdRNl8RgKw"
              metadata={{
                video_id: "vsl-ff-recovery",
                video_title: "VSL Free Fire Recovery",
                viewer_user_id: visitorId.current,
              }}
              streamType="on-demand"
              className="w-full h-full object-cover vsl-player"
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              placeholder="https://picsum.photos/seed/vsl-ff-poster/720/1280"
              primaryColor="#ef4444"
              layout="vod"
            />
          </div>

          <div className="mt-4 text-center">
             <p className="text-red-500 text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
                <Volume2 className="w-4 h-4 fill-current" />
                Aumente o volume, o vídeo tem som!
             </p>
          </div>
        </section>

        <section className="w-full mt-10 flex flex-col items-center space-y-6">
          <Button 
            className="w-full py-10 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none button-pulse"
          >
            QUERO DESBANIR AGORA!
            <span className="text-[10px] mt-1 not-italic tracking-normal">Acesso vitalício ao sistema bypass</span>
          </Button>

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

        <footer className="mt-12 text-[8px] text-zinc-700 text-center uppercase tracking-[0.15em] space-y-2 border-t border-zinc-900 pt-8 w-full">
          <p>ESTE SITE NÃO POSSUI VÍNCULO COM A GARENA. USE POR SUA CONTA E RISCO.</p>
          <p>UNBAN ELITE SYSTEM - © 2024</p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        @keyframes pulse-cta { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        .button-pulse { animation: pulse-cta 2s infinite; }
        .text-glow-red { text-shadow: 0 0 10px rgba(220, 38, 38, 0.5); }
        
        /* 100% BLINDAGEM DO PLAYER - APENAS BARRA DE PROGRESSO VISUAL */
        
        /* Oculta o menu de 3 pontos, volume, tela cheia e botões de busca */
        mux-player::part(play-button),
        mux-player::part(mute-button),
        mux-player::part(volume-range),
        mux-player::part(fullscreen-button),
        mux-player::part(seek-backward-button),
        mux-player::part(seek-forward-button),
        mux-player::part(captions-button),
        mux-player::part(airplay-button),
        mux-player::part(cast-button),
        mux-player::part(pip-button),
        mux-player::part(playback-rate-button),
        mux-player::part(time-display),
        mux-player::part(top-chrome),
        mux-player::part(center-controls) {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Oculta qualquer menu de configurações ou overflow */
        mux-player::part(settings-menu),
        mux-player::part(settings-menu-button) {
          display: none !important;
        }

        /* Configura a barra de controle para ser apenas um container da barra de tempo */
        mux-player::part(control-bar) {
          display: flex !important;
          background: transparent !important;
          padding: 0 12px !important;
          position: absolute !important;
          bottom: 12px !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 10 !important;
          pointer-events: none !important; /* IMPEDE QUALQUER CLIQUE NA BARRA INTEIRA */
        }

        /* A barra de tempo fica visível mas NÃO INTERATIVA */
        mux-player::part(time-range) {
          display: block !important;
          flex: 1 !important;
          height: 6px !important;
          pointer-events: none !important; /* BLOQUEIA O ARRASTE/CLIQUE */
          opacity: 1 !important;
        }
      `}</style>
    </main>
  );
}
