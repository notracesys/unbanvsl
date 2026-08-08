
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SearchPage() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.length < 3) return;
    // Passamos o nome para a etapa de filtragem
    router.push(`/scan?n=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1020] relative text-[#F5F7FB] font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#4DA3FF]/10 to-transparent opacity-40" />
      </div>

      <nav className="relative z-10 w-full pt-12 pb-4 flex justify-center px-6">
        <div className="relative w-48 h-12">
          <Image 
            src="/localiza.png" 
            alt="Localiza Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center px-6 pt-8 max-w-xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161F38] border border-[#4DA3FF]/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#4DA3FF] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DA3FF]">
            Verificação de Exposição Digital
          </span>
        </div>

        {/* Headline Agressiva */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 px-2">
          Seus dados podem estar expostos na internet <br/>
          <span className="text-[#4DA3FF]">sem você saber.</span>
        </h1>

        <p className="text-lg text-[#AAB4D0] mb-10 leading-relaxed font-medium">
          O problema não é ter dados na internet. É não saber onde eles estão e quem pode vê-los.
        </p>

        <div className="w-full space-y-6">
          <div className="text-left space-y-2">
            <p className="text-[11px] font-bold text-[#4DA3FF] uppercase tracking-[0.2em] ml-4">
              Verifique sua exposição agora
            </p>
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-[#4DA3FF]/20 rounded-2xl blur-[2px] opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-[#4DA3FF]/50" />
                </div>
                <input 
                  type="text"
                  placeholder="Seu Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="w-full h-16 bg-[#0D1428] border border-[#27314F] rounded-2xl pl-16 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/40 transition-all placeholder:text-[#AAB4D0]/30 shadow-inner"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleStart}
            disabled={name.length < 3}
            className="w-full h-16 rounded-2xl bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-black text-lg uppercase tracking-wider shadow-lg active:scale-[0.98] transition-all"
          >
            DESCOBRIR MINHA EXPOSIÇÃO →
          </Button>

          <p className="text-[11px] font-bold text-[#AAB4D0]/40 uppercase tracking-[0.15em]">
            Consulta gratuita sobre seus próprios dados
          </p>
        </div>

        {/* Branding de dados */}
        <div className="mt-16 pt-8 border-t border-[#27314F]/30 w-full flex flex-col items-center gap-6">
           <div className="flex gap-6 text-[10px] font-black text-[#4DA3FF]/30 uppercase tracking-[0.3em]">
              <span>CPF</span>
              <span>Telefone</span>
              <span>E-mail</span>
              <span>Nome</span>
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-red-500/50 uppercase tracking-[0.2em]">
             <ShieldAlert className="w-3 h-3" />
             Proteja sua identidade hoje
           </div>
        </div>
      </main>
    </div>
  );
}
