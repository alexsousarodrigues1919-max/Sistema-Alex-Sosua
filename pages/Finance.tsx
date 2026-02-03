
import React, { useState } from 'react';
import { Transaction, Client } from '../types';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, X, Loader2, Search, Calendar, Tag, ArrowRightCircle, CreditCard, Landmark } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Fluxo de Caixa</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conciliação Financeira & Tesouraria</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 uppercase text-[10px] tracking-widest">
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 transform rotate-12"><Landmark size={120}/></div>
          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4">Saldo Consolidado</p>
            <h2 className="text-4xl font-black tracking-tighter mb-4">{formatBRL(netBalance)}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className={`w-2 h-2 rounded-full ${netBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              <span className="text-[9px] font-black uppercase text-slate-300">Atualizado agora</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ArrowUpCircle size={20}/></div>
              <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">Créditos Totais</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatBRL(totalIncome)}</h3>
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase">Baseado em {transactions.filter(t => t.type === 'income').length} transações</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><ArrowDownCircle size={20}/></div>
              <span className="text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">Débitos Totais</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatBRL(totalExpense)}</h3>
          </div>
          <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase">Comprometimento de {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}% da receita</p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row gap-8 lg:items-center justify-between bg-slate-50/20">
          <div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Livro Diário de Movimentações</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Registros auditáveis por ordem cronológica</p>
          </div>
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            <button onClick={() => setTypeFilter('all')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${typeFilter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Tudo</button>
            <button onClick={() => setTypeFilter('income')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${typeFilter === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Receitas</button>
            <button onClick={() => setTypeFilter('expense')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${typeFilter === 'expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Despesas</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-12 py-6">Histórico da Operação</th>
                <th className="px-12 py-6">Classificação</th>
                <th className="px-12 py-6">Data</th>
                <th className="px-12 py-6 text-right">Valor Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {tx.type === 'income' ? <ArrowUpCircle size={22}/> : <ArrowDownCircle size={22}/>}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-[13px] uppercase tracking-tight">{tx.description}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {tx.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                      <Tag size={10} className="text-blue-500"/> {tx.category}
                    </span>
                  </td>
                  <td className="px-12 py-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Calendar size={12} className="text-slate-300"/> {new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <p className={`font-black text-base tracking-tighter ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'} {formatBRL(tx.amount)}
                    </p>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr><td colSpan={4} className="py-32 text-center text-slate-300 font-bold uppercase text-[10px] tracking-[0.4em]">Livro caixa sem registros para o filtro aplicado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Lançamento Contábil</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Insira os dados da transação financeira</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all"><X size={24} /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-2 shadow-inner">
                  <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>Receita (+)</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500'}`}>Despesa (-)</button>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição do Lançamento</label>
                   <input required className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="Ex: Pagamento Fornecedor Cloud" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Montante (R$)</label>
                     <input type="number" step="0.01" required className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-sm outline-none" placeholder="0,00" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classificação</label>
                     <select className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                       <option>Operacional</option><option>Aluguel/Sede</option><option>Folha Pagamento</option><option>Impostos/Taxas</option><option>Equipamentos</option><option>Marketing</option><option>Outros</option>
                     </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data da Efetivação</label>
                  <input type="date" required className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <button type="submit" disabled={loading} className={`w-full py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all mt-4 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 ${formData.type === 'income' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-rose-600 shadow-rose-600/20'}`}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Processar Lançamento'}
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
