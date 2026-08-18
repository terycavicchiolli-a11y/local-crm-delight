import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { db } from "@/lib/db/store";
import { Process, ProcessStep, Client } from "@/lib/db/types";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  MoreHorizontal,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/processos")({
  component: ProcessosPage,
});

const STEPS: ProcessStep[] = [
  'Lead',
  'Contato Inicial',
  'Atendimento',
  'Documentação',
  'Análise',
  'Aprovação',
  'Fechamento'
];

function ProcessosPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Process>>({
    step: 'Lead',
    status: 'Ativo',
    value: 0,
    nextAction: '',
    notes: ''
  });

  const loadData = () => {
    setProcesses(db.getAll('processes'));
    setClients(db.getAll('clients'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      toast.error("Selecione um cliente");
      return;
    }
    const newProcess: Process = {
      ...(formData as any),
      id: crypto.randomUUID(),
      commercialId: '1',
      entryDate: new Date().toISOString(),
      lastMove: new Date().toISOString(),
    };
    db.upsert('processes', newProcess);
    toast.success("Processo criado");
    setShowModal(false);
  };

  const updateStep = (processId: string, newStep: ProcessStep) => {
    const p = db.getById('processes', processId) as Process;
    if (p) {
      db.upsert('processes', { ...p, step: newStep, lastMove: new Date().toISOString() });
      toast.info(`Processo movido para ${newStep}`);
    }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Desconhecido';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Funil de Processos</h2>
          <p className="text-muted-foreground">O eixo operacional da Diamante Imobiliária.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-border rounded-lg overflow-hidden bg-card">
            <button 
              onClick={() => setView('kanban')}
              className={`p-2 ${view === 'kanban' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-diamante-orange hover:bg-diamante-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Processo
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[70vh]">
          {STEPS.map(step => (
            <div key={step} className="flex-shrink-0 w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-diamante-dark/70 flex items-center gap-2">
                  {step}
                  <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">
                    {processes.filter(p => p.step === step).length}
                  </span>
                </h3>
              </div>
              
              <div className="flex-1 bg-muted/30 rounded-xl p-2 space-y-3 border border-border/50">
                {processes.filter(p => p.step === step).map(process => (
                  <div 
                    key={process.id}
                    className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">#{process.id.slice(0, 5)}</span>
                      <button className="text-muted-foreground hover:text-primary"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <p className="font-bold text-diamante-dark mb-1">{getClientName(process.clientId)}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      {new Date(process.entryDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs font-bold text-primary">R$ {process.value.toLocaleString()}</span>
                      {process.nextAction && (
                        <div className="flex items-center text-[10px] text-orange-600 font-medium">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Ação pendente
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {STEPS.indexOf(step) > 0 && (
                        <button 
                          onClick={() => updateStep(process.id, STEPS[STEPS.indexOf(step) - 1])}
                          className="text-[10px] bg-muted hover:bg-muted-foreground/10 px-2 py-1 rounded"
                        >
                          Anterior
                        </button>
                      )}
                      {STEPS.indexOf(step) < STEPS.length - 1 && (
                        <button 
                          onClick={() => updateStep(process.id, STEPS[STEPS.indexOf(step) + 1])}
                          className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded ml-auto"
                        >
                          Próximo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          {/* List view placeholder */}
          <div className="p-8 text-center text-muted-foreground">Visão em lista selecionada</div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-diamante-dark text-white">
              <h3 className="font-bold text-lg">Novo Processo</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Cliente</label>
                <select 
                  required 
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Valor Estimado</label>
                  <input 
                    type="number"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Etapa Inicial</label>
                  <select 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.step}
                    onChange={e => setFormData({...formData, step: e.target.value as any})}
                  >
                    {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Próxima Ação</label>
                <input 
                  placeholder="Ex: Ligar para confirmar documentos"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  onChange={e => setFormData({...formData, nextAction: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-diamante-orange text-white text-sm font-bold rounded-lg hover:bg-diamante-orange/90"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
