'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  BarChart3, 
  Search, 
  Database,
  ArrowRight,
  Unlock,
  Activity,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type ScanStatus = 'processing' | 'result';

export default function ScanResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [status, setStatus] = useState<ScanStatus>('processing');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Interpretando consulta",
    "Pesquisando fontes públicas",
    "Validando ocorrências",
    "Correlacionando resultados",
    "Eliminando duplicatas",
    "Gerando análise final"
  ];

  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus('result'), 500);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);

      const stepInterval = setInterval(() => {
        setStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(stepInterval);
      };
    }
  }, [status]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 atlas-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4DA3FF]/5 blur-[100px] rounded-full" />

        <div className="w-full max-w-lg space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-space font-bold">Processando sua consulta</h1>
            <p className="text-[#AAB4D0]">Analisando fontes públicas e correlacionando ocorrências para {query}.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-[#AAB4D0] uppercase tracking-widest">
                <span>{steps[stepIndex]}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-[#161F38]" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {steps.map((step, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                    i < stepIndex ? "bg-[#161F38]/50 border-green-500/20 text-[#F5F7FB]" :
                    i === stepIndex ? "bg-[#161F38] border-[#4DA3FF]/30 text-[#4DA3FF] shadow-lg shadow-blue-500/5" :
                    "opacity-30 border-transparent text-[#AAB4D0]"
                  )}
                >
                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                   i === stepIndex ? <Loader2 className="w-4 h-4 animate-spin" /> :
                   <div className="w-4 h-4 rounded-full border border-current opacity-20" />}
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FB] p-6 lg:p-12 relative">
      <div className="absolute inset-0 atlas-grid opacity-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#27314F] pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Análise Concluída</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-space font-bold tracking-tight">Relatório de Inteligência</h1>
            <p className="text-[#AAB4D0]">Ocorrências públicas localizadas para: <span className="text-[#F5F7FB] font-semibold">{query}</span></p>
          </div>
          <div className="flex gap-4">
            <div className="glass-morphism px-6 py-4 rounded-2xl border-none">
              <p className="text-[10px] font-bold text-[#AAB4D0] uppercase tracking-widest mb-1">Score de Exposição</p>
              <p className="text-3xl font-space font-bold text-[#4DA3FF]">64<span className="text-sm opacity-50">/100</span></p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Ocorrências', value: '14', icon: Search },
            { label: 'Fontes Analisadas', value: '2.4k', icon: Database },
            { label: 'Confiança', value: 'Alta', icon: ShieldCheck },
            { label: 'Status', value: 'Público', icon: Activity }
          ].map((item, i) => (
            <div key={i} className="glass-morphism p-6 rounded-2xl space-y-3">
              <item.icon className="w-5 h-5 text-[#4DA3FF]" />
              <div>
                <p className="text-[10px] font-bold text-[#AAB4D0] uppercase tracking-widest">{item.label}</p>
                <p className="text-2xl font-space font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-space font-bold flex items-center gap-2">
              <Network className="w-5 h-5 text-[#4DA3FF]" />
              Resultados de Verificação
            </h2>
            
            <div className="space-y-4">
              {[
                { type: 'Cadastro Digital', source: 'linkedin.com', risk: 'Moderado', date: 'Há 2 dias' },
                { type: 'Registro Comercial', source: 'gov.br/receita', risk: 'Baixo', date: 'Há 5 meses' },
                { type: 'Mencao Pública', source: 'jusbrasil.com.br', risk: 'Alta', date: 'Há 1 ano' }
              ].map((res, i) => (
                <div key={i} className="glass-morphism p-6 rounded-2xl flex items-center justify-between group hover:border-[#4DA3FF]/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#161F38] flex items-center justify-center text-[#AAB4D0]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{res.type}</p>
                      <p className="text-xs text-[#AAB4D0]">{res.source} • {res.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[#4DA3FF] text-xs font-bold gap-2">
                    VER <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              <div className="p-12 border-2 border-dashed border-[#27314F] rounded-[2.5rem] flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-transparent to-[#161F38]/20">
                <div className="w-16 h-16 rounded-full bg-[#161F38] flex items-center justify-center">
                  <Unlock className="w-8 h-8 text-[#7C6CFF]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-space font-bold">Relatório Completo Atlas.AI</h3>
                  <p className="text-sm text-[#AAB4D0] max-w-sm">Desbloqueie os detalhes de todas as 14 fontes localizadas e receba a análise estruturada completa.</p>
                </div>
                <div className="space-y-4 w-full max-w-xs">
                   <div className="flex justify-between items-end pb-2">
                      <span className="text-[10px] font-bold text-[#AAB4D0] uppercase tracking-widest">Acesso vitalício</span>
                      <p className="text-3xl font-space font-bold">R$ 19,90</p>
                   </div>
                   <Button className="w-full h-14 bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-bold rounded-xl shadow-lg shadow-blue-500/10">
                     DESBLOQUEAR RELATÓRIO
                   </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <h2 className="text-xl font-space font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4DA3FF]" />
              Insights de Exposição
            </h2>
            <div className="glass-morphism p-8 rounded-[2.5rem] space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#AAB4D0] uppercase tracking-widest">Distribuição por Categoria</p>
                <div className="space-y-3">
                  {[
                    { label: 'Profissional', p: 40, c: 'bg-[#4DA3FF]' },
                    { label: 'Jurídico', p: 25, c: 'bg-[#7C6CFF]' },
                    { label: 'Social', p: 35, c: 'bg-[#61D9FF]' }
                  ].map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{cat.label}</span>
                        <span>{cat.p}%</span>
                      </div>
                      <div className="h-1 w-full bg-[#161F38] rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", cat.c)} style={{ width: `${cat.p}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-[#27314F]">
                <p className="text-sm italic text-[#AAB4D0] leading-relaxed">
                  "O volume de dados correlacionados sugere uma presença digital estruturada, porém com pontos de exposição em registros antigos que podem ser remediados."
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
