
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  ChevronLeft,
  ChevronRight,
  Timer,
  ExternalLink,
  Save,
  ShoppingCart,
  ArrowUpCircle
} from 'lucide-react';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const ITEMS_PER_PAGE = 50;
const VIDEO_DURATION_FIXED = 140; // 02:20 em segundos

export default function AdvancedAnalyticsDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [newCheckoutUrl, setNewCheckoutUrl] = useState('');
  const [newUpsellUrl, setNewUpsellUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingUpsell, setIsSavingUpsell] = useState(false);

  const configRef = useMemo(() => firestore ? doc(firestore, 'config', 'sales') : null, [firestore]);
  const { data: appConfig } = useDoc(configRef);

  useEffect(() => {
    if (appConfig?.checkoutUrl && !newCheckoutUrl) {
      setNewCheckoutUrl(appConfig.checkoutUrl);
    }
    if (appConfig?.upsellCheckoutUrl && !newUpsellUrl) {
      setNewUpsellUrl(appConfig.upsellCheckoutUrl);
    }
  }, [appConfig]);

  const handleSaveCheckout = () => {
    if (!firestore || !newCheckoutUrl || !configRef) return;
    setIsSaving(true);
    
    setDoc(configRef, {
      checkoutUrl: newCheckoutUrl,
      updatedAt: serverTimestamp()
    }, { merge: true })
    .then(() => {
      toast({
        title: "Link VSL Atualizado!",
        description: "A página principal já está usando o novo checkout.",
      });
    })
    .catch(async (err) => {
      const permsError = new FirestorePermissionError({
        path: configRef.path,
        operation: 'update',
        requestResourceData: { checkoutUrl: newCheckoutUrl }
      });
      errorEmitter.emit('permission-error', permsError);
    })
    .finally(() => setIsSaving(false));
  };

  const handleSaveUpsell = () => {
    if (!firestore || !newUpsellUrl || !configRef) return;
    setIsSavingUpsell(true);
    
    setDoc(configRef, {
      upsellCheckoutUrl: newUpsellUrl,
      updatedAt: serverTimestamp()
    }, { merge: true })
    .then(() => {
      toast({
        title: "Link Upsell Atualizado!",
        description: "A página de Upsell já está usando o novo checkout.",
      });
    })
    .catch(async (err) => {
      const permsError = new FirestorePermissionError({
        path: configRef.path,
        operation: 'update',
        requestResourceData: { upsellCheckoutUrl: newUpsellUrl }
      });
      errorEmitter.emit('permission-error', permsError);
    })
    .finally(() => setIsSavingUpsell(false));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setMounted(true);
    setSelectedDate(getLocalDateString());
  }, []);

  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== "project-id";

  const metricsQuery = useMemo(() => {
    if (!firestore || !isConfigured || !selectedDate) return null;
    return query(
      collection(firestore, 'metrics'), 
      where('dateStr', '==', selectedDate),
      limit(2000) 
    );
  }, [firestore, isConfigured, selectedDate]);

  const { data: metrics, loading } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    const sortedData = [...metrics].sort((a: any, b: any) => {
      const timeA = a.updatedAt?.seconds || 0;
      const timeB = b.updatedAt?.seconds || 0;
      return timeB - timeA;
    });

    const totalSessions = sortedData.length;
    let startedCount = 0;
    let midRetentionCount = 0;
    let completedCount = 0;
    let ctaClicks = 0;
    
    const maxDuration = VIDEO_DURATION_FIXED;
    const intervals: { label: string; sec: number; count: number }[] = [];
    const step = 10;
    
    for (let s = 0; s <= maxDuration; s += step) {
      intervals.push({ label: formatTime(s), sec: s, count: 0 });
    }

    sortedData.forEach((m: any) => {
      if (m.started) startedCount++;
      if (m.clickedCTA) ctaClicks++;
      
      const wTime = m.watchTime || 0;
      const pct = (wTime / maxDuration) * 100;

      if (pct >= 50) midRetentionCount++;
      if (pct >= 90 || m.completed) completedCount++;

      intervals.forEach(interval => {
        if (wTime >= interval.sec) {
          interval.count++;
        }
      });
    });

    const playRate = totalSessions > 0 ? ((startedCount / totalSessions) * 100).toFixed(1) : '0';
    const finalRetentionRate = startedCount > 0 ? ((completedCount / startedCount) * 100).toFixed(1) : '0';
    const conversionRate = totalSessions > 0 ? ((ctaClicks / totalSessions) * 100).toFixed(1) : '0';

    const funnelData = [
      { name: 'Visitas', value: totalSessions, fill: '#27272a' },
      { name: 'Plays', value: startedCount, fill: '#52525b' },
      { name: 'Meio (50%)', value: midRetentionCount, fill: '#dc2626' },
      { name: 'Fim (90%+)', value: completedCount, fill: '#ef4444' },
      { name: 'Venda (Click)', value: ctaClicks, fill: '#22c55e' }
    ];

    const timeline = intervals.map(interval => ({
      tempo: interval.label,
      'Ativos': interval.count,
      'Retenção': startedCount > 0 ? parseFloat(((interval.count / startedCount) * 100).toFixed(1)) : 0
    }));

    return {
      totalSessions,
      startedCount,
      playRate,
      finalRetentionRate,
      conversionRate,
      funnelData,
      timeline,
      sortedData
    };
  }, [metrics]);

  const paginatedLeads = useMemo(() => {
    if (!stats) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return stats.sortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [stats, currentPage]);

  const totalPages = stats ? Math.ceil(stats.totalSessions / ITEMS_PER_PAGE) : 0;

  if (!mounted) return null;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full text-center bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem]">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter italic">FIREBASE DESCONECTADO</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">Configure as credenciais no arquivo <code className="text-red-500 bg-red-500/10 px-1 rounded">src/firebase/config.ts</code> para ativar o rastreamento em tempo real.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-10 font-sans selection:bg-red-600/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Traffic Analytics</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              DASHBOARD <span className="text-red-600">VTURB PRO</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-950 border-zinc-800 pl-10 text-xs w-[180px] h-10 focus:ring-red-600"
              />
            </div>
            <Button variant="outline" className="h-10 bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Gestor Global de Checkout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/40 border-zinc-800 border-l-4 border-l-green-600 overflow-hidden">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-500">
                  <ShoppingCart className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Oferta VSL Principal</h3>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newCheckoutUrl} 
                    onChange={(e) => setNewCheckoutUrl(e.target.value)}
                    placeholder="Link do checkout VSL..."
                    className="bg-black border-zinc-800 text-xs font-mono h-12"
                  />
                  <Button 
                    onClick={handleSaveCheckout} 
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 h-12 px-6 font-black uppercase italic tracking-tighter"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800 border-l-4 border-l-orange-600 overflow-hidden">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <ArrowUpCircle className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Oferta Upsell (Bypass)</h3>
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newUpsellUrl} 
                    onChange={(e) => setNewUpsellUrl(e.target.value)}
                    placeholder="Link do checkout Upsell..."
                    className="bg-black border-zinc-800 text-xs font-mono h-12"
                  />
                  <Button 
                    onClick={handleSaveUpsell} 
                    disabled={isSavingUpsell}
                    className="bg-orange-600 hover:bg-orange-700 h-12 px-6 font-black uppercase italic tracking-tighter"
                  >
                    {isSavingUpsell ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {(!stats || stats.totalSessions === 0) ? (
          <div className="py-32 text-center space-y-6 bg-zinc-950/50 rounded-[3rem] border-2 border-dashed border-zinc-900">
            {loading ? <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" /> : (
              <>
                <Zap className="w-16 h-16 text-zinc-800 mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-zinc-500 uppercase italic tracking-tighter">Aguardando tráfego real</h2>
                  <p className="text-zinc-700 text-sm max-w-xs mx-auto">Nenhum registro encontrado em {selectedDate}. Os leads aparecerão aqui assim que derem o play.</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard 
                title="Total de Leads" 
                value={stats.totalSessions} 
                icon={<Users className="text-red-600" />} 
                highlight 
              />
              <KpiCard 
                title="Taxa de Play" 
                value={`${stats.playRate}%`} 
                icon={<Play className="text-zinc-500" />} 
              />
              <KpiCard 
                title="Retenção Final" 
                value={`${stats.finalRetentionRate}%`} 
                icon={<CheckCircle2 className="text-zinc-500" />} 
              />
              <KpiCard 
                title="Conv. Checkout" 
                value={`${stats.conversionRate}%`} 
                icon={<TrendingUp className="text-green-500" />} 
                success 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-zinc-950/40 border-zinc-900 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-red-600" />
                    Funil Comercial
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.funnelData} layout="vertical" margin={{ left: 10, right: 40 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} width={85} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {stats.funnelData.map((entry, index) => (
                          <RechartsCell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList dataKey="value" position="right" fill="#fff" fontSize={10} fontWeight="900" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-zinc-950/40 border-zinc-900 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-red-600" />
                    Curva de Retenção Exata (2:20)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.timeline}>
                      <defs>
                        <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                      <XAxis dataKey="tempo" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px' }}
                        formatter={(value: any) => [`${value}%`, 'Retenção']}
                      />
                      <Area type="monotone" dataKey="Retenção" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRet)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-950/20 border-zinc-900 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Log de Visualizações Individuais</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-zinc-900"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-[10px] font-black text-zinc-600">PÁGINA {currentPage} DE {totalPages}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-zinc-900"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase font-black tracking-widest text-zinc-600 bg-black/40">
                    <tr>
                      <th className="p-5">Lead ID</th>
                      <th className="p-5">Device</th>
                      <th className="p-5">Tempo Assistido</th>
                      <th className="p-5 text-right">Ação Comercial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {paginatedLeads.map((m: any, i: number) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-5 font-mono text-zinc-500 text-[10px]">
                          {m.id?.substring(0, 16)}...
                        </td>
                        <td className="p-5 uppercase text-[9px] font-black text-zinc-600 tracking-tighter">
                          {m.device || 'DESKTOP'}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-zinc-300 bg-zinc-900 px-2 py-1 rounded text-[11px] font-bold border border-zinc-800">
                              {formatTime(m.watchTime)} / 02:20
                            </span>
                            <div className="w-24 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                              <div className="bg-red-600 h-full" style={{ width: `${Math.min((m.watchTime / 140) * 100, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          {m.clickedCTA ? (
                            <span className="text-green-500 font-black tracking-tighter bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-[10px] uppercase">
                              Comprou / Clicou ✅
                            </span>
                          ) : m.completed ? (
                            <span className="text-red-500 font-black tracking-tighter bg-red-500/10 px-3 py-1.5 rounded-full text-[10px] uppercase">
                              Assistiu Tudo
                            </span>
                          ) : (
                            <span className="text-zinc-600 italic text-[10px]">Abandonou</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, highlight, success }: { title: string, value: string | number, icon: any, highlight?: boolean, success?: boolean }) {
  return (
    <Card className={`bg-zinc-950/40 transition-all border-zinc-900 hover:border-zinc-800 rounded-[1.5rem] ${highlight ? 'ring-1 ring-red-600/20' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{title}</p>
          <div className="p-2 bg-black rounded-xl border border-zinc-900">
            {React.cloneElement(icon, { size: 16 })}
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-3xl font-black italic tracking-tighter ${highlight ? 'text-red-600' : success ? 'text-green-500' : 'text-white'}`}>{value}</p>
          <div className="w-8 h-1 bg-zinc-900 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
