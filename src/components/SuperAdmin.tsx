import React, { useState } from 'react';
import { LayoutDashboard, Building2, AlertTriangle, Users, LogOut, ArrowRight, Activity, Shield, CheckCircle, Pencil, Trash2, KeyRound, Plus, X, HardDrive, Bug, Zap, CreditCard, CheckCircle2, Settings, Globe, Search, User, Filter } from 'lucide-react';
import FrequencySettingsForm from './FrequencySettingsForm';
import CustomDropdown from './CustomDropdown';

export function SuperAdminLayout({ 
  children, 
  currentView, 
  setCurrentView, 
  isDarkMode, 
  setIsDarkMode,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  language, 
  onLogout 
}: any) {
  const navItems = [
    { id: 'global_dashboard', label: language === 'Español' ? 'Dashboard Global' : 'Global Dashboard', icon: LayoutDashboard },
    { id: 'global_workspaces', label: language === 'Español' ? 'Frecuencias' : 'Frequencies', icon: Building2 },
    { id: 'global_reports', label: language === 'Español' ? 'Reportes del Sistema' : 'System Reports', icon: AlertTriangle },
    { id: 'global_users', label: language === 'Español' ? 'Usuarios Globales' : 'Global Users', icon: Users },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden font-body transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <aside className={`h-full flex-col shrink-0 border-r backdrop-blur-md flex transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/30' : 'bg-white/80 border-primary-2/20'}`}>
        <div className={`p-6 shrink-0 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
          <h1 className="font-headline text-2xl font-bold text-primary-2 tracking-tight flex items-center gap-2">
            <Shield className="text-primary-1 w-6 h-6" /> {!isSidebarCollapsed && 'Echoes Admin'}
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === item.id ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
              {!isSidebarCollapsed && item.label}
            </button>
          ))}
        </nav>

        <div className={`p-4 mt-auto border-t flex flex-col gap-4 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col justify-center gap-4' : 'justify-between'} px-2`}>
            <button 
              onClick={() => setIsDarkMode && setIsDarkMode(!isDarkMode)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-primary-2/10'}`}
              title={isSidebarCollapsed ? (language === 'Español' ? 'Cambiar Tema' : 'Toggle Theme') : undefined}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed && setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-primary-2/10'}`}
              title={isSidebarCollapsed ? (language === 'Español' ? 'Expandir Menú' : 'Expand Menu') : (language === 'Español' ? 'Colapsar Menú' : 'Collapse Menu')}
            >
              <svg className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <button 
            onClick={onLogout}
            className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 hover:bg-white/5 text-red-400' : 'bg-slate-50 border-primary-2/20 hover:bg-slate-100 text-red-500'}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Cerrar Sesión' : 'Log Out') : undefined}
          >
            <LogOut className={isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
            {!isSidebarCollapsed && <span className="font-bold text-sm">{language === 'Español' ? 'Cerrar Sesión' : 'Log Out'}</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col relative bg-light-bg bg-[linear-gradient(to_right,rgba(0,200,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.15)_1px,transparent_1px)] [background-size:40px_40px] h-full overflow-y-auto ${isDarkMode ? 'bg-dark-bg bg-[linear-gradient(to_right,rgba(0,200,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.05)_1px,transparent_1px)]' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export function GlobalDashboard({ workspaces, globalReports, users, isDarkMode, language }: any) {
  const totalUsers = users.length;
  const totalWorkspaces = workspaces.length;
  const activeReports = globalReports.filter((r: any) => r.status !== 'Resuelto').length;

  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'warning', workspace: 'Acme Corp', message: 'Ha alcanzado el 90% de su límite de almacenamiento en la Bóveda.', time: 'hace 10 min', read: false },
    { id: 'n2', type: 'error', workspace: 'Casa de Verano', message: 'Nuevo reporte de sistema: El Eco no está respondiendo en inglés.', time: 'hace 1 hora', read: false },
    { id: 'n3', type: 'info', workspace: 'Acme Corp', message: 'El usuario Carlos (Asesor) solicitó un restablecimiento de contraseña.', time: 'hace 2 horas', read: false },
    { id: 'n4', type: 'billing', workspace: 'Global', message: 'Alerta: El consumo total de la API del Eco ha superado el 80% del límite del servidor.', time: 'hace 5 horas', read: true }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <HardDrive className="w-5 h-5 text-amber-500" />;
      case 'error': return <Bug className="w-5 h-5 text-red-500" />;
      case 'info': return <Users className="w-5 h-5 text-blue-500" />;
      case 'billing': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationBg = (type: string, isDark: boolean) => {
    if (isDark) {
      switch (type) {
        case 'warning': return 'bg-amber-500/10 border-amber-500/20';
        case 'error': return 'bg-red-500/10 border-red-500/20';
        case 'info': return 'bg-blue-500/10 border-blue-500/20';
        case 'billing': return 'bg-purple-500/10 border-purple-500/20';
        default: return 'bg-slate-500/10 border-slate-500/20';
      }
    } else {
      switch (type) {
        case 'warning': return 'bg-amber-50 border-amber-100';
        case 'error': return 'bg-red-50 border-red-100';
        case 'info': return 'bg-blue-50 border-blue-100';
        case 'billing': return 'bg-purple-50 border-purple-100';
        default: return 'bg-slate-50 border-slate-100';
      }
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900">{language === 'Español' ? 'Dashboard Global' : 'Global Dashboard'}</h1>
        <p className="text-gray-500 mt-1">
          {language === 'Español' ? 'Resumen general del ecosistema y notificaciones del sistema.' : 'General ecosystem overview and system notifications.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Total Frecuencias' : 'Total Frequencies'}</p>
              <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalWorkspaces}</h3>
            </div>
          </div>
        </div>

        <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Total Usuarios' : 'Total Users'}</p>
              <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Reportes Activos' : 'Active Reports'}</p>
              <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeReports}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {language === 'Español' ? 'Actividad Reciente del Sistema' : 'Recent System Activity'}
          </h3>
          <button 
            onClick={markAllAsRead}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-primary-2 hover:bg-primary-2/10' : 'text-primary-1 hover:bg-primary-1/10'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {language === 'Español' ? 'Marcar todas como leídas' : 'Mark all as read'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                notif.read ? (isDarkMode ? 'bg-dark-bg/30 border-slate-800' : 'bg-slate-50 border-slate-200') : getNotificationBg(notif.type, isDarkMode)
              }`}
            >
              <div className="mt-1 relative">
                {!notif.read && (
                  <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                )}
                {getNotificationIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
                    {notif.workspace}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {notif.time}
                  </span>
                </div>
                <p className={`text-sm ${!notif.read ? 'font-semibold' : ''} ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <button 
                  onClick={() => markAsRead(notif.id)}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white text-slate-500 hover:text-slate-900'}`}
                  title={language === 'Español' ? 'Marcar como leída' : 'Mark as read'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GlobalWorkspaces({ workspaces, setWorkspaces, onImpersonate, users, setUsers, isDarkMode, language }: any) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [isEditWorkspaceModalOpen, setIsEditWorkspaceModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'asesor' });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const newWs = {
      id: `w${Date.now()}`,
      name: newWorkspaceName,
      userCount: 0,
      isActive: true,
      settings: {
        logo: '',
        primaryColor: '#0ea5e9',
        fontFamily: 'Inter',
        customFields: [],
        reportCategories: []
      }
    };
    setWorkspaces([...workspaces, newWs]);
    setIsCreateWorkspaceModalOpen(false);
    setNewWorkspaceName('');
    showToast(language === 'Español' ? 'Frecuencia creada exitoamente' : 'Frequency created successfully');
  };

  const toggleEstadoFrecuencia = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWorkspaces(workspaces.map((w: any) => w.id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const eliminarFrecuencia = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(language === 'Español' ? '¿Seguro que deseas eliminar y borrar completamente la frecuencia al aceptar?' : 'Are you sure you want to delete and completely delete the frequency upon accepting?')) {
      setWorkspaces(workspaces.filter((w: any) => w.id !== id));
      setUsers(users.filter((u: any) => u.workspaceId !== id));
      if (selectedWorkspace?.id === id) setSelectedWorkspace(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `user_${Date.now()}`;
    const user = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      password: 'temp1234',
      mustChangePassword: true,
      workspaceId: selectedWorkspace.id,
      avatar: `https://i.pravatar.cc/150?u=${newId}`
    };
    setUsers([...users, user]);
    setIsCreateUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'asesor' });
    showToast(language === 'Español' ? 'Usuario creado con contraseña temporal' : 'User created with temporary password');
  };

  const handleResetPassword = (userId: string) => {
    if (window.confirm(language === 'Español' ? '¿Seguro que deseas resetear la contraseña a temp1234?' : 'Are you sure you want to reset the password to temp1234?')) {
      setUsers(users.map((u: any) => u.id === userId ? { ...u, password: 'temp1234', mustChangePassword: true } : u));
      showToast(language === 'Español' ? 'Contraseña reseteada a temp1234' : 'Password reset to temp1234');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(language === 'Español' ? '¿Seguro que deseas eliminar este usuario?' : 'Are you sure you want to delete this user?')) {
      setUsers(users.filter((u: any) => u.id !== userId));
    }
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map((u: any) => u.id === editingUser.id ? { ...u, ...editingUser } : u));
    setIsEditUserModalOpen(false);
    setEditingUser(null);
    showToast(language === 'Español' ? 'Usuario actualizado correctamente' : 'User updated successfully');
  };

  const openEditUser = (user: any) => {
    setEditingUser({ ...user, languagePref: user.languagePref || 'Español' });
    setIsEditUserModalOpen(true);
  };

  if (selectedWorkspace) {
    const workspaceUsers = users.filter((u: any) => u.workspaceId === selectedWorkspace.id);
    return (
      <div className="p-6 md:p-8 relative">
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
        
        <button 
          onClick={() => setSelectedWorkspace(null)}
          className={`mb-6 flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> {language === 'Español' ? 'Volver a Frecuencias' : 'Back to Frequencies'}
        </button>

        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              {selectedWorkspace.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {language === 'Español' ? 'Gestión de usuarios de la frecuencia.' : 'Frequency user management.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditWorkspaceModalOpen(true)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Pencil className="w-4 h-4" /> {language === 'Español' ? 'Editar' : 'Edit'}
            </button>
            <button 
              onClick={() => onImpersonate(selectedWorkspace)}
              className="px-4 py-2 rounded-xl bg-primary-1 text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
            >
              {language === 'Español' ? 'Entrar a la Frecuencia' : 'Enter Frequency'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {language === 'Español' ? 'Usuarios de esta Frecuencia' : 'Users of this Frequency'}
            </h3>
            <button 
              onClick={() => setIsCreateUserModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-primary-2 text-white text-sm font-bold flex items-center gap-2 hover:bg-primary-2/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> {language === 'Español' ? 'Crear Usuario' : 'Create User'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-primary-2/30 bg-white/5' : 'border-primary-2/10 bg-slate-50'}`}>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Nombre' : 'Name'}</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Correo' : 'Email'}</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Rol' : 'Role'}</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Estado' : 'Status'}</th>
                  <th className="p-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">{language === 'Español' ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {workspaceUsers.map((user: any) => (
                  <tr key={user.id} className={`border-b last:border-0 ${isDarkMode ? 'border-primary-2/30 hover:bg-white/5' : 'border-primary-2/10 hover:bg-slate-50'}`}>
                    <td className="p-3 flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                    </td>
                    <td className={`p-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{user.email}</td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Asesor'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${user.mustChangePassword ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                        {user.mustChangePassword ? (language === 'Español' ? 'Pendiente Clave' : 'Pending Password') : (language === 'Español' ? 'Activo' : 'Active')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditUser(user)}
                          className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`} 
                          title={language === 'Español' ? 'Editar' : 'Edit'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(user.id)}
                          className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10' : 'text-slate-500 hover:text-amber-500 hover:bg-amber-50'}`} 
                          title={language === 'Español' ? 'Resetear Contraseña' : 'Reset Password'}
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`} 
                          title={language === 'Español' ? 'Eliminar' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {workspaceUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`p-4 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'Español' ? 'No hay usuarios en esta frecuencia.' : 'No users in this frequency.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {isCreateUserModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#13131a] border border-primary-2/30' : 'bg-white'}`}>
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'Español' ? 'Crear Nuevo Usuario' : 'Create New User'}
                </h3>
                <button onClick={() => setIsCreateUserModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Nombre' : 'Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Correo Electrónico' : 'Email'}</label>
                  <input 
                    type="email" 
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Rol' : 'Role'}</label>
                  <CustomDropdown
                    options={[
                      { value: 'admin', label: language === 'Español' ? 'Administrador' : 'Admin', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-blue-500/20 text-blue-500"><Settings className="w-3 h-3" /></div> },
                      { value: 'asesor', label: language === 'Español' ? 'Asesor' : 'Agent', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><User className="w-3 h-3" /></div> }
                    ]}
                    value={newUser.role}
                    onChange={(val) => setNewUser({...newUser, role: val})}
                    isDarkMode={isDarkMode}
                    className="text-sm"
                  />
                </div>
                <div className={`p-3 rounded-lg text-sm border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                  {language === 'Español' ? 'El usuario recibirá la contraseña temporal: ' : 'The user will receive the temporary password: '} <strong>temp1234</strong>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateUserModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
                    {language === 'Español' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-primary-1 text-white text-sm font-bold hover:bg-primary-1/90 transition-colors">
                    {language === 'Español' ? 'Guardar Usuario' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#13131a] border border-primary-2/30' : 'bg-white'}`}>
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'Español' ? 'Editar Usuario' : 'Edit User'}
                </h3>
                <button onClick={() => setIsEditUserModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditUserSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Nombre' : 'Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Correo Electrónico' : 'Email'}</label>
                  <input 
                    type="email" 
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Rol' : 'Role'}</label>
                  <CustomDropdown
                    options={[
                      { value: 'admin', label: language === 'Español' ? 'Administrador' : 'Admin', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-blue-500/20 text-blue-500"><Settings className="w-3 h-3" /></div> },
                      { value: 'asesor', label: language === 'Español' ? 'Asesor' : 'Agent', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><User className="w-3 h-3" /></div> }
                    ]}
                    value={editingUser.role}
                    onChange={(val) => setEditingUser({...editingUser, role: val})}
                    isDarkMode={isDarkMode}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Idioma del Panel' : 'Panel Language'}</label>
                  <CustomDropdown
                    options={[
                      { value: 'Español', label: 'Español', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}>ES</div> },
                      { value: 'English', label: 'English', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}>EN</div> }
                    ]}
                    value={editingUser.languagePref}
                    onChange={(val) => setEditingUser({...editingUser, languagePref: val})}
                    isDarkMode={isDarkMode}
                    className="text-sm"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditUserModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
                    {language === 'Español' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-primary-1 text-white text-sm font-bold hover:bg-primary-1/90 transition-colors">
                    {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Workspace Modal */}
        {isEditWorkspaceModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#13131a] border border-primary-2/30' : 'bg-white'}`}>
              <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'Español' ? 'Editar Frecuencia' : 'Edit Frequency'}
                </h3>
                <button onClick={() => setIsEditWorkspaceModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <button 
                  onClick={(e) => {
                    toggleEstadoFrecuencia(selectedWorkspace.id, e);
                    setSelectedWorkspace({ ...selectedWorkspace, isActive: !selectedWorkspace.isActive });
                  }}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${selectedWorkspace.isActive ? (isDarkMode ? 'border-orange-400/50 text-orange-400 hover:bg-orange-400/10' : 'border-orange-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600') : (isDarkMode ? 'border-green-400/50 text-green-400 hover:bg-green-400/10' : 'border-green-200 text-green-600 hover:bg-green-50')}`}
                >
                  {selectedWorkspace.isActive ? (language === 'Español' ? 'Desactivar Frecuencia' : 'Deactivate Frequency') : (language === 'Español' ? 'Activar Frecuencia' : 'Activate Frequency')}
                </button>

                <button 
                  onClick={() => {
                    setIsEditWorkspaceModalOpen(false);
                    eliminarFrecuencia(selectedWorkspace.id);
                  }}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border ${isDarkMode ? 'border-red-400/50 text-red-400 hover:bg-red-400/10' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
                >
                  <Trash2 className="w-5 h-5" />
                  {language === 'Español' ? 'Eliminar Frecuencia' : 'Delete Frequency'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 relative">
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]">
          {toastMessage}
        </div>
      )}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{language === 'Español' ? 'Frecuencias' : 'Frequencies'}</h1>
          <p className="text-gray-500 mt-1">
            {language === 'Español' ? 'Gestión de todas las frecuencias del sistema.' : 'Management of all system frequencies.'}
          </p>
        </div>
        <button 
          onClick={() => setIsCreateWorkspaceModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {language === 'Español' ? 'Nueva Frecuencia' : 'New Frequency'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace: any) => (
          <div 
            key={workspace.id} 
            className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''} ${!workspace.isActive ? 'opacity-60 grayscale' : ''}`}
            style={{ borderTopColor: workspace.settings?.primaryColor || '#e5e7eb', borderTopWidth: '4px' }}
          >
            <div className="flex items-center gap-4 mb-6">
              {workspace.settings?.logo ? (
                <img src={workspace.settings.logo} alt={workspace.name} className="w-12 h-12 rounded-xl object-contain bg-white p-1" />
              ) : (
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: `${workspace.settings?.primaryColor || '#cbd5e1'}20`, color: workspace.settings?.primaryColor || '#475569' }}
                >
                  {workspace.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{workspace.name}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID: {workspace.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Usuarios' : 'Users'}</p>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{workspace.userCount}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedWorkspace(workspace)}
              className={`mt-auto w-full py-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'border-primary-2/30 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              {language === 'Español' ? 'Ver Detalles' : 'View Details'}
            </button>
          </div>
        ))}
      </div>

      {isCreateWorkspaceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-[#13131a] border border-primary-2/30' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
              <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{language === 'Español' ? 'Nueva Frecuencia' : 'New Frequency'}</h3>
              <button onClick={() => setIsCreateWorkspaceModalOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateWorkspace} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Nombre de la Frecuencia' : 'Frequency Name'}</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder={language === 'Español' ? 'Ej. Sucursal Norte' : 'E.g. North Branch'}
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateWorkspaceModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
                  {language === 'Español' ? 'Cancelar' : 'Cancel'}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md">
                  {language === 'Español' ? 'Crear' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function GlobalUsers({ users, setUsers, workspaces, isDarkMode, language }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [workspaceFilter, setWorkspaceFilter] = useState('Todas');
  const [roleFilter, setRoleFilter] = useState('Todos');

  const updateRole = (id: string, newRole: string) => {
    setUsers(users.map((u: any) => u.id === id ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkspace = workspaceFilter === 'Todas' || (workspaceFilter === 'Global' ? !user.workspaceId : user.workspaceId === workspaceFilter);
    const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;
    return matchesSearch && matchesWorkspace && matchesRole;
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{language === 'Español' ? 'Usuarios Globales' : 'Global Users'}</h1>
          <p className="text-gray-500 mt-1">
            {language === 'Español' ? 'Directorio global de usuarios del sistema.' : 'Global directory of system users.'}
          </p>
        </div>
      </div>
      
      {/* Actions & Filters Bar */}
      <div className="flex flex-col md:flex-row items-center mb-6 gap-4 w-full">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder={language === 'Español' ? 'Buscar usuario...' : 'Search user...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
              isDarkMode 
                ? 'bg-[#0a0a0f]/60 border-primary-2/30 text-white placeholder-slate-500' 
                : 'bg-white/60 border-primary-2/20 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
        
        <div className="relative w-full md:w-auto min-w-[200px]">
          <CustomDropdown
            options={[
              { value: 'Todas', label: language === 'Español' ? 'Todas las frecuencias' : 'All frequencies', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Globe className="w-3 h-3" /></div> },
              { value: 'Global', label: 'Global (Super Admins)', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-600'}`}><Shield className="w-3 h-3" /></div> },
              ...workspaces.map((w: any) => ({ 
                value: w.id, 
                label: w.name, 
                icon: w.settings?.logo ? (
                  <img src={w.settings.logo} className="w-5 h-5 rounded-md object-cover bg-white" alt="" />
                ) : (
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${w.settings?.primaryColor || '#cbd5e1'}40`, color: w.settings?.primaryColor || '#475569' }}>
                    {w.name.charAt(0)}
                  </div>
                ) 
              }))
            ]}
            value={workspaceFilter}
            onChange={setWorkspaceFilter}
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>

        <div className="relative w-full md:w-auto min-w-[160px]">
          <CustomDropdown
            options={[
              { value: 'Todos', label: language === 'Español' ? 'Todos los roles' : 'All roles', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}><Filter className="w-3 h-3" /></div> },
              { value: 'superadmin', label: 'Super Admin', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-purple-500/20 text-purple-500"><Shield className="w-3 h-3" /></div> },
              { value: 'admin', label: 'Admin', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-blue-500/20 text-blue-500"><Settings className="w-3 h-3" /></div> },
              { value: 'asesor', label: 'Asesor', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><User className="w-3 h-3" /></div> }
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            isDarkMode={isDarkMode}
            className="w-full"
          />
        </div>
      </div>
      
      <div className={`bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden mb-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-primary-2/30 bg-white/5' : 'border-primary-2/10 bg-slate-50'}`}>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Usuario' : 'User'}</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Frecuencia' : 'Frequency'}</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'Español' ? 'Rol' : 'Role'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => {
              const userWorkspace = workspaces.find((w: any) => w.id === user.workspaceId);
              
              return (
              <tr key={user.id} className={`border-b last:border-0 ${isDarkMode ? 'border-primary-2/30 hover:bg-white/5' : 'border-primary-2/10 hover:bg-slate-50'}`}>
                <td className="p-4 flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{user.email}</span>
                  </div>
                </td>
                <td className={`p-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {user.workspaceId ? (
                    <div className="flex items-center gap-2">
                      {userWorkspace?.settings?.logo ? (
                        <img src={userWorkspace.settings.logo} className="w-5 h-5 rounded-md object-cover bg-white" alt="" />
                      ) : (
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${userWorkspace?.settings?.primaryColor || '#cbd5e1'}40`, color: userWorkspace?.settings?.primaryColor || '#475569' }}>
                          {userWorkspace?.name?.charAt(0) || user.workspaceId.charAt(0)}
                        </div>
                      )}
                      <span>{userWorkspace?.name || user.workspaceId}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Globe className="w-3 h-3" /></div>
                      <span>Global</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  {user.role === 'superadmin' ? (
                    <span className="text-xs font-bold px-2 py-1.5 rounded-md bg-purple-500/10 text-purple-500 flex items-center gap-1.5 w-fit">
                      <Shield className="w-3 h-3" /> Super Admin
                    </span>
                  ) : (
                    <div className="w-32">
                      <CustomDropdown
                        options={[
                          { value: 'admin', label: 'Admin', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-blue-500/20 text-blue-500"><Settings className="w-3 h-3" /></div> },
                          { value: 'asesor', label: 'Asesor', icon: <div className="w-4 h-4 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><User className="w-3 h-3" /></div> }
                        ]}
                        value={user.role}
                        onChange={(newRole) => updateRole(user.id, newRole)}
                        isDarkMode={isDarkMode}
                        className="w-full text-xs"
                      />
                    </div>
                  )}
                </td>
              </tr>
            )})}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={3} className={`p-8 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {language === 'Español' ? 'No se encontraron usuarios.' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
