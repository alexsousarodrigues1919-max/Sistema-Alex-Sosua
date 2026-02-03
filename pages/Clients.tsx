
import React, { useState } from 'react';
import { Client } from '../types';
import { Search, Plus, X, Trash2, Loader2, User, Phone, MapPin, Mail, Calendar, Fingerprint, ChevronRight, Heart, Users } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id' | 'joinedAt' | 'balance'>) => void;
  onDeleteClient: (id: string) => void;
}

const applyMask = (type: 'doc' | 'phone' | 'cep', value: string) => {
  const v = value.replace(/\D/g, '');
  if (type === 'doc') {
    if (v.length <= 11) return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').substring(0, 14);
    return v.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 18);
  }
  if (type === 'phone') return v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2').substring(0, 15);
  if (type === 'cep') return v.replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
  return value;
};

const InputField = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
        <Icon size={16} />
      </div>
      <input {...props} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" />
    </div>
  </div>
);

const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onDeleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: '', cpf_rg: '', cnpj: '', birthDate: '', gender: 'Masculino' as any, maritalStatus: 'Solteiro(a)' as any,
    phone: '', email: '', cep: '', address: '', number: '', neighborhood: '', city: '', uf: 'SP',
    status: 'active' as const
  };

  const [form, setForm] = useState(initialForm);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onAddClient(form);
      setIsAddModalOpen(false);
      setForm(initialForm);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-10 page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestão de Clientes</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Base de Dados • {clients.length} Registros</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 uppercase text-[11px] tracking-widest">
          <Plus size={20} /> Cadastrar Titular
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Localizar por nome, documento ou e-mail..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Perfil</th>
                <th className="px-8 py-5">Documento / Nascimento</th>
                <th className="px-8 py-5">Contatos</th>
                <th className="px-8 py-5">Localidade</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/10 uppercase">{c.name.charAt(0)}</div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm uppercase tracking-tight">{c.name}</p>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{c.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{c.cpf_rg}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(c.birthDate).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-tight">{c.email}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{c.phone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-tight">{c.city} - {c.uf}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase truncate max-w-[150px]">{c.address}, {c.number}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => onDeleteClient(c.id)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                      <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><ChevronRight size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={5} className="py-24 text-center text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Nenhum cliente cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Novo Registro Mestre</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Preencha todos os campos obrigatórios abaixo</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <InputField label="Nome Completo" icon={User} value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} placeholder="Ex: Rodrigo Amarante" required />
                </div>
                <InputField label="Nascimento" icon={Calendar} type="date" value={form.birthDate} onChange={(e:any) => setForm({...form, birthDate: e.target.value})} required />
                
                <InputField label="Documento (CPF/RG)" icon={Fingerprint} value={form.cpf_rg} onChange={(e:any) => setForm({...form, cpf_rg: applyMask('doc', e.target.value)})} placeholder="000.000.000-00" required />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sexo</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-bold text-sm" value={form.gender} onChange={(e:any) => setForm({...form, gender: e.target.value})}>
                    <option>Masculino</option><option>Feminino</option><option>Outro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado Civil</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-bold text-sm" value={form.maritalStatus} onChange={(e:any) => setForm({...form, maritalStatus: e.target.value})}>
                    <option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option>
                  </select>
                </div>

                <InputField label="Telefone" icon={Phone} value={form.phone} onChange={(e:any) => setForm({...form, phone: applyMask('phone', e.target.value)})} placeholder="(00) 00000-0000" required />
                <InputField label="E-mail Pessoal" icon={Mail} type="email" value={form.email} onChange={(e:any) => setForm({...form, email: e.target.value})} placeholder="contato@exemplo.com" required />
                <InputField label="CEP" icon={MapPin} value={form.cep} onChange={(e:any) => setForm({...form, cep: applyMask('cep', e.target.value)})} placeholder="00000-000" required />

                <div className="md:col-span-2">
                  <InputField label="Endereço" icon={MapPin} value={form.address} onChange={(e:any) => setForm({...form, address: e.target.value})} placeholder="Rua, Avenida..." required />
                </div>
                <InputField label="Número" icon={MapPin} value={form.number} onChange={(e:any) => setForm({...form, number: e.target.value})} placeholder="SN" required />

                <InputField label="Bairro" icon={MapPin} value={form.neighborhood} onChange={(e:any) => setForm({...form, neighborhood: e.target.value})} placeholder="Ex: Higienópolis" required />
                <InputField label="Cidade" icon={MapPin} value={form.city} onChange={(e:any) => setForm({...form, city: e.target.value})} placeholder="São Paulo" required />
                <InputField label="UF" icon={MapPin} value={form.uf} onChange={(e:any) => setForm({...form, uf: e.target.value.toUpperCase()})} placeholder="SP" maxLength={2} required />
              </div>

              <div className="pt-10 border-t border-slate-50">
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Processar Cadastro Mestre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
