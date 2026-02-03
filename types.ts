
export type View = 'dashboard' | 'clients' | 'client-accounts' | 'professionals' | 'schedule' | 'finance' | 'planning' | 'settings' | 'service-records';

export interface SystemPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
}

export interface SystemProfile {
  logo?: string;
  companyName: string;
  adminName: string;
  username: string;
  cnpj: string;
  phone: string;
  role: string;
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  uf: string;
  birthDate: string;
  password?: string;
  preferences?: SystemPreferences;
}

export interface Client {
  id: string;
  name: string;
  cpf_rg: string;
  cnpj?: string;
  birthDate: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  maritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)';
  phone: string;
  email: string;
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  uf: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  phone?: string;
  email?: string;
  doc: string;
}

export interface ClientAccountEntry {
  id: string;
  clientId: string;
  description: string;
  value: number;
  paymentType: 'Dinheiro' | 'Cartão' | 'Pix' | 'Boleto';
  status: 'pago' | 'pendente' | 'atrasado';
  date: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  clientName: string;
  professionalName: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  type: 'note' | 'meeting';
  participants?: string;
  confirmed: boolean;
  updatedAt?: string;
}
