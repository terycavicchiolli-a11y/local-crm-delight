import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Task, Client } from "@/lib/db/types";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter,
  User,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/agenda")({
  component: AgendaPage,
});

function AgendaPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delayed'>('all');
  const [formData, setFormData] = useState<Partial<Task>>({
    priority: 'Média',
    status: 'Pendente'
  });

  const { user } = useSupabaseAuth();

  const loadData = async () => {
    if (!user) return;
    const [taskRes, cliRes] = await Promise.all([
      supabase.from('tasks').select('*').order('deadline'),
      supabase.from('clients').select('*').order('name')
    ]);
    if (taskRes.data) setTasks(taskRes.data as any);
    if (cliRes.data) setClients(cliRes.data as any);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      toast.error("Usuário sem empresa vinculada");
      return;
    }

    const dbPayload = {
      id: crypto.randomUUID(),
      company_id: profile.company_id,
      title: formData.title || '',
      description: formData.description || '',
      responsible_id: user.id,
      deadline: formData.deadline || new Date().toISOString(),
      priority: formData.priority || 'Média',
      status: 'Pendente',
      client_id: formData.clientId || null,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('tasks').insert(dbPayload);
    if (error) {
      toast.error("Erro ao agendar: " + error.message);
    } else {
      toast.success("Tarefa agendada");
      setShowModal(false);
      setFormData({ priority: 'Média', status: 'Pendente' });
      loadData();
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === 'Concluída' ? 'Pendente' : 'Concluída';
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: newStatus,
        completed_at: newStatus === 'Concluída' ? new Date().toISOString() : null 
      })
      .eq('id', task.id);
    
    if (error) {
      toast.error("Erro ao atualizar tarefa: " + error.message);
    } else {
      loadData();
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'Pendente';
    if (filter === 'delayed') return new Date(t.deadline) < new Date() && t.status !== 'Concluída';
    return true;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Agenda & Tarefas</h2>
          <p className="text-muted-foreground">Gestão da rotina diária da equipe Diamante.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-diamante-orange hover:bg-diamante-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nova Atividade
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filter === 'all' ? 'bg-primary text-white font-bold' : 'hover:bg-muted'}`}
              >
                Todas as tarefas
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filter === 'pending' ? 'bg-primary text-white font-bold' : 'hover:bg-muted'}`}
              >
                Apenas Pendentes
              </button>
              <button 
                onClick={() => setFilter('delayed')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filter === 'delayed' ? 'bg-destructive text-white font-bold' : 'hover:bg-muted'}`}
              >
                Atrasadas
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="py-20 text-center bg-card rounded-xl border border-dashed border-border">
              <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma tarefa programada para este filtro.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`bg-card p-4 rounded-xl border border-border shadow-sm flex items-start gap-4 transition-all group ${task.status === 'Concluída' ? 'opacity-60' : ''}`}
              >
                <button 
                  onClick={() => toggleTask(task)}
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.status === 'Concluída' ? 'bg-green-500 border-green-500 text-white' : 'border-border hover:border-primary'
                  }`}
                >
                  {task.status === 'Concluída' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold text-diamante-dark truncate ${task.status === 'Concluída' ? 'line-through' : ''}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.priority === 'Alta' ? 'bg-red-100 text-red-700' : 
                      task.priority === 'Média' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${new Date(task.deadline) < new Date() && task.status !== 'Concluída' ? 'text-destructive' : ''}`} />
                      {format(new Date(task.deadline), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </div>
                    {((task as any).client_id || task.clientId) && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {clients.find(c => c.id === ((task as any).client_id || task.clientId))?.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={async () => {
                      const { error } = await supabase.from('tasks').delete().eq('id', task.id);
                      if (error) toast.error("Erro ao remover: " + error.message);
                      else { toast.info("Tarefa removida"); loadData(); }
                    }}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border bg-diamante-dark text-white flex justify-between">
              <h3 className="font-bold">Nova Tarefa / Compromisso</h3>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Título</label>
                <input required className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Prazo / Horário</label>
                <input required type="datetime-local" className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Prioridade</label>
                  <select className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Cliente Relacionado</label>
                  <select className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFormData({...formData, clientId: e.target.value})}>
                    <option value="">Nenhum</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Descrição</label>
                <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none resize-none h-24" onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-diamante-orange text-white text-sm font-bold rounded-lg">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
