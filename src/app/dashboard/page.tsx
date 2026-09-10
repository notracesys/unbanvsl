'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Play, 
  TrendingUp, 
  Smartphone, 
  Zap,
  Clock,
  Loader2,
  AlertCircle,
  Database,
  MousePointerClick,
  Activity,
  Timer
} from 'lucide-react';
import { firebaseConfig } from '@/firebase/config';

export default function AdvancedAnalyticsDashboard() {
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isConfigured = firebaseConfig.projectId && firebaseConfig.projectId !== "project-id";

  const metricsQuery = useMemo(() => {
    if (!firestore || !isConfigured) return null;
    return query(
      collection(firestore, 'metrics'), 
      orderBy('updatedAt', 'desc'), 
      limit(1000)
    );
  }, [firestore, isConfigured]);

  const { data: metrics, loading } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    const totalSessions = metrics.length;
    let totalWatchTime = 0;
    let totalPercentage = 0;
    let ctaClicks = 0;
    let mobileCount = 0;
    let desktopCount = 0;

    // Inicializa intervalos de 10% para curva de retenção de alta fidelidade
    const retentionBuckets = Array(11).fill(0); 

    metrics.forEach((m: any) => {
      totalWatchTime += m.watchTime || 0;
      totalPercentage += m.percentage || 0;
      if (m.clickedCTA) ctaClicks++;
      if (m.device === 'mobile') mobileCount++;
      else desktopCount++;

      const pct = m.percentage || 0;
      for (let i = 0; i <= 10; i++) {
        if (pct >= i * 10) {
          retentionBuckets[i]++;
        }
      }
    });

    const avgWatchSeconds = totalSessions > 0 ? Math.floor(totalWatchTime / totalSessions) : 0;
    const avgCompletionPct = totalSessions > 0 ? (totalPercentage / totalSessions).toFixed(1) : '0';
    const conversionRate = totalSessions > 0 ? ((ctaClicks / totalSessions) * 100).toFixed(1) : '0';

    const retentionData = retentionBuckets.map((count, idx) => ({
      milestone: `${idx * 10}%`,
      'Retenção %': parseFloat(((count / totalSessions) * 100).toFixed(1)),
      leads: count
    }));

    const deviceData = [
      { name: 'Celular', value: mobileCount },
      { name: 'Computador', value: desktopCount }
    ].filter(d => d.value > 0);

    // Calcula os maiores pontos de queda (Drop-off)
    const dropoffs = [];
    for (let i = 0; i < 10; i++) {
      const currentLeads = retentionBuckets[i];
      const nextLeads = retentionBuckets[i + 1];
      const lostLeads = currentLeads - nextLeads;
      const dropPct = totalSessions > 0 ? ((lostLeads / totalSessions) * 100) : 0;

      if (dropPct > 0) {
        dropoffs.push({
          range: `${i * 10}% a ${(i + 1) * 10}%`,
          lostPct: dropPct.toFixed(1),
          severity: dropPct > 20 ? 'Crítico' : dropPct > 10 ? 'Médio' : 'Leve'
        });
      }
    }
    
    // Ordena do maior drop-off pro menor
    dropoffs.sort((a, b) => parseFloat(b.lostPct) - parseFloat(a.lostPct));

    const formatTime = (secs: number) => {
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      return `${mins}m ${remainingSecs}s`;
    };

    return {
      totalSessions,
      avgWatchTimeStr: formatTime(avgWatchSeconds),
      avgCompletionPct,
      ctaClicks,
      conversionRate,
      retentionData,
      deviceData,
      dropoffs: dropoffs.slice(0, 4)
    };
  }, [metrics]);

  if (!mounted) return null;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Acesso não conectado</h2>
          <p className="text-zinc-400 text-sm mb-4">Insira as credenciais do seu Firebase no arquivo `src/firebase/config.ts` para habilitar a inteligência.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mapeando Tráfego...</span>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-zinc-900/30 p-10 rounded-3xl border border-zinc-800/80 backdrop-blur-sm">
          <Zap className="w-12 h-12 text-red-600 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Aguardando Cliques & Plays</h2>
          <p className="text-zinc-400 text-sm">Visite a página principal, dê o play no seu vídeo e assista para ver a inteligência gerando dados aqui instantaneamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 lg:p-10 font-sans selection:bg-red-600/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho Premium */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Precise Tracking</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              AUDITORIA DE <span className="text-red-600">RETENÇÃO VSL</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/60 px-4 py-2 rounded-xl">
            <Database className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Projeto: unban-a07e6</span>
          </div>
        </header>

        {/* KPIs Avançados */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Sessões Iniciadas" value={stats.totalSessions} icon={<Play className="text-red-600" />} subtitle="Leads únicos monitorados" />
          <KpiCard title="Tempo Médio Assistido" value={stats.avgWatchTimeStr} icon={<Timer className="text-red-600" />} subtitle={`~${stats.avgCompletionPct}% do roteiro`} />
          <KpiCard title="Cliques no Checkout" value={stats.ctaClicks} icon={<MousePointerClick className="text-red-600" />} subtitle="Intenções reais de compra" />
          <KpiCard title="Conversão da VSL" value={`${stats.conversionRate}%`} icon={<TrendingUp className="text-green-500" />} subtitle="CTR de leads para checkout" highlight />
        </div>

        {/* Gráficos de Alta Fidelidade */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Curva de Retenção VTurb Style */}
          <Card className="lg:col-span-2 bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-600" />
                Curva de Retenção Cirúrgica (De 10% em 10%)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full pt-4">
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

          {/* Análise de Drop-off e Copyscript */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base font-black uppercase tracking-wider text-zinc-300">
                  Pontos de Desistência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.dropoffs.map((d, index) => (
                  <div key={index} className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 font-bold">Intervalo {d.range}</p>
                      <p className="text-[10px] text-zinc-500">Queda no roteiro</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9px] ${
                        d.severity === 'Crítico' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        -{d.lostPct}% {d.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dispositivos Mix */}
            <Card className="bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Origem do Lead</CardTitle>
              </CardHeader>
              <CardContent className="h-[140px] flex items-center justify-center">
                {stats.deviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.deviceData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                        <Cell fill="#dc2626" />
                        <Cell fill="#3f3f46" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', border: 'none', borderRadius: '8px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-zinc-600">Aguardando dados de origem</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Feed de Sessões Ativas */}
        <Card className="bg-zinc-900/10 border-zinc-900 overflow-hidden">
          <CardHeader className="bg-zinc-950/40 p-4 border-b border-zinc-900">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              Sessões em Tempo Real (Últimos Leads)
            </h3>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-black tracking-widest text-zinc-500 border-b border-zinc-900 bg-zinc-950/20">
                <tr>
                  <th className="p-4">Sessão / ID</th>
                  <th className="p-4">Dispositivo</th>
                  <th className="p-4">Tempo Visualizado</th>
                  <th className="p-4">Conclusão %</th>
                  <th className="p-4 text-right">Status do Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-zinc-950/10">
                {metrics.slice(0, 10).map((m: any, i: number) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 font-mono text-zinc-400 text-[11px]">{m.id || 'sess_anonima'}</td>
                    <td className="p-4 uppercase text-[10px] font-bold tracking-wider text-zinc-400">{m.device || 'mobile'}</td>
                    <td className="p-4 font-bold text-white">{m.watchTime || 0}s <span className="text-zinc-600">/ {m.totalDuration || 180}s</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-600 h-full" style={{ width: `${m.percentage || 0}%` }} />
                        </div>
                        <span className="font-mono text-zinc-400 text-[10px]">{m.percentage || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {m.clickedCTA ? (
                        <span className="px-2 py-0.5 rounded-md bg-green-950 text-green-400 font-black border border-green-800 text-[9px] uppercase tracking-wider animate-pulse">
                          Clicou CTA / Comprou
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-500 text-[9px] uppercase tracking-wider">
                          Apenas Assistindo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, subtitle, highlight }: { title: string, value: string | number, icon: any, subtitle?: string, highlight?: boolean }) {
  return (
    <Card className={`bg-zinc-900/20 transition-all duration-300 hover:scale-[1.01] ${highlight ? 'border-green-600/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'border-zinc-800'}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{title}</p>
          <div className="p-1.5 bg-zinc-950 rounded-lg">
            {React.cloneElement(icon, { size: 14 })}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black italic tracking-tighter text-white">{value}</p>
          {subtitle && <p className="text-[10px] text-zinc-500 font-medium">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
