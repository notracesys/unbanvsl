'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Network, 
  BarChart3,
  User,
  Mail,
  Phone,
  Hash,
  Building2,
  MapPin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function DataVisualization() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4DA3FF]/10 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute inset-0 atlas-grid" />
      <div className="absolute top-1/4 right-10 w-96 h-96 border border-[#27314F] rounded-full flex items-center justify-center">
        <div className="w-64 h-64 border border-[#27314F]/50 rounded-full flex items-center justify-center animate-spin-slow">
          <div className="w-4 h-4 bg-[#61D9FF] rounded-full shadow-[0_0_20px_#61D9FF]" />
        </div>
      </div>
    </div>
  );
}

function SearchTypeBadge({ query }: { query: string }) {
  const detectType = (val: string) => {
    if (!val) return null;
    if (val.includes('@')) return { icon: Mail, label: 'E-mail' };
    if (/^\+?[\d\s-]{8,}$/.test(val)) return { icon: Phone, label: 'Telefone' };
    if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(val)) return { icon: Hash, label: 'CPF' };
    if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/.test(val)) return { icon: Building2, label: 'CNPJ' };
    if (val.length > 5 && val.includes(' ')) return { icon: User, label: 'Nome Completo' };
    return { icon: Globe, label: 'Identificador' };
  };

  const type = detectType(query);
  if (!type) return null;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-[#161F38] border border-[#27314F] rounded-full animate-in fade-in slide-in-from-right-2">
      <type.icon className="w-3 h-3 text-[#4DA3FF]" />
      <span className="text-[10px] font-mono font-bold text-[#AAB4D0] uppercase tracking-wider">{type.label}</span>
    </div>
  );
}

export default function AtlasLandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    const scanId = Math.random().toString(36).substring(7);
    router.push(`/scan/${scanId}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] relative">
      <DataVisualization />

      <nav className="relative z-10 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4DA3FF] to-[#7C6CFF] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-space font-bold tracking-tighter">
            ATLAS<span className="text-[#4DA3FF]">.AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#AAB4D0]">
          <a href="#" className="hover:text-white transition-colors">Plataforma</a>
          <a href="#" className="hover:text-white transition-colors">Tecnologia</a>
          <a href="#" className="hover:text-white transition-colors">Preços</a>
          <Button variant="outline" className="border-[#27314F] hover:bg-[#161F38] text-[#F5F7FB]">Entrar</Button>
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center pt-24 px-6">
        <section className="w-full max-w-4xl text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11182D] border border-[#27314F]">
            <Activity className="w-3.5 h-3.5 text-[#4DA3FF]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#AAB4D0]">
              Data Intelligence Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-space font-bold leading-[1.1] tracking-tight text-[#F5F7FB]">
            Pesquise o que a <br/>
            <span className="text-gradient">internet já sabe.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#AAB4D0] max-w-2xl mx-auto leading-relaxed">
            Pesquise nome, CPF, telefone, e-mail e outros identificadores em fontes públicas e veja ocorrências relevantes com rapidez e precisão.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4DA3FF]/20 to-[#7C6CFF]/20 rounded-[2rem] blur opacity-75 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAB4D0]/50" />
                <input 
                  type="text"
                  placeholder="Nome, CPF, e-mail, telefone ou empresa"
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
              { icon: Database, text: "Fontes públicas verificáveis" },
              { icon: Activity, text: "Análise em segundos" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAB4D0]/60">
                <item.icon className="w-4 h-4 text-[#4DA3FF]" />
                {item.text}
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-6xl pb-32">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Cpu, 
                title: "Processamento Neural", 
                desc: "Algoritmos avançados de correlação que conectam pontos de dados de diversas fontes." 
              },
              { 
                icon: BarChart3, 
                title: "Análise de Risco", 
                desc: "Avaliação objetiva de exposição digital baseada em ocorrências públicas confirmadas." 
              },
              { 
                icon: MapPin, 
                title: "Mapeamento Global", 
                desc: "Busca abrangente em diretórios, registros comerciais e perfis digitais públicos." 
              }
            ].map((feature, i) => (
              <div key={i} className="glass-morphism p-8 rounded-[2rem] space-y-4 hover:border-[#4DA3FF]/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#161F38] border border-[#27314F] flex items-center justify-center text-[#4DA3FF] group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-space font-bold">{feature.title}</h3>
                <p className="text-sm text-[#AAB4D0] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-[#27314F] py-12 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Network className="w-5 h-5 text-[#4DA3FF]" />
          <span className="text-sm font-space font-bold">ATLAS.AI</span>
        </div>
        <p className="text-xs text-[#AAB4D0]/50 font-medium">
          © 2024 Atlas Data Intelligence Platform. Resultados baseados em fontes públicas.
        </p>
      </footer>
    </div>
  );
}
