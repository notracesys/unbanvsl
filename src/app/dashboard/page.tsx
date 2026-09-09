
'use client';

import React from 'react';
import { initializeFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Clock, Play, Award } from 'lucide-react';

export default function DashboardPage() {
  const { firestore } = initializeFirebase();
  const metricsQuery = firestore ? query(collection(firestore, 'metrics'), orderBy('createdAt', 'desc')) : null;
  const { data: metrics, loading } = useCollection(metricsQuery);

  if (loading) return <div className="p-10 text-center">Carregando métricas...</div>;

  const totalViews = new Set(metrics?.map(m => m.visitorId)).size;
  
  // Calculate retention data
  const milestones = [0, 25, 50, 75, 90, 100];
  const chartData = milestones.map(m => {
    const count = new Set(metrics?.filter(met => met.percentage >= m).map(met => met.visitorId)).size;
    return {
      name: m === 0 ? 'Play' : `${m}%`,
      value: count,
      percentage: totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : 0
    };
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black uppercase tracking-tight">Analytics da VSL</h1>
          <p className="text-zinc-500">Métricas de retenção e performance em tempo real.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard icon={<Users />} title="Total de Leads" value={totalViews} />
          <MetricCard icon={<Play />} title="Taxa de Play" value={`${chartData[0].percentage}%`} />
          <MetricCard icon={<Clock />} title="Retenção Média" value={`${chartData[2].percentage}%`} />
          <MetricCard icon={<Award />} title="Vendas Sim." value={chartData[5].value} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Retenção</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [`${value} Leads (${props.payload.percentage}%)`, 'Volume']} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value }: { icon: any, title: string, value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl text-zinc-600">
            {React.cloneElement(icon, { size: 20 })}
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
