import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { TeamMember, Partner, User } from "@/lib/db/types";
import { 
  Plus, 
  Users, 
  Handshake, 
  ShieldCheck, 
  Phone, 
  Mail,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/comercial")({
  component: ComercialPage,
});

function ComercialPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'team' | 'partners' | 'users'>('team');

  const { user: currentUser } = useSupabaseAuth();

  const loadData = async () => {
    if (!currentUser) return;
    const [teamRes, partRes, profRes] = await Promise.all([
      supabase.from('team_members').select('*').order('name'),
      supabase.from('partners').select('*').order('name'),
      supabase.from('profiles').select('*').order('name')
    ]);

    if (teamRes.data) setTeam(teamRes.data as any);
    if (partRes.data) setPartners(partRes.data as any);
    if (profRes.data) setUsers(profRes.data as any);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-diamante-dark">Comercial & Parceiros</h2>
          <p className="text-muted-foreground">Gestão da equipe interna e rede de parceiros comerciais.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-diamante-orange hover:bg-diamante-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo {activeTab === 'team' ? 'Membro' : activeTab === 'partners' ? 'Parceiro' : 'Usuário'}
        </button>
      </div>

      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('team')}
          className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'team' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Equipe Comercial
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'partners' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Parceiros (Imobiliárias/Corretoras)
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Gerenciamento de Usuários
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'team' ? (
          team.map(member => (
            <div key={member.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden group">
              <div className="p-6 text-center bg-muted/20 border-b border-border">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-diamante-dark">{member.name}</h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{member.role}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4 text-diamante-orange" />
                    Comissão
                  </div>
                  <span className="font-bold">{member.commissionRate}%</span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{member.email}</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <button className="flex-1 bg-primary/5 text-primary text-xs font-bold py-2 rounded-lg hover:bg-primary/10 transition-colors">Ver Processos</button>
                  <button className="px-3 py-2 bg-muted hover:bg-muted-foreground/10 rounded-lg"><TrendingUp className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === 'partners' ? (
          partners.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-card rounded-xl border border-dashed border-border">
              <Handshake className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum parceiro cadastrado ainda.</p>
            </div>
          ) : (
            partners.map(partner => (
              <div key={partner.id} className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-muted rounded-lg"><Handshake className="w-6 h-6 text-primary" /></div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{partner.type}</span>
                </div>
                <div>
                  <h4 className="font-bold text-diamante-dark">{partner.name}</h4>
                  <p className="text-xs text-muted-foreground">{partner.contact}</p>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Acordo Ativo
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Detalhes</button>
                </div>
              </div>
            ))
          )
        ) : (
          <div className="col-span-full space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-bold text-diamante-dark">Usuários do Sistema</h3>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Nível</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
