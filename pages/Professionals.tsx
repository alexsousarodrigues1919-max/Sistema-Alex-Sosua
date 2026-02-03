
import React, { useState } from 'react';
import { Professional } from '../types';
import { BadgeCheck, Plus, X, Trash2, Edit2, User, Phone, Search, Loader2, Fingerprint, Mail, Briefcase } from 'lucide-react';

interface ProfessionalsProps {
  professionals: Professional[];
  onAdd: (p: Omit<Professional, 'id'>) => void;
  onDelete: (id: string) => void;
}

const applyPhoneMask = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2').substring(0, 15);

const Professionals: React.FC<ProfessionalsProps> = ({ professionals, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', specialty: '', phone: '', email: '', doc: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('save');
    setTimeout(() => {
      onAdd(formData);
      setIsModalOpen(false);
      setFormData({ name: '', role: '', specialty: '', phone: '', email: '', doc: '' });
      setLoading(null);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remover este profissional da equipe permanentemente?")) {
      setLoading(`delete-${id}`);
      setTimeout(() => {
        onDelete(id);
        setLoading(null);
      }, 800);
    }
  };

  return (
    <div className="space-y-10 page-transition">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Capital Humano</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão de Equipe e Especialistas</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black shadow-xl shadow-slate-900/10 transition-all active:scale-95 uppercase text-[11px] tracking-widest">
          <Plus size={18} /> Novo Especialista
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
               <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl shadow-inner">
                 {p.name.charAt(0)}
               </div>
               <div className="flex gap-1">
                 <button onClick={() => handleDelete(p.id)} disabled={loading === `delete-${p.id}`} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                   {loading === `delete-${p.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16}/>}
                 </button>
               </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{p.name}</h3>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{p.role}</p>
            
            <div className="space-y-3 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Fingerprint size={14} className="text-slate-300"/> {p.doc || '---.---.---'}
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Phone size={14} className="text-slate-300"/> {p.phone || '(00) 00000-0000'}
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Mail size={14} className="text-slate-300"/> {p.email || 'contato@pro.com'}
               </div>
            </div>
          </div>
        ))}
        {professionals.length === 0 && (
          <div className="lg:col-span-3 py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum profissional na equipe</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-white overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Ficha do Especialista</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Ex: Dr. Roberto Carlos" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo / Função</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Ex: Advogado Pleno" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento (CPF)</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="000.000.000-00" value={formData.doc} onChange={(e) => setFormData({...formData, doc: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="(00) 00000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: applyPhoneMask(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                  <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="admin@pro.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading === 'save'} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                {loading === 'save' ? <Loader2 className="animate-spin" size={20} /> : 'Processar Contratação'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professionals;
