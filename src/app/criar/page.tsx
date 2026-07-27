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
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

// --- Components ---

/**
 * Componente que anima o texto letra por letra com efeito de fade e desfoque suave
 */
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

  // Audio States
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Music Search States
  const [musicSearch, setMusicSearch] = useState('');
  const [musicResults, setMusicResults] = useState<MusicTrack[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  const [timeTogether, setTimeTogether] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  // Stop audio and hide content on phase/step change to allow typewriter animation
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackUrl(null);
    }
    setShowContent(false);
  }, [phase, wizardStep]);

  // Calculate time in real-time
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

  // iTunes Music Search API
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
        case 3: return "Hora das fotos! Escolha as 5 melhores lembranças de vocês.";
        case 4: return "Abra seu coração! Escreva uma carta de amor inesquecível.";
        case 5: return "Estamos quase lá! Escolha a melhor foto para a capa do seu contador.";
        case 6: return "O seu presente está lindíssimo! Confira se está tudo certinho antes de finalizar.";
        default: return "";
      }
    }
    if (phase === 'upsell') return "O seu presente já está incrível, mas que tal deixar ele INESQUECÍVEL com uma Retrospectiva Animada?";
    if (phase === 'planos') return "Escolha o melhor plano para manter sua história de amor sempre acessível.";
    if (phase === 'checkout') return "Tudo pronto para o grande momento! Preencha os detalhes do pagamento abaixo e prepare-se para surpreender.";
    return "";
  }, [phase, wizardStep]);

  const PreviewContent = () => (
    <div className="w-full h-full bg-[#050505] overflow-y-auto no-scrollbar space-y-6 pb-20 p-6 rounded-[2rem] border border-white/5">
      <div className="text-center space-y-2 mt-4 animate-in fade-in zoom-in duration-700">
        <Heart className="w-10 h-10 text-primary fill-current mx-auto animate-pulse" />
        <h3 className="font-serif-elegant font-bold text-2xl leading-tight text-white/90">{data.title || "Seu Título Aqui"}</h3>
        <p className="text-sm text-muted-foreground italic tracking-wide">Para: {data.partnerName || "Amor"}</p>
      </div>

      <GlassCard className="p-4 rounded-3xl border-white/10 flex items-center gap-4 bg-white/[0.03] backdrop-blur-xl">
        <div className={cn(
          "w-14 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner",
          playingTrackUrl && "animate-pulse"
        )}>
          {data.music?.cover ? (
            <img src={data.music.cover} className="w-full h-full object-cover" alt="Cover" />
          ) : (
            <Music className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold truncate text-white/90">{data.music?.title || "Nenhuma música"}</p>
          <p className="text-xs text-muted-foreground truncate">{data.music?.artist || "Escolha no passo 2"}</p>
          <div className="h-1 bg-white/10 w-full rounded-full mt-2 relative overflow-hidden">
            <div className={cn("absolute left-0 top-0 h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(255,77,109,0.8)]", playingTrackUrl ? "w-2/3" : "w-0")} />
          </div>
        </div>
      </GlassCard>

      <div className="aspect-square rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {data.photos[0] ? (
          <img src={data.photos[0]} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Casal" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80">Nossa História</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
            <p className="text-xl font-bold text-white/90">{timeTogether.years}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Anos</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
            <p className="text-xl font-bold text-white/90">{timeTogether.months}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Meses</p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
            <p className="text-xl font-bold text-white/90">{timeTogether.days}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Dias</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 text-foreground overflow-x-hidden">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingTrackUrl(null)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
      
      {/* Banner de Urgência Topo */}
      <div className="w-full bg-primary/90 backdrop-blur-md py-2.5 px-6 text-center text-[10px] font-bold text-white uppercase tracking-[0.1em] z-[110] shadow-md border-b border-white/10">
        Mais de 100 mil pessoas já emocionaram seu amor hoje ✨
      </div>

      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center pb-32">
        {/* Barra de Progresso e Preview */}
        <div className="w-full px-8 pt-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full -ml-4 opacity-40 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(255,77,109,0.5)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
          {phase !== 'sucesso' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-primary transition-colors gap-2"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </Button>
          )}
        </div>

        {/* Mascote e Fala Animada */}
        <div 
          key={`assistant-header-${phase}-${wizardStep}`}
          className="mt-10 mb-6 flex flex-col items-center px-6 w-full"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10 animate-pulse" />
            <div className="w-28 h-28 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border-[6px] border-white/10 animate-in zoom-in duration-700">
              <img 
                src="/lovi.png" 
                alt="Mascote" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <div className="mt-8 w-full glass p-7 rounded-[2.5rem] shadow-2xl relative text-center border-white/20 bg-white/[0.03] backdrop-blur-2xl animate-in slide-in-from-top-6 fade-in duration-1000">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white/[0.05] backdrop-blur-xl rotate-45 border-l border-t border-white/10" />
            <div className="text-sm font-medium leading-relaxed text-white/80 min-h-[3rem] font-headline tracking-wide">
              <Typewriter 
                text={assistantMessage} 
                onFinished={() => setShowContent(true)} 
              />
            </div>
          </div>
        </div>

        {/* Conteúdo da Etapa */}
        <div 
          key={`content-body-${phase}-${wizardStep}`}
          className={cn(
            "w-full px-6 py-4 transition-all duration-1000 flex-1",
            showContent ? "opacity-100 translate-y-0 blur-none scale-100" : "opacity-0 translate-y-8 blur-md scale-[0.98] pointer-events-none"
          )}
        >
          {phase === 'dados' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.15em]">Seu Nome</span>
                  <span className="text-[9px] text-muted-foreground/40 flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Apenas o primeiro nome por segurança</span>
                </div>
                <Input 
                  placeholder="Como você se chama?" 
                  value={data.creatorName}
                  onChange={e => setData({...data, creatorName: e.target.value})}
                  className="h-16 bg-white/[0.04] border-white/10 text-lg rounded-3xl focus:ring-primary/40 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.15em]">Nome do seu Amor</span>
                  <span className="text-[9px] text-muted-foreground/40 flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Não precisa ser o nome completo</span>
                </div>
                <Input 
                  placeholder="Qual o nome dele(a)?" 
                  value={data.partnerName}
                  onChange={e => setData({...data, partnerName: e.target.value})}
                  className="h-16 bg-white/[0.04] border-white/10 text-lg rounded-3xl focus:ring-primary/40 backdrop-blur-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-3 tracking-[0.15em]">Desde quando?</span>
                  <Input 
                    type="date" 
                    value={data.startDate}
                    onChange={e => setData({...data, startDate: e.target.value})}
                    className="h-16 bg-white/[0.04] border-white/10 rounded-3xl focus:ring-primary/40 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 ml-3 tracking-[0.15em]">Que horas?</span>
                  <Input 
                    type="time" 
                    value={data.startTime}
                    onChange={e => setData({...data, startTime: e.target.value})}
                    className="h-16 bg-white/[0.04] border-white/10 rounded-3xl focus:ring-primary/40 backdrop-blur-sm"
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
                      className="h-16 bg-white/[0.04] border-white/10 text-lg rounded-3xl focus:ring-primary/40"
                    />
                    <span className="absolute right-5 bottom-5 text-[10px] text-muted-foreground/50 tracking-tighter">{data.title.length}/30</span>
                  </div>
                  <Button variant="ghost" className="w-full h-12 text-xs gap-2 text-primary/70 font-bold hover:text-primary hover:bg-white/5 rounded-2xl" onClick={() => setData({...data, title: "Nosso amor é infinito ❤️"})}>
                    <Sparkles className="w-3.5 h-3.5" /> Gerar ideia romântica
                  </Button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-colors -z-10" />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                    <Input 
                      placeholder="Busque música ou artista..." 
                      className="pl-14 h-16 bg-white/[0.04] border-white/10 rounded-3xl focus:ring-primary/40" 
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
                          "flex flex-col p-4 rounded-3xl border transition-all duration-300 backdrop-blur-sm",
                          data.music?.previewUrl === m.previewUrl ? "border-primary/50 bg-primary/[0.07] shadow-lg" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative group/play cursor-pointer" onClick={() => togglePlay(m)}>
                            <img src={m.cover} alt="Capa" className="w-14 h-14 rounded-2xl shadow-xl object-cover transition-transform group-hover/play:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover/play:opacity-100 transition-opacity">
                              {playingTrackUrl === m.previewUrl ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setData({...data, music: m})}>
                            <p className="text-sm font-bold truncate text-white/90">{m.title}</p>
                            <p className="text-[11px] text-muted-foreground/70 truncate">{m.artist}</p>
                          </div>
                        </div>
                        {playingTrackUrl === m.previewUrl && (
                          <div className="mt-5 px-1 space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <Slider value={[audioProgress]} max={audioDuration} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
                          </div>
                        )}
                      </div>
                    ))}
                    {musicSearch.length >= 3 && musicResults.length === 0 && !isSearchingMusic && (
                      <p className="text-center text-xs text-muted-foreground py-10 italic">Nenhuma música encontrada...</p>
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="grid grid-cols-2 gap-4">
                  {data.photos.map((p, i) => (
                    <div key={i} className="aspect-square rounded-3xl bg-white/[0.03] relative overflow-hidden border border-white/10 shadow-xl group">
                      <img src={p} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Sua foto" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" className="h-10 w-10 rounded-full shadow-2xl" onClick={() => setData({...data, photos: data.photos.filter((_, idx) => idx !== i)})}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {data.photos.length < 5 && (
                    <button className="aspect-square rounded-3xl bg-white/[0.03] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.05] transition-colors group" onClick={() => setData({...data, photos: [...data.photos, `https://picsum.photos/seed/${Math.random()}/800/800` ]})}>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Enviar Foto</span>
                    </button>
                  )}
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-1000">
                  <Textarea 
                    placeholder="Abra seu coração aqui..." 
                    className="min-h-[300px] bg-white/[0.04] border-white/10 rounded-3xl p-6 text-base leading-relaxed focus:ring-primary/40 shadow-inner"
                    value={data.message}
                    onChange={e => setData({...data, message: e.target.value})}
                  />
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-muted-foreground/50">{data.message.length}/5000 caracteres</span>
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-primary hover:bg-primary/10">
                      Inspirar-me com IA ✨
                    </Button>
                  </div>
                </div>
              )}

              {wizardStep >= 5 && (
                 <div className="text-center space-y-6 py-10 animate-in zoom-in duration-1000">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shadow-2xl border border-primary/20">
                      <CheckCircle2 className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif-elegant font-bold text-white/90">Presente Perfeito!</h3>
                    <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">Tudo pronto para ser eternizado. Revise como ficou no botão acima.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === 'planos' && (
            <div className="space-y-5">
              <div 
                className={cn(
                  "p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden cursor-pointer group",
                  data.plan === 'lifetime' ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,77,109,0.2)]" : "border-white/10 glass hover:bg-white/[0.05]"
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
                    <h3 className="font-bold text-xl text-white/90">Acesso Vitalício</h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Presente para sempre</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through decoration-primary/50">R$ 57,00</p>
                    <p className="text-2xl font-bold text-primary">R$ 27,97</p>
                  </div>
                </div>
              </div>
              <div 
                className={cn(
                  "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer",
                  data.plan === 'temporary' ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(255,77,109,0.2)]" : "border-white/10 glass hover:bg-white/[0.05]"
                )}
                onClick={() => setData({...data, plan: 'temporary'})}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-white/90">Plano Econômico</h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Válido por 1 ano</p>
                  </div>
                  <p className="text-2xl font-bold text-white/90">R$ 19,90</p>
                </div>
              </div>
            </div>
          )}

          {phase === 'checkout' && (
            <div className="space-y-6">
              <GlassCard className="p-8 border-white/10 bg-white/[0.02] space-y-7 rounded-[3rem] shadow-2xl backdrop-blur-3xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-lg font-bold text-white/90">Resumo do Pedido</h3>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                        <Gift className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground font-medium">Plano: {data.plan === 'lifetime' ? 'Vitalício' : 'Econômico'}</span>
                    </div>
                    <span className="font-bold text-white/90">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary/60" />
                      </div>
                      <span className="text-muted-foreground font-medium">Tema Exclusivo & Música</span>
                    </div>
                    <span className="font-bold text-white/90">Grátis</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />
                
                <div className="flex justify-between items-end pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total a pagar</span>
                    <p className="text-3xl font-bold text-white tracking-tighter">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</p>
                  </div>
                  <Button variant="ghost" className="h-8 text-[10px] gap-2 text-muted-foreground/60 hover:text-primary tracking-widest uppercase font-bold">
                    <Ticket className="w-3.5 h-3.5" /> Cupom
                  </Button>
                </div>

                <div className="p-6 rounded-[2rem] bg-primary/[0.04] border border-primary/10 flex items-center gap-5 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/[0.02] -z-10 group-hover:bg-primary/[0.05] transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-tight text-white/90 tracking-tight">O amor dura <span className="text-primary">PARA SEMPRE</span></p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">Mude para o vitalício por apenas + R$ 8,00</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            </div>
          )}

          {phase === 'sucesso' && (
            <div className="text-center space-y-8 py-14 animate-in zoom-in duration-1000">
              <div className="relative mx-auto w-28 h-28">
                <div className="absolute inset-0 bg-primary/40 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-28 h-28 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,77,109,0.4)] border border-white/20">
                  <Sparkles className="w-14 h-14 text-primary animate-float" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-serif-elegant font-bold text-white tracking-tight">Presente Criado!</h2>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">Sua história agora está eternizada. Compartilhe esse link e veja a mágica acontecer.</p>
              </div>
              <Button size="lg" className="w-full h-16 bg-[#25D366] hover:bg-[#25D366]/90 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(37,211,102,0.3)] gap-3 transition-transform hover:scale-[1.02]">
                Compartilhar no WhatsApp <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Botão de Navegação Rodapé Fixo */}
        {phase !== 'sucesso' && showContent && (
          <div className="fixed bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-[100] animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Button 
              size="lg" 
              className="w-full h-16 bg-primary hover:bg-primary/90 pink-glow text-lg font-bold rounded-full max-w-lg mx-auto flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(255,77,109,0.4)]"
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

      {/* Modal de Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md w-[92%] p-0 bg-transparent border-none overflow-hidden rounded-[3rem] shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Visualização da Página</DialogTitle>
            <DialogDescription>Uma prévia de como sua surpresa será vista pelo seu amor.</DialogDescription>
          </DialogHeader>
          <div className="relative h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[3rem]">
            <Button variant="ghost" size="icon" className="absolute top-5 right-5 z-[60] bg-black/60 text-white rounded-full backdrop-blur-md border border-white/10" onClick={() => setIsPreviewOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
            <PreviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
