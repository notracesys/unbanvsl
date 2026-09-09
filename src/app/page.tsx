
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Lock, Play, AlertTriangle, RefreshCcw } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import MuxPlayer from '@mux/mux-player-react';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(247);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const playerRef = useRef<any>(null);
  const visitorId = useRef<string>('');
  const trackedMilestones = useRef<Set<number>>(new Set());
  const { firestore } = initializeFirebase();

  useEffect(() => {
    setHasMounted(true);
    visitorId.current = Math.random().toString(36).substring(7);
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
      setIsEnded(false);
      if (!trackedMilestones.current.has(0)) {
        trackedMilestones.current.add(0);
        trackMetric(0);
      }
    }
  };

  const handleRestartVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
      playerRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      handlePlayVideo();
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
        {/* Contador de urgência */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none">
           <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-zinc-300 uppercase">+{recoveryCount} RECUPERAÇÕES HOJE!</span>
        </div>

        {/* Player Container */}
        <div 
          className="w-full aspect-[9/16] bg-zinc-900 rounded-2xl border-2 border-zinc-800 shadow-[0_0_40px_rgba(220,38,38,0.3)] relative overflow-hidden cursor-pointer"
          onContextMenu={(e) => e.preventDefault()}
          onClick={togglePlayPause}
        >
          {/* Overlay de Pausa / Escassez Extrema */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
              <div className="flex flex-col items-center gap-6 px-6 text-center">
                <div className="flex gap-4">
                  <div 
                    onClick={handlePlayVideo}
                    className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse border-4 border-white/20"
                  >
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                  <div 
                    onClick={handleRestartVideo}
                    className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white/10"
                  >
                    <RefreshCcw className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-red-500 font-black animate-bounce">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-xl uppercase tracking-tighter italic">NÃO PARE AGORA!</span>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-white text-sm font-bold leading-tight uppercase">
                      ESSE MACETE VAI SUMIR E <br />
                      <span className="text-red-500 text-lg">NUNCA MAIS VOLTARÁ!</span>
                    </p>
                    <p className="text-zinc-400 text-[10px] mt-2 font-medium">
                      Se você fechar ou parar o vídeo agora, perderá a única chance de ver como ele funciona.
                    </p>
                  </div>
                  
                  <p className="text-zinc-200 text-xs font-black uppercase tracking-widest animate-pulse">
                    CLIQUE PARA VOLTAR A ASSISTIR IMEDIATAMENTE
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overlay de Replay ao Final */}
          {isEnded && (
            <div 
              className="absolute inset-0 z-[100] flex items-center justify-center cursor-pointer bg-black/90 backdrop-blur-lg"
              onClick={handleRestartVideo}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <RefreshCcw className="w-10 h-10 text-black" />
                </div>
                <span className="text-white text-xs font-black uppercase tracking-widest">ASSISTIR NOVAMENTE</span>
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
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => { setIsPlaying(true); setIsEnded(false); }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => { setIsPlaying(false); setIsEnded(true); }}
            placeholder="https://picsum.photos/seed/vsl-ff-poster/720/1280"
          />
        </div>

        {/* Chamada de Áudio */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white/90 animate-pulse">
            <Volume2 className="w-5 h-5 text-red-600" />
            <span className="text-[12px] font-black uppercase tracking-tighter text-center">LIGUE O SOM PARA RECEBER AS INSTRUÇÕES</span>
          </div>
          <div className="w-full max-w-[180px] h-1 bg-zinc-800 rounded-full overflow-hidden relative opacity-30">
            <div className="absolute inset-0 bg-red-600/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Botão de Chamada para Ação */}
      <section className="w-full max-w-[360px] mt-8 flex flex-col items-center">
        <Button 
          onClick={() => window.open('https://checkout.exemplo.com', '_blank')}
          className="w-full h-16 text-lg font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex flex-col leading-none button-pulse"
        >
          QUERO DESBANIR AGORA!
          <span className="text-[10px] mt-1 not-italic tracking-normal">Acesso vitalício ao sistema bypass</span>
        </Button>

        {/* Logos e Segurança */}
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

      {/* Estilos para blindar o player de forma agressiva */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-red { text-shadow: 0 0 15px rgba(220, 38, 38, 0.7); }
        
        /* OCULTA ABSOLUTAMENTE TUDO DO PAINEL DE CONTROLE NATIVO */
        mux-player::part(control-bar) {
          background: transparent !important;
          pointer-events: none !important;
        }

        /* OCULTA BOTÕES ESPECÍFICOS */
        mux-player::part(play-button),
        mux-player::part(mute-button),
        mux-player::part(volume-range),
        mux-player::part(fullscreen-button),
        mux-player::part(settings-menu-button),
        mux-player::part(playback-rate-button),
        mux-player::part(pip-button),
        mux-player::part(airplay-button),
        mux-player::part(cast-button),
        mux-player::part(captions-button),
        mux-player::part(seek-backward-button),
        mux-player::part(seek-forward-button),
        mux-player::part(top-chrome),
        mux-player::part(replay-button) {
          display: none !important;
        }

        /* MOSTRA APENAS A BARRA DE PROGRESSO VISUAL NA BASE */
        mux-player::part(time-range) {
          display: block !important;
          flex: 1 !important;
          height: 6px !important;
          pointer-events: none !important;
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          opacity: 0.9 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        mux-player {
          --media-range-track-background: rgba(255, 255, 255, 0.15);
          --media-range-bar-color: #dc2626;
        }
      `}} />
    </main>
  );
}
