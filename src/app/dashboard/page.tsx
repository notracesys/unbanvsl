'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc, useUser, useAuth } from '@/firebase';
import { collection, query, where, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell as RechartsCell,
  LabelList
} from 'recharts';
import { 
  Play, 
  TrendingUp, 
  Zap,
  Loader2,
  AlertCircle,
  Activity,
  RefreshCw,
  Filter,
  Users,
  CheckCircle2,
  Calendar as CalendarIcon,
  Timer,
  Save,
  ShoppingCart,
  ArrowUpCircle,
  LogOut,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const VIDEO_DURATION_FIXED = 140;

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
  const [isSavingUpsell, setIsSavingUpsell] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig, error: configError } = useDoc(configRef);

  useEffect(() => {
    if (appConfig?.checkoutUrl) setNewCheckoutUrl(appConfig.checkoutUrl);
    if (appConfig?.upsellCheckoutUrl) setNewUpsellUrl(appConfig.upsellCheckoutUrl);
  }, [appConfig]);

  const handleLogout = async () => {
    if (auth) { await signOut(auth); router.push('/login'); }
  };

  const handleSaveCheckout = () => {
    if (!firestore || !newCheckoutUrl || !configRef) return;
    setIsSaving(true);
    setDoc(configRef, { checkoutUrl: newCheckoutUrl, updatedAt: serverTimestamp() }, { merge: true })
      .then(() => toast({ title: "Link Atualizado!", description: "O site já está usando o novo checkout." }))
      .catch((err) => toast({ variant: "destructive", title: "Cota Esgotada", description: "O Firebase bloqueou o salvamento hoje." }))
      .finally(() => setIsSaving(false));
  };

  const handleSaveUpsell = () => {
    if (!firestore || !newUpsellUrl || !configRef) return;
    setIsSavingUpsell(true);
    setDoc(configRef, { upsellCheckoutUrl: newUpsellUrl, updatedAt: serverTimestamp() }, { merge: true })
      .then(() => toast({ title: "Upsell Atualizado!", description: "O novo link de Upsell está ativo." }))
      .catch((err) => toast({ variant: "destructive", title: "Cota Esgotada", description: "O Firebase bloqueou o salvamento hoje." }))
      .finally(() => setIsSavingUpsell(false));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const getLocalDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    setMounted(true);
    setSelectedDate(getLocalDateString());
  }, []);

  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== "project-id";

  const metricsQuery = useMemo(() => {
    if (!firestore || !isConfigured || !selectedDate) return null;
    return query(collection(firestore, 'metrics'), where('dateStr', '==', selectedDate), limit(500));
  }, [firestore, isConfigured, selectedDate]);

  const { data: metrics, loading, error: metricsError } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;
    let started = 0, mid = 0, comp = 0, cta = 0;
    metrics.forEach((m: any) => {
      if (m.started) started++;
      if (m.clickedCTA) cta++;
      if (m.percentage >= 50) mid++;
      if (m.percentage >= 90 || m.completed) comp++;
    });
    return {
      total: metrics.length,
      started,
      playRate: ((started / metrics.length) * 100).toFixed(1),
      retention: started > 0 ? ((comp / started) * 100).toFixed(1) : '0',
      conv: ((cta / metrics.length) * 100).toFixed(1),
      funnel: [
        { name: 'Visitas', value: metrics.length, fill: '#27272a' },
        { name: 'Plays', value: started, fill: '#52525b' },
        { name: 'Meio', value: mid, fill: '#dc2626' },
        { name: 'Fim', value: comp, fill: '#ef4444' },
        { name: 'Venda', value: cta, fill: '#22c55e' }
      ]
    };
  }, [metrics]);

  if (!mounted || authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>;
  if (!user) return null;

  const isQuotaExceeded = (metricsError?.message?.includes('quota') || configError?.message?.includes('quota'));

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">DASHBOARD <span className="text-red-600">ANALYTICS</span></h1>
          <Button variant="destructive" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Sair</Button>
        </header>

        {isQuotaExceeded && (
          <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-3xl flex items-center gap-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <p className="text-zinc-400 text-sm">O Firebase bloqueou leituras hoje. Seus links serão atualizados no código, mas o painel só voltará após o reset ou upgrade.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-green-500">Checkout Principal</h3>
              <div className="flex gap-2">
                <Input value={newCheckoutUrl} onChange={(e) => setNewCheckoutUrl(e.target.value)} className="bg-black border-zinc-800 text-xs h-12" />
                <Button onClick={handleSaveCheckout} disabled={isSaving || isQuotaExceeded} className="bg-green-600 h-12 px-6"><Save className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-500">Checkout Upsell</h3>
              <div className="flex gap-2">
                <Input value={newUpsellUrl} onChange={(e) => setNewUpsellUrl(e.target.value)} className="bg-black border-zinc-800 text-xs h-12" />
                <Button onClick={handleSaveUpsell} disabled={isSavingUpsell || isQuotaExceeded} className="bg-orange-600 h-12 px-6"><Save className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900">
              <p className="text-[10px] font-black uppercase text-zinc-500">Total Leads</p>
              <p className="text-3xl font-black text-white">{stats.total}</p>
            </div>
            <div className="bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900">
              <p className="text-[10px] font-black uppercase text-zinc-500">Taxa Play</p>
              <p className="text-3xl font-black text-white">{stats.playRate}%</p>
            </div>
            <div className="bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900">
              <p className="text-[10px] font-black uppercase text-zinc-500">Retenção</p>
              <p className="text-3xl font-black text-white">{stats.retention}%</p>
            </div>
            <div className="bg-zinc-950/40 p-6 rounded-3xl border border-zinc-900">
              <p className="text-[10px] font-black uppercase text-zinc-500">Conversão</p>
              <p className="text-3xl font-black text-green-500">{stats.conv}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
