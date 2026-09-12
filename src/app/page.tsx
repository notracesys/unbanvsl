'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Lock, Play, AlertTriangle, RefreshCcw, ArrowRight, MoreHorizontal, ExternalLink, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import MuxPlayer from '@mux/mux-player-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { firebaseConfig } from '@/firebase/config';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MobileSalesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [recoveryCount, setRecoveryCount] = useState(2483);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const playerRef = useRef<any>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const visitorIdRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');
  const lastTrackedTime = useRef<number>(0);
  const trackedMilestones = useRef<Set<number>>(new Set());

  const firestore = useFirestore();
  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== 'project-id';

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig } = useDoc(configRef);

  // Utiliza o link inserido no dashboard ou o link padrão caso não exista
  const checkoutUrl = appConfig?.checkoutUrl || 'https://comprasseguras.org.ua/c/c9f3270011';

  const getLocalDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    setHasMounted(true);
    
    const ua = typeof window !== 'undefined' ? (navigator.userAgent || navigator.vendor || (window as any).opera) : '';
    const isTikTokBrowser = /TikTok|musical_ly/i.test(ua);
    setIsTikTok(isTikTokBrowser);

    const termsAccepted = localStorage.getItem('vsl_terms_accepted') === 'true';
    setAcceptedTerms(termsAccepted);

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
    
    if (firestore && isConfigured) {
      const docRef = doc(firestore, 'metrics', sessionIdRef.current);
      setDoc(docRef, {
        id: sessionIdRef.current,
        visitorId: visitorIdRef.current,
        dateStr: getLocalDateString(),
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        updatedAt: serverTimestamp(),
        started: true,
        watchTime: 0
      }, { merge: true }).catch(() => {});
    }

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

  const trackMetric = (percentage: number, extra = {}) => {
    if (!firestore || !isConfigured) return;
    const docRef = doc(firestore, 'metrics', sessionIdRef.current);
    setDoc(docRef, {
      percentage,
      updatedAt: serverTimestamp(),
      ...extra
    }, { merge: true }).catch(() => {});
  };

  const handlePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playerRef.current) {
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

  const handleAcceptTerms = () => {
    localStorage.setItem('vsl_terms_accepted', 'true');
    setAcceptedTerms(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = () => {
    if (firestore && isConfigured) {
      const docRef = doc(firestore, 'metrics', sessionIdRef.current);
      setDoc(docRef, { clickedCTA: true, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
    }
    window.open(checkoutUrl, '_self');
  };

  if (!hasMounted) return null;

  if (isTikTok) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-sm">
          <div className="relative mx-auto w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              NAVEGADOR <span className="text-red-600">INCOMPATÍVEL</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium italic">
              O navegador do TikTok não suporta nosso systema de segurança de alta velocidade.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <p className="text-white text-xs font-bold uppercase tracking-widest">Siga os passos abaixo:</p>
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                <p className="text-zinc-300 text-[11px] leading-tight font-medium uppercase italic">Clique nos <MoreHorizontal className="w-3 h-3 inline"/> três pontos no topo da tela.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                <p className="text-zinc-300 text-[11px] leading-tight font-medium uppercase italic">Selecione <ExternalLink className="w-3 h-3 inline"/> Abrir no Navegador.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!acceptedTerms) {
    return (
      <div className="fixed inset-0 z-[9998] bg-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 space-y-8 flex flex-col shadow-2xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">AVISO LEGAL</h2>
          </div>
          <ScrollArea className="h-[280px] w-full pr-4 border-y border-zinc-900 py-4">
            <div className="text-[11px] text-zinc-400 leading-relaxed font-medium space-y-5">
              <p>Este site destina-se à prestação de serviços de análise técnica independente, orientação e suporte informativo, exclusivamente voltados para recursos administrativos de banimento.</p>
              <p>O CLIENTE declara conhecimento inequívoco de que o CONTRATADO não possui qualquer vínculo, parceria ou filiação com a Garena, sendo todas as marcas mencionadas de propriedade exclusiva de seus respectivos titulares.</p>
              <p>O CONTRATADO não realiza, sob hipótese alguma, acesso direto ou indireto a servidores internos da plataforma.</p>
              <p>Ao utilizar este site ou contratar quaisquer serviços nele oferecidos, o CLIENTE declara ter lido, compreendido e concordado integralmente com estes termos.</p>
              <div className="bg-red-600/10 p-5 rounded-2xl border border-red-600/20 mt-8">
                <p className="text-zinc-300 font-bold italic underline decoration-red-600/50 leading-relaxed text-justify">
                  É expressamente reconhecido que o CONTRATADO não garante, promete ou assegura a reversão, desbloqueio, recuperação ou restabelecimentos de contas, itens virtuais, progressos, patentes ou quaisquer ativos digitais, visto que a decisão final e sovereign pertence exclusivamente à plataforma responsável (Garena).
                </p>
              </div>
            </div>
          </ScrollArea>
          <Button onClick={handleAcceptTerms} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter rounded-2xl">
            LI E CONCORDO COM OS TERMOS <CheckCircle2 className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const getImg = (id: string) => PlaceHolderImages.find(img => img.id === id);

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col items-center px-4 pt-4 pb-20 select-none overflow-x-hidden font-sans">
      <header className="w-full max-w-[480px] text-center mb-6 space-y-4">
        <h1 className="text-white text-[1.4rem] font-black italic uppercase tracking-tighter leading-[1.1]">
          ESSE MACETE IRÁ <span className="text-red-600 text-[1.6rem] animate-pulse">SAIR DO AR A QUALQUER MOMENTO.</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-4 leading-tight">
          já solicitaram a queda do site, então aproveite enquanto há tempo
        </p>
      </header>

      <section className="w-full relative group max-w-[320px] mb-12">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[110] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md shadow-xl flex items-center gap-2 whitespace-nowrap">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">{recoveryCount} JOGADORES RECUPERANDO AGORA</span>
        </div>

        <div className="aspect-[9/16] w-full bg-zinc-900 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-zinc-800 relative cursor-pointer" onClick={togglePlayPause}>
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] animate-pulse">
                <Play className="w-10 h-10 text-white fill-current ml-1" />
              </div>
            </div>
          )}
          
          <MuxPlayer
            ref={playerRef}
            playbackId="QDJSIlmrorxXFDYyElAGNofuG8lo01zgwpEdRNl8RgKw"
            playsInline
            className="w-full h-full object-cover"
            onTimeUpdate={(e: any) => {
              const currentTime = e.target.currentTime;
              const duration = 140; 
              const pct = Math.floor((currentTime / duration) * 100);
              
              if (currentTime >= 128 && !showCTA) setShowCTA(true);
              
              const roundedTime = Math.floor(currentTime);
              if (roundedTime > 0 && roundedTime % 30 === 0 && roundedTime !== lastTrackedTime.current) {
                lastTrackedTime.current = roundedTime;
                trackMetric(pct, { watchTime: roundedTime, totalDuration: duration });
              }

              [25, 50, 75, 90].forEach(m => {
                if (pct >= m && !trackedMilestones.current.has(m)) {
                  trackedMilestones.current.add(m);
                  trackMetric(m, { watchTime: Math.floor(currentTime), totalDuration: duration });
                }
              });

              if (roundedTime >= 128 && !trackedMilestones.current.has(128)) {
                trackedMilestones.current.add(128);
                trackMetric(91, { watchTime: 128, totalDuration: duration, reachedPitch: true });
              }
            }}
            onEnded={() => { 
              setIsPlaying(false); 
              setIsEnded(true); 
              trackMetric(100, { completed: true, watchTime: 140 }); 
            }}
          />
        </div>
      </section>

      {showCTA && (
        <section ref={ctaRef} className="w-full max-w-[360px] mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
          <Button onClick={handleCtaClick} className="w-full h-16 text-xl font-black uppercase italic tracking-tighter bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl button-pulse gap-2 mb-8">
            QUERO DESBANIR AGORA! <ArrowRight className="w-6 h-6" />
          </Button>

          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider text-center mt-[-16px] mb-8">
            recupere em até 10 dias, ou receba seu dinheiro de volta.
          </p>

          <div className="mt-4 w-full space-y-4">
            <FeedbackCard img={getImg('feedback-1')?.imageUrl || '/feedback1.jpg'} name="JOÃO S." text="Funcionou na hora! Já recuperei minha conta." />
            <FeedbackCard img={getImg('feedback-2')?.imageUrl || '/feedback2.jpg'} name="MATHEUS R." text="Moleque do céu, deu certo mesmo! Minha conta lvl 70 de volta." />
          </div>
        </section>
      )}

      <footer className="mt-8 text-[8px] text-zinc-600 text-center uppercase font-bold tracking-widest">
        Este site não possui vínculo com a Garena Free Fire.
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .button-pulse { animation: pulse-cta 2s infinite; }
        @keyframes pulse-cta { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        mux-player::part(control-bar), mux-player::part(play-button), mux-player::part(center-controls) { display: none !important; }
        mux-player { --media-range-bar-color: #dc2626; }
      `}} />
    </main>
  );
}

function FeedbackCard({ img, name, text }: { img: string, name: string, text: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 bg-zinc-800">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="text-white text-[12px] font-black italic tracking-tight">{name}</span>
        <p className="text-zinc-400 text-[11px] leading-snug mt-1">{text}</p>
      </div>
    </div>
  );
}
