
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setIsSubmitting(true);
    setError('');

    // Remove espaços em branco acidentais do e-mail
    const cleanEmail = email.trim();

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login failed", err.code, err.message);
      
      let friendlyMessage = 'Credenciais inválidas. Verifique o e-mail e a senha.';
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'E-mail ou senha incorretos. Verifique no Console do Firebase se o usuário existe.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
      }

      setError(friendlyMessage);
      toast({
        variant: "destructive",
        title: "Erro de Acesso",
        description: friendlyMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
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
          <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
            ACESSO <span className="text-red-600">RESTRITO</span>
          </CardTitle>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Painel Administrativo VTURB PRO</p>
        </CardHeader>
        
        <CardContent className="pb-12 px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">E-mail</Label>
              <Input 
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black border-zinc-800 h-12 rounded-xl focus:ring-red-600 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Senha</Label>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black border-zinc-800 h-12 rounded-xl focus:ring-red-600 text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-red-500 text-[11px] font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            <div className="bg-black/40 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <p className="text-[10px] text-zinc-400 font-medium">Autenticação criptografada. Apenas administradores autorizados.</p>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              Entrar no Painel
            </Button>
            
            <p className="text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
              Caso tenha esquecido sua senha, redefina-a no Console do Firebase.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
