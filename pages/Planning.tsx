
import React, { useState } from 'react';
import { Note } from '../types';
import { FileText, Plus, X, Trash2, CheckCircle, Clock, Calendar, Users, BookOpen, Search } from 'lucide-react';

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
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Planejamento & Atas</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão de Conhecimento do Escritório</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNotes.length > 0 ? filteredNotes.map(note => (
          <div key={note.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all hover:shadow-xl group relative overflow-hidden ${note.confirmed ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${note.type === 'meeting' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {note.type === 'meeting' ? <Users size={22}/> : <FileText size={22}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${note.type === 'meeting' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                      {note.type === 'meeting' ? 'Ata de Reunião' : 'Nota'}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black mt-1 uppercase tracking-tight ${note.confirmed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{note.title}</h3>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => onUpdateNote({...note, confirmed: !note.confirmed})} className={`p-2 rounded-xl ${note.confirmed ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:bg-slate-50'}`} title="Concluir">
                  <CheckCircle size={18} />
                </button>
                {onDeleteNote && (
                  <button onClick={() => onDeleteNote(note.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Excluir"><Trash2 size={18} /></button>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-4 whitespace-pre-wrap">{note.content}</p>
              {note.type === 'meeting' && note.participants && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Participantes</p>
                  <p className="text-[11px] font-bold text-slate-600">{note.participants}</p>
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
            </div>
          </div>
        )) : (
          <div className="lg:col-span-2 py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <BookOpen size={48} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Nenhum registro encontrado</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Novo Registro</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-10 space-y-6">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-2">
                <button type="button" onClick={() => setFormData({...formData, type: 'note'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'note' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>Nota Geral</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'meeting'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${formData.type === 'meeting' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'}`}>Ata de Reunião</button>
              </div>
              <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Título do Registro" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-6">
                <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                <input type="time" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>
              {formData.type === 'meeting' && (
                <input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Participantes da Reunião" value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} />
              )}
              <textarea required rows={5} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none resize-none" placeholder="Conteúdo detalhado..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all">
                Salvar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planning;
