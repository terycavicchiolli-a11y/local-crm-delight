import { z } from 'zod';

export const UserRole = z.enum(['OWNER', 'MASTER', 'COMMON']);

export const PermissionSchema = z.object({
  moduleId: z.string(),
  actions: z.array(z.string()), // ['view', 'create', 'edit', 'delete', 'export', 'approve']
  fields: z.record(z.string(), z.enum(['view', 'edit', 'hide'])).optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  passwordHash: z.string(),
  role: UserRole,
  companyId: z.string().uuid().optional(),
  status: z.enum(['Ativo', 'Inativo']),
  permissions: z.array(PermissionSchema).default([]),
  createdAt: z.string(),
  lastAccess: z.string().optional(),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  corporateName: z.string(),
  tradeName: z.string(),
  document: z.string(), // CNPJ
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['Ativo', 'Inativo']),
  createdAt: z.string(),
});

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyId: z.string().uuid().optional(),
  action: z.string(),
  details: z.string().optional(),
  affectedRecordId: z.string().optional(),
  timestamp: z.string(),
});

export const ClientSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z.string(),
  document: z.string(), // CPF/CNPJ
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string(),
  origin: z.string(),
  partnerId: z.string().uuid().optional().or(z.literal('')),
  commercialId: z.string().uuid(),
  status: z.enum(['Ativo', 'Inativo', 'Lead']),
  notes: z.string(),
  createdAt: z.string(),
});

export const ProcessStep = z.enum([
  'Lead',
  'Contato Inicial',
  'Atendimento',
  'Documentação',
  'Análise',
  'Aprovação',
  'Fechamento',
  'Finalizado',
  'Parado'
]);

export const ProcessSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  clientId: z.string().uuid(),
  commercialId: z.string().uuid(),
  partnerId: z.string().uuid().optional().or(z.literal('')),
  step: ProcessStep,
  status: z.string(),
  entryDate: z.string(),
  lastMove: z.string(),
  nextAction: z.string(),
  value: z.number().default(0),
  notes: z.string(),
});

export const TeamMemberSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
  phone: z.string(),
  commissionRate: z.number(), // Default rate
  status: z.enum(['Ativo', 'Inativo']),
});

export const PartnerSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['Imobiliária', 'Corretora', 'Outro']),
  contact: z.string(),
  email: z.string(),
  commissionAgreement: z.string(),
  status: z.enum(['Ativo', 'Inativo']),
});

export const TaskSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  responsibleId: z.string().uuid(),
  deadline: z.string(),
  priority: z.enum(['Baixa', 'Média', 'Alta']),
  status: z.enum(['Pendente', 'Em Andamento', 'Concluída', 'Atrasada']),
  clientId: z.string().uuid().optional().or(z.literal('')),
  processId: z.string().uuid().optional().or(z.literal('')),
  createdAt: z.string(),
  completedAt: z.string().optional(),
});

export const FinancialSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  processId: z.string().uuid(),
  type: z.enum(['Recebimento', 'Pagamento']),
  value: z.number(),
  date: z.string(),
  status: z.enum(['Pendente', 'Confirmado']),
  invoiceNumber: z.string().optional(),
  invoiceUrl: z.string().optional(), // Base64 or local URL
});

export const CommissionSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  processId: z.string().uuid(),
  financialId: z.string().uuid(),
  responsibleId: z.string().uuid(),
  value: z.number(),
  rate: z.number(),
  status: z.enum(['Prevista', 'Calculada', 'Aprovada', 'Paga']),
  paymentDate: z.string().optional(),
});

export const MessageTemplateSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid().optional(), // Can be global or company-specific
  title: z.string(),
  category: z.string(),
  content: z.string(),
});

export type Client = z.infer<typeof ClientSchema>;
export type Process = z.infer<typeof ProcessSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type Partner = z.infer<typeof PartnerSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Financial = z.infer<typeof FinancialSchema>;
export type Commission = z.infer<typeof CommissionSchema>;
export type MessageTemplate = z.infer<typeof MessageTemplateSchema>;

export type User = z.infer<typeof UserSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Permission = z.infer<typeof PermissionSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;

export interface Database {
  users: User[];
  companies: Company[];
  auditLogs: AuditLog[];
  clients: Client[];
  processes: Process[];
  team: TeamMember[];
  partners: Partner[];
  tasks: Task[];
  financials: Financial[];
  commissions: Commission[];
  templates: MessageTemplate[];
}
