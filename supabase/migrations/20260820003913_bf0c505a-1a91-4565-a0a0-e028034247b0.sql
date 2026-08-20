-- 15. Message Templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_templates TO authenticated;
GRANT ALL ON public.message_templates TO service_role;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company template isolation" ON public.message_templates FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()) OR company_id IS NULL);

-- Seed initial company
INSERT INTO public.companies (corporate_name, trade_name, document, email, phone, status)
VALUES (
    'Diamante Crédito Imobiliário LTDA', 
    'Diamante Imobiliária', 
    '00.000.000/0001-00', 
    'cesarjuliobraga@gmail.com', 
    '(11) 4002-8922', 
    'Ativo'
) ON CONFLICT (document) DO NOTHING;
