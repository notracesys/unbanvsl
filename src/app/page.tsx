
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Lock, Play, AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import MuxPlayer from '@mux/mux-player-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { firebaseConfig } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(2483);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const playerRef = useRef<any>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const visitorIdRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');
  const lastSavedTimeRef = useRef<number>(0);
  const hasStartedRef = useRef<boolean>(false);

  const firestore = useFirestore();
  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== 'project-id';

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig } = useDoc(configRef);

  const checkoutUrl = appConfig?.checkoutUrl || 'https://checkout.exemplo.com';

  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setHasMounted(true);
    
    let savedVisitorId = localStorage.getItem('vsl_visitor_id');
    if (!savedVisitorId) {
      savedVisitorId = 'vis_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('vsl_visitor_id', savedVisitorId);
    }
    visitorIdRef.current = savedVisitorId;

    let currentSessionId = sessionStorage.getItem('vsl_session_id');
    if (!currentSessionId) {
      currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sessionStorage.setItem('vsl_session_id', currentSessionId);
    }
    sessionIdRef.current = currentSessionId;
    
    const initTracking = async () => {
      if (firestore && isConfigured) {
        const todayStr = getLocalDateString();
        const docRef = doc(firestore, 'metrics', sessionIdRef.current);
        setDoc(docRef, {
          id: sessionIdRef.current,
          visitorId: visitorIdRef.current,
          dateStr: todayStr,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(() => {});
      }
    };
    initTracking();

    const interval = setInterval(() => {
      setRecoveryCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(interval);
  }, [firestore, isConfigured]);

  useEffect(() => {
    if (showCTA && ctaRef.current) {
      setTimeout(() => {
        ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showCTA]);

  const trackMetric = (currentTime: number, duration: number, extra = {}) => {
    if (!firestore || !isConfigured) return;
    
    const videoDuration = 140;
    const docRef = doc(firestore, 'metrics', sessionIdRef.current);
    const todayStr = getLocalDateString();

    setDoc(docRef, {
      watchTime: Math.floor(currentTime),
      totalDuration: videoDuration,
      percentage: Math.min(Math.floor((currentTime / videoDuration) * 100), 100),
      dateStr: todayStr,
      updatedAt: serverTimestamp(),
      ...extra
    }, { merge: true }).catch(async (err) => {
      const permsError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { watchTime: currentTime, ...extra }
      });
      errorEmitter.emit('permission-error', permsError);
    });
  };

  const handlePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
      
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        trackMetric(0, 140, { started: true });
      }
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

  const handleCtaClick = () => {
    if (firestore && isConfigured) {
      const docRef = doc(firestore, 'metrics', sessionIdRef.current);
      setDoc(docRef, {
        clickedCTA: true,
        clickedCtaAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }
    window.open(checkoutUrl, '_blank');
  };

  if (!hasMounted) return null;

  const getImg = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center px-4 pt-4 pb-20 select-none overflow-x-hidden font-sans">
      <header className="w-full max-w-[480px] text-center mb-6 space-y-4">
        <h1 className="text-white text-[1.4rem] font-black italic uppercase tracking-tighter leading-[1.1] text-glow-red mb-2">
          ESSE MACETE IRÁ <span className="text-red-600 text-[1.6rem] animate-pulse">SAIR DO AR A QUALQUER MOMENTO.</span>
        </h1>
        <p className="text-zinc-300 text-[13px] font-medium leading-tight px-2 mt-2">
          Já solicitaram a queda deste site. Aproveite enquanto há tempo para recuperar sua conta.
        </p>
      </header>

      <section className="w-full relative group max-w-[320px] mb-12">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap pointer-events-none">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">
            {recoveryCount} JOGADORES RECUPERANDO AGORA
          </span>
        </div>

        <div 
          className="aspect-[9/16] w-full bg-zinc-900 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-zinc-800 relative cursor-pointer"
          onClick={togglePlayPause}
        >
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
              <div className="flex flex-col items-center gap-6 px-6 text-center">
                <div 
                  onClick={handlePlayVideo}
                  className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse border-4 border-white/20 cursor-pointer"
                >
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-red-500 font-black animate-bounce">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-xl uppercase tracking-tighter italic">NÃO PARE AGORA!</span>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-zinc-200 text-sm font-bold leading-tight">
                      ESSE SEGREDO VAI SUMIR... <br />
                      <span className="text-zinc-400 text-[11px] font-normal mt-2 block">
                        Se você parar agora, nunca mais terá acesso a este método. Continue assistindo.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEnded && (
            <div 
              className="absolute inset-0 z-[100] flex items-center justify-center cursor-pointer bg-black/90 backdrop-blur-lg"
              onClick={() => {
                if (playerRef.current) {
                  playerRef.current.currentTime = 0;
                  handlePlayVideo();
                }
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <RefreshCcw className="w-10 h-10 text-black" />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">ASSISTIR NOVAMENTE</span>
              </div>
            </div>
          )}
          
          <MuxPlayer
            ref={playerRef}
            playbackId="QDJSIlmrorxXFDYyElAGNofuG8lo01zgwpEdRNl8RgKw"
            metadata={{
              video_id: "vsl-ff-recovery",
              video_title: "VSL Free Fire Recovery",
              viewer_user_id: visitorIdRef.current,
            }}
            streamType="on-demand"
            playsInline
            className="w-full h-full object-cover pointer-events-none"
            onTimeUpdate={(e: any) => {
              const currentTime = e.target.currentTime;
              if (currentTime >= 115 && !showCTA) {
                setShowCTA(true);
              }
              if (Math.abs(currentTime - lastSavedTimeRef.current) >= 5) {
                lastSavedTimeRef.current = currentTime;
                trackMetric(currentTime, 140);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setIsEnded(true);
              trackMetric(140, 140, { completed: true });
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 text-zinc-400 animate-pulse-slow">
            <Volume2 className="w-5 h-5" />
            <span className="text-[12px] font-black uppercase tracking-tighter text-center">LIGUE O SOM PARA RECEBER AS INSTRUÇÕES</span>
          </div>
        </div>
      </section>

      {showCTA && (
        <section 
          ref={ctaRef}
          className="w-full max-w-[360px] mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000"
        >
          <Button 
            onClick={handleCtaClick}
            className="w-full h-16 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex items-center justify-center leading-none button-pulse gap-2"
          >
            QUERO DESBANIR AGORA! <ArrowRight className="w-6 h-6" />
          </Button>
          
          <div className="mt-4 flex items-center gap-2 text-zinc-500">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Pagamento 100% seguro via criptografia</span>
          </div>

          <div className="mt-8 w-full space-y-4">
            <FeedbackCard 
              img={getImg('feedback-1')?.imageUrl || '/feedback1.jpg'} 
              name="JOÃO S." 
              text="Funcionou na hora! Já recuperei minha conta com a Calça Angelical que tava banida faz 1 ano." 
            />
            <FeedbackCard 
              img={getImg('feedback-2')?.imageUrl || '/feedback2.jpg'} 
              name="MATHEUS R." 
              text="Moleque do céu, deu certo mesmo! Minha conta lvl 70 de volta, achei que tinha perdido tudo kkk valeu demais!" 
            />
            <FeedbackCard 
              img={getImg('feedback-3')?.imageUrl || '/feedback3.jpg'} 
              name="LUCAS P." 
              text="Top demais, o suporte ajudou na hora que deu erro no login. Já tô jogando ranqueada de novo." 
            />
          </div>
        </section>
      )}

      <footer className="mt-8 text-[8px] text-zinc-600 text-center uppercase font-bold tracking-widest max-w-[280px]">
        Este site não possui vínculo com a Garena Free Fire. <br />
        Uso exclusivo para recuperação de contas legítimas.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-red { text-shadow: 0 0 15px rgba(220, 38, 38, 0.7); }
        
        mux-player::part(control-bar),
        mux-player::part(play-button),
        mux-player::part(mute-button),
        mux-player::part(volume-range),
        mux-player::part(fullscreen-button),
        mux-player::part(center-controls) {
          display: none !important;
        }

        mux-player::part(time-range) {
          display: block !important;
          position: absolute !important;
          bottom: 0 !important;
          height: 3px !important;
          --media-range-thumb-display: none !important;
        }

        mux-player {
          --media-range-bar-color: #dc2626;
        }
      `}} />
    </main>
  );
}

function FeedbackCard({ img, name, text }: { img: string, name: string, text: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex gap-3 transition-transform hover:scale-[1.02]">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 bg-zinc-800 relative">
        <img 
          src={img} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-white text-[12px] font-black italic tracking-tight">{name}</span>
        <p className="text-zinc-400 text-[11px] leading-snug mt-1">{text}</p>
      </div>
    </div>
  );
}
