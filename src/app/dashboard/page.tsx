
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
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
  Cell as RechartsCell
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
  ChevronRight
} from 'lucide-react';
import { firebaseConfig } from '@/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 50;

export default function AdvancedAnalyticsDashboard() {
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [manualReload, setManualReload] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Função auxiliar para pegar a data local YYYY-MM-DD
  const getLocalDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  useEffect(() => {
    setMounted(true);
  }, []);

  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== "project-id";

  const metricsQuery = useMemo(() => {
    if (!firestore || !isConfigured) return null;
    return query(
      collection(firestore, 'metrics'), 
      where('dateStr', '==', selectedDate),
      limit(5000) 
    );
  }, [firestore, isConfigured, selectedDate, manualReload]);

  const { data: metrics, loading, error } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    // Ordenação client-side para evitar erro de índice do Firestore
    const sortedMetrics = [...metrics].sort((a: any, b: any) => {
      const timeA = a.updatedAt?.seconds || 0;
      const timeB = b.updatedAt?.seconds || 0;
      return timeB - timeA;
    });

    const totalSessions = sortedMetrics.length;
    let startedCount = 0;
    let midRetentionCount = 0;
    let completedCount = 0;
    let ctaClicks = 0;
    
    const retentionBuckets = Array(11).fill(0); 

    sortedMetrics.forEach((m: any) => {
      if (m.started) startedCount++;
      if (m.clickedCTA) ctaClicks++;
      
      const pct = m.percentage || 0;
      if (pct >= 50) midRetentionCount++;
      if (pct >= 90 || m.completed) completedCount++;

      for (let i = 0; i <= 10; i++) {
        if (pct >= i * 10) {
          retentionBuckets[i]++;
        }
      }
    });

    const playRate = totalSessions > 0 ? ((startedCount / totalSessions) * 100).toFixed(1) : '0';
    const finalRetentionRate = startedCount > 0 ? ((completedCount / startedCount) * 100).toFixed(1) : '0';
    const conversionRate = totalSessions > 0 ? ((ctaClicks / totalSessions) * 100).toFixed(1) : '0';

    const funnelData = [
      { name: 'Visitas', value: totalSessions, fill: '#3f3f46' },
      { name: 'Plays', value: startedCount, fill: '#71717a' },
      { name: 'Ret. 50%', value: midRetentionCount, fill: '#dc2626' },
      { name: 'Ret. Final', value: completedCount, fill: '#ef4444' },
      { name: 'Checkout', value: ctaClicks, fill: '#22c55e' }
    ];

    const retentionData = retentionBuckets.map((count, idx) => ({
      milestone: `${idx * 10}%`,
      'Retenção %': totalSessions > 0 ? parseFloat(((count / totalSessions) * 100).toFixed(1)) : 0,
    }));

    return {
      totalSessions,
      startedCount,
      playRate,
      finalRetentionRate,
      conversionRate,
      ctaClicks,
      funnelData,
      retentionData,
      sortedMetrics
    };
  }, [metrics]);

  const paginatedLeads = useMemo(() => {
    if (!stats) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return stats.sortedMetrics.slice(start, start + ITEMS_PER_PAGE);
  }, [stats, currentPage]);

  const totalPages = stats ? Math.ceil(stats.totalSessions / ITEMS_PER_PAGE) : 0;

  if (!mounted) return null;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full text-center bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase mb-2">Sem Conexão</h2>
          <p className="text-zinc-400 text-sm">Configure o Firebase no arquivo `config.ts` para começar a receber dados.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-10 font-sans selection:bg-red-600/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">High Performance Tracking</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              DASHBOARD <span className="text-red-600">VTURB PRO</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-zinc-900 border-zinc-800 pl-10 text-xs w-[180px] focus:ring-red-600"
              />
            </div>
            <Button onClick={() => setManualReload(s => s + 1)} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> Sincronizar
            </Button>
          </div>
        </header>

        {(!stats || stats.totalSessions === 0) ? (
          <div className="py-20 text-center space-y-6 bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-800">
            <Zap className="w-12 h-12 text-zinc-700 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-zinc-400">Nenhum lead encontrado em {selectedDate}</h2>
              <p className="text-zinc-600 text-sm">Gere tráfego ou mude a data para ver os dados.</p>
            </div>
            <Button onClick={() => setSelectedDate(getLocalDateString())} variant="link" className="text-red-600">Ir para Hoje</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard 
                title="Leads do Dia" 
                value={stats.totalSessions} 
                icon={<Users className="text-red-600" />} 
                subtitle="Volume total na data" 
                highlight 
              />
              <KpiCard 
                title="Taxa de Play" 
                value={`${stats.playRate}%`} 
                icon={<Play className="text-zinc-400" />} 
                subtitle={`${stats.startedCount} iniciaram`} 
              />
              <KpiCard 
                title="Retenção Final" 
                value={`${stats.finalRetentionRate}%`} 
                icon={<CheckCircle2 className="text-zinc-400" />} 
                subtitle="Leads que viram tudo" 
              />
              <KpiCard 
                title="Conv. Checkout" 
                value={`${stats.conversionRate}%`} 
                icon={<TrendingUp className="text-green-500" />} 
                subtitle={`${stats.ctaClicks} cliques no botão`} 
                success 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-red-600" />
                    Funil de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.funnelData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={11} width={80} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {stats.funnelData.map((entry, index) => (
                          <RechartsCell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-600" />
                    Curva de Retenção Detalhada
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.retentionData}>
                      <defs>
                        <linearGradient id="glowRed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#161619" vertical={false} />
                      <XAxis dataKey="milestone" stroke="#52525b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="Retenção %" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#glowRed)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900/10 border-zinc-900 overflow-hidden">
              <CardHeader className="bg-zinc-950/40 p-4 border-b border-zinc-900 flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Lista de Leads</h3>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold mt-1">Exibindo {paginatedLeads.length} de {stats.totalSessions} registros</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-zinc-900 border-zinc-800"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-[10px] font-mono px-2">Pág {currentPage} de {totalPages}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-zinc-900 border-zinc-800"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 border-b border-zinc-900 bg-zinc-950/20">
                    <tr>
                      <th className="p-4">ID Sessão</th>
                      <th className="p-4">Dispositivo</th>
                      <th className="p-4">Progresso</th>
                      <th className="p-4 text-right">Ação Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 bg-zinc-950/10">
                    {paginatedLeads.map((m: any, i: number) => (
                      <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="p-4 font-mono text-zinc-400">
                          {m.id?.substring(0, 12)}...
                          {m.visitorId === (typeof window !== 'undefined' ? localStorage.getItem('vsl_visitor_id') : '') && <span className="ml-2 text-[8px] bg-red-600/20 text-red-500 px-1 rounded">VOCÊ</span>}
                        </td>
                        <td className="p-4 uppercase text-[10px] font-bold text-zinc-500">
                          {m.device || 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-zinc-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-red-600 h-full" style={{ width: `${m.percentage || 0}%` }} />
                            </div>
                            <span className="font-mono text-[10px]">{m.percentage || 0}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {m.clickedCTA ? (
                            <span className="text-green-500 font-black">CLICK CHECKOUT ✅</span>
                          ) : m.completed ? (
                            <span className="text-red-400">ASSISTIU TUDO</span>
                          ) : (
                            <span className="text-zinc-600 italic">ABANDONOU</span>
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

function KpiCard({ title, value, icon, subtitle, highlight, success }: { title: string, value: string | number, icon: any, subtitle?: string, highlight?: boolean, success?: boolean }) {
  return (
    <Card className={`bg-zinc-900/20 transition-all duration-300 hover:scale-[1.01] border-zinc-800 ${highlight ? 'border-red-600/30 ring-1 ring-red-600/20' : ''} ${success ? 'border-green-600/30' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</p>
          <div className="p-1.5 bg-zinc-950 rounded-lg">
            {React.cloneElement(icon, { size: 14 })}
          </div>
        </div>
        <div className="space-y-1">
          <p className={`text-2xl font-black italic tracking-tighter ${highlight ? 'text-red-600' : success ? 'text-green-500' : 'text-white'}`}>{value}</p>
          {subtitle && <p className="text-[9px] text-zinc-500 font-bold uppercase">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
