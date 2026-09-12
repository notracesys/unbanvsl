
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, limit, doc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, AreaChart, Area, CartesianGrid } from 'recharts';
import { LogOut, Save, Loader2, AlertCircle, Users, Play, CheckCircle2, Activity, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdvancedAnalyticsDashboard() {
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
    return query(collection(firestore, 'metrics'), where('dateStr', '==', selectedDate), limit(500));
  }, [firestore, selectedDate]);

  const { data: rawMetrics, loading: metricsLoading, error: metricsError } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!rawMetrics || rawMetrics.length === 0) return null;
    let started = 0, p25 = 0, p50 = 0, p75 = 0, p90 = 0, p100 = 0, cta = 0;
    
    rawMetrics.forEach((m: any) => {
      if (m.started) started++;
      if (m.percentage >= 25) p25++;
      if (m.percentage >= 50) p50++;
      if (m.percentage >= 75) p75++;
      if (m.percentage >= 90) p90++;
      if (m.percentage >= 100 || m.completed) p100++;
      if (m.clickedCTA) cta++;
    });

    return {
      total: rawMetrics.length,
      started,
      playRate: ((started / rawMetrics.length) * 100).toFixed(1),
      retention: started > 0 ? ((p90 / started) * 100).toFixed(1) : '0',
      conv: ((cta / rawMetrics.length) * 100).toFixed(1),
      funnel: [
        { name: 'Visitas', value: rawMetrics.length, fill: '#27272a' },
        { name: 'Plays', value: started, fill: '#52525b' },
        { name: 'Checkout', value: cta, fill: '#22c55e' }
      ],
      retentionCurve: [
        { name: 'Início', value: started },
        { name: '25%', value: p25 },
        { name: '50%', value: p50 },
        { name: '75%', value: p75 },
        { name: '90%', value: p90 },
        { name: '100%', value: p100 },
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
      .then(() => toast({ title: "Sucesso", description: "Configuração salva." }))
      .catch(() => toast({ variant: "destructive", title: "Erro", description: "Cota excedida ou sem permissão." }))
      .finally(() => setIsSaving(false));
  };

  if (!mounted || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>;
  if (!user) return null;

  const isQuotaExceeded = metricsError?.message?.includes('quota') || configError?.message?.includes('quota');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between border-b border-zinc-900 pb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">VTURB <span className="text-red-600">ANALYTICS</span></h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Painel de Controle Estratégico</p>
          </div>
          <div className="flex gap-3">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="bg-zinc-900 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-zinc-800"
            />
            <Button variant="destructive" onClick={handleLogout} className="rounded-xl font-bold uppercase italic">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </header>

        {isQuotaExceeded && (
          <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-3xl flex items-center gap-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <div>
              <p className="font-black uppercase italic text-red-600">Cota do Firebase Esgotada</p>
              <p className="text-zinc-400 text-sm">O Google bloqueou as leituras por hoje. Upgrade para o plano Blaze é recomendado para tráfego real.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem]">
            <CardHeader><CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Checkout Principal</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                value={newCheckoutUrl} 
                onChange={(e) => setNewCheckoutUrl(e.target.value)} 
                className="bg-black border-zinc-800 rounded-xl"
              />
              <Button 
                onClick={() => handleSave('checkoutUrl', newCheckoutUrl)} 
                disabled={isSaving} 
                className="bg-green-600 h-10 px-4 rounded-xl"
              >
                <Save className="w-4 h-4"/>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem]">
            <CardHeader><CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Checkout Upsell</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                value={newUpsellUrl} 
                onChange={(e) => setNewUpsellUrl(e.target.value)} 
                className="bg-black border-zinc-800 rounded-xl"
              />
              <Button 
                onClick={() => handleSave('upsellCheckoutUrl', newUpsellUrl)} 
                disabled={isSaving} 
                className="bg-orange-600 h-10 px-4 rounded-xl"
              >
                <Save className="w-4 h-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>

        {stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users className="w-4 h-4 text-blue-500" />} label="Visitas Totais" value={stats.total} />
              <StatCard icon={<Play className="w-4 h-4 text-zinc-100" />} label="Taxa de Play" value={`${stats.playRate}%`} />
              <StatCard icon={<Activity className="w-4 h-4 text-red-500" />} label="Retenção 90%" value={`${stats.retention}%`} />
              <StatCard icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} label="Conversão Final" value={`${stats.conv}%`} highlight />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 bg-zinc-900/30 border-zinc-800 rounded-[2rem] h-[400px]">
                <CardHeader><CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Funil de Vendas</CardTitle></CardHeader>
                <CardContent className="h-full pb-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.funnel} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                        {stats.funnel.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                        <LabelList dataKey="value" position="right" fill="#fff" style={{ fontSize: 10, fontWeight: 'black' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-zinc-900/30 border-zinc-800 rounded-[2rem] h-[400px]">
                <CardHeader>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Curva de Retenção do Vídeo (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-full pb-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.retentionCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 10 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ef4444" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-[2rem]">
            <Activity className="w-12 h-12 text-zinc-800 mb-4 animate-pulse" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Aguardando tráfego real...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all ${highlight ? 'bg-green-600/10 border-green-500/20' : 'bg-zinc-950/40 border-zinc-900'}`}>
      <div className="flex items-center gap-2 mb-2">{icon}<p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</p></div>
      <p className={`text-3xl font-black italic uppercase tracking-tighter ${highlight ? 'text-green-500' : 'text-white'}`}>{value}</p>
    </div>
  );
}
