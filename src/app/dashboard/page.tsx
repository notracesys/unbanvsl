
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, limit, doc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, CartesianGrid, LabelList 
} from 'recharts';
import { 
  LogOut, Save, Loader2, AlertCircle, Play, 
  CheckCircle2, Clock, Zap, Target, MousePointer2 
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
    
    let started = 0, p25 = 0, p50 = 0, p75 = 0, p90 = 0, p100 = 0, cta = 0;
    let totalWatchTime = 0;
    let reachedPitch = 0; // Pitch aos 128s
    
    const milestones = [
      { label: '0s', time: 0, count: 0 },
      { label: '30s', time: 30, count: 0 },
      { label: '60s', time: 60, count: 0 },
      { label: '90s', time: 90, count: 0 },
      { label: '120s', time: 120, count: 0 },
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
        if (wt >= 128) reachedPitch++;
      }
      
      if (m.percentage >= 25) p25++;
      if (m.percentage >= 50) p50++;
      if (m.percentage >= 75) p75++;
      if (m.percentage >= 90) p90++;
      if (m.percentage >= 100 || m.completed) p100++;
      if (m.clickedCTA) cta++;
      
      totalWatchTime += wt;
    });

    const avgWatchTime = started > 0 ? Math.floor(totalWatchTime / started) : 0;
    const pitchConversion = reachedPitch > 0 ? ((cta / reachedPitch) * 100).toFixed(1) : '0';

    return {
      total: rawMetrics.length,
      started,
      avgWatchTime,
      reachedPitchRate: started > 0 ? ((reachedPitch / started) * 100).toFixed(1) : '0',
      pitchConversion,
      ctaClicks: cta,
      retentionData: milestones,
      funnel: [
        { name: 'Plays', value: started, fill: '#18181b' },
        { name: 'Viram Pitch', value: reachedPitch, fill: '#ef4444' },
        { name: 'Clicaram CTA', value: cta, fill: '#22c55e' }
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
      .then(() => toast({ title: "Atualizado", description: "Link salvo com sucesso." }))
      .catch(() => toast({ variant: "destructive", title: "Erro", description: "Cota do Firebase excedida." }))
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
              <Zap className="text-red-600 fill-current w-6 h-6" /> VSL<span className="text-red-600">.TRACKER</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monitoramento Cirúrgico (140s)</p>
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
            <p className="text-xs font-bold uppercase text-red-500">Google Cloud: Cota Excedida. Ative o plano Blaze.</p>
          </div>
        )}

        <Tabs defaultValue="stats" className="w-full space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <TabsTrigger value="stats" className="rounded-lg font-bold text-[10px] uppercase tracking-widest px-6">Métricas</TabsTrigger>
            <TabsTrigger value="config" className="rounded-lg font-bold text-[10px] uppercase tracking-widest px-6">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard title="Tempo Médio" value={`${stats.avgWatchTime}s`} sub="Visualização" icon={<Clock className="text-red-600" />} />
                  <StatCard title="Chegaram no Pitch" value={`${stats.reachedPitchRate}%`} sub="128 segundos" icon={<Target className="text-red-600" />} />
                  <StatCard title="Cliques CTA" value={stats.ctaClicks} sub="Total de hoje" icon={<MousePointer2 className="text-green-500" />} />
                  <StatCard title="Conversão Pitch" value={`${stats.pitchConversion}%`} sub="Click/Pitch" icon={<Zap className="text-yellow-500" />} highlight />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Gráfico de Retenção por Segundos */}
                  <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Retenção Cirúrgica (Segundos)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6 pt-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.retentionData}>
                          <defs>
                            <linearGradient id="vslGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fill="url(#vslGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Funil de Pitch */}
                  <Card className="bg-zinc-900/40 border-zinc-800 rounded-3xl overflow-hidden">
                    <CardHeader className="p-6 pb-2">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Funil de Conversão</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.funnel} layout="vertical">
                          <YAxis dataKey="name" type="category" hide />
                          <XAxis type="number" hide />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ display: 'none' }} />
                          <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={50}>
                            {stats.funnel.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                            <LabelList dataKey="name" position="insideLeft" fill="#fff" style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }} />
                            <LabelList dataKey="value" position="right" fill="#fff" style={{ fontSize: 12, fontWeight: '900' }} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl bg-zinc-950/20">
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Sem dados para a data selecionada</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConfigItem 
                title="Checkout VSL" 
                desc="Link do botão principal (128s)"
                value={newCheckoutUrl} 
                setValue={setNewCheckoutUrl} 
                onSave={() => handleSave('checkoutUrl', newCheckoutUrl)}
                isSaving={isSaving}
              />
              <ConfigItem 
                title="Checkout Upsell" 
                desc="Link da página de oferta extra"
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
    <div className={`p-6 rounded-3xl border ${highlight ? 'bg-red-600 border-red-500' : 'bg-zinc-900/40 border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-black/20' : 'bg-black/40'}`}>{icon}</div>
        <span className={`text-[8px] font-black uppercase tracking-widest ${highlight ? 'text-white/60' : 'text-zinc-500'}`}>{sub}</span>
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-white/80' : 'text-zinc-500'}`}>{title}</p>
      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{value}</h3>
    </div>
  );
}

function ConfigItem({ title, desc, value, setValue, onSave, isSaving }: any) {
  return (
    <Card className="bg-zinc-900/40 border-zinc-800 rounded-3xl p-6 space-y-4">
      <div>
        <h3 className="text-sm font-black italic uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] font-medium text-zinc-500 uppercase">{desc}</p>
      </div>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        className="bg-black border-zinc-800 h-12 rounded-xl text-xs font-mono"
      />
      <Button onClick={onSave} disabled={isSaving} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black uppercase italic rounded-xl">
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar Link'}
      </Button>
    </Card>
  );
}

