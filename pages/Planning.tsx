
import React, { useState } from 'react';
import { Note } from '../types';
import { FileText, Plus, X, Trash2, CheckCircle, Clock, Calendar, Users, BookOpen, Search, Filter, Hash } from 'lucide-react';

interface PlanningProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
}

const Planning: React.FC<PlanningProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'note' | 'meeting'>('all');
  const [formData, setFormData] = useState<Omit<Note, 'id' | 'updatedAt'>>({ 
    title: '', 
    content: '', 
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
    type: 'note',
    participants: '',
    confirmed: false 
  });

  const filteredNotes = notes.filter(n => filter === 'all' || n.type === filter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(formData);
    setIsModalOpen(false);
    setFormData({ 
      title: '', 
      content: '', 
      date: new Date().toISOString().split('T')[0], 
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
      type: 'note',
      participants: '',
      confirmed: false 
    });
  };

  return (
    <div className="space-y-8 page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestão de Conhecimento</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Notas Rápidas & Atas de Reunião Profissionais</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Todos</button>
            <button onClick={() => setFilter('note')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'note' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Notas</button>
            <button onClick={() => setFilter('meeting')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'meeting' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Reuniões</button>
          </div>
          
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-slate-900/10 transition-all active:scale-95 uppercase text-[10px] tracking-widest">
            <Plus size={18} /> Novo Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <div key={note.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all hover:shadow-xl group relative overflow-hidden ${note.confirmed ? 'border-emerald-100' : 'border-slate-100'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.02] p-6 pointer-events-none transform translate-x-4 -translate-y-4`}>
              {note.type === 'meeting' ? <Users size={128}/> : <FileText size={128}/>}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${note.type === 'meeting' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {note.type === 'meeting' ? <Users size={22}/> : <FileText size={22}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${note.type === 'meeting' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                      {note.type === 'meeting' ? 'Ata de Reunião' : 'Nota Estratégica'}
                    </span>
                    {note.confirmed && <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">Finalizado</span>}
                  </div>
                  <h3 className={`text-lg font-black mt-1 uppercase tracking-tight ${note.confirmed ? 'text-slate-400' : 'text-slate-900'}`}>{note.title}</h3>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => onUpdateNote({...note, confirmed: !note.confirmed})} className={`p-2 rounded-xl ${note.confirmed ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`} title="Marcar como lido/feito">
                  <CheckCircle size={18} />
                </button>
                {onDeleteNote && (
                  <button onClick={() => onDeleteNote(note.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Excluir"><Trash2 size={18} /></button>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className={`text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap ${note.type === 'meeting' ? 'bg-slate-50 p-6 rounded-3xl border border-slate-100 font-mono text-[13px]' : ''}`}>
                {note.content}
              </div>
              
              {note.type === 'meeting' && note.participants && (
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <Users size={14} className="text-indigo-600"/>
                  <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Pauta: {note.participants}</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} className="text-blue-500"/> {new Date(note.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock size={12} className="text-blue-500"/> {note.time}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                <Hash size={10} /> {note.id.substring(0,8)}
              </div>
            </div>
          </div>
        )) : (
          <div className="lg:col-span-2 py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200">
             <BookOpen size={64} className="mx-auto text-slate-100 mb-8" />
             <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Aguardando novos registros para o arquivo</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-8 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline px-6 py-2 bg-blue-50 rounded-full">Iniciar Documentação</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Editor de Registro</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gere documentos internos com validade operacional</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAdd} className="p-10 space-y-6">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-2 shadow-inner">
                <button type="button" onClick={() => setFormData({...formData, type: 'note'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'note' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>Nota Estratégica</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'meeting'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'meeting' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>Ata de Reunião</button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assunto / Título do Documento</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="Ex: Definição de Metas Q3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horário</label>
                  <input type="time" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              {formData.type === 'meeting' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Participantes / Presentes</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Ex: Rodrigo, Marina, Carlos (Consultor)" value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo do Registro</label>
                <textarea required rows={6} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl font-medium text-sm outline-none resize-none leading-relaxed focus:ring-4 focus:ring-blue-500/5 transition-all" placeholder="Descreva os pontos abordados, decisões tomadas e próximos passos..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-blue-600">
                Arquivar Documento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;
