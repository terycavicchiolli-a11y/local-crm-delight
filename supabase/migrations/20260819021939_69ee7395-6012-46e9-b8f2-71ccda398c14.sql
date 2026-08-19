-- 1. Restrict execution of SECURITY DEFINER function
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. Add missing RLS policies for companies
CREATE POLICY "Owners and Masters can manage company"
ON public.companies FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'OWNER') OR 
  public.has_role(auth.uid(), 'MASTER')
);

CREATE POLICY "Common users can view company"
ON public.companies FOR SELECT
TO authenticated
USING (id = (SELECT company_id FROM public.profiles WHERE id = auth.uid()));

-- 3. Add missing RLS policies for user_roles
CREATE POLICY "Owners can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'OWNER'));

CREATE POLICY "Users can see their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 4. Add missing RLS policies for audit_logs
CREATE POLICY "Owners and Masters can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'OWNER') OR 
  public.has_role(auth.uid(), 'MASTER')
);

CREATE POLICY "Users can create audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());