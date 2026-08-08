
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Activity, ShieldCheck, Globe, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    const scanId = Math.random().toString(36).substring(7);
    router.push(`/scan/${scanId}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] relative text-[#F5F7FB] font-sans selection:bg-[#4DA3FF]/30">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#4DA3FF]/5 to-transparent opacity-50" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#4DA3FF 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Header / Logo */}
      <nav className="relative z-10 w-full pt-10 pb-6 flex justify-center">
        <Image 
          src="/localiza.png" 
          alt="Logo" 
          width={180} 
          height={180} 
          className="w-40 h-auto object-contain"
          priority
        />
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center px-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-full max-w-xl flex flex-col items-center text-center">
          
          {/* 1. Badge no topo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11182D] border border-[#4DA3FF]/20 mb-8">
            <Activity className="w-3 h-3 text-[#4DA3FF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4DA3FF]">
              Inteligência de Dados Públicos
            </span>
          </div>

          {/* 2. Headline principal */}
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight mb-6 px-2">
            Digite um dado e descubra o que a <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4DA3FF] to-[#61D9FF]">
              internet pode revelar.
            </span>
          </h1>

          {/* 3. Subheadline */}
          <p className="text-base text-[#AAB4D0] mb-12 leading-relaxed px-4 max-w-md">
            Pesquise nome, CPF, telefone, e-mail ou username e visualize ocorrências públicas organizadas com rapidez e clareza.
          </p>

          {/* 4. Campo de busca */}
          <div className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4DA3FF]/30 to-transparent rounded-[2rem] blur opacity-50 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-6 w-5 h-5 text-[#4DA3FF]/40" />
                <input 
                  type="text"
                  placeholder="Digite nome, CPF, telefone, e-mail..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-16 bg-[#11182D] border border-[#27314F] rounded-[1.5rem] pl-14 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 transition-all placeholder:text-[#AAB4D0]/30 shadow-inner"
                />
              </div>
            </div>

            {/* 5. Botão CTA */}
            <Button 
              onClick={handleSearch}
              className="w-full h-16 rounded-[1.5rem] bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Iniciar Busca Agora
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* 6. Microcopy abaixo do botão */}
          <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-bold text-[#AAB4D0]/50 uppercase tracking-widest">
            <span>Busca rápida</span>
            <span className="w-1 h-1 bg-[#27314F] rounded-full" />
            <span>Fontes públicas</span>
            <span className="w-1 h-1 bg-[#27314F] rounded-full" />
            <span>Resultados organizados</span>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-10 w-full py-10 flex flex-col items-center gap-6">
        <div className="flex gap-8 opacity-20">
          <ShieldCheck className="w-5 h-5" />
          <Database className="w-5 h-5" />
          <Globe className="w-5 h-5" />
        </div>
        <p className="text-[9px] text-[#AAB4D0]/30 font-bold uppercase tracking-[0.3em]">
          Localiza Protocol // Encrypted Search
        </p>
      </footer>
    </div>
  );
}
