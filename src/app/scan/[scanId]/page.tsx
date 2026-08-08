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
  const query = searchParams.get('q') || searchParams.get('identifier') || '';
  
  const [loading, setLoading] = useState(true);
  const [scanData, setScanData] = useState<PerformScanOutput | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const runScan = async () => {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 1 : prev));
      }, 50);

      try {
        const result = await performScan({ query });
        setScanData(result);
        setProgress(100);
        setTimeout(() => setLoading(false), 800);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
      return () => clearInterval(interval);
    };
    runScan();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative w-48 h-12 mx-auto mb-8">
            <Image src="/localiza.png" alt="Localiza Logo" fill className="object-contain" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Rastreando pegada digital...</h2>
            <p className="text-[#AAB4D0] text-sm">Consultando fontes governamentais, redes sociais e bancos de dados públicos.</p>
          </div>
          <div className="relative h-1 w-full bg-[#161F38] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4DA3FF] transition-all duration-300 shadow-[0_0_15px_rgba(77,163,255,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-[#AAB4D0]/40 uppercase tracking-widest">
            <div className="flex items-center gap-2 justify-center">
              <div className={cn("w-1.5 h-1.5 rounded-full", progress > 30 ? "bg-green-500" : "bg-[#27314F]")} />
              Protocolos de Rede
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className={cn("w-1.5 h-1.5 rounded-full", progress > 60 ? "bg-green-500" : "bg-[#27314F]")} />
              Deep Web Scraper
            </div>
          </div>
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
            <div className="group relative flex items-center w-full h-11 bg-[#303134] hover:bg-[#3c4043] border border-transparent focus-within:bg-[#303134] focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] rounded-full transition-all">
              <input 
                type="text" 
                defaultValue={query} 
                className="w-full bg-transparent pl-5 pr-12 text-sm focus:outline-none"
              />
              <div className="absolute right-4 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#4DA3FF]" />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            <Settings className="w-5 h-5 text-[#bdc1c6]" />
            <Grid className="w-5 h-5 text-[#bdc1c6]" />
            <div className="w-8 h-8 rounded-full bg-[#4DA3FF] flex items-center justify-center text-[#171717] font-bold text-sm shadow-lg">U</div>
          </div>
        </div>

        {/* Tabs Estilo Google */}
        <div className="flex items-center gap-4 md:ml-[164px] mt-4 px-4 md:px-0 overflow-x-auto no-scrollbar text-sm text-[#bdc1c6]">
          <div className="flex items-center gap-1 pb-3 border-b-[3px] border-[#4DA3FF] text-[#4DA3FF] font-medium whitespace-nowrap">
            <Search className="w-4 h-4" /> Todas
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Texto
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Documentos
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Registros
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            Vazamentos
          </div>
          <div className="flex items-center gap-1 pb-3 hover:text-white cursor-pointer whitespace-nowrap">
            <MoreVertical className="w-4 h-4" /> Mais
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:pl-[164px] py-4 space-y-8 pb-32">
        <p className="text-sm text-[#969ba1]">
          Aproximadamente {scanData?.findingsCount} resultados encontrados (0,48 segundos)
        </p>

        {/* AI Overview Section */}
        <div className="bg-[#1e1f24] border border-[#3c4043] rounded-[24px] p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-2 text-[#4DA3FF]">
            <div className="w-5 h-5 bg-[#4DA3FF] rounded-full flex items-center justify-center">
               <ShieldAlert className="w-3 h-3 text-[#171717]" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">AI Overview // Localiza.AI</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium leading-relaxed">
              Resumo da exposição detectada para <span className="text-[#4DA3FF]">{query}</span>:
            </h3>
            <div className="text-[#e8eaed] leading-relaxed text-[16px] whitespace-pre-wrap">
              {scanData?.aiOverview}
            </div>
            <div className="flex items-center gap-2 text-[#9aa0a6] text-xs pt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Fontes verificadas em tempo real
              <span className="mx-2">•</span>
              <span className="cursor-pointer hover:underline flex items-center gap-1">Show more <ChevronDown className="w-3 h-3" /></span>
            </div>
          </div>
        </div>

        {/* Resultados Principais (Apenas Texto) */}
        <div className="space-y-8 max-w-[652px]">
          {scanData?.results.map((result, index) => (
            <div key={index} className="group space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center border border-[#3c4043]">
                  <GlobeIcon className="w-4 h-4 text-[#bdc1c6]" />
                </div>
                <div>
                  <div className="text-[12px] text-[#bdc1c6] leading-tight flex items-center gap-1">
                    {result.source}
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div className="text-[12px] text-[#bdc1c6] leading-tight truncate max-w-[200px] md:max-w-none">
                    {result.url}
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-[#bdc1c6] ml-auto opacity-0 group-hover:opacity-100 cursor-pointer" />
              </div>
              <h3 className={cn(
                "text-xl cursor-pointer hover:underline transition-colors",
                result.isSensitive ? "text-[#ff6b6b] font-bold" : "text-[#8ab4f8]"
              )}>
                {result.isSensitive && <ShieldAlert className="w-4 h-4 inline mr-2 align-text-bottom" />}
                {result.title}
              </h3>
              <p className="text-sm text-[#bdc1c6] leading-relaxed">
                {result.snippet}
              </p>
              {result.isSensitive && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-lg text-[10px] font-bold text-[#ff6b6b] uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3" /> Dado Sensível Detectado
                </div>
              )}
            </div>
          ))}

          {/* Call to Action Final */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#1e1f24] to-[#171717] border-[2px] border-[#4DA3FF]/20 rounded-[32px] space-y-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/5 blur-3xl rounded-full" />
            
            <div className="w-16 h-16 rounded-2xl bg-[#4DA3FF]/10 flex items-center justify-center mx-auto border border-[#4DA3FF]/20">
              <Lock className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Relatório de Inteligência Completo</h3>
              <p className="text-[#969ba1] text-sm max-w-sm mx-auto">
                Desbloqueie os detalhes de todas as fontes sensíveis e receba o guia de remoção de dados.
              </p>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-[#969ba1] line-through">R$ 57,00</span>
                <span className="text-3xl font-bold text-white">R$ 19,90</span>
              </div>
              <Button className="w-full h-14 bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#171717] font-bold text-md rounded-2xl shadow-xl shadow-blue-500/10 group">
                DESBLOQUEAR TUDO AGORA <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-[#969ba1]/50 uppercase tracking-widest pt-4">
              <span>Acesso Vitalício</span>
              <span>•</span>
              <span>Download PDF</span>
              <span>•</span>
              <span>100% Seguro</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Estilo Google */}
      <footer className="bg-[#171717] border-t border-[#3c4043] px-8 py-4 text-sm text-[#969ba1]">
        <div className="max-w-[1200px] mx-auto md:pl-[164px] flex flex-wrap gap-x-8 gap-y-4">
          <span className="cursor-pointer hover:underline">Ajuda</span>
          <span className="cursor-pointer hover:underline">Privacidade</span>
          <span className="cursor-pointer hover:underline">Termos</span>
          <span className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" /> Localiza.AI Intelligence Server 04
          </span>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
