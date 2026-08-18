import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { db } from "@/lib/db/store";
import { MessageTemplate, Client, Process } from "@/lib/db/types";
import { 
  Copy, 
  MessageCircle, 
  Plus, 
  Search,
  Check,
  Layout
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/comunicacao")({
  component: ComunicacaoPage,
});

function ComunicacaoPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    setTemplates(db.getAll('templates'));
    setClients(db.getAll('clients'));
    setProcesses(db.getAll('processes'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const getPreview = (content: string) => {
    let preview = content;
    const client = clients.find(c => c.id === selectedClient);
    const process = processes.find(p => p.id === selectedProcess);
    
    preview = preview.replace(/{nome}/g, client?.name || '[NOME]');
    preview = preview.replace(/{processo}/g, process?.id.slice(0, 8) || '[PROCESSO]');
    return preview;
  };

  const handleCopy = (template: MessageTemplate) => {
    const text = getPreview(template.content);
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    toast.success("Mensagem copiada para o clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Comunicação</h2>
          <p className="text-muted-foreground">Banco de mensagens prontas para WhatsApp e e-mail.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Personalização</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Selecione o Cliente</label>
                <select 
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                >
                  <option value="">Nenhum</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Selecione o Processo</label>
                <select 
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none"
                  value={selectedProcess}
                  onChange={e => setSelectedProcess(e.target.value)}
                >
                  <option value="">Nenhum</option>
                  {processes.map(p => <option key={p.id} value={p.id}>#{p.id.slice(0, 8)}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Categorias</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setSearchTerm("")}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${searchTerm === "" ? 'bg-primary text-white font-bold' : 'hover:bg-muted'}`}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSearchTerm(cat)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${searchTerm === cat ? 'bg-primary text-white font-bold' : 'hover:bg-muted'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar modelos..." 
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-card rounded-xl border border-border shadow-sm flex flex-col group">
                <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">
                      {template.category}
                    </span>
                    <h4 className="font-bold text-diamante-dark">{template.title}</h4>
                  </div>
                  <Layout className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-dashed border-border leading-relaxed">
                    {getPreview(template.content)}
                  </p>
                </div>
                <div className="p-4 pt-0 mt-auto">
                  <button 
                    onClick={() => handleCopy(template)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                  >
                    {copiedId === template.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedId === template.id ? 'Copiado!' : 'Copiar Mensagem'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
