
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, limit, doc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  LogOut, Loader2, AlertCircle, Play, 
  Zap, Target, MousePointer2, TrendingDown, Users, Flame, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VSLAnalyticsDashboard() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newCheckoutUrl, setNewCheckoutUrl] = useState('');
  const [newUpsellUrl, setNewUpsellUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setSelectedDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  }, []);

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig, error: configError } = useDoc(configRef);

  useEffect(() => {
    if (appConfig?.checkoutUrl) setNewCheckoutUrl(appConfig.checkoutUrl);
    if (appConfig?.upsellCheckoutUrl) setNewUpsellUrl(appConfig.upsellCheckoutUrl);
  }, [appConfig]);

  const metricsQuery = useMemo(() => {
    if (!firestore || !selectedDate) return null;
    return query(collection(firestore, 'metrics'), where('dateStr', '==', selectedDate), limit(1000));
  }, [firestore, selectedDate]);

  const { data: rawMetrics, loading: metricsLoading, error: metricsError } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!rawMetrics || rawMetrics.length === 0) return null;
    
    let started = 0, cta = 0, reachedPitch = 0;
    
    const milestones = [
      { label: '0s', time: 0, count: 0 },
      { label: '30s', time: 30, count: 0 },
      { label: '60s', time: 60, count: 0 },
      { label: '90s', time: 90, count: 0 },
      { label: 'PITCH', time: 128, count: 0 },
      { label: 'FIM', time: 140, count: 0 }
    ];

    rawMetrics.forEach((m: any) => {
      const wt = m.watchTime || 0;
      if (m.started) {
        started++;
        milestones.forEach(milestone => {
          if (wt >= milestone.time) milestone.count++;
        });
        if (wt >= 128 || m.reachedPitch) reachedPitch++;
      }
      if (m.clickedCTA) cta++;
    });

    const playToPitch = started > 0 ? ((reachedPitch / started) * 100).toFixed(1) : '0';
    const pitchToCta = reachedPitch > 0 ? ((cta / reachedPitch) * 100).toFixed(1) : '0';
    const globalConv = started > 0 ? ((cta / started) * 100).toFixed(2) : '0';

    return {
      started,
      reachedPitch,
      ctaClicks: cta,
      playToPitch,
      pitchToCta,
      globalConv,
      retentionData: milestones,
      funnel: [
        { label: 'Total Plays', value: started, fill: '#18181b' },
        { label: 'Viram a Oferta', value: reachedPitch, fill: '#ef4444' },
        { label: 'Clicaram no Botão', value: cta, fill: '#22c55e' }
      ]
    };
  }, [rawMetrics]);

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push('/login'); }
  };

  const handleSave = (field: 'checkoutUrl' | 'upsellCheckoutUrl', value: string) => {
    if (!firestore || !configRef) return;
    setIsSaving(true);
    setDoc(configRef, { [field]: value, updatedAt: serverTimestamp() }, { merge: true })
      .then(() => toast({ title: "Sucesso", description: "Link atualizado no banco de dados." }))
      .catch((e) => {
        toast({ variant: "destructive", title: "Erro de Permissão", description: "Cota do Google Cloud excedida ou sem permissão." });
      })
      .finally(() => setIsSaving(false));
  };

  if (!mounted || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>;
  if (!user) return null;

  const isQuotaExceeded = metricsError?.message?.includes('quota') || configError?.message?.includes('quota');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-red-600/30">
      <div className="max-w-[1200px] mx-auto p-4 lg:p-8 space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-8 gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <Zap className="text-red-600 fill-current w-6 h-6" /> VSL<span className="text-red-600">.METRICS</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monitoramento Profissional (Pitch 128s)</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:border-red-600/50"
            />
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl text-zinc-500 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {isQuotaExceeded && (
          <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-xs font-bold uppercase text-red-500">Atenção: Cota de Leitura do Firebase Excedida. Dados podem estar desatualizados.</p>
          </div>
        )}

        <Tabs defaultValue="stats" className="w-full space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <TabsTrigger value="stats" className="rounded-lg font-bold text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-red-600">Desempenho</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg font-bold text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-red-600">Checkout</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard title="Total Plays" value={stats.started} sub="Leads Únicos" icon={<Play className="text-zinc-500" />} />
                  <StatCard title="Play to Pitch" value={`${stats.playToPitch}%`} sub="Retenção até Oferta" icon={<Target className="text-orange-500" />} />
                  <StatCard title="Cliques CTA" value={stats.ctaClicks} sub="Botão de Compra" icon={<MousePointer2 className="text-green-500" />} />
                  <StatCard title="Conversão Pitch" value={`${stats.pitchToCta}%`} sub="Poder da Oferta" icon={<Zap className="text-yellow-500" />} highlight />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Gráfico de Retenção */}
                  <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Curva de Retenção Acumulada</CardTitle>
                      <span className="text-[8px] font-black bg-red-600/20 text-red-500 px-2 py-1 rounded">OFERTA AOS 128S</span>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.retentionData}>
                          <defs>
                            <linearGradient id="vslGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#ef4444', fontWeight: '900', marginBottom: '4px' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fill="url(#vslGradient)" animationDuration={1000} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Funil de Drop-off Cirúrgico */}
                  <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <CardHeader className="p-8 pb-2">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Eficiência do Funil</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-8 space-y-8">
                      {stats.funnel.map((step, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{step.label}</span>
                            <span className="text-xl font-black italic">{step.value}</span>
                          </div>
                          <div className="h-4 bg-black rounded-full overflow-hidden border border-zinc-800 relative">
                            <div 
                              className="h-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${(step.value / stats.started) * 100}%`,
                                backgroundColor: step.fill 
                              }}
                            />
                          </div>
                          {i > 0 && (
                            <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-600 uppercase">
                              <TrendingDown className="w-3 h-3 text-red-600" />
                              <span>{((step.value / stats.funnel[i-1].value) * 100).toFixed(1)}% chegaram aqui da etapa anterior</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="mt-8 p-6 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl text-center">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Conversão Global (Play -> CTA)</p>
                        <p className="text-3xl font-black italic text-green-500">{stats.globalConv}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[3rem] bg-zinc-950/20">
                <Users className="w-12 h-12 text-zinc-800 mb-4" />
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Aguardando dados de visualização para hoje...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConfigCard 
                title="Checkout Principal" 
                desc="Aparece aos 128s da VSL"
                value={newCheckoutUrl} 
                setValue={setNewCheckoutUrl} 
                onSave={() => handleSave('checkoutUrl', newCheckoutUrl)}
                isSaving={isSaving}
              />
              <ConfigCard 
                title="Checkout Upsell" 
                desc="Página após a compra principal"
                value={newUpsellUrl} 
                setValue={setNewUpsellUrl} 
                onSave={() => handleSave('upsellCheckoutUrl', newUpsellUrl)}
                isSaving={isSaving}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, highlight = false }: any) {
  return (
    <div className={`p-6 rounded-[2.2rem] border transition-all hover:scale-[1.02] ${highlight ? 'bg-red-600 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.25)]' : 'bg-zinc-900/40 border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${highlight ? 'bg-black/20' : 'bg-black/40'}`}>{icon}</div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${highlight ? 'text-white/60' : 'text-zinc-500'}`}>{sub}</span>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-white/80' : 'text-zinc-500'}`}>{title}</p>
      <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{value}</h3>
    </div>
  );
}

function ConfigCard({ title, desc, value, setValue, onSave, isSaving }: any) {
  return (
    <Card className="bg-zinc-900/40 border-zinc-800 rounded-[2.5rem] p-10 space-y-6 shadow-xl">
      <div>
        <h3 className="text-base font-black italic uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{desc}</p>
      </div>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        className="bg-black border-zinc-800 h-16 rounded-2xl text-xs font-mono focus:ring-red-600"
      />
      <Button 
        onClick={onSave} 
        disabled={isSaving} 
        className="w-full h-16 bg-white text-black hover:bg-zinc-200 font-black uppercase italic rounded-2xl transition-all"
      >
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Link'}
      </Button>
    </Card>
  );
}
