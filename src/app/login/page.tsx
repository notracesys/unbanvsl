
'use client';

import React, { useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-red-600/30">
      <div className="absolute inset-0 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="pt-12 pb-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">
            ACESSO <span className="text-red-600">RESTRITO</span>
          </CardTitle>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Painel Administrativo VTURB PRO</p>
        </CardHeader>
        
        <CardContent className="pb-12 px-10">
          <div className="space-y-6">
            <div className="bg-black/40 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <p className="text-[11px] text-zinc-400 font-medium">Autenticação segura via Google Workspace para administradores autorizados.</p>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-black uppercase italic tracking-tighter rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              Entrar com Google
            </Button>
            
            <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
              Somente e-mails autorizados possuem acesso aos dados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
