
import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Wallet, 
  Target, 
  Settings, 
  LogOut,
  BadgeCheck,
  CircleDollarSign,
  Briefcase,
  ChevronRight,
  ClipboardList,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} /> },
    { id: 'clients', label: 'Cadastro Clientes', icon: <Users size={20} /> },
    { id: 'client-accounts', label: 'Contas Clientes', icon: <CircleDollarSign size={20} /> },
    { id: 'professionals', label: 'Gestão Equipe', icon: <BadgeCheck size={20} /> },
    { id: 'schedule', label: 'Agenda Pauta', icon: <Calendar size={20} /> },
    { id: 'finance', label: 'Fluxo de Caixa', icon: <Receipt size={20} /> },
    { id: 'planning', label: 'Notação / Reunião', icon: <Target size={20} /> },
    { id: 'service-records', label: 'Atendimentos', icon: <ClipboardList size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#020617] text-slate-400 flex flex-col z-40 border-r border-slate-800/50 shadow-2xl">
      <div className="p-10 mb-6">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transform -rotate-3">
            <Briefcase size={26} strokeWidth={2.5} />
          </div>
          <div>
             <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 leading-none mb-1 text-nowrap">Office Pro</span>
             <span className="block font-extrabold text-base tracking-tighter leading-none">Sistema do <br/>Escritório</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-[10px] tracking-widest uppercase">{item.label}</span>
            </div>
            {currentView === item.id && <ChevronRight size={14} className="opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800/50 bg-[#020617]/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
        >
          <LogOut size={16} />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
