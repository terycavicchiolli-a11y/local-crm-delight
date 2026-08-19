-- 1. Enum for Roles
CREATE TYPE public.app_role AS ENUM ('OWNER', 'MASTER', 'COMMON');

-- 2. Companies Table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    document TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo',
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 3. Profiles (extending auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'COMMON',
    status TEXT NOT NULL DEFAULT 'Ativo',
    phone TEXT,
    last_access TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. User Roles Table (for security-definer checks)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Security Definer Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 6. Clients
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    name TEXT NOT NULL,
    document TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    address TEXT,
    origin TEXT,
    partner_id UUID,
    commercial_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'Lead',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 7. Processes
CREATE TABLE public.processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    client_id UUID REFERENCES public.clients(id) NOT NULL,
    commercial_id UUID NOT NULL,
    partner_id UUID,
    step TEXT NOT NULL DEFAULT 'Lead',
    status TEXT NOT NULL,
    entry_date TIMESTAMPTZ DEFAULT now(),
    last_move TIMESTAMPTZ DEFAULT now(),
    next_action TEXT,
    value NUMERIC DEFAULT 0,
    notes TEXT
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.processes TO authenticated;
GRANT ALL ON public.processes TO service_role;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- 8. Team Members
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    commission_rate NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Ativo'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 9. Partners
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    commission_agreement TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- 10. Tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    responsible_id UUID NOT NULL,
    deadline TIMESTAMPTZ,
    priority TEXT NOT NULL DEFAULT 'Média',
    status TEXT NOT NULL DEFAULT 'Pendente',
    client_id UUID REFERENCES public.clients(id),
    process_id UUID REFERENCES public.processes(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 11. Financials
CREATE TABLE public.financials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    process_id UUID REFERENCES public.processes(id) NOT NULL,
    type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    invoice_number TEXT,
    invoice_url TEXT
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.financials TO authenticated;
GRANT ALL ON public.financials TO service_role;
ALTER TABLE public.financials ENABLE ROW LEVEL SECURITY;

-- 12. Commissions
CREATE TABLE public.commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    process_id UUID REFERENCES public.processes(id) NOT NULL,
    financial_id UUID REFERENCES public.financials(id) NOT NULL,
    responsible_id UUID NOT NULL,
    value NUMERIC NOT NULL,
    rate NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Prevista',
    payment_date TIMESTAMPTZ
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- 13. Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID,
    action TEXT NOT NULL,
    details TEXT,
    affected_record_id UUID,
    timestamp TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. Policies (Isolation by company_id)

CREATE POLICY "Users can see profiles from their company"
ON public.profiles FOR SELECT
TO authenticated
USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Company client isolation"
ON public.clients FOR ALL
TO authenticated
USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Company process isolation"
ON public.processes FOR ALL
TO authenticated
USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Company task isolation"
ON public.tasks FOR ALL
TO authenticated
USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Company team isolation" ON public.team_members FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Company partner isolation" ON public.partners FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Company financial isolation" ON public.financials FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Company commission isolation" ON public.commissions FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));