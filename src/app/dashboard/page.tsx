
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, limit, doc, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, LabelList, AreaChart, Area, CartesianGrid, PieChart, Pie 
} from 'recharts';
import { 
  LogOut, Save, Loader2, AlertCircle, Users, Play, 
  CheckCircle2, Activity, Smartphone, Monitor, TrendingUp, 
  Settings, BarChart3, Target, MousePointer2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfessionalAnalyticsDashboard() {
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
    let mobile = 0, desktop = 0;
    
    rawMetrics.forEach((m: any) => {
      if (m.started) started++;
      if (m.percentage >= 25) p25++;
      if (m.percentage >= 50) p50++;
      if (m.percentage >= 75) p75++;
      if (m.percentage >= 90) p90++;
      if (m.percentage >= 100 || m.completed) p100++;
      if (m.clickedCTA) cta++;
      
      if (m.device === 'mobile') mobile++;
      else desktop++;
    });

    return {
      total: rawMetrics.length,
      started,
      playRate: ((started / rawMetrics.length) * 100).toFixed(1),
      retention90: started > 0 ? ((p90 / started) * 100).toFixed(1) : '0',
      conv: ((cta / rawMetrics.length) * 100).toFixed(1),
      devices: [
        { name: 'Mobile', value: mobile, fill: '#ef4444' },
        { name: 'Desktop', value: desktop, fill: '#3f3f46' }
      ],
      funnel: [
        { name: 'Visitas', value: rawMetrics.length, fill: '#18181b' },
        { name: 'Plays', value: started, fill: '#27272a' },
        { name: 'Checkout', value: cta, fill: '#ef4444' }
      ],
      retentionCurve: [
        { name: '0%', value: started },
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
      .then(() => toast({ title: "Configuração Atualizada", description: "O novo link já está em vigor." }))
      .catch(() => toast({ variant: "destructive", title: "Erro ao Salvar", description: "Verifique sua cota do Firebase." }))
      .finally(() => setIsSaving(false));
  };

  if (!mounted || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>;
  if (!user) return null;

  const isQuotaExceeded = metricsError?.message?.includes('quota') || configError?.message?.includes('quota');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-red-600/30">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10 space-y-10">
        
        {/* Top Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                LOCALIZA<span className="text-red-600">.METRICS</span>
              </h1>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Advanced Sales Funnel Monitoring</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative group">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 px-6 py-2.5 rounded-2xl text-xs font-black outline-none transition-all focus:border-red-600/50"
              />
            </div>
            <Button variant="destructive" onClick={handleLogout} className="rounded-2xl font-black uppercase italic px-6 h-11 shadow-lg shadow-red-950/20">
              <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
            </Button>
          </div>
        </header>

        {isQuotaExceeded && (
          <div className="bg-red-600/10 border border-red-600/20 p-8 rounded-[2.5rem] flex items-center gap-8 animate-pulse">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase italic text-red-500 text-lg">Limite de Dados Atingido</p>
              <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">O Google bloqueou as consultas por hoje. Recomendamos o upgrade para o plano Blaze no Console do Firebase para suportar tráfego real sem interrupções.</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="analytics" className="w-full space-y-8">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1.5 rounded-2xl h-14">
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-bold px-8 uppercase text-[10px] tracking-widest">
              <BarChart3 className="w-4 h-4 mr-2" /> Métricas
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-bold px-8 uppercase text-[10px] tracking-widest">
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard title="Visitas Únicas" value={stats.total} icon={<Users className="text-blue-500" />} />
                  <KPICard title="Taxa de Play" value={`${stats.playRate}%`} icon={<Play className="text-zinc-100" />} />
                  <KPICard title="Retenção (90%)" value={`${stats.retention90}%`} icon={<TrendingUp className="text-red-500" />} />
                  <KPICard title="Conversão Geral" value={`${stats.conv}%`} icon={<CheckCircle2 className="text-green-500" />} highlight />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Gráfico de Retenção */}
                  <Card className="lg:col-span-8 bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Curva de Audiência</CardTitle>
                          <CardDescription className="text-zinc-400 text-xs mt-1">Percentual de usuários ativos por marco do vídeo</CardDescription>
                        </div>
                        <Target className="text-red-600 w-5 h-5 opacity-50" />
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] p-0 pr-8 pb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.retentionCurve}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', padding: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'black' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Distribuição de Dispositivos */}
                  <Card className="lg:col-span-4 bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] flex flex-col">
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center items-center pb-8">
                      <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.devices}
                              cx="50%" cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {stats.devices.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black italic tracking-tighter">{stats.total}</span>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase">Leads</span>
                        </div>
                      </div>
                      <div className="w-full space-y-3 mt-6">
                        {stats.devices.map((d, i) => (
                          <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                            <div className="flex items-center gap-3">
                              {d.name === 'Mobile' ? <Smartphone className="w-4 h-4 text-red-500" /> : <Monitor className="w-4 h-4 text-zinc-500" />}
                              <span className="text-xs font-bold text-zinc-300">{d.name}</span>
                            </div>
                            <span className="text-xs font-black text-white">{((d.value / stats.total) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Funil de Vendas Horizontal */}
                <Card className="bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] p-8">
                  <div className="flex justify-between items-center mb-8">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Filtro de Conversão</CardTitle>
                    <MousePointer2 className="w-5 h-5 text-red-600 opacity-50" />
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.funnel} margin={{ top: 20, bottom: 20 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                        <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={80}>
                          {stats.funnel.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                          <LabelList dataKey="value" position="top" fill="#fff" style={{ fontSize: 12, fontWeight: 'black', marginBottom: 10 }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-900 rounded-[3rem] bg-zinc-950/20">
                <Activity className="w-16 h-16 text-zinc-800 mb-6 animate-pulse" />
                <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Waiting for Traffic Engine...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ConfigCard 
                title="Checkout Principal" 
                value={newCheckoutUrl} 
                setValue={setNewCheckoutUrl} 
                onSave={() => handleSave('checkoutUrl', newCheckoutUrl)}
                isSaving={isSaving}
                icon={<Target className="text-red-500" />}
                description="Link de redirecionamento do botão da VSL principal."
              />
              <ConfigCard 
                title="Checkout Upsell" 
                value={newUpsellUrl} 
                setValue={setNewUpsellUrl} 
                onSave={() => handleSave('upsellCheckoutUrl', newUpsellUrl)}
                isSaving={isSaving}
                icon={<TrendingUp className="text-orange-500" />}
                description="Link de redirecionamento para a página de oferta posterior."
              />
            </div>
          </TabsContent>
        </Tabs>

      </div>
      <footer className="py-10 text-center opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-500">System Core v4.8 • Secure Data Encryption</p>
      </footer>
    </div>
  );
}

function KPICard({ title, value, icon, highlight = false }: { title: string, value: string | number, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-1 ${highlight ? 'bg-red-600/10 border-red-600/20 shadow-[0_20px_40px_rgba(239,68,68,0.1)]' : 'bg-zinc-900/20 border-zinc-800'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">{icon}</div>
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{title}</p>
      </div>
      <p className={`text-4xl font-black italic uppercase tracking-tighter ${highlight ? 'text-red-600' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function ConfigCard({ title, value, setValue, onSave, isSaving, icon, description }: any) {
  return (
    <Card className="bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] p-10 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black/50 rounded-2xl flex items-center justify-center border border-white/5">{icon}</div>
        <div>
          <CardTitle className="text-xl font-black italic uppercase tracking-tighter">{title}</CardTitle>
          <CardDescription className="text-zinc-500 text-xs font-bold">{description}</CardDescription>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative group">
          <Input 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            placeholder="https://..."
            className="bg-black border-zinc-800 h-16 rounded-2xl px-6 font-mono text-xs focus:border-red-600/50 transition-all"
          />
        </div>
        <Button 
          onClick={onSave} 
          disabled={isSaving} 
          className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-tighter rounded-2xl transition-all shadow-xl shadow-red-950/20 group"
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Salvar Alterações <Save className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" /></>}
        </Button>
      </div>
    </Card>
  );
}
