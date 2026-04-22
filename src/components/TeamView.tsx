import { useState } from 'react';
import { User, Mail, Shield, CheckCircle2, Pencil, Save, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  assignmentRule?: string;
}

interface TeamViewProps {
  users: TeamMember[];
  onUpdateUser: (user: TeamMember) => void;
  currentUser: any;
  isDarkMode: boolean;
  language: string;
}

export default function TeamView({ users, onUpdateUser, currentUser, isDarkMode, language }: TeamViewProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin';

  const filteredUsers = users.filter(u => u.role !== 'superadmin');

  const handleEdit = (user: TeamMember) => {
    if (!isAdmin) return;
    setEditingUserId(user.id);
    setEditValue(user.assignmentRule || '');
  };

  const handleSave = (user: TeamMember) => {
    onUpdateUser({ ...user, assignmentRule: editValue });
    setEditingUserId(null);
  };

  return (
    <div className={`h-full overflow-y-auto p-4 lg:p-8 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] ${isDarkMode ? 'bg-[#040308] !bg-[radial-gradient(#1e293b_1px,transparent_1px)]' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-primary-1' : 'text-blue-900'}`}>
            {language === 'Español' ? 'Equipo de Trabajo' : 'Work Team'}
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {language === 'Español' ? 'Gestiona los miembros de tu equipo y sus reglas de asignación automática.' : 'Manage your team members and their automatic assignment rules.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className={`rounded-2xl border p-6 transition-all shadow-sm hover:shadow-md ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-1/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDarkMode ? 'bg-dark-bg border-dark-bg' : 'bg-white border-white'}`}>
                    <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/10" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-lg truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-sm truncate">{user.email || `${user.id}@empresa.com`}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'admin' || user.role === 'superadmin' 
                    ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-blue-100 text-blue-700')
                    : (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                }`}>
                  <Shield className="w-3 h-3" />
                  {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'ADMIN' : 'ASESOR'}
                </span>
              </div>

              <div className={`pt-4 border-t ${isDarkMode ? 'border-primary-2/20' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Regla de Asignación' : 'Assignment Rule'}
                  </h4>
                  {isAdmin && editingUserId !== user.id && (
                    <button 
                      onClick={() => handleEdit(user)}
                      className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {editingUserId === user.id ? (
                  <div className="space-y-3">
                    <textarea 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-primary-1 resize-none h-24 ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      placeholder={language === 'Español' ? "Ej: Atiende quejas, soporte técnico y devoluciones" : "Ex: Handles complaints, tech support and returns"}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingUserId(null)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleSave(user)}
                        className="bg-primary-1 text-white p-2 rounded-lg hover:bg-primary-1/90 transition-all shadow-lg shadow-primary-1/20"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {user.assignmentRule || (language === 'Español' ? "Sin regla definida" : "No rule defined")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
