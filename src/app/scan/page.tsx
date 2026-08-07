
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Lock, 
  AlertCircle,
  Activity,
  User,
  Mail,
  Phone,
  Terminal as TerminalIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

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
      // Iniciar o scan e redirecionar para a tela de animação
      // Aqui simularíamos a criação de um scanId no Firestore
      const scanId = Math.random().toString(36).substring(7);
      router.push(`/scan/${scanId}?identifier=${encodeURIComponent(query)}&type=${detectedType?.toLowerCase() || 'username'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* FX */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="scanline" />

      <header className="px-6 py-8 border-b border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-background" />
          </div>
          <span className="font-heading-cyber font-bold tracking-tighter">Localiza<span className="text-primary">.AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className={cn("h-1 w-8 rounded-full transition-all", step === 'identifier' ? "bg-primary" : "bg-primary/20")} />
            <div className={cn("h-1 w-8 rounded-full transition-all", step === 'consent' ? "bg-primary" : "bg-primary/20")} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg space-y-12">
          {step === 'identifier' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <h2 className="text-4xl font-heading-cyber font-bold leading-none">O que vamos analisar?</h2>
                <p className="text-muted-foreground">Informe o identificador que você deseja pesquisar em fontes públicas.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">E-mail, Telefone ou Username</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity" />
                    <Input 
                      placeholder="exemplo@email.com" 
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setError('');
                      }}
                      className="h-16 bg-white/[0.02] border-white/10 rounded-2xl px-6 text-lg focus-visible:ring-primary/20"
                    />
                    {detectedType && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                        <span className="text-[9px] font-mono-tech font-bold text-primary tracking-widest">{detectedType}</span>
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 ml-2 mt-2">
                      <AlertCircle className="w-3.5 h-3.5" /> {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Nome Completo (Opcional)</label>
                  <Input 
                    placeholder="Seu nome completo" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-16 bg-white/[0.02] border-white/10 rounded-2xl px-6 text-lg focus-visible:ring-primary/20"
                  />
                  <p className="text-[9px] text-muted-foreground ml-2 italic">Ajudar a diferenciar homônimos aumenta a precisão do scan.</p>
                </div>
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="space-y-4">
                <h2 className="text-4xl font-heading-cyber font-bold leading-none">Último passo.</h2>
                <p className="text-muted-foreground">Para garantir a legalidade do scan, precisamos da sua confirmação.</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    id="consent" 
                    checked={agreed} 
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1 border-primary data-[state=checked]:bg-primary"
                  />
                  <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none">
                    Confirmo que estou solicitando uma análise de informações relacionadas a <span className="text-foreground font-bold">mim mesmo</span> e autorizo o Localiza.AI a processar temporariamente os dados fornecidos para realizar esta busca.
                  </label>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1 uppercase tracking-widest text-primary">Privacidade por Design</h4>
                    <p className="text-xs text-muted-foreground">Seus dados não são vendidos para terceiros. O scan é realizado de forma efêmera para gerar o seu relatório de exposição.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              className="h-14 px-8 rounded-xl text-muted-foreground hover:text-foreground"
              onClick={() => step === 'consent' ? setStep('identifier') : router.back()}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button 
              className="h-14 px-12 rounded-xl bg-primary hover:bg-primary-strong text-background font-bold shadow-2xl glow-primary"
              onClick={handleNext}
              disabled={step === 'consent' && !agreed}
            >
              {step === 'consent' ? 'INICIAR ANÁLISE' : 'CONTINUAR'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] relative z-10">
        Localiza.AI // Secure Intelligence Protocol
      </footer>
    </div>
  );
}
