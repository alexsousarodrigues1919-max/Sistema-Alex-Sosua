
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users as UsersIcon, 
  Calendar as CalendarIcon, 
  DollarSign,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Globe
} from 'lucide-react';

const StatCard = ({ title, value, icon, trend, color, delay }: any) => (
  <div 
    className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color || 'bg-blue-50 text-blue-600'} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg">
          +{trend}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
  </div>
);

interface DashboardProps {
  clientsCount: number;
  appointmentsToday: number;
  totalIncome: number;
  totalExpenses: number;
  revenueData: { name: string, valor: number }[];
}

const Dashboard: React.FC<DashboardProps> = ({ clientsCount, appointmentsToday, totalIncome, totalExpenses, revenueData }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-10 page-transition">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Painel de Controle</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Gestão Estratégica & Performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <Globe size={16} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Netlify Edge Optimized</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
            <Activity size={16} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clientes" value={clientsCount} icon={<UsersIcon size={24} />} delay={100} />
        <StatCard title="Receita Bruta" value={formatCurrency(totalIncome)} icon={<DollarSign size={24} />} color="bg-emerald-50 text-emerald-600" delay={200} />
        <StatCard title="Agendas Hoje" value={appointmentsToday} icon={<CalendarIcon size={24} />} color="bg-amber-50 text-amber-600" delay={300} />
        <StatCard title="Despesas Mês" value={formatCurrency(totalExpenses)} icon={<Briefcase size={24} />} color="bg-rose-50 text-rose-600" delay={400} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Fluxo de Rendimentos</h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Métricas de Performance Mensal</p>
            </div>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black uppercase text-slate-400">Exportar</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData.length > 0 ? revenueData : [{name: 'Sem Dados', valor: 0}]}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', background: '#0f172a', padding: '20px'}}
                  labelStyle={{color: '#94a3b8', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px'}}
                  itemStyle={{color: '#fff', fontSize: '16px', fontWeight: 900}}
                />
                <Area type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
            <ShieldCheck className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6">Segurança e Cloud</p>
              <h4 className="text-2xl font-black mb-8 leading-tight">Netlify Deployment <br/><span className="text-blue-500">Active & Secured</span></h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>SSL/TLS Encryption</span>
                  <span className="text-emerald-500">Verified</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm">
             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Ações do Sistema</h4>
             <div className="grid grid-cols-2 gap-3">
                {['Auditoria', 'Backup', 'Relatórios', 'Metas'].map(item => (
                  <button key={item} className="p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
                    {item}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
