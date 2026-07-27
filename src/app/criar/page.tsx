'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Music, 
  Image as ImageIcon, 
  Trash2,
  Upload,
  Search,
  Zap,
  Loader2,
  Play,
  Pause,
  Eye,
  X,
  CheckCircle2,
  Crown,
  Gift,
  Ticket,
  QrCode,
  ShieldCheck,
  MessageCircle,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  MailOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { differenceInSeconds, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

// --- Components ---

function Typewriter({ text, speed = 25, onFinished }: { text: string; speed?: number; onFinished?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onFinished) {
      const finishTimeout = setTimeout(onFinished, 400);
      return () => clearTimeout(finishTimeout);
    }
  }, [index, text, speed, onFinished]);

  return (
    <span className="inline-block transition-all duration-300">
      {displayedText}
      <span className="inline-block w-1 h-4 bg-primary/40 ml-0.5 animate-pulse rounded-full align-middle" />
    </span>
  );
}

// --- Types ---
type CreationPhase = 'dados' | 'wizard' | 'upsell' | 'planos' | 'checkout' | 'sucesso';

interface MusicTrack {
  title: string;
  artist: string;
  cover: string;
  previewUrl: string;
}

interface PageData {
  creatorName: string;
  partnerName: string;
  startDate: string;
  startTime: string;
  city: string;
  title: string;
  music: MusicTrack | null;
  photos: string[];
  message: string;
  theme: 'classic' | 'starry' | 'elegant' | 'minimal';
  plan: 'lifetime' | 'temporary';
  email: string;
}

export default function CriarPagina() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<CreationPhase>('dados');
  const [wizardStep, setWizardStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const [data, setData] = useState<PageData>({
    creatorName: '',
    partnerName: '',
    startDate: '',
    startTime: '00:00',
    city: '',
    title: '',
    music: null,
    photos: [],
    message: '',
    theme: 'classic',
    plan: 'lifetime',
    email: ''
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const [musicSearch, setMusicSearch] = useState('');
  const [musicResults, setMusicResults] = useState<MusicTrack[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  const [timeTogether, setTimeTogether] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackUrl(null);
    }
    setShowContent(false);
  }, [phase, wizardStep]);

  useEffect(() => {
    if (!data.startDate) return;
    
    const interval = setInterval(() => {
      const start = new Date(`${data.startDate}T${data.startTime || '00:00'}`);
      const now = new Date();
      const diff = differenceInSeconds(now, start);
      
      if (diff > 0) {
        setTimeTogether({
          years: Math.floor(diff / (365 * 24 * 3600)),
          months: Math.floor((diff % (365 * 24 * 3600)) / (30 * 24 * 3600)),
          days: Math.floor((diff % (30 * 24 * 3600)) / (24 * 3600)),
          hours: Math.floor((diff % (24 * 3600)) / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [data.startDate, data.startTime]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (musicSearch.length < 3) {
        setMusicResults([]);
        return;
      }
      
      setIsSearchingMusic(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(musicSearch)}&entity=song&limit=15`);
        const result = await response.json();
        const tracks = result.results.map((item: any) => ({
          title: item.trackName,
          artist: item.artistName,
          cover: item.artworkUrl100.replace('100x100', '400x400'),
          previewUrl: item.previewUrl
        }));
        setMusicResults(tracks);
      } catch (error) {
        console.error("Erro ao buscar música:", error);
      } finally {
        setIsSearchingMusic(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [musicSearch]);

  const togglePlay = (track: MusicTrack) => {
    if (playingTrackUrl === track.previewUrl) {
      audioRef.current?.pause();
      setPlayingTrackUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.play();
        setPlayingTrackUrl(track.previewUrl);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setAudioProgress(value[0]);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 10)
      }));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const progress = useMemo(() => {
    if (phase === 'dados') return 15;
    if (phase === 'wizard') return 15 + (wizardStep * 10);
    if (phase === 'upsell') return 75;
    if (phase === 'planos') return 85;
    if (phase === 'checkout') return 95;
    return 100;
  }, [phase, wizardStep]);

  const handleNext = () => {
    if (phase === 'dados') {
      if (data.creatorName && data.partnerName && data.startDate) {
        setPhase('wizard');
      }
    } else if (phase === 'wizard') {
      if (wizardStep < 6) setWizardStep(wizardStep + 1);
      else setPhase('upsell');
    } else if (phase === 'upsell') {
      setPhase('planos');
    } else if (phase === 'planos') {
      setPhase('checkout');
    } else if (phase === 'checkout') {
      setPhase('sucesso');
    }
  };

  const handleBack = () => {
    if (phase === 'wizard' && wizardStep > 1) setWizardStep(wizardStep - 1);
    else if (phase === 'wizard' && wizardStep === 1) setPhase('dados');
    else if (phase === 'upsell') { setPhase('wizard'); setWizardStep(6); }
    else if (phase === 'planos') setPhase('upsell');
    else if (phase === 'checkout') setPhase('planos');
  };

  const assistantMessage = useMemo(() => {
    if (phase === 'dados') return "Tudo pronto para o grande momento! Estou ansioso para ver a reação dela(e). Me conta quem são vocês?";
    if (phase === 'wizard') {
      switch(wizardStep) {
        case 1: return "Dê um título especial para esse presente! Como você chama seu amor?";
        case 2: return "Qual a trilha sonora de vocês? Escolha aquela música que faz o coração bater mais forte.";
        case 3: return "Hora das fotos! Escolha as melhores lembranças de vocês (até 10 fotos).";
        case 4: return "Abra seu coração! Escreva uma carta de amor inesquecível.";
        case 5: return "Estamos quase lá! O visual do presente está incrível.";
        case 6: return "O seu presente está lindíssimo! Confira se está tudo certinho antes de finalizar.";
        default: return "";
      }
    }
    if (phase === 'upsell') return "O seu presente já está incrível, mas que tal deixar ele INESQUECÍVEL com uma Retrospectiva Animada?";
    if (phase === 'planos') return "Escolha o melhor plano para manter sua história de amor sempre acessível.";
    if (phase === 'checkout') return "Tudo pronto para o grande momento! Preencha os detalhes do pagamento abaixo e prepare-se para surpreender.";
    return "";
  }, [phase, wizardStep]);

  // --- PREVIEW CONTENT (DARK NEON STYLE) ---

  const PreviewContent = () => {
    const [previewOpened, setPreviewOpened] = useState(false);
    const [isStoryMode, setIsStoryMode] = useState(false);

    if (!previewOpened) {
      return (
        <div 
          className="w-full h-full bg-[#050505] flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden"
          onClick={() => setPreviewOpened(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-30" />
          <div className="relative group flex flex-col items-center">
            <div className="w-48 h-36 bg-zinc-900 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,77,109,0.15)] flex items-center justify-center animate-bounce duration-[2000ms]">
              <Heart className="w-16 h-16 text-primary fill-current animate-pulse" />
            </div>
            <p className="mt-12 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 animate-pulse text-center leading-relaxed">
              Você recebeu um presente<br/>Toque para abrir
            </p>
          </div>
        </div>
      );
    }

    if (isStoryMode) {
      return (
        <div className="w-full h-full bg-black relative flex flex-col">
          <div className="absolute top-4 left-0 w-full px-4 flex gap-1 z-50">
            <div className="h-0.5 flex-1 bg-white/30 overflow-hidden rounded-full">
              <div className="h-full bg-white w-full animate-[progress_5s_linear_infinite]" />
            </div>
          </div>
          <button 
            onClick={() => setIsStoryMode(false)}
            className="absolute top-8 right-6 text-white z-50 bg-black/40 p-2 rounded-full backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
            <img 
              src={data.photos[0] || 'https://picsum.photos/seed/love/600/900'} 
              className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" 
              alt="Story BG" 
            />
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                Sua<br/>História<br/><span className="text-[#00FFFF]">Love Link</span>
              </h2>
              <p className="text-[#00FFFF] text-[10px] font-bold tracking-[0.3em] uppercase">Mergulhe nas memórias</p>
            </div>
            <Button 
              className="mt-12 w-64 h-16 bg-[#00FFFF] hover:bg-[#00FFFF]/90 text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] animate-pulse"
              onClick={() => setIsStoryMode(false)}
            >
              COMEÇAR STORY
            </Button>
          </div>
          <style jsx>{`
            @keyframes progress {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-[#050505] overflow-y-auto no-scrollbar scroll-smooth">
        {/* Section 1: Music Player */}
        <section className="min-h-full flex flex-col items-center justify-center p-8 space-y-8 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          <div className="w-72 aspect-square rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border border-white/5 relative group">
            <img 
              src={data.photos[0] || 'https://picsum.photos/seed/love/600/600'} 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
              alt="Capa" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="w-full space-y-1 text-left px-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-white truncate italic tracking-tighter">
                {data.music?.title || "Sua Música Especial"}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-[#00FFFF] fill-[#00FFFF]/20" />
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              {data.music?.artist || "Escolha seu artista favorito"}
            </p>
          </div>

          <div className="w-full px-4 space-y-4">
            <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-[#00FFFF] w-[35%] shadow-[0_0_10px_#00FFFF]" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-600 tracking-widest">
              <span>1:14</span>
              <span>3:45</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full px-4 pt-2">
            <Shuffle className="w-5 h-5 text-zinc-600" />
            <SkipBack className="w-7 h-7 text-white fill-current" />
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl shadow-white/5 hover:scale-105 transition-transform cursor-pointer">
              <Play className="w-8 h-8 text-black fill-current ml-1" />
            </div>
            <SkipForward className="w-7 h-7 text-white fill-current" />
            <Repeat className="w-5 h-5 text-zinc-600" />
          </div>

          <div className="pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-1 h-12 bg-gradient-to-b from-[#00FFFF] to-transparent rounded-full animate-bounce" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">Role para continuar</p>
            </div>
          </div>
        </section>

        {/* Section 2: Counter Brutalist */}
        <section className="min-h-full bg-black flex flex-col items-center justify-center p-8 py-20 space-y-12">
          <div className="text-center space-y-4 w-full">
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tighter leading-none break-words px-4">
              {data.creatorName || "NOME"} & {data.partnerName || "AMOR"}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              UM LAÇO ETERNO DESDE {data.startDate ? format(new Date(data.startDate), 'dd/MM/yyyy') : '...'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { label: 'Anos', value: timeTogether.years },
              { label: 'Meses', value: timeTogether.months },
              { label: 'Dias', value: timeTogether.days },
              { label: 'Horas', value: timeTogether.hours },
              { label: 'Minutos', value: timeTogether.minutes },
              { label: 'Segundos', value: timeTogether.seconds }
            ].map((t, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] text-center space-y-1 flex flex-col items-center justify-center backdrop-blur-sm">
                <span className="text-4xl font-black text-white italic tracking-tighter">{t.value}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Note of Love (Cyan Card) */}
        <section className="min-h-full flex flex-col items-center justify-center p-8 bg-[#050505]">
          <div className="bg-[#00FFFF] w-full p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,255,255,0.3)] space-y-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-3 bg-black/10 px-4 py-2 rounded-full">
              <MessageCircle className="w-5 h-5 text-black" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Nota de Amor</span>
            </div>
            
            <p className="text-2xl font-black text-black leading-tight tracking-tight uppercase italic line-clamp-4">
              {data.message || "Sua mensagem especial aparecerá aqui para emocionar seu amor..."}
            </p>

            <Button className="w-full h-16 bg-black hover:bg-black/90 text-white font-black rounded-full text-sm uppercase tracking-widest">
              LER MENSAGEM
            </Button>
          </div>
        </section>

        {/* Section 4: Story Redirect */}
        <section className="min-h-full flex flex-col items-center justify-center p-8 space-y-12 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#00FFFF]/10 to-transparent" />
          <div className="relative z-10 text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                Sua<br/>História<br/><span className="text-[#00FFFF]">Love Link</span>
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Mergulhe nas memórias</p>
            </div>
            
            <Button 
              className="w-64 h-16 bg-[#00FFFF] hover:bg-[#00FFFF]/90 text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(0,255,255,0.4)] animate-pulse"
              onClick={() => setIsStoryMode(true)}
            >
              COMEÇAR STORY
            </Button>
          </div>
        </section>
      </div>
    );
  };

  // --- END PREVIEW CONTENT ---

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 text-foreground overflow-x-hidden">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingTrackUrl(null)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
      
      <div className="w-full bg-primary py-2.5 px-6 text-center text-[10px] font-bold text-white uppercase tracking-[0.1em] z-[120] shadow-sm relative shrink-0">
        Mais de 100 mil pessoas já emocionaram seu amor hoje ✨
      </div>

      {phase !== 'sucesso' && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed top-14 right-6 z-[130] text-[10px] uppercase font-bold tracking-widest text-primary bg-white/90 hover:bg-white rounded-full px-4 h-9 gap-2 transition-all hover:scale-105 pink-glow shadow-xl backdrop-blur-md border border-primary/10"
          onClick={() => setIsPreviewOpen(true)}
        >
          <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-full" />
          <Eye className="w-3.5 h-3.5 relative z-10" /> 
          <span className="relative z-10">Preview</span>
        </Button>
      )}

      <header className="relative w-full bg-white px-6 py-6 flex items-center gap-4 z-50">
        <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-primary/5 shrink-0 h-9 w-9">
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Button>
        <div className="flex-1 h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-in-out rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-24 shrink-0" />
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center pb-32 pt-2">
        <div 
          key={`assistant-header-${phase}-${wizardStep}`}
          className="mt-4 mb-6 flex flex-col items-center px-6 w-full"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full -z-10" />
            <div className="w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white animate-in zoom-in duration-700">
              <img 
                src="/lovi.png" 
                alt="Mascote" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <div className="mt-8 w-full bg-white p-7 rounded-[2.5rem] shadow-xl relative text-center border border-primary/10 animate-in slide-in-from-top-6 fade-in duration-1000">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 border-l border-t border-primary/10" />
            <div className="text-sm font-medium leading-relaxed text-foreground min-h-[3rem] font-headline tracking-wide">
              <Typewriter 
                text={assistantMessage} 
                onFinished={() => setShowContent(true)} 
              />
            </div>
          </div>
        </div>

        <div 
          key={`content-body-${phase}-${wizardStep}`}
          className={cn(
            "w-full px-6 py-4 transition-all duration-1000 flex-1",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none blur-sm"
          )}
        >
          {phase === 'dados' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em]">Seu Nome</span>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Apenas o primeiro nome</span>
                </div>
                <Input 
                  placeholder="Como você se chama?" 
                  value={data.creatorName}
                  onChange={e => setData({...data, creatorName: e.target.value})}
                  className="h-16 bg-white border-primary/10 text-lg rounded-3xl focus:ring-primary/20 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.15em]">Nome do seu Amor</span>
                </div>
                <Input 
                  placeholder="Qual o nome dele(a)?" 
                  value={data.partnerName}
                  onChange={e => setData({...data, partnerName: e.target.value})}
                  className="h-16 bg-white border-primary/10 text-lg rounded-3xl focus:ring-primary/20 shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground ml-3 tracking-[0.15em]">Desde quando?</span>
                  <Input 
                    type="date" 
                    value={data.startDate}
                    onChange={e => setData({...data, startDate: e.target.value})}
                    className="h-16 bg-white border-primary/10 rounded-3xl shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground ml-3 tracking-[0.15em]">Que horas?</span>
                  <Input 
                    type="time" 
                    value={data.startTime}
                    onChange={e => setData({...data, startTime: e.target.value})}
                    className="h-16 bg-white border-primary/10 rounded-3xl shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {phase === 'wizard' && (
            <div className="space-y-6">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      placeholder="Ex: Pra sempre juntos..." 
                      value={data.title}
                      onChange={e => setData({...data, title: e.target.value})}
                      maxLength={30}
                      className="h-16 bg-white border-primary/10 text-lg rounded-3xl shadow-sm"
                    />
                    <span className="absolute right-5 bottom-5 text-[10px] text-muted-foreground">{data.title.length}/30</span>
                  </div>
                  <Button variant="outline" className="w-full h-12 text-xs gap-2 text-primary border-primary/20 hover:bg-primary/5 rounded-2xl" onClick={() => setData({...data, title: "Nosso amor é infinito ❤️"})}>
                    <Sparkles className="w-3.5 h-3.5" /> Gerar ideia romântica
                  </Button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder="Busque música ou artista..." 
                      className="pl-14 h-16 bg-white border-primary/10 rounded-3xl shadow-sm" 
                      value={musicSearch}
                      onChange={e => setMusicSearch(e.target.value)}
                    />
                    {isSearchingMusic && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                  </div>
                  <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pb-16">
                    {musicResults.map((m, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex flex-col p-4 rounded-3xl border transition-all duration-300",
                          data.music?.previewUrl === m.previewUrl ? "border-primary bg-primary/5 shadow-md" : "border-primary/5 bg-white hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative group/play cursor-pointer" onClick={() => togglePlay(m)}>
                            <img src={m.cover} alt="Capa" className="w-14 h-14 rounded-2xl shadow-sm object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl opacity-0 group-hover/play:opacity-100 transition-opacity">
                              {playingTrackUrl === m.previewUrl ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setData({...data, music: m})}>
                            <p className="text-sm font-bold truncate text-foreground">{m.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{m.artist}</p>
                          </div>
                        </div>
                        {playingTrackUrl === m.previewUrl && (
                          <div className="mt-5 px-1 space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <Slider value={[audioProgress]} max={audioDuration} step={0.1} onValueChange={handleSeek} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {data.photos.map((p, i) => (
                      <div key={i} className="aspect-square rounded-3xl bg-muted/30 relative overflow-hidden border border-primary/10 group shadow-sm">
                        <img src={p} className="w-full h-full object-cover" alt="Sua foto" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" className="h-10 w-10 rounded-full" onClick={() => setData({...data, photos: data.photos.filter((_, idx) => idx !== i)})}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {data.photos.length < 10 && (
                      <button 
                        className="aspect-square rounded-3xl bg-white border-2 border-dashed border-primary/10 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors group" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-primary/60 tracking-widest">Enviar Foto</span>
                      </button>
                    )}
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground">Você pode enviar até 10 fotos.</p>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-1000">
                  <Textarea 
                    placeholder="Abra seu coração aqui..." 
                    className="min-h-[300px] bg-white border-primary/10 rounded-3xl p-6 text-base leading-relaxed focus:ring-primary/20 shadow-sm"
                    value={data.message}
                    onChange={e => setData({...data, message: e.target.value})}
                  />
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-muted-foreground">{data.message.length}/5000</span>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/5">
                      Inspirar-me ✨
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep >= 5 && (
                 <div className="text-center space-y-6 py-10 animate-in zoom-in duration-1000">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-white border border-primary/10 rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif-elegant font-bold text-foreground">Presente Perfeito!</h3>
                    <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">Tudo pronto para ser eternizado. Confira o preview acima.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'planos' && (
            <div className="space-y-5">
              <div 
                className={cn(
                  "p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden cursor-pointer bg-white",
                  data.plan === 'lifetime' ? "border-primary shadow-lg ring-4 ring-primary/5" : "border-primary/5 hover:bg-primary/5"
                )}
                onClick={() => setData({...data, plan: 'lifetime'})}
              >
                {data.plan === 'lifetime' && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-foreground">Acesso Vitalício</h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Presente para sempre</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through">R$ 57,00</p>
                    <p className="text-2xl font-bold text-primary">R$ 27,97</p>
                  </div>
                </div>
              </div>
              <div 
                className={cn(
                  "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer bg-white",
                  data.plan === 'temporary' ? "border-primary shadow-lg ring-4 ring-primary/5" : "border-primary/5 hover:bg-primary/5"
                )}
                onClick={() => setData({...data, plan: 'temporary'})}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-foreground">Plano Econômico</h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Válido por 1 ano</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">R$ 19,90</p>
                </div>
              </div>
            </div>
          )}

          {phase === 'checkout' && (
            <div className="space-y-6">
              <div className="p-8 border border-primary/10 bg-white space-y-7 rounded-[3rem] shadow-xl">
                <div className="flex items-center justify-between border-b border-muted pb-4">
                  <h3 className="text-lg font-bold text-foreground">Resumo do Pedido</h3>
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Gift className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground font-medium">Plano: {data.plan === 'lifetime' ? 'Vitalício' : 'Econômico'}</span>
                    </div>
                    <span className="font-bold text-foreground">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</span>
                  </div>
                </div>

                <div className="h-px bg-muted w-full" />
                
                <div className="flex justify-between items-end pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total a pagar</span>
                    <p className="text-3xl font-bold text-foreground tracking-tighter">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</p>
                  </div>
                  <Button variant="ghost" className="h-8 text-[10px] gap-2 text-primary tracking-widest uppercase font-bold">
                    <Ticket className="w-3.5 h-3.5" /> Cupom
                  </Button>
                </div>
              </div>
            </div>
          )}

          {phase === 'sucesso' && (
            <div className="text-center space-y-8 py-14 animate-in zoom-in duration-1000">
              <div className="relative mx-auto w-28 h-28">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl border border-primary/5">
                  <Sparkles className="w-14 h-14 text-primary animate-float" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-serif-elegant font-bold text-foreground">Presente Criado!</h2>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">Sua história agora está eternizada. Compartilhe esse link e veja a mágica acontecer.</p>
              </div>
              <Button size="lg" className="w-full h-16 bg-[#25D366] hover:bg-[#25D366]/90 rounded-full font-bold text-lg shadow-lg shadow-green-200 gap-3 transition-transform hover:scale-[1.02]">
                Compartilhar no WhatsApp <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {phase !== 'sucesso' && showContent && (
          <div className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background to-transparent z-[100] animate-in fade-in slide-in-from-bottom-6 duration-700 pointer-events-none">
            <Button 
              size="lg" 
              className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-bold rounded-full max-w-lg mx-auto flex items-center justify-center gap-3 pink-glow pointer-events-auto shadow-2xl"
              onClick={handleNext}
              disabled={
                (phase === 'dados' && !(data.creatorName && data.partnerName && data.startDate))
              }
            >
              {phase === 'checkout' ? 'Finalizar Presente' : 'Próximo Passo'} 
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </main>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          hideClose
          className="max-w-[420px] h-[90vh] p-0 bg-transparent border-none shadow-none focus:outline-none flex items-center justify-center overflow-visible"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Visualização da Página</DialogTitle>
            <DialogDescription>Uma prévia de como sua surpresa será vista pelo seu amor.</DialogDescription>
          </DialogHeader>
          
          <div className="relative w-full h-full flex items-center justify-center group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-0 -left-12 z-[220] bg-white text-primary rounded-full shadow-2xl h-10 w-10 border border-primary/10 transition-transform hover:scale-110 active:scale-90" 
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="w-[360px] h-full bg-white border-[12px] border-zinc-900 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col relative">
              <div className="flex-1 overflow-hidden relative">
                <PreviewContent />
              </div>
              <div className="h-1.5 w-32 bg-zinc-200 rounded-full mx-auto mb-2 mt-auto shrink-0 z-10" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
