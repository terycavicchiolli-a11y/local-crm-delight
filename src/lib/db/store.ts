import { Database, Client, Process, TeamMember, Partner, Task, Financial, Commission, MessageTemplate } from './types';

const STORAGE_KEY = 'diamante_crm_db';

const INITIAL_DATA: Database = {
  users: [
    {
      id: '1',
      name: 'Proprietário Diamante',
      email: 'cesarjuliobraga@gmail.com',
      passwordHash: 'admin123', // Em um sistema real, seria um hash
      role: 'OWNER',
      status: 'Ativo',
      permissions: [],
      createdAt: new Date().toISOString(),
    }
  ],
  companies: [
    {
      id: '1',
      corporateName: 'Diamante Crédito Imobiliário LTDA',
      tradeName: 'Diamante Imobiliária',
      document: '00.000.000/0001-00',
      email: 'contato@diamanteimobiliaria.com.br',
      phone: '(11) 4002-8922',
      status: 'Ativo',
      createdAt: new Date().toISOString(),
    }
  ],
  auditLogs: [],
  clients: [],
  processes: [],
  team: [
    {
      id: '1',
      companyId: '1',
      name: 'Corretor Exemplo',
      role: 'Consultor Imobiliário',
      email: 'exemplo@diamante.com',
      phone: '11999999999',
      commissionRate: 5,
      status: 'Ativo'
    }
  ],
  partners: [],
  tasks: [],
  financials: [],
  commissions: [],
  templates: [
    {
      id: '1',
      companyId: '1',
      title: 'Primeiro Contato',
      category: 'Atendimento',
      content: 'Olá {nome}, sou da Diamante Imobiliária. Recebi seu interesse no processo {processo} e gostaria de conversar sobre os próximos passos.'
    }
  ]
};

export const getDb = (): Database => {
  if (typeof window === 'undefined') return INITIAL_DATA;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveDb(INITIAL_DATA);
    return INITIAL_DATA;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DATA;
  }
};

export const saveDb = (db: Database) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event('storage-update'));
};

// Generic CRUD helpers
export const db = {
  getAll: <K extends keyof Database>(key: K): Database[K] => getDb()[key],
  
  getById: <K extends keyof Database>(key: K, id: string): Database[K][number] | undefined => {
    return (getDb()[key] as any[]).find(item => item.id === id);
  },

  upsert: <K extends keyof Database>(key: K, item: Database[K][number]) => {
    const currentDb = getDb();
    const collection = currentDb[key] as any[];
    const index = collection.findIndex(i => i.id === item.id);
    
    if (index > -1) {
      collection[index] = item;
    } else {
      collection.push(item);
    }
    
    saveDb(currentDb);
  },

  delete: <K extends keyof Database>(key: K, id: string) => {
    const currentDb = getDb();
    currentDb[key] = (currentDb[key] as any[]).filter(item => item.id !== id) as any;
    saveDb(currentDb);
  }
};
