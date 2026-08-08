
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Lock, Eye } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-[#0B1020] relative text-[#F5F7FB] font-sans selection:bg-[#4DA3FF]/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#4DA3FF]/10 to-transparent opacity-40" />
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: `radial-gradient(#4DA3FF 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Header / Logo */}
      <nav className="relative z-10 w-full pt-10 pb-6 flex justify-center px-6">
        <div className="relative w-48 h-12 md:w-64 md:h-16">
          <Image 
            src="/localiza.png" 
            alt="Localiza Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center px-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="w-full max-w-[420px] flex flex-col items-center text-center">
          
          {/* 1. Badge no topo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161F38] border border-[#4DA3FF]/30 mb-10 shadow-[0_0_15px_rgba(77,163,255,0.1)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DA3FF]">
              Verificação de Exposição Digital
            </span>
          </div>

          {/* 2. Headline principal */}
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight mb-6 px-2">
            Você saberia dizer onde seus <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4DA3FF] to-[#61D9FF]">
              dados estão aparecendo agora?
            </span>
          </h1>

          {/* 3. Subheadline */}
          <p className="text-[15px] text-[#AAB4D0] mb-12 leading-relaxed px-2 font-medium">
            Seu CPF, telefone, e-mail ou nome podem aparecer em fontes públicas sem você perceber. Veja o que encontramos.
          </p>

          {/* 4. Campo de busca & CTA */}
          <div className="w-full space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-[0.2em]">
                Verifique sua exposição agora
              </p>
              
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#4DA3FF]/40 to-[#4DA3FF]/10 rounded-[1.8rem] blur-[2px] opacity-70 group-focus-within:opacity-100 transition duration-500" />
                <div className="relative flex items-center">
                  <div className="absolute left-6 w-5 h-5 flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#4DA3FF]/50 group-focus-within:text-[#4DA3FF] transition-colors" />
                  </div>
                  <input 
                    type="text"
                    placeholder="CPF, e-mail, telefone ou nome"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full h-18 bg-[#0D1428] border border-[#27314F] rounded-[1.6rem] pl-16 pr-6 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/40 transition-all placeholder:text-[#AAB4D0]/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              className="w-full h-18 rounded-[1.6rem] bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(77,163,255,0.3)] active:scale-[0.98] transition-all"
            >
              ESCANEAR MINHA EXPOSIÇÃO →
            </Button>
          </div>

          {/* 5. Microcopy abaixo do botão */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] font-bold text-[#AAB4D0]/40 uppercase tracking-widest text-center px-4">
            <span>Consulta sobre seus próprios dados</span>
            <div className="w-1 h-1 bg-[#27314F] rounded-full hidden xs:block" />
            <span>Fontes verificáveis</span>
            <div className="w-1 h-1 bg-[#27314F] rounded-full hidden xs:block" />
            <span>Resultado organizado</span>
          </div>

          {/* 6. Branding de dados */}
          <div className="mt-16 pt-10 border-t border-[#27314F]/40 w-full flex flex-col items-center gap-4">
             <div className="flex gap-6 text-[10px] font-black text-[#4DA3FF]/40 uppercase tracking-[0.3em]">
                <span>CPF</span>
                <span>Telefone</span>
                <span>E-mail</span>
                <span>Nome</span>
             </div>
             <p className="text-[10px] font-bold text-[#AAB4D0]/20 uppercase tracking-[0.2em]">
               Descubra o que aparece relacionado a você.
             </p>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-10 w-full py-12 flex flex-col items-center gap-6">
        <div className="flex gap-10 opacity-20 text-[#AAB4D0]">
          <ShieldCheck className="w-5 h-5" />
          <Lock className="w-5 h-5" />
          <Eye className="w-5 h-5" />
        </div>
      </footer>

      <style jsx global>{`
        .h-18 { height: 4.5rem; }
      `}</style>
    </div>
  );
}
