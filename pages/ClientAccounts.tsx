
import React, { useState } from 'react';
import { Client, ClientAccountEntry } from '../types';
import { DollarSign, Plus, X, Trash2, CheckCircle, TrendingUp, Wallet, AlertCircle, Loader2, CreditCard, Receipt, HandCoins } from 'lucide-react';

interface ClientAccountsProps {
  clients: Client[];
  entries: ClientAccountEntry[];
  onAddEntry: (entry: Omit<ClientAccountEntry, 'id'>) => void;
  onUpdateEntry: (entry: ClientAccountEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const ClientAccounts: React.FC<ClientAccountsProps> = ({ clients, entries, onAddEntry, onUpdateEntry, onDeleteEntry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientId: '', description: '', value: 0, paymentType: 'Pix' as any, status: 'pendente' as any, date: new Date().toISOString().split('T')[0]
  });

  const totalPaid = entries.filter(e => e.status === 'pago').reduce((acc, curr) => acc + curr.value, 0);
  const totalPending = entries.filter(e => e.status === 'pendente').reduce((acc, curr) => acc + curr.value, 0);
  const totalLate = entries.filter(e => e.status === 'atrasado').reduce((acc, curr) => acc + curr.value, 0);
  const totalOverall = entries.reduce((acc, curr) => acc + curr.value, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('save');
    setTimeout(() => {
      onAddEntry(formData);
      setIsModalOpen(false);
      setLoading(null);
    }, 1000);
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-10 page-transition">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Contas de Clientes</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão de Lançamentos e Cobranças</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3 active:scale-95">
          <HandCoins size={18} /> Novo Débito
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Wallet size={80}/></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Lançado</p>
          <h3 className="text-2xl font-black text-slate-900">{formatBRL(totalOverall)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><CheckCircle size={80}/></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pago</p>
          <h3 className="text-2xl font-black text-emerald-600">{formatBRL(totalPaid)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><AlertCircle size={80}/></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Em Aberto</p>
          <h3 className="text-2xl font-black text-amber-500">{formatBRL(totalPending)}</h3>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={80}/></div>
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Inadimplência</p>
          <h3 className="text-2xl font-black">{formatBRL(totalLate)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Titular</th>
              <th className="px-8 py-5">Descrição / Data</th>
              <th className="px-8 py-5">Valor / Forma</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900 text-sm uppercase">{clients.find(c => c.id === e.clientId)?.name || 'Cliente Removido'}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-black text-slate-600 uppercase">{e.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(e.date).toLocaleDateString('pt-BR')}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900 text-sm">{formatBRL(e.value)}</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">{e.paymentType}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${
                    e.status === 'pago' ? 'bg-emerald-50 text-emerald-600' : e.status === 'atrasado' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    ● {e.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {e.status !== 'pago' && (
                      <button onClick={() => onUpdateEntry({...e, status: 'pago'})} className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Confirmar Pagamento">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => onDeleteEntry(e.id)} className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Excluir Registro">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={5} className="py-24 text-center text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Nenhum lançamento contábil</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-white">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Lançar Cobrança</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selecionar Cliente Titular</label>
                <select required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                  <option value="">Buscar cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Ex: Honorários Advocatícios" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Débito (R$)</label>
                  <input type="number" step="0.01" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" placeholder="0,00" value={formData.value || ''} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Forma de Recebimento</label>
                  <select required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.paymentType} onChange={e => setFormData({...formData, paymentType: e.target.value as any})}>
                    <option>Pix</option><option>Dinheiro</option><option>Cartão</option><option>Boleto</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vencimento</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Inicial</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="pendente">Pendente</option><option value="pago">Já Pago</option><option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading === 'save'} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                {loading === 'save' ? <Loader2 className="animate-spin" size={20} /> : 'Validar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAccounts;
