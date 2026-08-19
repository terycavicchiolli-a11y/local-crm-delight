import { createFileRoute } from "@tanstack/react-router";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Abr', value: 2780 },
  { name: 'Mai', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const pieData = [
  { name: 'Imobiliárias', value: 400 },
  { name: 'Indicações', value: 300 },
  { name: 'Site', value: 300 },
  { name: 'WhatsApp', value: 200 },
];

const COLORS = ['#122A5E', '#F58F45', '#0E2149', '#94a3b8'];

function StatCard({ title, value, icon: Icon, description, trend }: any) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-muted rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-foreground/70">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Visão Geral</h2>
        <p className="text-muted-foreground">Bem-vindo ao cockpit da Diamante Imobiliária.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clientes Novos" value="24" icon={Users} trend={12} description="+4 em relação a ontem" />
        <StatCard title="Processos Ativos" value="156" icon={Briefcase} trend={8} description="Em andamento no funil" />
        <StatCard title="Concluídos (Mês)" value="42" icon={CheckCircle2} trend={24} description="Meta: 50 processos" />
        <StatCard title="Tarefas Pendentes" value="12" icon={Clock} description="3 urgentes hoje" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Desempenho Financeiro
            </h3>
            <select className="text-sm border rounded px-2 py-1 outline-none">
              <option>Últimos 6 meses</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#122A5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Origem de Leads
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]!} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-4">Próximos Compromissos</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="w-12 h-12 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-bold uppercase">Ago</span>
                  <span className="text-lg font-bold">1{i}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Reunião de Documentação</p>
                  <p className="text-xs text-muted-foreground">Cliente: João Silva • 14:30</p>
                </div>
                <div className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">Urgente</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Pendências Críticas
          </h3>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg border-l-4 border-destructive bg-destructive/5">
                <div className="flex-1">
                  <p className="font-semibold text-sm">Documento de CPF faltante</p>
                  <p className="text-xs text-muted-foreground mt-1">Processo #1234 - Maria Oliveira • Atrasado 2 dias</p>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">Resolver</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
