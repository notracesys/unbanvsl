
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
  Users, 
  Clock, 
  Play, 
  TrendingUp, 
  Smartphone, 
  Monitor, 
  Zap,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { firestore } = initializeFirebase();
  const metricsQuery = firestore ? query(collection(firestore, 'metrics'), orderBy('createdAt', 'desc'), limit(5000)) : null;
  const { data: metrics, loading } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    const uniqueVisitors = new Set(metrics.map(m => m.visitorId));
    const totalLeads = uniqueVisitors.size;

    // Milestones retention
    const milestones = [0, 25, 50, 75, 90, 100];
    const retentionData = milestones.map(m => {
      const reached = new Set(metrics.filter(met => met.percentage >= m).map(met => met.visitorId)).size;
      const pct = totalLeads > 0 ? (reached / totalLeads) * 100 : 0;
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
      name: key === 'mobile' ? 'Mobile' : 'Desktop',
      value: devices[key].size
    }));

    // Average watch time
    const lastMilestones = metrics.reduce((acc: any, curr) => {
      if (!acc[curr.visitorId] || acc[curr.visitorId] < curr.percentage) {
        acc[curr.visitorId] = curr.percentage;
      }
      return acc;
    }, {});
    
    const avgRetention = Object.values(lastMilestones).reduce((a: any, b: any) => a + b, 0) as number / totalLeads;

    return {
      totalLeads,
      retentionData,
      deviceData,
      avgRetention: avgRetention.toFixed(1),
      playRate: 100 // Assumindo que quem está na métrica deu play
    };
  }, [metrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-red-600 animate-pulse" />
          <p className="text-zinc-400 font-medium">Carregando inteligência de dados...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle className="w-16 h-16 text-zinc-700 mx-auto" />
          <h2 className="text-xl font-bold text-white">Nenhum dado capturado ainda</h2>
          <p className="text-zinc-500">Comece a rodar tráfego para sua VSL para ver as métricas de retenção aqui.</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#dc2626', '#18181b'];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Profissional */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Live Analytics</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Performance <span className="text-red-600">VSL</span>
            </h1>
            <p className="text-zinc-500 text-sm">Análise de retenção em tempo real para escala agressiva.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Status da Fonte</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold">Recebendo Dados</span>
              </div>
            </div>
          </div>
        </header>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total de Plays" 
            value={stats.totalLeads} 
            icon={<Play className="text-red-600" />} 
            description="Leads únicos que iniciaram"
          />
          <StatCard 
            title="Retenção Média" 
            value={`${stats.avgRetention}%`} 
            icon={<Clock className="text-red-600" />} 
            description="Média de tempo assistido"
          />
          <StatCard 
            title="Desktop Share" 
            value={`${stats.deviceData.find(d => d.name === 'Desktop')?.value || 0}`} 
            icon={<Monitor className="text-red-600" />} 
            description="Acessos via Computador"
          />
          <StatCard 
            title="Mobile Share" 
            value={`${stats.deviceData.find(d => d.name === 'Mobile')?.value || 0}`} 
            icon={<Smartphone className="text-red-600" />} 
            description="Acessos via Celular"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Retenção (O coração do VTurb) */}
          <Card className="lg:col-span-2 bg-zinc-900/30 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Curva de Retenção</CardTitle>
              <CardDescription>Veja exatamente onde seu público perde o interesse.</CardDescription>
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
                  <XAxis 
                    dataKey="milestone" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#dc2626', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#dc2626" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRet)" 
                    name="Retenção"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Distribution */}
          <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Dispositivos</CardTitle>
              <CardDescription>Perfil técnico do seu tráfego.</CardDescription>
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
                    {stats.deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Recomendação</p>
                <p className="text-sm font-medium mt-1">
                  {stats.deviceData[0]?.value > stats.deviceData[1]?.value ? 'Otimize para Mobile primeiro.' : 'Público Desktop é forte.'}
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Milestone Table */}
        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Análise de Drop-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Ponto do Vídeo</th>
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Leads Retidos</th>
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Taxa de Retenção</th>
                    <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {stats.retentionData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">{row.milestone}</td>
                      <td className="py-4 text-zinc-400">{row.leads}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden max-w-[100px]">
                            <div 
                              className="h-full bg-red-600" 
                              style={{ width: `${row.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-black">{row.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        {row.percentage > 70 ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase rounded">Excelente</span>
                        ) : row.percentage > 40 ? (
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase rounded">Atenção</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-black uppercase rounded">Crítico</span>
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

function StatCard({ title, value, icon, description }: { title: string, value: string | number, icon: any, description: string }) {
  return (
    <Card className="bg-zinc-900/30 border-zinc-800 hover:border-red-600/50 transition-all group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-colors">
            {React.cloneElement(icon, { size: 18 })}
          </div>
          <Zap className="w-3 h-3 text-zinc-800 group-hover:text-red-600 transition-colors" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{title}</p>
          <p className="text-3xl font-black italic tracking-tighter">{value}</p>
          <p className="text-[11px] text-zinc-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
