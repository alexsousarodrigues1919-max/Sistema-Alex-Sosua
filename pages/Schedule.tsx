
import React, { useState } from 'react';
import { Appointment, Client, Professional } from '../types';
import { Calendar as LucideCalendar, Clock, User, X, Plus, Trash2, CheckCircle, Loader2, Briefcase } from 'lucide-react';

interface ScheduleProps {
  appointments: Appointment[];
  clients: Client[];
  professionals: Professional[];
  onAddAppointment: (app: Omit<Appointment, 'id' | 'clientName' | 'status' | 'professionalName'>) => void;
  onDeleteAppointment: (id: string) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ appointments, clients, professionals, onAddAppointment, onDeleteAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientId: '', professionalId: '', title: '', date: new Date().toISOString().split('T')[0], time: '09:00', duration: '01:00'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('save');
    setTimeout(() => {
      onAddAppointment(form);
      setIsModalOpen(false);
      setLoading(null);
    }, 1000);
  };

  return (
    <div className="space-y-10 page-transition">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Agenda Executiva</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sincronização de Compromissos e Especialistas</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3">
          <Plus size={18} /> Marcar Horário
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {appointments.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">Nenhum compromisso agendado</div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center font-black">
                  <span className="text-[10px] uppercase">{new Date(app.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                  <span className="text-lg leading-none">{new Date(app.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-tight">{app.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><User size={12} className="text-blue-600"/> {app.clientName}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Briefcase size={12} className="text-blue-600"/> {app.professionalName}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Clock size={12} className="text-blue-600"/> {app.time}</span>
                  </div>
                </div>
                <button onClick={() => onDeleteAppointment(app.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
            <h4 className="font-black uppercase tracking-widest text-[11px] text-blue-400 mb-6">Calendário do Mês</h4>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['D','S','T','Q','Q','S','S'].map(d => <span key={d} className="text-[9px] font-black opacity-40">{d}</span>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-black ${i+1 === new Date().getDate() ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/10'}`}>
                  {i+1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-white">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Reservar Pauta</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cliente Solicitante</label>
                <select required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialista Alocado</label>
                <select required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={form.professionalId} onChange={e => setForm({...form, professionalId: e.target.value})}>
                  <option value="">Selecione...</option>
                  {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assunto / Pauta</label>
                <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" placeholder="Ex: Reunião de Planejamento" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                  <input type="date" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horário</label>
                  <input type="time" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading === 'save'} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                {loading === 'save' ? <Loader2 className="animate-spin" size={20} /> : 'Processar Reserva'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
