import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/db/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Artificial delay to simulate server
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(email, password);
    
    if (success) {
      toast.success("Bem-vindo de volta!");
      navigate({ to: "/" });
    } else {
      toast.error("Credenciais inválidas ou conta desativada.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-diamante-dark p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 text-center">
          <div className="w-16 h-16 bg-diamante-orange rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4 shadow-lg">D</div>
          <h1 className="text-2xl font-bold text-diamante-dark">Diamante CRM</h1>
          <p className="text-gray-500 text-sm mt-1">Acesse sua conta para continuar</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">E-mail</label>
            <input 
              required
              type="email"
              placeholder="exemplo@diamante.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Senha</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-diamante-orange text-white font-bold py-4 rounded-xl hover:bg-diamante-orange/90 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </button>
        </form>
        
        <div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          © 2026 Diamante Crédito Imobiliário
        </div>
      </div>
    </div>
  );
}
