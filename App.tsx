
import React, { useState, useEffect } from 'react';
import { View, Client, Appointment, Transaction, Note, SystemProfile, Professional, ClientAccountEntry } from './types';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Schedule from './pages/Schedule';
import Finance from './pages/Finance';
import Planning from './pages/Planning';
import Settings from './pages/Settings';
import ClientAccounts from './pages/ClientAccounts';
import Professionals from './pages/Professionals';
import { Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('nexus_auth') === 'true');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<SystemProfile | null>(() => {
    const p = localStorage.getItem('nexus_profile');
    return p ? JSON.parse(p) : null;
  });
  
  const [clients, setClients] = useState<Client[]>(() => JSON.parse(localStorage.getItem('nexus_clients') || '[]'));
  const [professionals, setProfessionals] = useState<Professional[]>(() => JSON.parse(localStorage.getItem('nexus_professionals') || '[]'));
  const [appointments, setAppointments] = useState<Appointment[]>(() => JSON.parse(localStorage.getItem('nexus_appointments') || '[]'));
  const [clientAccounts, setClientAccounts] = useState<ClientAccountEntry[]>(() => JSON.parse(localStorage.getItem('nexus_client_accounts') || '[]'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('nexus_transactions') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('nexus_notes') || '[]'));

  useEffect(() => {
    localStorage.setItem('nexus_clients', JSON.stringify(clients));
    localStorage.setItem('nexus_professionals', JSON.stringify(professionals));
    localStorage.setItem('nexus_appointments', JSON.stringify(appointments));
    localStorage.setItem('nexus_client_accounts', JSON.stringify(clientAccounts));
    localStorage.setItem('nexus_transactions', JSON.stringify(transactions));
    localStorage.setItem('nexus_notes', JSON.stringify(notes));
    localStorage.setItem('nexus_profile', JSON.stringify(profile));
  }, [clients, professionals, appointments, clientAccounts, transactions, notes, profile]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (newProfile?: any) => {
    if (newProfile) setProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('nexus_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nexus_auth');
    setCurrentView('dashboard');
  };

  const totalIncomeFromAccounts = clientAccounts.filter(e => e.status === 'pago').reduce((acc, curr) => acc + curr.value, 0);
  const totalIncomeFromTransactions = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = totalIncomeFromAccounts + totalIncomeFromTransactions;
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const revenueData = clientAccounts.filter(e => e.status === 'pago').reduce((acc: any[], curr) => {
    const month = new Date(curr.date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
    const existing = acc.find(a => a.name === month);
    if (existing) existing.valor += curr.value;
    else acc.push({ name: month, valor: curr.value });
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return (
        <Dashboard 
          clientsCount={clients.length} 
          appointmentsToday={appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} 
          totalIncome={totalRevenue} 
          totalExpenses={totalExpenses}
          revenueData={revenueData}
        />
      );
      case 'clients': return (
        <Clients 
          clients={clients} 
          onAddClient={(c) => setClients([...clients, { ...c, id: crypto.randomUUID(), joinedAt: new Date().toISOString() }])} 
          onDeleteClient={(id) => setClients(clients.filter(c => c.id !== id))} 
        />
      );
      case 'client-accounts': return (
        <ClientAccounts 
          clients={clients} 
          entries={clientAccounts} 
          onAddEntry={(e) => setClientAccounts([...clientAccounts, { ...e, id: crypto.randomUUID() }])} 
          onUpdateEntry={(updated) => setClientAccounts(clientAccounts.map(e => e.id === updated.id ? updated : e))} 
          onDeleteEntry={(id) => setClientAccounts(clientAccounts.filter(e => e.id !== id))} 
        />
      );
      case 'professionals': return (
        <Professionals 
          professionals={professionals} 
          onAdd={(p) => setProfessionals([...professionals, { ...p, id: crypto.randomUUID() }])} 
          onDelete={(id) => setProfessionals(professionals.filter(p => p.id !== id))} 
        />
      );
      case 'schedule': return (
        <Schedule 
          appointments={appointments} 
          clients={clients} 
          professionals={professionals} 
          onAddAppointment={(a) => setAppointments([...appointments, { ...a, id: crypto.randomUUID(), status: 'scheduled', clientName: clients.find(c => c.id === a.clientId)?.name || '?', professionalName: professionals.find(p => p.id === a.professionalId)?.name || '?' }])} 
          onDeleteAppointment={(id) => setAppointments(appointments.filter(a => a.id !== id))} 
        />
      );
      case 'finance': return (
        <Finance 
          transactions={transactions} 
          clients={clients} 
          onAddTransaction={(t) => setTransactions([{ ...t, id: crypto.randomUUID() }, ...transactions])} 
          onDeleteTransaction={(id) => setTransactions(transactions.filter(t => t.id !== id))}
        />
      );
      case 'planning': return (
        <Planning 
          notes={notes} 
          onAddNote={(n) => setNotes([...notes, { ...n, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }])} 
          onUpdateNote={(n) => setNotes(notes.map(old => old.id === n.id ? n : old))} 
          onDeleteNote={(id) => setNotes(notes.filter(n => n.id !== id))}
        />
      );
      case 'settings': return <Settings profile={profile} onUpdateProfile={setProfile} />;
      default: return null;
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Plus_Jakarta_Sans'] relative">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout} />
      
      <main className="flex-1 ml-72 p-10 min-h-screen">
        <header className="flex items-center justify-between mb-12 sticky top-0 z-30 py-4 -mt-4 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Busca inteligente..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all font-bold text-sm" />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 bg-white border border-slate-200 rounded-xl relative hover:border-blue-500 transition-colors shadow-sm">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{profile?.adminName || 'Admin'}</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{profile?.companyName || 'Matriz'}</p>
              </div>
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-xl">{profile?.adminName?.charAt(0) || 'A'}</div>
            </div>
          </div>
        </header>

        <div className="pb-10">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
