import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { db } from "@/lib/db/store";
import { Financial, Commission, Process, TeamMember } from "@/lib/db/types";
import { 
  Plus, 
  TrendingUp, 
  ArrowDownCircle, 
  ArrowUpCircle,
  FileText,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/financeiro")({
  component: FinanceiroPage,
});

function FinanceiroPage() {
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Financial>>({
    type: 'Recebimento',
    status: 'Pendente',
    value: 0
  });

  const loadData = () => {
    setFinancials(db.getAll('financials'));
    setCommissions(db.getAll('commissions'));
    setProcesses(db.getAll('processes'));
    setTeam(db.getAll('team'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.processId) return;

    const newEntry: Financial = {
      ...(formData as any),
      id: crypto.randomUUID(),
      companyId: '1', // Default
      date: new Date().toISOString(),
    };
    db.upsert('financials', newEntry);

    // Auto-calculate commission if it's a confirmed receipt
    if (newEntry.type === 'Recebimento' && newEntry.status === 'Confirmado') {
      const process = processes.find(p => p.id === newEntry.processId);
      const responsible = team.find(t => t.id === process?.commercialId);
      if (process && responsible) {
        const commissionVal = (newEntry.value * responsible.commissionRate) / 100;
        const newComm: Commission = {
          id: crypto.randomUUID(),
          companyId: '1', // Default
          processId: process.id,
          financialId: newEntry.id,
          responsibleId: responsible.id,
          value: commissionVal,
          rate: responsible.commissionRate,
          status: 'Calculada'
        };
        db.upsert('commissions', newComm);
      }
    }

    toast.success("Lançamento financeiro registrado");
    setShowModal(false);
  };

  const totalReceived = financials.filter(f => f.type === 'Recebimento' && f.status === 'Confirmado').reduce((acc, f) => acc + f.value, 0);
  const pendingReceived = financials.filter(f => f.type === 'Recebimento' && f.status === 'Pendente').reduce((acc, f) => acc + f.value, 0);
  const totalCommissions = commissions.reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Financeiro</h2>
          <p className="text-muted-foreground">Controle objetivo de recebimentos, NFs e comissões.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-diamante-orange hover:bg-diamante-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Confirmado</p>
              <h3 className="text-xl font-bold">R$ {totalReceived.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Pendente</p>
              <h3 className="text-xl font-bold">R$ {pendingReceived.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-diamante-orange/10 rounded-lg text-diamante-orange">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Comissões Totais</p>
              <h3 className="text-xl font-bold">R$ {totalCommissions.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold text-diamante-dark">Recebimentos & NFs</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Processo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {financials.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground italic">Sem registros</td></tr>
              ) : (
                financials.map(f => (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs">{new Date(f.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">#{f.processId.slice(0, 5)}</td>
                    <td className="px-4 py-3 font-bold text-primary">R$ {f.value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold text-diamante-dark">Comissões Detalhadas</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Responsável</th>
                <th className="px-4 py-3">Processo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commissions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground italic">Nenhuma comissão calculada</td></tr>
              ) : (
                commissions.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{team.find(t => t.id === c.responsibleId)?.name || 'Consultor'}</td>
                    <td className="px-4 py-3 text-xs">#{c.processId.slice(0, 5)}</td>
                    <td className="px-4 py-3 font-bold text-diamante-orange">R$ {c.value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{c.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border bg-diamante-dark text-white flex justify-between">
              <h3 className="font-bold">Novo Lançamento</h3>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Processo Vinculado</label>
                <select 
                  required 
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
                  onChange={e => setFormData({...formData, processId: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  {processes.map(p => <option key={p.id} value={p.id}>#{p.id.slice(0, 8)} - R$ {p.value.toLocaleString()}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Valor do Lançamento</label>
                  <input 
                    required
                    type="number"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Status</label>
                  <select 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Confirmado">Confirmado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-diamante-orange text-white text-sm font-bold rounded-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
