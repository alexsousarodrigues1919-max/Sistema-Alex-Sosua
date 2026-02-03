
import React, { useState } from 'react';
import { Transaction, Client } from '../types';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, X, Loader2, Search, Calendar, Tag } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  clients: Client[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction?: (id: string) => void;
}

const Finance: React.FC<FinanceProps> = ({ transactions, clients, onAddTransaction, onDeleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Geral',
    amount: 0,
    type: 'income'
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => typeFilter === 'all' || t.type === typeFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onAddTransaction(formData);
      setIsModalOpen(false);
      setLoading(false);
      setFormData({ date: new Date().toISOString().split('T')[0], description: '', category: 'Geral', amount: 0, type: 'income' });
    }, 800);
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-10 page-transition">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Fluxo de Caixa</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Controle Financeiro Operacional</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 uppercase text-[10px] tracking-widest">
          <Plus size={18} /> Lançar Movimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Saldo em Caixa</p>
          <h2 className="text-4xl font-black tracking-tighter">{formatBRL(netBalance)}</h2>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpCircle size={18} className="text-emerald-500"/>
            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest">Entradas</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-600">{formatBRL(totalIncome)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDownCircle size={18} className="text-rose-500"/>
            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest">Saídas</span>
          </div>
          <h3 className="text-2xl font-black text-rose-600">{formatBRL(totalExpense)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extrato de Movimentações</h4>
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${typeFilter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Tudo</button>
            <button onClick={() => setTypeFilter('income')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${typeFilter === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Créditos</button>
            <button onClick={() => setTypeFilter('expense')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${typeFilter === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Débitos</button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th className="px-10 py-5">Descrição</th>
              <th className="px-10 py-5">Categoria / Data</th>
              <th className="px-10 py-5 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-6">
                  <p className="font-black text-slate-900 text-sm uppercase">{tx.description}</p>
                </td>
                <td className="px-10 py-6">
                  <p className="text-[10px] font-black text-slate-600 uppercase flex items-center gap-2"><Tag size={12}/> {tx.category}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                </td>
                <td className="px-10 py-6 text-right">
                  <p className={`font-black text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} {formatBRL(tx.amount)}
                  </p>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr><td colSpan={3} className="py-20 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">Nenhum lançamento</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Novo Lançamento</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                  <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>Receita (+)</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500'}`}>Despesa (-)</button>
                </div>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="O que é este lançamento?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-6">
                   <input type="number" step="0.01" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" placeholder="Valor R$" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                   <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     <option>Geral</option><option>Aluguel</option><option>Salários</option><option>Impostos</option><option>Serviços</option>
                   </select>
                </div>
                <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                <button type="submit" disabled={loading} className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase text-white shadow-2xl active:scale-95 transition-all ${formData.type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Processar Lançamento'}
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
