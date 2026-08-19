import { Link, useNavigate } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MessageSquare,
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/db/auth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', to: '/' },
  { icon: Users, label: 'Clientes', to: '/clientes' },
  { icon: Briefcase, label: 'Processos', to: '/processos' },
  { icon: Calendar, label: 'Agenda & Tarefas', to: '/agenda' },
  { icon: DollarSign, label: 'Financeiro', to: '/financeiro' },
  { icon: MessageSquare, label: 'Comunicação', to: '/comunicacao' },
  { icon: Settings, label: 'Comercial & Parceiros', to: '/comercial' },
];

export function Sidebar() {
  const { user, logout, checkPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth' });
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.to === '/') return true;
    if (item.to === '/clientes') return checkPermission('clientes');
    if (item.to === '/processos') return checkPermission('processos');
    if (item.to === '/agenda') return checkPermission('agenda');
    if (item.to === '/financeiro') return checkPermission('financeiro');
    if (item.to === '/comunicacao') return checkPermission('comunicacao');
    if (item.to === '/comercial') return user?.role === 'OWNER' || user?.role === 'MASTER';
    return true;
  });
  return (
    <aside className="w-64 bg-diamante-dark text-white flex flex-col h-screen sticky top-0 border-r border-white/10">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-diamante-orange rounded flex items-center justify-center font-bold text-white">D</div>
        <h1 className="text-xl font-bold tracking-tight">Diamante CRM</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: 'bg-diamante-orange text-white' }}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-white/10 group",
              "text-white/70"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-diamante-orange flex items-center justify-center text-xs font-bold">
            {user?.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-[10px] text-white/50 truncate uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
