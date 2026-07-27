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
  ShieldCheck,
  CheckCircle2,
  Crown,
  CreditCard,
  QrCode,
  Copy,
  ChevronRight,
  History,
  Star,
  Gamepad2,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

  // Music Search States
  const [musicSearch, setMusicSearch] = useState('');
  const [musicResults, setMusicResults] = useState<MusicTrack[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  const [timeTogether, setTimeTogether] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

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

  const PreviewContent = () => (
    <div className="w-full h-full bg-[#050505] overflow-y-auto no-scrollbar space-y-6 pb-20 p-6 rounded-[2rem]">
      <div className="text-center space-y-2 mt-4">
        <Heart className="w-10 h-10 text-primary fill-current mx-auto animate-pulse" />
        <h3 className="font-serif-elegant font-bold text-2xl leading-tight">{data.title || "Seu Título Aqui"}</h3>
        <p className="text-sm text-muted-foreground italic">Para: {data.partnerName || "Amor"}</p>
      </div>

      {/* Bloco Música */}
      <GlassCard className="p-4 rounded-3xl border-white/5 flex items-center gap-4 transition-all animate-in fade-in zoom-in-95">
        <div className={cn(
          "w-14 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0 shadow-inner flex items-center justify-center relative",
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

      {/* Bloco Fotos */}
      <div className="aspect-square rounded-[2rem] bg-white/5 border border-white/5 overflow-hidden shadow-lg transition-all duration-500">
        {data.photos[0] ? (
          <img src={data.photos[0]} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Casal" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
      </div>

      {/* Bloco Tempo */}
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

      {/* Bloco Mensagem */}
      {data.message && (
        <div className="glass p-6 rounded-3xl text-sm leading-relaxed text-muted-foreground italic border-white/5 shadow-sm text-center">
          &quot;{data.message}&quot;
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <audio ref={audioRef} onEnded={() => setPlayingTrackUrl(null)} />
      
      {/* Barra de Progresso Fixa */}
      <div className="fixed top-0 left-0 w-full z-[100] h-1.5 bg-white/5">
        <div 
          className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(255,77,109,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Banner de Urgência */}
      {phase !== 'sucesso' && (
        <div className="pt-1.5 bg-primary/20 py-2 text-center text-[10px] uppercase tracking-widest font-bold text-primary-foreground/80 flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 fill-current" />
          +100 mil pessoas já criaram o presente delas.
        </div>
      )}

      {/* Header com Voltar */}
      <header className="px-4 h-14 flex items-center gap-4">
        {(phase !== 'dados' && phase !== 'sucesso') && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span className="font-serif-elegant font-bold text-lg">LoveLink</span>
          </div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 container max-w-lg mx-auto px-4 py-4 flex flex-col gap-6">
        
        {/* Assistente (Mascote) */}
        {phase !== 'sucesso' && (
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 shrink-0 shadow-lg pink-glow">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/love-bot/100/100" alt="Mascote" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="glass p-3 rounded-2xl relative flex-1">
              <div className="absolute top-4 -left-1 w-2 h-2 glass rotate-45 border-l border-b border-transparent" />
              <p className="text-xs font-medium leading-relaxed">
                {phase === 'dados' && "Olá! Sou seu assistente do amor. Para começar, quem são vocês?"}
                {phase === 'wizard' && wizardStep === 1 && "Dê um título especial para esse presente!"}
                {phase === 'wizard' && wizardStep === 2 && "Qual a trilha sonora de vocês? Clique no play para ouvir."}
                {phase === 'wizard' && wizardStep === 3 && "Hora das fotos! Escolha as melhores lembranças."}
                {phase === 'wizard' && wizardStep === 4 && "Abra seu coração na carta de amor."}
                {phase === 'wizard' && wizardStep === 5 && "Escolha a capa do seu contador."}
                {phase === 'wizard' && wizardStep === 6 && "Confira se tudo está como você sonhou!"}
                {phase === 'upsell' && "O presente ficou lindo! Mas dá pra deixar INESQUECÍVEL com a nossa Retrospectiva Animada."}
                {phase === 'planos' && "Quase lá! Agora escolha o plano que melhor se adapta a você."}
                {phase === 'checkout' && "Falta só um passo para o seu amor receber essa surpresa!"}
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo da Etapa */}
        <div className="space-y-6 flex-1">
          {phase === 'dados' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-serif-elegant font-bold">Informações Básicas</h2>
              <div className="space-y-4">
                <Input 
                  placeholder="Seu nome" 
                  value={data.creatorName}
                  onChange={e => setData({...data, creatorName: e.target.value})}
                  className="bg-white/5 border-white/10 h-12"
                />
                <Input 
                  placeholder="Nome do seu amor" 
                  value={data.partnerName}
                  onChange={e => setData({...data, partnerName: e.target.value})}
                  className="bg-white/5 border-white/10 h-12"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="date" 
                    value={data.startDate}
                    onChange={e => setData({...data, startDate: e.target.value})}
                    className="bg-white/5 border-white/10 h-12"
                  />
                  <Input 
                    type="time" 
                    value={data.startTime}
                    onChange={e => setData({...data, startTime: e.target.value})}
                    className="bg-white/5 border-white/10 h-12"
                  />
                </div>
                {data.startDate && (
                  <GlassCard className="p-6 text-center space-y-2 border-primary/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Contagem do Amor</p>
                    <div className="flex justify-center gap-4 text-primary">
                      <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.years}</span><span className="text-[8px] uppercase">Anos</span></div>
                      <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.months}</span><span className="text-[8px] uppercase">Meses</span></div>
                      <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.days}</span><span className="text-[8px] uppercase">Dias</span></div>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          )}

          {phase === 'wizard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Etapa {wizardStep} de 6</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6].map(s => (
                    <div key={s} className={cn("w-1.5 h-1.5 rounded-full", s === wizardStep ? "bg-primary w-3" : "bg-white/20")} />
                  ))}
                </div>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <label className="text-sm font-bold">Título da página</label>
                  <div className="relative">
                    <Input 
                      placeholder="Ex: Eu te amo cada dia mais" 
                      value={data.title}
                      onChange={e => setData({...data, title: e.target.value})}
                      maxLength={30}
                      className="h-14 bg-white/5"
                    />
                    <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">{data.title.length}/30</span>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Busque música ou artista..." 
                      className="pl-10 h-12 bg-white/5" 
                      value={musicSearch}
                      onChange={e => setMusicSearch(e.target.value)}
                    />
                    {isSearchingMusic && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />}
                  </div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto no-scrollbar pb-10">
                    {musicResults.map((m, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-all",
                          data.music?.previewUrl === m.previewUrl ? "border-primary bg-primary/10" : "bg-white/5"
                        )}
                      >
                        <div className="relative group cursor-pointer" onClick={() => togglePlay(m)}>
                          <img src={m.cover} alt="Capa" className="w-12 h-12 rounded-lg shadow-md object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            {playingTrackUrl === m.previewUrl ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0" onClick={() => setData({...data, music: m})}>
                          <p className="text-sm font-bold leading-tight truncate">{m.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{m.artist}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("rounded-full", data.music?.previewUrl === m.previewUrl && "text-primary")}
                          onClick={() => setData({...data, music: m})}
                        >
                          <Heart className={cn("w-5 h-5", data.music?.previewUrl === m.previewUrl && "fill-current")} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {data.photos.map((p, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/5 relative group overflow-hidden border border-white/10">
                        <img src={p} className="w-full h-full object-cover" alt="Sua foto" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={() => setData({...data, photos: data.photos.filter((_, idx) => idx !== i)})}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {data.photos.length < 5 && (
                      <button 
                        className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1"
                        onClick={() => setData({...data, photos: [...data.photos, `https://picsum.photos/seed/${Math.random()}/600/600` ]})}
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Upload</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Escreva uma mensagem especial para o seu amor..." 
                    className="min-h-[250px] bg-white/5 text-sm"
                    value={data.message}
                    onChange={e => setData({...data, message: e.target.value})}
                    maxLength={5000}
                  />
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                    <span>Mínimo sugerido: 100 caracteres</span>
                    <span>{data.message.length}/5000</span>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Capa do Contador</h3>
                  <div className="aspect-[16/9] rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 overflow-hidden">
                    <img src="https://picsum.photos/seed/cover/800/450" className="w-full h-full object-cover opacity-50" alt="Capa" />
                    <Button variant="secondary" size="sm" className="absolute">Alterar Capa</Button>
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
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

          {phase === 'upsell' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative aspect-[9/16] max-w-[280px] mx-auto rounded-[2.5rem] border-4 border-white/10 overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/retro/400/800" className="w-full h-full object-cover" alt="Upgrade" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <Badge className="w-fit mb-2 bg-accent text-accent-foreground">Upgrade VIP</Badge>
                  <p className="font-bold text-lg leading-tight">8+ Seções Animadas</p>
                  <p className="text-xs opacity-80">Conte sua história como um filme.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 glass rounded-2xl">
                  <History className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-bold">Linha do Tempo</p>
                    <p className="text-[10px] text-muted-foreground">Relembre as datas mais importantes.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 glass rounded-2xl">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-bold">Nosso Mapa</p>
                    <p className="text-[10px] text-muted-foreground">Os lugares que marcaram vocês.</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-bold rounded-full shadow-lg" onClick={() => setPhase('planos')}>
                Sim! Quero adicionar agora <Crown className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setPhase('planos')}>
                Seguir apenas com o presente básico
              </Button>
            </div>
          )}

          {phase === 'planos' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div 
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all relative overflow-hidden",
                  data.plan === 'lifetime' ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,77,109,0.2)]" : "border-white/10 glass"
                )}
                onClick={() => setData({...data, plan: 'lifetime'})}
              >
                {data.plan === 'lifetime' && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Recomendado</div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Acesso Vitalício</h3>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground line-through">R$ 57,00</p>
                    <p className="text-xl font-bold text-primary">R$ 27,97</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-primary" /> Presente disponível para sempre</li>
                  <li className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-primary" /> QR Code Premium para imprimir</li>
                  <li className="flex items-center gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-primary" /> Edição ilimitada</li>
                </ul>
              </div>

              <div 
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all relative",
                  data.plan === 'temporary' ? "border-primary bg-primary/5" : "border-white/10 glass"
                )}
                onClick={() => setData({...data, plan: 'temporary'})}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Plano Econômico</h3>
                  <p className="text-xl font-bold text-muted-foreground">R$ 19,90</p>
                </div>
                <p className="text-xs text-muted-foreground">Página disponível por 30 dias. Ideal para uma surpresa rápida.</p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1" className="border-white/10">
                  <AccordionTrigger className="text-xs font-bold">Pagamento é seguro?</AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground">Sim, usamos criptografia de ponta a ponta e processamento seguro via PIX/Cartão.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {phase === 'checkout' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <GlassCard className="p-6 border-white/5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resumo</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Presente Digital ({data.plan === 'lifetime' ? 'Vitalício' : '30 dias'})</span>
                  <span className="font-bold">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center text-primary">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold">R$ {data.plan === 'lifetime' ? '27,97' : '19,90'}</span>
                </div>
              </GlassCard>

              <div className="space-y-4">
                <h3 className="text-sm font-bold">Seus Dados</h3>
                <Input 
                  placeholder="Seu melhor e-mail" 
                  type="email"
                  className="h-12 bg-white/5"
                  value={data.email}
                  onChange={e => setData({...data, email: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground text-center">O link de acesso também será enviado para este e-mail.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 border-white/10 bg-white/5 font-bold flex flex-col gap-1">
                  <QrCode className="w-5 h-5" />
                  <span className="text-[10px]">Pagar via PIX</span>
                </Button>
                <Button variant="outline" className="h-14 border-white/10 bg-white/5 font-bold flex flex-col gap-1">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px]">Cartão de Crédito</span>
                </Button>
              </div>
            </div>
          )}

          {phase === 'sucesso' && (
            <div className="text-center space-y-8 py-12 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,77,109,0.3)]">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif-elegant font-bold">Presente Criado!</h2>
                <p className="text-muted-foreground">O amor está no ar. Sua página está pronta!</p>
              </div>
              
              <GlassCard className="p-6 border-white/10 space-y-4 max-w-sm mx-auto">
                <div className="aspect-square bg-white p-4 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-full h-full text-black" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary">lovelink.com/p/ana-e-pedro</p>
                  <Button variant="secondary" className="w-full gap-2 rounded-full" onClick={() => {}}>
                    <Copy className="w-4 h-4" /> Copiar Link
                  </Button>
                </div>
              </GlassCard>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full h-14 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-full gap-2">
                   Compartilhar no WhatsApp
                </Button>
                <Button variant="ghost" size="lg" className="w-full h-14 font-bold rounded-full" onClick={() => router.push('/')}>
                  Voltar ao Início
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Botoes de Navegação Rodapé */}
        {phase !== 'sucesso' && (
          <div className="grid grid-cols-1 gap-3 pt-4">
            <Button 
              size="lg" 
              className="w-full h-14 bg-primary hover:bg-primary/90 pink-glow text-lg font-bold rounded-full"
              onClick={handleNext}
              disabled={
                (phase === 'dados' && !(data.creatorName && data.partnerName && data.startDate)) ||
                (phase === 'checkout' && !data.email)
              }
            >
              {phase === 'planos' ? 'Ir para Pagamento' : phase === 'checkout' ? 'Finalizar Presente' : 'Próximo Passo'} 
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </main>

      {/* Botão Flutuante de Preview Mobile */}
      {phase !== 'sucesso' && (
        <Button 
          variant="secondary" 
          size="icon" 
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-2xl z-50 bg-white text-black hover:scale-110 transition-transform"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="w-6 h-6" />
        </Button>
      )}

      {/* Modal de Preview com Acessibilidade Corrigida */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md w-[90%] p-0 bg-transparent border-none overflow-hidden rounded-[2.5rem]">
          <DialogHeader className="sr-only">
            <DialogTitle>Visualização Prévia do Presente</DialogTitle>
            <DialogDescription>
              Veja como a sua página romântica está ficando em tempo real antes de finalizar.
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-[80vh]">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-[60] bg-black/50 text-white rounded-full"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            <PreviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
