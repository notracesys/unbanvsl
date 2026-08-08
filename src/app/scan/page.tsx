
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  UserSearch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

type ScanStep = 'loading' | 'filter' | 'finalizing';

export default function ScanWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('n') || '';
  
  const [step, setStep] = useState<ScanStep>('loading');
  const [progress, setProgress] = useState(0);
  const [homonyms, setHomonyms] = useState(0);

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setHomonyms(Math.floor(Math.random() * 5) + 3); // Entre 3 e 7 homônimos
              setStep('filter');
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFilter = (ageRange: string) => {
    setStep('finalizing');
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 4;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        // O redirecionamento ocorre fora do setProgress para evitar erro de ciclo de vida do React
        const scanId = Math.random().toString(36).substring(7);
        router.push(`/scan/${scanId}?q=${encodeURIComponent(name)}&age=${ageRange}`);
      } else {
        setProgress(currentProgress);
      }
    }, 40);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DA3FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-lg space-y-10 relative z-10 text-center">
        
        {step === 'loading' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative w-48 h-12 mx-auto mb-8">
              <Image src="/localiza.png" alt="Localiza Logo" fill className="object-contain" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Rastreando bases de dados...</h2>
              <p className="text-[#AAB4D0] text-sm">Buscando ocorrências para: <span className="text-white font-bold">{name}</span></p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-[#161F38]" />
              <div className="flex justify-between text-[10px] font-bold text-[#4DA3FF] uppercase tracking-widest">
                <span>{progress}%</span>
                <span>Analisando registros públicos</span>
              </div>
            </div>
          </div>
        )}

        {step === 'filter' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#4DA3FF]/10 rounded-full flex items-center justify-center mx-auto border border-[#4DA3FF]/20">
              <UserSearch className="w-10 h-10 text-[#4DA3FF]" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold leading-tight">
                Encontramos {homonyms} pessoas <br/> com o mesmo nome.
              </h2>
              <p className="text-[#AAB4D0] text-sm leading-relaxed">
                Identificamos vários registros para <span className="text-white font-bold">{name}</span>. 
                Para garantir que estamos analisando os seus dados reais, selecione sua faixa etária:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {['20-35 anos', '36-50 anos', '51-65 anos', 'Acima de 65 anos'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilter(range)}
                  className="w-full h-14 bg-[#11182D] border border-[#27314F] hover:border-[#4DA3FF]/50 hover:bg-[#161F38] rounded-xl font-bold text-sm transition-all flex items-center justify-between px-6 group"
                >
                  {range}
                  <ArrowRight className="w-4 h-4 text-[#4DA3FF] opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#AAB4D0]/40 uppercase tracking-widest pt-4">
              <Lock className="w-3 h-3" />
              Sua privacidade é nossa prioridade
            </div>
          </div>
        )}

        {step === 'finalizing' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-500 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Perfil Localizado</span>
              </div>
              <h2 className="text-2xl font-bold">Identificando dados expostos...</h2>
              <p className="text-[#AAB4D0] text-sm">Cruzando informações sensíveis para seu CPF e registros públicos.</p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-[#161F38]" />
              <div className="flex justify-center items-center gap-3 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                <AlertTriangle className="w-3 h-3" />
                <span>Alerta: Exposição detectada em {progress > 40 ? '2' : '0'} fontes</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
