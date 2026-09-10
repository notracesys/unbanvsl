'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Volume2, Lock, Play, AlertTriangle, RefreshCcw } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import MuxPlayer from '@mux/mux-player-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(2483);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const playerRef = useRef<any>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visitorId = useRef<string>('');
  const trackedMilestones = useRef<Set<number>>(new Set());
  const { firestore } = initializeFirebase();

  useEffect(() => {
    setHasMounted(true);
    if (!visitorId.current) {
      visitorId.current = 'vis_' + Math.random().toString(36).substring(2, 11);
    }
    
    const interval = setInterval(() => {
      setRecoveryCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showCTA && ctaRef.current) {
      setTimeout(() => {
        ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showCTA]);

  const trackMetric = (milestone: number, currentTime: number = 0, duration: number = 0) => {
    if (!firestore) return;
    
    addDoc(collection(firestore, 'metrics'), {
      visitorId: visitorId.current,
      watchTime: Math.floor(currentTime),
      totalDuration: Math.floor(duration),
      percentage: milestone,
      device: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      createdAt: serverTimestamp(),
    }).catch((err) => {
      // Falha silenciosa em produção, mas importante para o dashboard
      console.error("Erro ao gravar métrica:", err);
    }); 
  };

  const handlePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!hasMounted) return null;

  const getImg = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center px-4 pt-4 pb-20 select-none overflow-x-hidden">
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
                <div className="flex justify-center">
                  <div 
                    onClick={handlePlayVideo}
                    className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse border-4 border-white/20 cursor-pointer"
                  >
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-red-500 font-black animate-bounce">
                    <AlertTriangle className="w-6 h-6" />
                    <span className="text-xl uppercase tracking-tighter italic">NÃO PARE AGORA!</span>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <p className="text-zinc-200 text-sm font-bold leading-tight">
                      ESSE MACETE VAI SUMIR... <br />
                      <span className="text-zinc-400 text-[11px] font-normal mt-2 block">
                        Se vc parar agora, nunca mais terá acesso a este segredo. Continue assistindo.
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
              onClick={handleRestartVideo}
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
              viewer_user_id: visitorId.current,
            }}
            streamType="on-demand"
            className="w-full h-full object-cover pointer-events-none"
            onTimeUpdate={(e: any) => {
              const currentTime = e.target.currentTime;
              const duration = e.target.duration;
              const progress = (currentTime / duration) * 100;
              
              if (currentTime >= 128 && !showCTA) {
                setShowCTA(true);
              }

              [25, 50, 75, 90, 100].forEach(m => {
                if (progress >= m && !trackedMilestones.current.has(m)) {
                  trackedMilestones.current.add(m);
                  trackMetric(m, currentTime, duration);
                }
              });
            }}
            onEnded={() => {
              setIsPlaying(false);
              setIsEnded(true);
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
            onClick={() => window.open('https://checkout.exemplo.com', '_blank')}
            className="w-full h-16 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all duration-75 flex items-center justify-center leading-none button-pulse"
          >
            QUERO DESBANIR AGORA!
          </Button>
          
          <div className="mt-4 flex items-center gap-2 text-zinc-500">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Pagamento 100% seguro via criptografia</span>
          </div>

          <div className="mt-8 w-full space-y-4">
            <FeedbackCard 
              img={getImg('feedback-1')?.imageUrl || '/feedback1.jpg'} 
              name="JOÃO S." 
              text="Funcionou na hr! Já recuperei minha conta com a Calça Angelical q tava banida faz 1 ano." 
            />
            <FeedbackCard 
              img={getImg('feedback-2')?.imageUrl || '/feedback2.jpg'} 
              name="MATHEUS R." 
              text="Mlk do céu, deu certo memo! Minha conta lvl 70 de volta, achei q tinha perdido td kkkk vlw demais!" 
            />
            <FeedbackCard 
              img={getImg('feedback-3')?.imageUrl || '/feedback3.jpg'} 
              name="LUCAS P." 
              text="Top demais, o suporte ajudou na hr q deu erro no login. Já to jogar ranqueada dnv. Vc é o cara!" 
            />
            <FeedbackCard 
              img={getImg('feedback-4')?.imageUrl || '/feedback4.jpg'} 
              name="GABRIELA F." 
              text="Caraca, a garena é mto safada msm, mas o macete salvou. Se vc fizer certinho volta na hr!" 
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
        <Image 
          src={img} 
          alt={name} 
          width={48} 
          height={48} 
          className="object-cover" 
          unoptimized 
        />
      </div>
      <div className="flex flex-col">
        <span className="text-white text-[12px] font-black italic tracking-tight">{name}</span>
        <p className="text-zinc-400 text-[11px] leading-snug mt-1">{text}</p>
      </div>
    </div>
  );
}
