
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldAlert, Lock, Eye, ShieldCheck } from 'lucide-react';
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
      <nav className="relative z-10 w-full pt-12 pb-4 flex justify-center">
        <Image 
          src="/localiza.png" 
          alt="Localiza Logo" 
          width={200} 
          height={200} 
          className="w-44 h-auto object-contain"
          priority
        />
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center px-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-full max-w-xl flex flex-col items-center text-center">
          
          {/* 1. Badge no topo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11182D] border border-[#4DA3FF]/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#4DA3FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DA3FF]">
              Verificação de Exposição Digital
            </span>
          </div>

          {/* 2. Headline principal */}
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6 px-2">
            Você saberia dizer onde seus <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4DA3FF] to-[#61D9FF]">
              dados estão aparecendo agora?
            </span>
          </h1>

          {/* 3. Subheadline */}
          <p className="text-base text-[#AAB4D0] mb-10 leading-relaxed px-4 max-w-[500px]">
            Seu CPF, telefone, e-mail ou nome podem aparecer em diferentes fontes públicas sem que você perceba. Faça uma busca e veja o que encontramos relacionado a você.
          </p>

          {/* 4. Campo de busca */}
          <div className="w-full space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-[0.2em]">
                Verifique sua exposição agora
              </p>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4DA3FF]/30 to-transparent rounded-[2rem] blur opacity-50 group-focus-within:opacity-100 transition duration-500" />
                <div className="relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-[#4DA3FF]/40" />
                  <input 
                    type="text"
                    placeholder="Digite um dado seu: CPF, e-mail, telefone ou nome"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full h-18 bg-[#11182D] border border-[#27314F] rounded-[1.5rem] pl-14 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 transition-all placeholder:text-[#AAB4D0]/30 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* 5. Botão CTA */}
            <Button 
              onClick={handleSearch}
              className="w-full h-18 rounded-[1.5rem] bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Escanear Minha Exposição →
            </Button>
          </div>

          {/* 6. Microcopy abaixo do botão */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-[#AAB4D0]/50 uppercase tracking-widest text-center px-4">
            <span>Consulta sobre seus próprios dados</span>
            <span className="w-1 h-1 bg-[#27314F] rounded-full" />
            <span>Fontes verificáveis</span>
            <span className="w-1 h-1 bg-[#27314F] rounded-full" />
            <span>Resultado organizado</span>
          </div>

          {/* Branding sutil de dados */}
          <div className="mt-16 pt-8 border-t border-[#27314F]/30 w-full flex flex-col items-center gap-4">
             <div className="flex gap-6 text-[10px] font-black text-[#4DA3FF]/60 uppercase tracking-[0.3em]">
                <span>CPF</span>
                <span>Telefone</span>
                <span>E-mail</span>
                <span>Nome</span>
             </div>
             <p className="text-[10px] font-bold text-[#AAB4D0]/30 uppercase tracking-widest">
               Descubra o que aparece relacionado a você.
             </p>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-10 w-full py-12 flex flex-col items-center gap-6">
        <div className="flex gap-10 opacity-20">
          <ShieldCheck className="w-5 h-5" />
          <Lock className="w-5 h-5" />
          <Eye className="w-5 h-5" />
        </div>
      </footer>
    </div>
  );
}
