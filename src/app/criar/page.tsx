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
  QrCode
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

  // Animation effect for assistant text vs content
  useEffect(() => {
    setShowContent(false);
    // Delay para o conteúdo aparecer após o balão de fala
    const timer = setTimeout(() => setShowContent(true), 1200);
    return () => clearTimeout(timer);
  }, [phase, wizardStep]);

  // Stop audio on step/phase change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackUrl(null);
    }
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
    <div className="w-full h-full bg-[#050505] overflow-y-auto no-scrollbar space-y-6 pb-20 p-6 rounded-[2rem]">
      <div className="text-center space-y-2 mt-4">
        <Heart className="w-10 h-10 text-primary fill-current mx-auto animate-pulse" />
        <h3 className="font-serif-elegant font-bold text-2xl leading-tight">{data.title || "Seu Título Aqui"}</h3>
        <p className="text-sm text-muted-foreground italic">Para: {data.partnerName || "Amor"}</p>
      </div>

      <GlassCard className="p-4 rounded-3xl border-white/5 flex items-center gap-4">
        <div className={cn(
          "w-14 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative",
          playingTrackUrl && "animate-pulse"
        )}>
          {data.music?.cover ? (
            <img src={data.music.cover} className="w-full h-full object-cover" alt="Cover" />
          ) : (
            <Music className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold truncate">{data.music?.title || "Nenhuma música"}</p>
          <p className="text-sm text-muted-foreground truncate">{data.music?.artist || "Escolha no passo 2"}</p>
          <div className="h-1 bg-white/10 w-full rounded-full mt-2 relative overflow-hidden">
            <div className={cn("absolute left-0 top-0 h-full bg-primary transition-all duration-500", playingTrackUrl ? "w-2/3" : "w-0")} />
          </div>
        </div>
      </GlassCard>

      <div className="aspect-square rounded-[2rem] bg-white/5 border border-white/5 overflow-hidden shadow-lg">
        {data.photos[0] ? (
          <img src={data.photos[0]} className="w-full h-full object-cover" alt="Casal" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
      </div>

      <div className="text-center space-y-4">
        <p className="text-xs uppercase font-bold tracking-widest text-primary">Nossa História</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-xl font-bold">{timeTogether.years}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Anos</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-xl font-bold">{timeTogether.months}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Meses</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-xl font-bold">{timeTogether.days}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Dias</p>
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
      <div className="w-full bg-primary py-2.5 px-6 text-center text-[11px] font-bold text-white uppercase tracking-tight z-[110]">
        Mais de 100 mil pessoas já emocionaram alguém que amam. Crie o seu presente em 5 minutos.
      </div>

      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center pb-32">
        {/* Barra de Progresso */}
        <div className="w-full px-8 pt-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full -ml-4 opacity-50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-700 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-10" />
        </div>

        {/* Mascote e Fala (Sempre animam ao trocar de etapa) */}
        <div 
          key={`assistant-header-${phase}-${wizardStep}`}
          className="mt-8 mb-4 flex flex-col items-center px-6 w-full"
        >
          <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white animate-in zoom-in duration-500">
            <img 
              src="https://picsum.photos/seed/panda-love/200/200" 
              alt="Mascote" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="mt-6 w-full glass p-6 rounded-[2rem] shadow-2xl relative text-center border-white/10 animate-in slide-in-from-top-4 fade-in duration-700 delay-200">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 glass rotate-45 border-l border-t border-white/5" />
            <p className="text-sm font-medium leading-relaxed text-foreground/80">
              {assistantMessage}
            </p>
          </div>
        </div>

        {/* Conteúdo da Etapa (Staggered Animation) */}
        <div 
          key={`content-body-${phase}-${wizardStep}`}
          className={cn(
            "w-full px-6 py-6 transition-all duration-1000 flex-1",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {phase === 'dados' && (
            <div className="space-y-4">
              <Input 
                placeholder="Qual o seu nome?" 
                value={data.creatorName}
                onChange={e => setData({...data, creatorName: e.target.value})}
                className="h-14 bg-white/5 border-white/10 text-lg rounded-2xl"
              />
              <Input 
                placeholder="E o nome do seu amor?" 
                value={data.partnerName}
                onChange={e => setData({...data, partnerName: e.target.value})}
                className="h-14 bg-white/5 border-white/10 text-lg rounded-2xl"
              />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Data do Início</span>
                  <Input 
                    type="date" 
                    value={data.startDate}
                    onChange={e => setData({...data, startDate: e.target.value})}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Horário</span>
                  <Input 
                    type="time" 
                    value={data.startTime}
                    onChange={e => setData({...data, startTime: e.target.value})}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl"
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
                      placeholder="Ex: Eu te amo cada dia mais" 
                      value={data.title}
                      onChange={e => setData({...data, title: e.target.value})}
                      maxLength={30}
                      className="h-14 bg-white/5 border-white/10 text-lg rounded-2xl"
                    />
                    <span className="absolute right-4 bottom-4 text-[10px] text-muted-foreground">{data.title.length}/30</span>
                  </div>
                  <Button variant="ghost" className="w-full text-xs gap-2 text-primary font-bold" onClick={() => setData({...data, title: "Nosso amor é infinito ❤️"})}>
                    <Sparkles className="w-3 h-3" /> Gerar sugestão automática
                  </Button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Busque música ou artista..." 
                      className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl" 
                      value={musicSearch}
                      onChange={e => setMusicSearch(e.target.value)}
                    />
                    {isSearchingMusic && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pb-10">
                    {musicResults.map((m, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex flex-col p-3 rounded-2xl border border-white/5 transition-all",
                          data.music?.previewUrl === m.previewUrl ? "border-primary bg-primary/10" : "bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative group cursor-pointer" onClick={() => togglePlay(m)}>
                            <img src={m.cover} alt="Capa" className="w-12 h-12 rounded-xl shadow-md object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                              {playingTrackUrl === m.previewUrl ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0" onClick={() => setData({...data, music: m})}>
                            <p className="text-sm font-bold truncate">{m.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.artist}</p>
                          </div>
                        </div>
                        {playingTrackUrl === m.previewUrl && (
                          <div className="mt-4 px-2 space-y-2">
                            <Slider value={[audioProgress]} max={audioDuration} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="grid grid-cols-2 gap-3">
                  {data.photos.map((p, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-white/5 relative overflow-hidden border border-white/10">
                      <img src={p} className="w-full h-full object-cover" alt="Sua foto" />
                      <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => setData({...data, photos: data.photos.filter((_, idx) => idx !== i)})}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {data.photos.length < 5 && (
                    <button className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1" onClick={() => setData({...data, photos: [...data.photos, `https://picsum.photos/seed/${Math.random()}/600/600` ]})}>
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Upload</span>
                    </button>
                  )}
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Escreva uma mensagem especial para o seu amor..." 
                    className="min-h-[250px] bg-white/5 border-white/10 rounded-2xl"
                    value={data.message}
                    onChange={e => setData({...data, message: e.target.value})}
                  />
                </div>
              )}

              {wizardStep >= 5 && (
                 <div className="text-center space-y-4 py-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif-elegant font-bold">Tudo pronto!</h3>
                  <p className="text-sm text-muted-foreground">Revise seu presente usando o botão de visualização antes de prosseguir.</p>
                </div>
              )}
            </div>
          )}

          {phase === 'planos' && (
            <div className="space-y-4">
              <div 
                className={cn(
                  "p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden",
                  data.plan === 'lifetime' ? "border-primary bg-primary/5 shadow-xl" : "border-white/10 glass"
                )}
                onClick={() => setData({...data, plan: 'lifetime'})}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Acesso Vitalício</h3>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through">R$ 57,00</p>
                    <p className="text-xl font-bold text-primary">R$ 27,97</p>
                  </div>
                </div>
              </div>
              <div 
                className={cn(
                  "p-6 rounded-[2rem] border-2 transition-all",
                  data.plan === 'temporary' ? "border-primary bg-primary/5 shadow-xl" : "border-white/10 glass"
                )}
                onClick={() => setData({...data, plan: 'temporary'})}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Plano Econômico</h3>
                  <p className="text-xl font-bold">R$ 19,90</p>
                </div>
              </div>
            </div>
          )}

          {phase === 'checkout' && (
            <div className="space-y-6">
              <GlassCard className="p-8 border-white/5 bg-white/5 space-y-6 rounded-[2.5rem]">
                <h3 className="text-lg font-bold text-foreground/90">Resumo do pedido</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">Plano: {data.plan === 'lifetime' ? 'Vitalício' : 'Econômico'}</span>
                    </div>
                    <span className="font-bold">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">Modelo Juntos para sempre</span>
                    </div>
                    <span className="font-bold">R$ 3,90</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-2xl font-bold text-foreground">R$ {(Number(data.plan === 'lifetime' ? '27.97' : '19.90') + 3.9).toFixed(2).replace('.', ',')}</span>
                </div>

                <Button variant="ghost" className="w-full text-xs gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Ticket className="w-3 h-3" /> Possui um cupom de desconto?
                </Button>

                <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold leading-tight">Faça seu presente durar <span className="text-primary">PARA SEMPRE</span></p>
                    <p className="text-[9px] text-muted-foreground">Plano Vitalício com edições ilimitadas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary">+ R$ 10,00</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {phase === 'sucesso' && (
            <div className="text-center space-y-6 py-12">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-serif-elegant font-bold">Presente Criado!</h2>
              <p className="text-muted-foreground">O amor está no ar. Sua página está pronta!</p>
              <Button size="lg" className="w-full h-14 bg-[#25D366] rounded-full font-bold">Compartilhar no WhatsApp</Button>
            </div>
          )}
        </div>

        {/* Botão de Navegação Rodapé Fixo */}
        {phase !== 'sucesso' && showContent && (
          <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button 
              size="lg" 
              className="w-full h-16 bg-primary hover:bg-primary/90 pink-glow text-lg font-bold rounded-full max-w-lg mx-auto block"
              onClick={handleNext}
              disabled={
                (phase === 'dados' && !(data.creatorName && data.partnerName && data.startDate))
              }
            >
              {phase === 'checkout' ? 'Finalizar Presente' : 'Próximo Passo'} 
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </main>

      {/* Botão de Preview Flutuante */}
      {phase !== 'sucesso' && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="fixed bottom-32 left-8 w-14 h-14 rounded-full shadow-2xl z-[120] bg-white text-black"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="w-6 h-6" />
        </Button>
      )}

      {/* Modal de Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md w-[90%] p-0 bg-transparent border-none overflow-hidden rounded-[2.5rem]">
          <DialogHeader className="sr-only">
            <DialogTitle>Visualização Prévia</DialogTitle>
            <DialogDescription>Veja como sua página está ficando.</DialogDescription>
          </DialogHeader>
          <div className="relative h-[80vh]">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-[60] bg-black/50 text-white rounded-full" onClick={() => setIsPreviewOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
            <PreviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
