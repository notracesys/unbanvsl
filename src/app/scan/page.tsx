'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type ScanStep = 'identifier' | 'consent';

export default function ScanWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<ScanStep>('identifier');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const detectedType = query.includes('@') 
    ? 'EMAIL' 
    : /^\+?[\d\s-]{8,}$/.test(query) 
    ? 'PHONE' 
    : query.length > 3 
    ? 'USERNAME' 
    : null;

  const handleNext = () => {
    if (step === 'identifier') {
      if (!query.trim()) {
        setError('Por favor, informe um dado para análise.');
        return;
      }
      setStep('consent');
    } else {
      if (!agreed) return;
      const scanId = Math.random().toString(36).substring(7);
      router.push(`/scan/${scanId}?identifier=${encodeURIComponent(query)}&type=${detectedType?.toLowerCase() || 'username'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FB] flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DA3FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <header className="px-6 py-4 border-b border-[#27314F] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-24 md:w-32 h-auto flex items-center justify-center">
            <Image 
              src="/localiza.png" 
              alt="Logo Header" 
              width={100} 
              height={100} 
              className="w-full h-auto object-contain brightness-0 invert"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className={cn("h-1 w-8 rounded-full transition-all", step === 'identifier' ? "bg-[#4DA3FF]" : "bg-[#27314F]")} />
            <div className={cn("h-1 w-8 rounded-full transition-all", step === 'consent' ? "bg-[#4DA3FF]" : "bg-[#27314F]")} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg space-y-12">
          {step === 'identifier' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-space font-bold leading-none">O que vamos analisar?</h2>
                <p className="text-[#AAB4D0]">Informe o identificador que você deseja pesquisar em fontes públicas.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAB4D0] ml-2">E-mail, Telefone ou Username</label>
                  <div className="relative group">
                    <Input 
                      placeholder="exemplo@email.com" 
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setError('');
                      }}
                      className="h-16 bg-[#11182D] border-[#27314F] rounded-2xl px-6 text-lg focus-visible:ring-[#4DA3FF]/20 text-[#F5F7FB]"
                    />
                    {detectedType && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#4DA3FF]/10 border border-[#4DA3FF]/20">
                        <span className="text-[9px] font-mono font-bold text-[#4DA3FF] tracking-widest">{detectedType}</span>
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1.5 ml-2 mt-2">
                      <AlertCircle className="w-3.5 h-3.5" /> {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAB4D0] ml-2">Nome Completo (Opcional)</label>
                  <Input 
                    placeholder="Seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-16 bg-[#11182D] border-[#27314F] rounded-2xl px-6 text-lg focus-visible:ring-[#4DA3FF]/20 text-[#F5F7FB]"
                  />
                  <p className="text-[9px] text-[#AAB4D0] ml-2 italic">Ajudar a diferenciar homônimos aumenta a precisão do scan.</p>
                </div>
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="space-y-4 text-center">
                <h2 className="text-4xl font-space font-bold leading-none">Último passo.</h2>
                <p className="text-[#AAB4D0]">Para garantir a legalidade do scan, precisamos da sua confirmação.</p>
              </div>

              <div className="bg-[#11182D] border border-[#27314F] rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id="consent" 
                    checked={agreed} 
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1 border-[#4DA3FF] data-[state=checked]:bg-[#4DA3FF]"
                  />
                  <label htmlFor="consent" className="text-sm text-[#AAB4D0] leading-relaxed cursor-pointer select-none">
                    Confirmo que estou solicitando uma análise de informações relacionadas a <span className="text-[#F5F7FB] font-bold">mim mesmo</span> e autorizo o Localiza.AI a processar temporariamente os dados fornecidos para realizar esta busca.
                  </label>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-[#27314F]">
                  <div className="w-8 h-8 rounded-full bg-[#4DA3FF]/10 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#4DA3FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1 uppercase tracking-widest text-[#4DA3FF]">Privacidade por Design</h4>
                    <p className="text-xs text-[#AAB4D0]">Seus dados não são vendidos para terceiros. O scan é realizado de forma efêmera para gerar o seu relatório de exposição.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              className="h-14 px-8 rounded-xl text-[#AAB4D0] hover:text-[#F5F7FB] hover:bg-[#11182D]"
              onClick={() => step === 'consent' ? setStep('identifier') : router.back()}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button 
              className="h-14 px-12 rounded-xl bg-[#4DA3FF] hover:bg-[#3d8be0] text-[#0B1020] font-bold shadow-2xl"
              onClick={handleNext}
              disabled={step === 'consent' && !agreed}
            >
              {step === 'consent' ? 'INICIAR ANÁLISE' : 'CONTINUAR'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
