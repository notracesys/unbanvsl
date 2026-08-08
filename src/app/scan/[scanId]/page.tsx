
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MoreVertical, 
  Settings,
  Grid,
  Lock,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { performScan, type PerformScanOutput } from '@/ai/flows/perform-scan-flow';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function GoogleScanResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const age = searchParams.get('age') || '';
  
  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState<PerformScanOutput | null>(null);

  useEffect(() => {
    const runScan = async () => {
      try {
        const result = await performScan({ query: `${query}, idade ${age}` });
        setScanData(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    runScan();
  }, [query, age]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-10 bg-[#303134] rounded-full" />
          <p className="text-[#969ba1] text-sm">Gerando relatório de inteligência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#e8eaed] font-sans selection:bg-[#4DA3FF]/30">
      {/* Header Estilo Google */}
      <header className="sticky top-0 z-50 bg-[#171717] border-b border-[#3c4043] md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex items-center w-full md:w-auto px-4 md:px-0">
             <div className="relative w-28 h-8 cursor-pointer" onClick={() => window.location.href = '/'}>
                <Image src="/localiza.png" alt="Localiza Logo" fill className="object-contain" />
             </div>
             <div className="md:hidden ml-auto flex gap-4">
                <Grid className="w-5 h-5 text-[#bdc1c6]" />
                <div className="w-8 h-8 rounded-full bg-[#4DA3FF] flex items-center justify-center text-[#171717] font-bold text-xs">U</div>
             </div>
          </div>

          <div className="w-full max-w-[692px] px-4 md:px-0">
            <div className="group relative flex items-center w-full h-11 bg-[#303134] rounded-full">
              <input 
                type="text" 
                defaultValue={query} 
                className="w-full bg-transparent pl-5 pr-12 text-sm focus:outline-none"
                readOnly
              />
              <div className="absolute right-4">
                <Search className="w-5 h-5 text-[#4DA3FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Estilo Google */}
        <div className="flex items-center gap-4 md:ml-[164px] mt-4 px-4 md:px-0 overflow-x-auto no-scrollbar text-sm text-[#bdc1c6]">
          <div className="flex items-center gap-1 pb-3 border-b-[3px] border-[#4DA3FF] text-[#4DA3FF] font-medium whitespace-nowrap">
            <Search className="w-4 h-4" /> Todas as Ocorrências
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Dados Sensíveis
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Vazamentos
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:pl-[164px] py-4 space-y-8 pb-32">
        <p className="text-sm text-[#969ba1]">
          Aproximadamente {scanData?.findingsCount} ocorrências identificadas para {query}
        </p>

        {/* AI Overview Section */}
        <div className="bg-[#1e1f24] border border-[#3c4043] rounded-[24px] p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">URGENTE: ALERTA DE EXPOSIÇÃO</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium leading-relaxed">
              O sistema Localiza.AI identificou riscos críticos para o seu perfil:
            </h3>
            <div className="text-[#e8eaed] leading-relaxed text-[16px] whitespace-pre-wrap">
              {scanData?.aiOverview}
            </div>
            <div className="flex items-center gap-2 text-green-500 text-xs pt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Registros confirmados via inteligência artificial
            </div>
          </div>
        </div>

        {/* Resultados Principais */}
        <div className="space-y-8 max-w-[652px]">
          {scanData?.results.map((result, index) => (
            <div key={index} className="group space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-2">
                <div className="text-[12px] text-[#bdc1c6] leading-tight">
                  {result.source}
                </div>
              </div>
              <h3 className={cn(
                "text-xl cursor-pointer hover:underline transition-colors",
                result.isSensitive ? "text-red-400 font-bold" : "text-[#8ab4f8]"
              )}>
                {result.isSensitive && <ShieldAlert className="w-4 h-4 inline mr-2" />}
                {result.title}
              </h3>
              <p className="text-sm text-[#bdc1c6] leading-relaxed">
                {result.snippet}
              </p>
              {result.isSensitive && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" /> Registro Sensível Detectado
                </div>
              )}
            </div>
          ))}

          {/* Call to Action Final - O foco da venda */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#1e1f24] to-[#111] border-[2px] border-[#4DA3FF]/30 rounded-[32px] space-y-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/5 blur-3xl rounded-full" />
            
            <div className="w-16 h-16 rounded-2xl bg-[#4DA3FF]/10 flex items-center justify-center mx-auto border border-[#4DA3FF]/20">
              <Lock className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Relatório Completo de Exposição</h3>
              <p className="text-[#969ba1] text-sm max-w-sm mx-auto">
                Localizamos dados sensíveis vinculados ao seu nome. Obtenha o dossiê completo e saiba como solicitar a remoção dessas fontes.
              </p>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-[#969ba1] line-through">De R$ 57,00</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-[10px] text-[#4DA3FF] font-black uppercase">HOJE</span>
                   <span className="text-4xl font-bold text-white">R$ 19,90</span>
                </div>
              </div>
              <Button className="w-full h-16 bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#171717] font-black text-lg rounded-2xl shadow-xl shadow-blue-500/10 group">
                REMOVER MEUS DADOS AGORA →
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-[#969ba1]/50 uppercase tracking-widest pt-4">
              <span>Acesso Imediato</span>
              <span>•</span>
              <span>100% Seguro</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#171717] border-t border-[#3c4043] px-8 py-8 text-sm text-[#969ba1]">
        <div className="max-w-[1200px] mx-auto md:pl-[164px] flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-wrap gap-8">
            <span className="cursor-pointer hover:underline">Políticas de Privacidade</span>
            <span className="cursor-pointer hover:underline">Termos de Uso</span>
            <span className="cursor-pointer hover:underline">Contato</span>
          </div>
          <p>© 2024 Localiza.AI Intelligence Systems</p>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
