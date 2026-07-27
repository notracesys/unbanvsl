
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Music, 
  Image as ImageIcon, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Trash2,
  Upload,
  Search,
  Lock,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, differenceInSeconds } from 'date-fns';

// --- Types ---
type CreationPhase = 'dados' | 'wizard' | 'upsell' | 'planos' | 'checkout';

interface PageData {
  creatorName: string;
  partnerName: string;
  startDate: string;
  startTime: string;
  city: string;
  title: string;
  music: {
    title: string;
    artist: string;
    cover: string;
  } | null;
  photos: string[];
  message: string;
  theme: 'classic' | 'starry' | 'elegant' | 'minimal';
  plan: 'lifetime' | 'temporary';
}

export default function CriarPagina() {
  const router = useRouter();
  const [phase, setPhase] = useState<CreationPhase>('dados');
  const [wizardStep, setWizardStep] = useState(1);
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
    plan: 'lifetime'
  });

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

  const progress = useMemo(() => {
    if (phase === 'dados') return 20;
    if (phase === 'wizard') return 20 + (wizardStep * 10);
    if (phase === 'upsell') return 80;
    if (phase === 'planos') return 90;
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
    }
  };

  const handleBack = () => {
    if (phase === 'wizard') {
      if (wizardStep > 1) setWizardStep(wizardStep - 1);
      else setPhase('dados');
    } else if (phase === 'upsell') {
      setPhase('wizard');
      setWizardStep(6);
    } else if (phase === 'planos') {
      setPhase('upsell');
    } else if (phase === 'checkout') {
      setPhase('planos');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Barra de Progresso Fixa */}
      <div className="fixed top-0 left-0 w-full z-[100] h-1.5 bg-white/5">
        <div 
          className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(255,77,109,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Banner de Urgência */}
      <div className="pt-1.5 bg-primary/20 py-2 text-center text-[10px] uppercase tracking-widest font-bold text-primary-foreground/80 flex items-center justify-center gap-2">
        <Zap className="w-3 h-3 fill-current" />
        +100 mil pessoas já criaram o presente delas. Crie o seu em 5 minutos.
      </div>

      {/* Header com Voltar */}
      <header className="px-4 h-16 flex items-center gap-4">
        {(phase !== 'dados' || wizardStep > 1) && (
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
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* Lado Esquerdo: Formulário e Assistente */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Assistente/Mascote */}
          <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 shrink-0 shadow-lg pink-glow">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/mascot/100/100" alt="Mascote" className="w-8 h-8 rounded-full" />
              </div>
            </div>
            <div className="glass p-4 rounded-2xl relative">
              <div className="absolute top-4 -left-2 w-4 h-4 glass rotate-45 border-l border-b border-transparent" />
              <p className="text-sm font-medium leading-relaxed">
                {phase === 'dados' && "Olá! Sou seu assistente do amor. Para começar, me conta... quem são vocês?"}
                {phase === 'wizard' && wizardStep === 1 && "Agora vamos dar um título especial para esse presente!"}
                {phase === 'wizard' && wizardStep === 2 && "Qual a trilha sonora do amor de vocês? Procure aqui embaixo."}
                {phase === 'wizard' && wizardStep === 3 && "Hora das fotos! Escolha as 5 melhores lembranças de vocês."}
                {phase === 'wizard' && wizardStep === 4 && "Abra seu coração. Escreva uma carta linda ou use minha ajuda."}
                {phase === 'wizard' && wizardStep === 5 && "Escolha uma foto bem marcante para o nosso contador de tempo."}
                {phase === 'wizard' && wizardStep === 6 && "Quase lá! Revise os textos e ajuste se precisar."}
                {phase === 'upsell' && "O presente ficou lindo! Mas dá pra deixar INESQUECÍVEL com o upgrade Retrospectiva."}
              </p>
            </div>
          </div>

          {/* Conteúdo da Etapa */}
          <div className="space-y-6">
            {phase === 'dados' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-serif-elegant font-bold">Informações Básicas</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Seu nome</label>
                    <Input 
                      placeholder="Ex: João" 
                      value={data.creatorName}
                      onChange={e => setData({...data, creatorName: e.target.value})}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Nome do seu amor</label>
                    <Input 
                      placeholder="Ex: Maria" 
                      value={data.partnerName}
                      onChange={e => setData({...data, partnerName: e.target.value})}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Data de Início</label>
                      <Input 
                        type="date" 
                        value={data.startDate}
                        onChange={e => setData({...data, startDate: e.target.value})}
                        className="bg-white/5 border-white/10 h-12"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Horário</label>
                      <Input 
                        type="time" 
                        value={data.startTime}
                        onChange={e => setData({...data, startTime: e.target.value})}
                        className="bg-white/5 border-white/10 h-12"
                      />
                    </div>
                  </div>
                  
                  {data.startDate && (
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl text-center space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">Vocês estão juntos há:</p>
                      <div className="flex justify-center gap-4 text-primary">
                        <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.years}</span><span className="text-[10px] uppercase">Anos</span></div>
                        <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.months}</span><span className="text-[10px] uppercase">Meses</span></div>
                        <div className="flex flex-col"><span className="text-2xl font-bold leading-none">{timeTogether.days}</span><span className="text-[10px] uppercase">Dias</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {phase === 'wizard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Passo {wizardStep} de 6</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6].map(s => (
                      <div key={s} className={cn("w-1.5 h-1.5 rounded-full", s === wizardStep ? "bg-primary" : "bg-white/20")} />
                    ))}
                  </div>
                </div>

                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <label className="text-sm font-bold">Qual será o título da página?</label>
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
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                      <Sparkles className="w-4 h-4 mr-2" /> Gerar sugestão automática
                    </Button>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <label className="text-sm font-bold">Busque a música de vocês</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Nome da música ou artista..." className="pl-10 h-12 bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      {/* Simulação de resultados */}
                      {[
                        { title: "Perfect", artist: "Ed Sheeran", cover: "https://picsum.photos/seed/music1/50/50" },
                        { title: "Always", artist: "Bon Jovi", cover: "https://picsum.photos/seed/music2/50/50" }
                      ].map((m, i) => (
                        <div 
                          key={i} 
                          onClick={() => setData({...data, music: m})}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                            data.music?.title === m.title && "border-primary bg-primary/5"
                          )}
                        >
                          <img src={m.cover} alt="Capa" className="w-10 h-10 rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-bold leading-none mb-1">{m.title}</p>
                            <p className="text-xs text-muted-foreground">{m.artist}</p>
                          </div>
                          <Music className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <label className="text-sm font-bold">Suas fotos favoritas</label>
                    <div className="grid grid-cols-3 gap-3">
                      {data.photos.map((p, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/5 relative group overflow-hidden border border-white/10">
                          <img src={p} className="w-full h-full object-cover" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setData({...data, photos: data.photos.filter((_, idx) => idx !== i)})}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {data.photos.length < 5 && (
                        <button 
                          className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors"
                          onClick={() => setData({...data, photos: [...data.photos, `https://picsum.photos/seed/${Math.random()}/400/400` ]})}
                        >
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Upload</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">Limite de 5 fotos. PNG, JPG ou WEBP até 10MB.</p>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <label className="text-sm font-bold">Sua mensagem especial</label>
                    <div className="relative">
                      <Textarea 
                        placeholder="Escreva uma mensagem especial para o seu amor..." 
                        className="min-h-[200px] bg-white/5"
                        value={data.message}
                        onChange={e => setData({...data, message: e.target.value})}
                        maxLength={5000}
                      />
                      <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground">{data.message.length}/5000</span>
                    </div>
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                      <Sparkles className="w-4 h-4 mr-2" /> Gerar com IA do LoveLink
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <Button 
              size="lg" 
              className="w-full h-14 bg-primary hover:bg-primary/90 pink-glow text-lg font-bold rounded-full mt-4"
              onClick={handleNext}
            >
              Continuar <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Lado Direito: Preview em Tempo Real */}
        <div className="hidden lg:block w-[380px] shrink-0">
          <div className="sticky top-24">
            <div className="text-center mb-4">
              <Badge variant="outline" className="border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">Visualização ao Vivo</Badge>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-[60px] rounded-full -z-10" />
              <div className="w-full aspect-[9/19] bg-[#050505] rounded-[3rem] border-8 border-white/10 shadow-2xl overflow-hidden flex flex-col">
                {/* Mockup de Celular Content */}
                <div className="h-6 w-1/3 bg-white/5 mx-auto rounded-b-2xl mb-4" />
                
                <div className="px-6 flex-1 overflow-y-auto no-scrollbar space-y-6 pb-12">
                  <div className="text-center space-y-2">
                    <Heart className="w-8 h-8 text-primary fill-current mx-auto animate-pulse" />
                    <h3 className="font-serif-elegant font-bold text-xl">{data.title || "Seu Título Aqui"}</h3>
                    <p className="text-xs text-muted-foreground italic">Para: {data.partnerName || "Amor"}</p>
                  </div>

                  {/* Bloco Música */}
                  <GlassCard className="p-4 rounded-3xl border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden shrink-0">
                      {data.music?.cover && <img src={data.music.cover} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{data.music?.title || "Nenhuma música"}</p>
                      <p className="text-xs text-muted-foreground truncate">{data.music?.artist || "Escolha no passo 2"}</p>
                      <div className="h-1 bg-white/10 w-full rounded-full mt-2 relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-primary" />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Bloco Fotos */}
                  <div className="aspect-square rounded-[2rem] bg-white/5 border border-white/5 overflow-hidden">
                    {data.photos[0] ? (
                      <img src={data.photos[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>

                  {/* Bloco Tempo */}
                  <div className="text-center space-y-3">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Nossa História</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/5 p-2 rounded-2xl"><p className="text-sm font-bold">{timeTogether.years}</p><p className="text-[8px] uppercase">Anos</p></div>
                      <div className="bg-white/5 p-2 rounded-2xl"><p className="text-sm font-bold">{timeTogether.months}</p><p className="text-[8px] uppercase">Meses</p></div>
                      <div className="bg-white/5 p-2 rounded-2xl"><p className="text-sm font-bold">{timeTogether.days}</p><p className="text-[8px] uppercase">Dias</p></div>
                    </div>
                  </div>

                  {/* Bloco Mensagem */}
                  <div className="glass p-4 rounded-3xl text-[11px] leading-relaxed text-muted-foreground italic">
                    {data.message || "Sua mensagem aparecerá aqui..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Mobile Button */}
      <div className="lg:hidden p-4 border-t border-white/5 sticky bottom-0 bg-background/80 backdrop-blur-md">
        <Button 
          className="w-full h-14 bg-primary hover:bg-primary/90 pink-glow text-lg font-bold rounded-full"
          onClick={handleNext}
        >
          Próximo Passo <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
