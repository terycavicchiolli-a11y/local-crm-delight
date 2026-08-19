import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import appCss from "../styles.css?url";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";
import { useAuth } from "@/lib/db/auth";
import { Loader2 } from "lucide-react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diamante CRM — Inteligência Imobiliária" },
      { name: "description", content: "Sistema centralizado de gestão para a Diamante Imobiliária." },
      { property: "og:title", content: "Diamante CRM" },
      { property: "og:description", content: "Gestão de processos, clientes e financeiro imobiliário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/auth") {
      navigate({ to: "/auth" });
    }
  }, [user, loading, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-diamante-dark">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!user && location.pathname === "/auth") {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="top-right" />
      </QueryClientProvider>
    );
  }

  if (!user) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
