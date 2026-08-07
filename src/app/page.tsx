
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Search, Zap, ArrowRight, CheckCircle2, Globe, Lock, Radar, Terminal, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/scan?q=${encodeURIComponent(query)}`);
  };

  const detectedType = query.includes('@') 
    ? 'EMAIL' 
    : /^\+?[\d\s-]{8,}$/.test(query) 
    ? 'PHONE' 
    : query.length > 3 
    ? 'USERNAME' 
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Background Grids & FX */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="scanline" />

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,255,107,0.4)]">
              <Radar className="w-5 h-5 text-background" />
            </div>
            <span className="font-heading-cyber font-bold text-xl tracking-tighter">
              Localiza<span className="text-primary">.AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</Link>
            <Link href="#seguranca" className="hover:text-primary transition-colors">Segurança</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          </nav>

          <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest px-6" asChild>
            <Link href="/scan">Entrar</Link>
          </Button>
        </div>
      </header>

      <main className="relative pt-40 pb-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inteligência de Privacidade Digital</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-heading-cyber font-bold mb-8 leading-[0.95] max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
            A internet sabe <span className="text-primary glow-text">mais sobre você</span> do que deveria.
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Mapeie sua exposição digital em tempo real. Descubra onde informações associadas a você aparecem publicamente antes de ignorar o problema.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 animate-in fade-in zoom-in duration-1000">
            <form onSubmit={handleStartScan} className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative bg-secondary/50 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Digite seu e-mail, telefone ou username..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 bg-transparent border-none text-lg px-6 focus-visible:ring-0 placeholder:text-white/20"
                  />
                  {detectedType && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                      <span className="text-[9px] font-mono-tech font-bold text-primary tracking-widest">{detectedType} DETECTADO</span>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-primary hover:bg-primary-strong text-background font-bold px-8 h-14 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                  disabled={!query}
                >
                  INICIAR SCAN <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Consulta Protegida</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Fontes Públicas</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Verificável</span>
            </div>
          </div>

          {/* Radar Visualization Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10" />
            <div className="border border-white/5 rounded-[3rem] p-12 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group">
              {/* Radar Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
                <div className="animate-radar" style={{ animationDelay: '0s' }} />
                <div className="animate-radar" style={{ animationDelay: '1s' }} />
                <div className="animate-radar" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <div className="w-full h-px bg-primary/20" />
                   <div className="h-full w-px bg-primary/20 absolute" />
                   {[100, 200, 300].map(size => (
                     <div key={size} className="absolute border border-primary/20 rounded-full" style={{ width: size, height: size }} />
                   ))}
                </div>
              </div>

              {/* Terminal Preview */}
              <div className="relative z-10 text-left bg-black/40 border border-white/5 p-6 rounded-2xl font-mono-tech text-xs space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[10px] uppercase text-white/40">Localiza.AI // Exposure Engine</span>
                </div>
                <p className="text-primary/60">> preparing deterministic scan...</p>
                <p className="text-white/40">> identifiers normalized [email_mask: *******@gmail.com]</p>
                <p className="text-white/40">> connecting to global public indexes...</p>
                <p className="text-primary">> [!] candidate found in 4 indexed sources</p>
                <p className="text-white/40">> initiating confidence resolution engine...</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="seguranca" className="py-32 container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading-cyber font-bold mb-4">Mapeie seu rastro digital</h2>
            <p className="text-muted-foreground">O Localiza.AI analisa múltiplas camadas de exposição pública.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Exposição de Contato", 
                desc: "Verifique se seu e-mail ou telefone estão listados em diretórios ou páginas públicas." 
              },
              { 
                icon: Search, 
                title: "Identidade Digital", 
                desc: "Localize perfis e usernames que podem estar revelando mais do que você imagina." 
              },
              { 
                icon: Zap, 
                title: "Raio-X de Riscos", 
                desc: "Receba um Exposure Score baseado na sensibilidade e visibilidade dos dados encontrados." 
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-primary" />
            <span className="font-heading-cyber font-bold tracking-tighter">Localiza<span className="text-primary">.AI</span></span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contato</Link>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-widest">© 2024 Localiza.AI. Tecnologia defensiva.</p>
        </div>
      </footer>
    </div>
  );
}
