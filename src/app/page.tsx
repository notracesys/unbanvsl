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
  const visitorId = useRef<string>(Math.random().toString(36).substring(7));
  const trackedMilestones = useRef<Set<number>>(new Set());
  const { firestore } = initializeFirebase();

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setRecoveryCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 15000);
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
    }).catch(() => {}); 
  };

  const handlePlayVideo = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
      trackMetric(0); 
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
    <main className="min-h-screen bg-[#050505] flex flex-col items-center px-4 pt-4 pb-20 select-none overflow-x-hidden">
      <header className="w-full max-w-[360px] text-center mb-6 space-y-3">
        <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter leading-[0.9]">
          O ACESSO SERÁ <br />
          <span className="text-red-600 text-[2.8rem] block animate-pulse text-glow-red">RETIRADO DO AR.</span>
        </h1>
        <p className="text-zinc-300 text-[13px] font-medium leading-tight px-2">
          A Garena já solicitou a queda deste site. Recupere sua conta em 5 minutos ou perca suas skins e passes para sempre.
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
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-[2px]"
              onClick={handlePlayVideo}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-bounce group-active:scale-95 transition-transform">
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">CLIQUE PARA ASSISTIR</span>
                </div>
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
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/90 animate-pulse">
            <Volume2 className="w-5 h-5 text-red-600" />
            <span className="text-[12px] font-black uppercase tracking-tighter text-center">Aumente o som para receber as instruções</span>
          </div>
          <div className="w-full max-w-[180px] h-1 bg-zinc-800 rounded-full overflow-hidden relative opacity-30">
            <div className="absolute inset-0 bg-red-600/50 animate-pulse" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-[360px] mt-8 flex flex-col items-center">
        <Button 
          onClick={() => window.open('https://checkout.exemplo.com', '_blank')}
          className="w-full h-16 text-lg font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none button-pulse"
        >
          QUERO DESBANIR AGORA!
          <span className="text-[10px] mt-1 not-italic tracking-normal">Acesso vitalício ao sistema bypass</span>
        </Button>

        <div className="flex flex-col items-center gap-4 py-8 w-full">
          <div className="flex items-center gap-4 grayscale opacity-40">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Garena_logo.svg" alt="Garena" className="h-4" />
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              <Lock className="w-3 h-3" /> BYPASS ANTIBAN ATIVO
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-4 text-[8px] text-zinc-600 text-center uppercase font-bold tracking-widest max-w-[280px]">
        Este site não possui vínculo com a Garena Free Fire. <br />
        Uso exclusivo para recuperação de contas legítimas.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-red { text-shadow: 0 0 15px rgba(220, 38, 38, 0.7); }
        
        /* BLINDAGEM TOTAL DO PLAYER - REMOVE TUDO EXCETO BARRA DE PROGRESSO */
        
        mux-player::part(play-button),
        mux-player::part(mute-button),
        mux-player::part(volume-range),
        mux-player::part(fullscreen-button),
        mux-player::part(seek-backward-button),
        mux-player::part(seek-forward-button),
        mux-player::part(captions-button),
        mux-player::part(airplay-button),
        mux-player::part(settings-menu-button),
        mux-player::part(cast-button),
        mux-player::part(pip-button),
        mux-player::part(top-chrome),
        mux-player::part(center-controls) {
          display: none !important;
        }

        /* Configura a barra de controle para mostrar APENAS o progresso de forma passiva */
        mux-player::part(control-bar) {
          display: flex !important;
          background: transparent !important;
          padding: 0 12px 12px 12px !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          pointer-events: none !important; /* BLOQUEIA QUALQUER CLIQUE NA BARRA */
        }

        /* A barra de tempo fica visível para o lead ver o avanço, mas sem interação */
        mux-player::part(time-range) {
          display: block !important;
          flex: 1 !important;
          height: 4px !important;
          pointer-events: none !important; /* BLOQUEIA O ARRASTE/PULO */
          opacity: 0.8 !important;
        }

        mux-player {
          --media-range-track-background: rgba(255, 255, 255, 0.1);
          --media-range-bar-color: #dc2626;
          --controls: none; /* Reforço Mux */
        }
      `}} />
    </main>
  );
}
