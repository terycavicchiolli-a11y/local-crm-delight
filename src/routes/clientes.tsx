import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Client } from "@/lib/db/types";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText,
  Trash2,
  Edit
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    status: 'Lead',
    origin: 'Site',
    name: '',
    document: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    notes: ''
  });

  const { user } = useSupabaseAuth();

  const loadClients = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error("Erro ao carregar clientes: " + error.message);
      return;
    }
    
    setClients(data as any);
  };

  useEffect(() => {
    loadClients();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Get company_id from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      toast.error("Erro: Usuário sem empresa vinculada.");
      return;
    }

    const payload = {
      ...(formData as any),
      id: formData.id || crypto.randomUUID(),
      company_id: profile.company_id,
      commercial_id: user.id, // Linking to current user
      created_at: new Date().toISOString(),
    };

    // Remove client-side only keys if they exist in camelCase to avoid DB errors
    // or map them to snake_case.
    const dbPayload = {
      id: payload.id,
      company_id: payload.company_id,
      name: payload.name,
      document: payload.document,
      phone: payload.phone,
      whatsapp: payload.whatsapp,
      email: payload.email,
      address: payload.address,
      origin: payload.origin,
      status: payload.status,
      notes: payload.notes,
      commercial_id: payload.commercial_id,
      created_at: payload.created_at
    };

    const { error } = await supabase
      .from('clients')
      .upsert(dbPayload);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success(formData.id ? "Cliente atualizado" : "Cliente cadastrado com sucesso");
      setShowModal(false);
      setFormData({ status: 'Lead', origin: 'Site' });
      loadClients();
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Clientes</h2>
          <p className="text-muted-foreground">Gestão da base de contatos e leads da imobiliária.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-diamante-orange hover:bg-diamante-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CPF..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Contato</th>
                <th className="px-6 py-3">Origem</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-diamante-dark">{client.name}</span>
                        <span className="text-[11px] text-muted-foreground">{client.document}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${client.phone}`} title="Ligar"><Phone className="w-3.5 h-3.5 text-primary" /></a>
                        <a href={`mailto:${client.email}`} title="E-mail"><Mail className="w-3.5 h-3.5 text-primary" /></a>
                        <a href={`https://wa.me/${client.whatsapp}`} target="_blank" title="WhatsApp"><MessageCircle className="w-3.5 h-3.5 text-green-600" /></a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{client.origin}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        client.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                        client.status === 'Lead' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setFormData(client); setShowModal(true); }}
                          className="p-1 hover:bg-primary/10 rounded text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => { 
                            const { error } = await supabase.from('clients').delete().eq('id', client.id);
                            if (error) toast.error("Erro ao remover: " + error.message);
                            else { toast.info("Cliente removido"); loadClients(); }
                          }}
                          className="p-1 hover:bg-destructive/10 rounded text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-diamante-dark text-white">
              <h3 className="font-bold text-lg">{formData.id ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Nome Completo</label>
                  <input 
                    required 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">CPF / CNPJ</label>
                  <input 
                    required 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.document}
                    onChange={e => setFormData({...formData, document: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Telefone</label>
                  <input 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">WhatsApp</label>
                  <input 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">E-mail</label>
                <input 
                  type="email"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Origem</label>
                  <select 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.origin}
                    onChange={e => setFormData({...formData, origin: e.target.value})}
                  >
                    <option>Site</option>
                    <option>Instagram</option>
                    <option>Indicação</option>
                    <option>WhatsApp</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
                  <select 
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Lead">Lead</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
