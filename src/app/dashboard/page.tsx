
'use client';

import React, { useMemo } from 'react';
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
  Monitor, 
  Zap,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { firebaseConfig } from '@/firebase/config';

export default function AnalyticsDashboard() {
  const firestore = useFirestore();
  
  // Verificamos se as chaves ainda são as de placeholder
  const isConfigured = firebaseConfig.projectId !== 'project-id';

  // Memoizamos a query para ser 100% estável e evitar o loop de renderização
  const metricsQuery = useMemo(() => {
    if (!firestore || !isConfigured) return null;
    return query(
      collection(firestore, 'metrics'), 
      orderBy('createdAt', 'desc'), 
      limit(500)
    );
  }, [firestore, isConfigured]);

  const { data: metrics, loading } = useCollection(metricsQuery);

  const stats = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;

    const visitorMap = new Map();
    const deviceCounts = new Map();

    metrics.forEach((m: any) => {
      const currentMax = visitorMap.get(m.visitorId) || 0;
      if (m.percentage > currentMax) {
        visitorMap.set(m.visitorId, m.percentage);
      }

      const devKey = m.visitorId + '_dev';
      if (!visitorMap.has(devKey)) {
        const dev = m.device || 'unknown';
        deviceCounts.set(dev, (deviceCounts.get(dev) || 0) + 1);
        visitorMap.set(devKey, true);
      }
    });

    const totalPlays = Array.from(visitorMap.keys()).filter(k => !k.endsWith('_dev')).length;

    const milestones = [0, 25, 50, 75, 90, 100];
    const retentionData = milestones.map(m => {
      let reached = 0;
      visitorMap.forEach((val, key) => {
        if (!key.endsWith('_dev') && val >= m) reached++;
      });
      return {
        milestone: m === 0 ? 'Start' : `${m}%`,
        percentage: totalPlays > 0 ? parseFloat(((reached / totalPlays) * 100).toFixed(1)) : 0
      };
    });

    const deviceData = Array.from(deviceCounts.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    let totalRetentionSum = 0;
    let count = 0;
    visitorMap.forEach((val, key) => {
      if (!key.endsWith('_dev')) {
        totalRetentionSum += val;
        count++;
      }
    });

    return {
      totalPlays,
      retentionData,
      deviceData,
      avgRetention: count > 0 ? (totalRetentionSum / count).toFixed(1) : '0'
    };
  }, [metrics]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Firebase Desconectado</h2>
            <p className="text-zinc-500 text-sm">
              Você ainda não configurou as chaves reais do Firebase em <code className="text-red-500 font-mono">src/firebase/config.ts</code>. 
              Sem isso, não conseguimos salvar ou ler os dados de retenção.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sincronizando Inteligência...</span>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalPlays === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Zap className="w-12 h-12 text-zinc-800 mx-auto" />
          <h2 className="text-xl font-bold text-white uppercase italic tracking-tighter">Aguardando Tráfego Real</h2>
          <p className="text-zinc-500 text-sm">As métricas aparecerão aqui assim que o primeiro lead der play no vídeo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Tracking</span>
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Performance <span className="text-red-600">VSL</span>
            </h1>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Analytics Ativo</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total de Leads" value={stats.totalPlays} icon={<Play className="text-red-600" />} />
          <KpiCard title="Retenção Média" value={`${stats.avgRetention}%`} icon={<Clock className="text-red-600" />} />
          <KpiCard title="Engajamento" value="Alto" icon={<Zap className="text-red-600" />} />
          <KpiCard title="Dispositivos" value={stats.deviceData.length} icon={<Smartphone className="text-red-600" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-zinc-900/20 border-zinc-800 overflow-hidden">
            <CardHeader>
              <h3 className="text-lg font-black uppercase italic tracking-tight">Curva de Retenção</h3>
            </CardHeader>
            <CardContent className="h-[350px] w-full pt-4">
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
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#dc2626' }}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRet)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/20 border-zinc-800">
            <CardHeader>
              <h3 className="text-lg font-black uppercase italic tracking-tight">Device Mix</h3>
            </CardHeader>
            <CardContent className="h-[350px]">
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
                    <Cell fill="#27272a" />
                    <Cell fill="#52525b" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <Card className="bg-zinc-900/20 border-zinc-800 hover:border-red-600/30 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-zinc-950 rounded-lg">{React.cloneElement(icon, { size: 16 })}</div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{title}</p>
          <p className="text-2xl font-black italic tracking-tighter">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
