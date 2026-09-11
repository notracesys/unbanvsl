
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, limit, doc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { LogOut, Save, Loader2, AlertCircle, Users, Play, CheckCircle2, ShoppingCart, TrendingUp, Activity, Smartphone, Monitor, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdvancedAnalyticsDashboard() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newCheckoutUrl, setNewCheckoutUrl] = useState('https://comprasseguras.org.ua/c/c9f3270011');
  const [newUpsellUrl, setNewUpsellUrl] = useState('https://comprasseguras.org.ua/c/f901da2ee5');
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
    return query(collection(firestore, 'metrics'), where('dateStr', '==', selectedDate), limit(100));
  }, [firestore, selectedDate]);

  const { data: rawMetrics, loading: metricsLoading, error: metricsError } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!rawMetrics || rawMetrics.length === 0) return null;
    let started = 0, mid = 0, comp = 0, cta = 0;
    rawMetrics.forEach((m: any) => {
      if (m.started) started++;
      if (m.clickedCTA) cta++;
      if (m.percentage >= 50) mid++;
      if (m.percentage >= 90 || m.completed) comp++;
    });
    return {
      total: rawMetrics.length,
      started,
      playRate: ((started / rawMetrics.length) * 100).toFixed(1),
      retention: started > 0 ? ((comp / started) * 100).toFixed(1) : '0',
      conv: ((cta / rawMetrics.length) * 100).toFixed(1),
      funnel: [
        { name: 'Visitas', value: rawMetrics.length, fill: '#27272a' },
        { name: 'Plays', value: started, fill: '#52525b' },
        { name: '50%', value: mid, fill: '#dc2626' },
        { name: '90%', value: comp, fill: '#ef4444' },
        { name: 'Checkout', value: cta, fill: '#22c55e' }
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
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Painel de Controle</p>
          </div>
          <div className="flex gap-3">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-zinc-900 px-4 py-2 rounded-xl text-xs font-bold outline-none border border-zinc-800"/>
            <Button variant="destructive" onClick={handleLogout} className="rounded-xl font-bold uppercase italic"><LogOut className="w-4 h-4 mr-2" /> Sair</Button>
          </div>
        </header>

        {isQuotaExceeded && (
          <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-3xl flex items-center gap-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <div>
              <p className="font-black uppercase italic text-red-600">Cota do Firebase Esgotada</p>
              <p className="text-zinc-400 text-sm">O Google bloqueou as leituras por hoje. Upgrade para o plano Blaze é recomendado.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem]">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Checkout Principal</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input value={newCheckoutUrl} onChange={(e) => setNewCheckoutUrl(e.target.value)} className="bg-black border-zinc-800 rounded-xl"/>
              <Button onClick={() => handleSave('checkoutUrl', newCheckoutUrl)} disabled={isSaving} className="bg-green-600 h-12 px-6 rounded-xl"><Save className="w-4 h-4"/></Button>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem]">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Checkout Upsell</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input value={newUpsellUrl} onChange={(e) => setNewUpsellUrl(e.target.value)} className="bg-black border-zinc-800 rounded-xl"/>
              <Button onClick={() => handleSave('upsellCheckoutUrl', newUpsellUrl)} disabled={isSaving} className="bg-orange-600 h-12 px-6 rounded-xl"><Save className="w-4 h-4"/></Button>
            </CardContent>
          </Card>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="w-4 h-4 text-blue-500" />} label="Visitas" value={stats.total} />
            <StatCard icon={<Play className="w-4 h-4 text-zinc-100" />} label="Taxa Play" value={`${stats.playRate}%`} />
            <StatCard icon={<Activity className="w-4 h-4 text-red-500" />} label="Retenção" value={`${stats.retention}%`} />
            <StatCard icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} label="Conversão" value={`${stats.conv}%`} highlight />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 bg-zinc-900/30 border-zinc-800 rounded-[2rem] h-[400px]">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Funil</CardTitle></CardHeader>
            <CardContent className="h-full pb-12">
              {stats && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.funnel} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={35}>
                      {stats.funnel.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                      <LabelList dataKey="value" position="right" fill="#fff" style={{ fontSize: 10, fontWeight: 'black' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-zinc-900/30 border-zinc-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Atividade Recente (Limite 100)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-[10px] font-black uppercase">Lead ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Dispositivo</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Retenção</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-right">Venda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawMetrics?.map((m: any) => (
                    <TableRow key={m.id} className="border-zinc-900 hover:bg-zinc-800/20">
                      <TableCell className="text-[10px] font-mono text-zinc-500">{m.visitorId?.substring(0, 8)}...</TableCell>
                      <TableCell>{m.device === 'mobile' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600" style={{ width: `${m.percentage || 0}%` }} />
                          </div>
                          <span className="text-[10px] font-black">{m.percentage || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{m.clickedCTA ? <span className="text-green-500 font-black">SIM</span> : <span className="text-zinc-700">NÃO</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
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
