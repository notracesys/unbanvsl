'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Activity, Network, Globe, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function SearchTypeBadge({ query }: { query: string }) {
  const detectType = (val: string) => {
    if (!val) return null;
    if (val.includes('@')) return { label: 'E-mail' };
    if (/^\+?[\d\s-]{8,}$/.test(val)) return { label: 'Telefone' };
    if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(val)) return { label: 'CPF' };
    return { label: 'Identificador' };
  };

  const type = detectType(query);
  if (!type) return null;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-[#161F38] border border-[#27314F] rounded-full animate-in fade-in slide-in-from-right-2">
      <span className="text-[9px] font-mono font-bold text-[#4DA3FF] uppercase tracking-wider">{type.label}</span>
    </div>
  );
}

export default function SearchLandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    const scanId = Math.random().toString(36).substring(7);
    router.push(`/scan/${scanId}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] relative text-[#F5F7FB] font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4DA3FF]/5 blur-[120px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: `radial-gradient(#4DA3FF 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <nav className="relative z-10 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4DA3FF] to-[#7C6CFF] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-space font-bold tracking-tighter">
            LOCALIZA<span className="text-[#4DA3FF]">.AI</span>
          </span>
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center pt-24 px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <section className="w-full max-w-4xl text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11182D] border border-[#27314F]">
            <Activity className="w-3.5 h-3.5 text-[#4DA3FF]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#AAB4D0]">
              Data Intelligence Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-space font-bold leading-[1.1] tracking-tight">
            Descubra o que a <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4DA3FF] via-[#61D9FF] to-[#7C6CFF]">internet já sabe.</span>
          </h1>

          <p className="text-lg text-[#AAB4D0] max-w-2xl mx-auto leading-relaxed">
            Pesquise nome, CPF, e-mail ou outros identificadores em fontes públicas e veja ocorrências relevantes com rapidez e precisão.
          </p>

          <div className="relative max-w-2xl mx-auto group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4DA3FF]/20 to-[#7C6CFF]/20 rounded-[2rem] blur opacity-75 group-focus-within:opacity-100 transition duration-1000"></div>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAB4D0]/50" />
                <input 
                  type="text"
                  placeholder="Nome, CPF, e-mail, telefone..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-16 bg-[#11182D] border border-[#27314F] rounded-2xl pl-14 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all placeholder:text-[#AAB4D0]/30"
                />
                <SearchTypeBadge query={query} />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-16 px-10 rounded-2xl bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 shrink-0 group"
              >
                Iniciar Busca
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8">
            {[
              { icon: ShieldCheck, text: "Resultados organizados" },
              { icon: Database, text: "Fontes verificáveis" },
              { icon: Globe, text: "Busca global" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#AAB4D0]/60">
                <item.icon className="w-4 h-4 text-[#4DA3FF]" />
                {item.text}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-[#27314F] py-12 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Network className="w-5 h-5 text-[#4DA3FF]" />
          <span className="text-sm font-space font-bold">LOCALIZA.AI</span>
        </div>
        <p className="text-xs text-[#AAB4D0]/50 font-medium">
          © 2024 Localiza Data Intelligence. Fontes públicas oficiais.
        </p>
      </footer>
    </div>
  );
}
