
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Monitor, 
  Zap,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { firestore } = initializeFirebase();
  const metricsQuery = firestore ? query(collection(firestore, 'metrics'), orderBy('createdAt', 'desc'), limit(5000)) : null;
  const { data: metrics, loading } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    const uniqueVisitors = new Set(metrics.map(m => m.visitorId));
    const totalPlays = uniqueVisitors.size;

    // Milestones retention
    const milestones = [0, 25, 50, 75, 90, 100];
    const retentionData = milestones.map(m => {
      const reached = new Set(metrics.filter(met => met.percentage >= m).map(met => met.visitorId)).size;
      const pct = totalPlays > 0 ? (reached / totalPlays) * 100 : 0;
      return {
        milestone: m === 0 ? 'Start' : `${m}%`,
        leads: reached,
        percentage: parseFloat(pct.toFixed(1))
      };
    });

    // Device breakdown
    const devices = metrics.reduce((acc: any, curr) => {
      const dev = curr.device || 'unknown';
      if (!acc[dev]) acc[dev] = new Set();
      acc[dev].add(curr.visitorId);
      return acc;
    }, {});

    const deviceData = Object.keys(devices).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: devices[key].size
    }));

    // Average watch time
    const lastMilestones = metrics.reduce((acc: any, curr) => {
      if (!acc[curr.visitorId] || acc[curr.visitorId] < curr.percentage) {
        acc[curr.visitorId] = curr.percentage;
      }
      return acc;
    }, {});
    
    const avgRetention = Object.values(lastMilestones).reduce((a: any, b: any) => a + b, 0) as number / totalPlays;

    return {
      totalPlays,
      retentionData,
      deviceData,
      avgRetention: avgRetention.toFixed(1)
    };
  }, [metrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Zap className="w-12 h-12 text-red-600 animate-pulse" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Nenhum dado capturado</h2>
          <p className="text-zinc-500 text-sm">Rode tráfego para sua VSL para começar a ver a curva de retenção aqui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Intelligence</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Performance <span className="text-red-600">VSL</span>
            </h1>
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">Análise Cirúrgica de Retenção</p>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Monitorando em Tempo Real</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total de Plays" value={stats.totalPlays} icon={<Play className="text-red-600" />} />
          <KpiCard title="Retenção Média" value={`${stats.avgRetention}%`} icon={<Clock className="text-red-600" />} />
          <KpiCard title="Dispositivo Dominante" value={stats.deviceData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'} icon={<Smartphone className="text-red-600" />} />
          <KpiCard title="Health Score" value="A+" icon={<Zap className="text-red-600" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase italic tracking-tight">Curva de Retenção (Estilo VTurb)</CardTitle>
              <CardDescription className="text-zinc-500">Acompanhe onde seu público perde o interesse no script.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.retentionData}>
                  <defs>
                    <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="milestone" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRet)" name="Leads Ativos" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/20 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase italic tracking-tight">Dispositivos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#dc2626" />
                    <Cell fill="#18181b" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/20 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase italic tracking-tight">Análise de Drop-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Ponto do Vídeo</th>
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Leads Retidos</th>
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {stats.retentionData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold text-sm">{row.milestone}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden max-w-[120px]">
                            <div className="h-full bg-red-600" style={{ width: `${row.percentage}%` }} />
                          </div>
                          <span className="text-xs font-black">{row.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {row.percentage > 60 ? (
                          <span className="text-[9px] font-black uppercase text-green-500">Escalável</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-red-600">Revisar Script</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <Card className="bg-zinc-900/20 border-zinc-800 hover:border-red-600/30 transition-all group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">{React.cloneElement(icon, { size: 16 })}</div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{title}</p>
          <p className="text-2xl font-black italic tracking-tighter">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
