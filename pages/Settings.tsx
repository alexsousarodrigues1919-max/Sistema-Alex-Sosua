
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, Save, Camera, Key, Smartphone, History, Monitor, Languages, Database, RefreshCcw, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, Phone, Building2 } from 'lucide-react';
import { SystemProfile } from '../types';

interface SettingsProps {
  profile: SystemProfile | null;
  onUpdateProfile: (profile: SystemProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const [profileData, setProfileData] = useState({ ...profile });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2').substring(0, 15);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const simulateLoading = (id: string, action: () => void) => {
    setLoading(id);
    setTimeout(() => {
      action();
      setLoading(null);
    }, 1000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    simulateLoading('save-profile', () => {
      onUpdateProfile(profileData as SystemProfile);
      showToast("Perfil atualizado com sucesso!");
    });
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new) {
      showToast("Preencha os campos!", "error");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showToast("As senhas não coincidem!", "error");
      return;
    }
    simulateLoading('change-password', () => {
      onUpdateProfile({ ...profileData, password: passwords.new } as SystemProfile);
      setPasswords({ current: '', new: '', confirm: '' });
      showToast("Senha alterada com sucesso!");
    });
  };

  const updatePreference = (key: string, value: any) => {
    const currentPrefs = profileData.preferences || {
      theme: 'light',
      language: 'pt-BR',
      notifications: { email: true, browser: true, sms: false, marketing: false }
    };
    let newPrefs = { ...currentPrefs };
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      newPrefs = { ...newPrefs, [parent]: { ...(newPrefs as any)[parent], [child]: value } };
    } else {
      newPrefs = { ...newPrefs, [key]: value };
    }
    const updated = { ...profileData, preferences: newPrefs } as SystemProfile;
    setProfileData(updated);
    onUpdateProfile(updated);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell size={18} /> },
    { id: 'security', label: 'Segurança', icon: <Shield size={18} /> },
    { id: 'general', label: 'Geral', icon: <Globe size={18} /> },
  ];

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 relative pb-10">
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
          <span className="font-black text-xs uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Personalização e Segurança do Admin</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-50 dark:border-slate-700 bg-blue-600 text-white flex items-center justify-center font-black text-2xl">
                    {profileData?.adminName?.charAt(0)}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg"><Camera size={14} /></button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Dados de Perfil</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerencie suas informações</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Admin</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/><input className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={profileData?.adminName || ''} onChange={e => setProfileData({...profileData, adminName: e.target.value} as any)} /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Escritório</label>
                  <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/><input className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={profileData?.companyName || ''} onChange={e => setProfileData({...profileData, companyName: e.target.value} as any)} /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/><input className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={profileData?.phone || ''} onChange={e => setProfileData({...profileData, phone: maskPhone(e.target.value)} as any)} /></div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading === 'save-profile'} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center gap-2">
                  {loading === 'save-profile' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar Perfil
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="pb-8 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Alterar Senha de Acesso</h3>
                <div className="grid grid-cols-1 gap-4 max-w-md">
                   <div className="relative">
                     <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                     <input type={showPass ? "text" : "password"} placeholder="Senha Atual" className="w-full pl-9 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                     <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                   </div>
                   <input type={showPass ? "text" : "password"} placeholder="Nova Senha" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                   <input type={showPass ? "text" : "password"} placeholder="Confirmar Nova Senha" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white outline-none" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                   <button onClick={handleChangePassword} disabled={loading === 'change-password'} className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                     {loading === 'change-password' && <Loader2 size={14} className="animate-spin" />} Atualizar Credenciais
                   </button>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3"><Monitor size={18} className="text-emerald-600"/><p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">Sessão Atual Ativa • São Paulo, BR</p></div>
                <span className="text-[8px] font-black uppercase text-emerald-600 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg">Protegido</span>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Preferências de Alerta</h3>
              {['email', 'browser', 'sms'].map(id => (
                <div key={id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase">{id}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Notificações automáticas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={(profileData.preferences?.notifications as any)?.[id] || false} onChange={(e) => updatePreference(`notifications.${id}`, e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-10">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Interface Visual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['light', 'dark', 'auto'].map((t) => (
                    <button key={t} onClick={() => updatePreference('theme', t as any)} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${(profileData.preferences?.theme || 'light') === t ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-700'}`}>
                      <div className={`w-full h-12 rounded-lg ${t === 'light' ? 'bg-white' : t === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-r from-white to-slate-900'}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-500">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { if(confirm("Apagar tudo?")) { localStorage.clear(); window.location.reload(); } }} className="w-full p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[2rem] flex items-center justify-between text-rose-600">
                   <div className="text-left"><h4 className="font-black uppercase text-sm">Resetar Banco de Dados</h4><p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Excluir todos os clientes e registros</p></div>
                   <RefreshCcw size={20}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
