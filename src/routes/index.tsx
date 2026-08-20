import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { 
  BarChart3, 
  Users, 
  Activity, 
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const DATA = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 500 },
  { name: 'Jun', value: 900 },
];

function Dashboard() {
  const { user } = useSupabaseAuth();
  const [stats, setStats] = useState({
    totalProcesses: 0,
    activeClients: 0,
    pendingTasks: 0,
    totalValue: 0
  });

  const loadStats = async () => {
    if (!user) return;
    const [procRes, cliRes, taskRes] = await Promise.all([
      supabase.from('processes').select('value'),
      supabase.from('clients').select('id'),
      supabase.from('tasks').select('id').eq('status', 'Pendente')
    ]);

    setStats({
      totalProcesses: procRes.data?.length || 0,
      activeClients: cliRes.data?.length || 0,
      pendingTasks: taskRes.data?.length || 0,
      totalValue: procRes.data?.reduce((acc, p) => acc + (Number(p.value) || 0), 0) || 0
    });
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Painel de Controle</h2>
        <p className="text-muted-foreground">Bem-vindo à inteligência de dados da Diamante Imobiliária.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Processos Ativos" value={stats.totalProcesses.toString()} icon={<BarChart3 className="w-5 h-5" />} trend="+12%" />
        <DashboardCard title="Base de Clientes" value={stats.activeClients.toString()} icon={<Users className="w-5 h-5" />} trend="+5%" />
        <DashboardCard title="Tarefas Pendentes" value={stats.pendingTasks.toString()} icon={<Activity className="w-5 h-5" />} trend="-2" />
        <DashboardCard title="Volume em Negócio" value={`R$ ${stats.totalValue.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} trend="+18%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 bg-card rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-diamante-dark flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-diamante-orange" />
              Desempenho de Vendas
            </h3>
            <div className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-1 rounded">Últimos 6 meses</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F58F45" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F58F45" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#F58F45', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="value" stroke="#F58F45" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-diamante-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Atividades Recentes
            </h3>
            <button className="text-[10px] font-bold uppercase text-primary hover:underline">Ver todas</button>
          </div>
          <div className="space-y-6">
            <ActivityItem title="Novo Lead Cadastrado" subtitle="João Silva — Site" time="Há 5 min" type="success" />
            <ActivityItem title="Processo Movido" subtitle="Maria Souza para 'Análise'" time="Há 12 min" type="info" />
            <ActivityItem title="Comissão Calculada" subtitle="R$ 4.500,00 — Ref #8829" time="Há 45 min" type="warning" />
            <ActivityItem title="Tarefa Concluída" subtitle="Confirmar documentos Bradesco" time="Há 1h" type="success" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-muted rounded-xl text-diamante-dark group-hover:bg-diamante-dark group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-diamante-dark tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function ActivityItem({ title, subtitle, time, type }: { title: string, subtitle: string, time: string, type: 'success' | 'info' | 'warning' }) {
  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-diamante-orange'
  };
  
  return (
    <div className="flex gap-4 relative">
      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${colors[type]}`}></div>
      <div className="flex-1 border-b border-border pb-4 last:border-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-sm font-bold text-diamante-dark">{title}</h4>
          <span className="text-[10px] text-muted-foreground font-medium">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
