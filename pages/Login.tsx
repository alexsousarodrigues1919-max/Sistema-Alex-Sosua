
import React, { useState } from 'react';
import { Lock, Loader2, Building2, User, Phone, MapPin, Briefcase, ChevronRight, Fingerprint, ShieldCheck, Calendar } from 'lucide-react';

interface LoginProps {
  onLogin: (profile?: any) => void;
}

const applyMask = (type: 'cnpj' | 'phone' | 'cep', value: string) => {
  const v = value.replace(/\D/g, '');
  if (type === 'cnpj') return v.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 18);
  if (type === 'phone') return v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2').substring(0, 15);
  if (type === 'cep') return v.replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
  return value;
};

const InputField = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} *</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
        <Icon size={16} />
      </div>
      <input {...props} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold placeholder:text-slate-300" />
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [auth, setAuth] = useState({ user: '', pass: '' });
  const [reg, setReg] = useState({
    companyName: '', adminName: '', username: '', cnpj: '', phone: '',
    role: '', cep: '', address: '', number: '', neighborhood: '', city: '', uf: '',
    birthDate: '', password: '', confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação básica manual
    if (mode === 'register') {
      const emptyFields = Object.entries(reg).filter(([k, v]) => v === '');
      if (emptyFields.length > 0) {
        setError("Todos os campos do formulário são obrigatórios.");
        setLoading(false);
        return;
      }
    }

    setTimeout(() => {
      if (mode === 'register') {
        if (reg.password !== reg.confirmPassword) {
          setError("As senhas não coincidem!");
          setLoading(false);
          return;
        }
        localStorage.setItem('nexus_profile', JSON.stringify(reg));
        onLogin(reg);
      } else {
        const saved = localStorage.getItem('nexus_profile');
        if (saved) {
          const profile = JSON.parse(saved);
          if (auth.user === profile.username && auth.pass === profile.password) {
            onLogin(profile);
          } else {
            setError("Usuário ou senha incorretos.");
          }
        } else {
          setError("Nenhum escritório cadastrado neste dispositivo.");
        }
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className={`w-full ${mode === 'login' ? 'max-w-md' : 'max-w-4xl'} bg-white shadow-2xl p-10 rounded-[2.5rem] relative z-10 border border-white/50 animate-in zoom-in-95 duration-500 overflow-hidden`}>
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/30 transform -rotate-3 hover:rotate-0 transition-transform">
            <Briefcase size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Office <span className="text-blue-600">Pro</span></h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Arquitetura de Gestão Corporativa</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'login' ? (
            <div className="space-y-4">
              <InputField label="Usuário" icon={User} type="text" value={auth.user} onChange={(e:any) => setAuth({...auth, user: e.target.value})} placeholder="admin" required />
              <InputField label="Senha" icon={Lock} type="password" value={auth.pass} onChange={(e:any) => setAuth({...auth, pass: e.target.value})} placeholder="••••••••" required />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <InputField label="Empresa / Razão Social" icon={Building2} value={reg.companyName} onChange={(e:any) => setReg({...reg, companyName: e.target.value})} placeholder="Ex: Master Consulting LTDA" required />
              </div>
              <InputField label="CNPJ" icon={Fingerprint} value={reg.cnpj} onChange={(e:any) => setReg({...reg, cnpj: applyMask('cnpj', e.target.value)})} placeholder="00.000.000/0000-00" required />
              
              <InputField label="Administrador (Nome Completo)" icon={User} value={reg.adminName} onChange={(e:any) => setReg({...reg, adminName: e.target.value})} placeholder="Ex: João da Silva" required />
              <InputField label="Cargo" icon={Briefcase} value={reg.role} onChange={(e:any) => setReg({...reg, role: e.target.value})} placeholder="Ex: Diretor Executivo" required />
              <InputField label="Telefone Comercial" icon={Phone} value={reg.phone} onChange={(e:any) => setReg({...reg, phone: applyMask('phone', e.target.value)})} placeholder="(00) 00000-0000" required />

              <InputField label="CEP" icon={MapPin} value={reg.cep} onChange={(e:any) => setReg({...reg, cep: applyMask('cep', e.target.value)})} placeholder="00000-000" required />
              <div className="md:col-span-2">
                <InputField label="Endereço" icon={MapPin} value={reg.address} onChange={(e:any) => setReg({...reg, address: e.target.value})} placeholder="Rua, Avenida..." required />
              </div>

              <InputField label="Número" icon={MapPin} value={reg.number} onChange={(e:any) => setReg({...reg, number: e.target.value})} placeholder="123" required />
              <InputField label="Bairro" icon={MapPin} value={reg.neighborhood} onChange={(e:any) => setReg({...reg, neighborhood: e.target.value})} placeholder="Centro" required />
              <InputField label="Cidade" icon={MapPin} value={reg.city} onChange={(e:any) => setReg({...reg, city: e.target.value})} placeholder="São Paulo" required />

              <InputField label="UF" icon={MapPin} value={reg.uf} onChange={(e:any) => setReg({...reg, uf: e.target.value.toUpperCase()})} placeholder="SP" maxLength={2} required />
              <InputField label="Nascimento Admin" icon={Calendar} type="date" value={reg.birthDate} onChange={(e:any) => setReg({...reg, birthDate: e.target.value})} required />
              <InputField label="ID de Acesso (Username)" icon={User} value={reg.username} onChange={(e:any) => setReg({...reg, username: e.target.value})} placeholder="admin_01" required />

              <InputField label="Senha Mestra" icon={Lock} type="password" value={reg.password} onChange={(e:any) => setReg({...reg, password: e.target.value})} placeholder="••••••••" required />
              <InputField label="Confirmar Senha" icon={ShieldCheck} type="password" value={reg.confirmPassword} onChange={(e:any) => setReg({...reg, confirmPassword: e.target.value})} placeholder="••••••••" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 active:scale-95 group">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>{mode === 'login' ? 'Acessar Console' : 'Concluir Registro do Sistema'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 pt-8">
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-slate-400 hover:text-blue-600 font-bold text-[10px] uppercase tracking-widest transition-colors">
            {mode === 'login' ? 'Novo por aqui? Criar Banco de Dados' : 'Já possui conta? Voltar ao Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
