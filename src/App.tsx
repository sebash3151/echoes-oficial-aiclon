import { useState, useEffect } from 'react';
import { LayoutDashboard, Inbox as InboxIcon, FileText, Image as ImageIcon, Settings as SettingsIcon, Moon, Sun, LogOut, Globe, ChevronLeft, ChevronRight, BarChart2, Users, Contact, Zap, Menu, X, Tag as TagIcon, Shield } from 'lucide-react';
import Login from './components/Login';
import ForcePasswordChange from './components/ForcePasswordChange';
import Dashboard from './components/Dashboard';
import Inbox from './components/Inbox';
import Contactos from './components/Contactos';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import Media from './components/Media';
import FrequencySettingsForm from './components/FrequencySettingsForm';
import GlobalEditContactModal from './components/GlobalEditContactModal';
import Shortcuts from './components/Shortcuts';
import TeamView from './components/TeamView';
import TagsManager, { Tag } from './components/TagsManager';
import { mockConversations, mockReports, mockMedia } from './data/mockData';

import { SuperAdminLayout, GlobalDashboard, GlobalWorkspaces, GlobalUsers } from './components/SuperAdmin';

const MOCK_WORKSPACES = [
  { 
    id: 'w1', 
    name: 'Casa de Verano', 
    userCount: 5,
    isActive: true,
    settings: {
      logo: '',
      primaryColor: '#0ea5e9',
      fontFamily: 'Inter',
      customFields: ['Metros cuadrados', 'Presupuesto'],
      reportCategories: [
        { id: 1, name: 'Falla de Eco', icon: 'bot' },
        { id: 2, name: 'Facturación', icon: 'settings' },
        { id: 3, name: 'Error UI', icon: 'alert' }
      ]
    }
  },
  { 
    id: 'w2', 
    name: 'Acme Corp', 
    userCount: 12,
    isActive: true,
    settings: {
      logo: '',
      primaryColor: '#8b5cf6',
      fontFamily: 'Inter',
      customFields: ['Industria', 'Empleados'],
      reportCategories: [
        { id: 4, name: 'Soporte Técnico', icon: 'settings' },
        { id: 5, name: 'Ventas', icon: 'bot' }
      ]
    }
  },
  { 
    id: 'w3', 
    name: 'Global Ventures', 
    userCount: 8,
    isActive: false,
    settings: {
      logo: '',
      primaryColor: '#f59e0b',
      fontFamily: 'Roboto',
      customFields: ['País', 'Sector'],
      reportCategories: [
        { id: 6, name: 'Quejas', icon: 'alert' },
      ]
    }
  },
  { 
    id: 'w4', 
    name: 'Innovatech', 
    userCount: 20,
    isActive: true,
    settings: {
      logo: '',
      primaryColor: '#10b981',
      fontFamily: 'Inter',
      customFields: ['Proyecto', 'Rol'],
      reportCategories: [
        { id: 7, name: 'Feedback', icon: 'user' },
        { id: 8, name: 'Bug Report', icon: 'settings' }
      ]
    }
  }
];

const MOCK_GLOBAL_REPORTS = [
  { id: 'r1', workspace: 'Casa de Verano', type: 'Bug', status: 'Pendiente', desc: 'Falla en el Eco...' },
  { id: 'r2', workspace: 'Acme Corp', type: 'Seguridad', status: 'Revisado', desc: 'Intento de acceso no autorizado.' },
  { id: 'r3', workspace: 'Innovatech', type: 'Facturación', status: 'Cerrado', desc: 'Disputa de pago resuelta respecto al mes pasado.' },
  { id: 'r4', workspace: 'Casa de Verano', type: 'Feedback', status: 'Pendiente', desc: 'El cliente detalla que la IA es lenta para responder consultas comunes.' },
  { id: 'r5', workspace: 'Global Ventures', type: 'Error Crítico', status: 'Pendiente', desc: 'El servidor dejó de responder durante el horario pico.' }
];

const MOCK_USERS = [
  { id: 'sa1', role: 'superadmin', name: 'Felipe (Dev Admin)', email: 'felipe@echoes.ai', avatar: 'https://i.pravatar.cc/150?u=super', password: '123', mustChangePassword: false, assignmentRule: 'Supervisa todas las operaciones globales.' },
  { id: 'a1', role: 'admin', name: 'Admin Casa Verano', email: 'admin@casaverano.com', workspaceId: 'w1', avatar: 'https://i.pravatar.cc/150?u=admin', password: '123', mustChangePassword: false, assignmentRule: 'Gestiona configuraciones de frecuencia y equipo.' },
  { id: 'as1', role: 'asesor', name: 'Juan Asesor', email: 'juan@casaverano.com', workspaceId: 'w1', avatar: 'https://i.pravatar.cc/150?u=juan', password: '123', mustChangePassword: false, assignmentRule: 'Atiende quejas, soporte técnico y devoluciones.' },
  { id: 'as2', role: 'asesor', name: 'Elena Asesor', email: 'elena@casaverano.com', workspaceId: 'w1', avatar: 'https://i.pravatar.cc/150?u=elena', password: '123', mustChangePassword: false, assignmentRule: 'Atiende solicitudes de ventas y nuevos clientes.' },
  { id: 'a2', role: 'admin', name: 'Admin Acme Corp', email: 'admin@acme.com', workspaceId: 'w2', avatar: 'https://i.pravatar.cc/150?u=adminacme', password: '123', mustChangePassword: false, assignmentRule: 'Control total de la frecuencia Acme.' },
  { id: 'as3', role: 'asesor', name: 'Carlos Ventas', email: 'carlos@acme.com', workspaceId: 'w2', avatar: 'https://i.pravatar.cc/150?u=carlos', password: '123', mustChangePassword: false, assignmentRule: 'Especialista en cierres de ventas Enterprise.' },
  { id: 'a3', role: 'admin', name: 'Admin Innovatech', email: 'admin@innovatech.com', workspaceId: 'w4', avatar: 'https://i.pravatar.cc/150?u=admininnov', password: '123', mustChangePassword: false, assignmentRule: 'Gestión técnica de Innovatech.' },
  { id: 'as4', role: 'asesor', name: 'Sophia Tech', email: 'sophia@innovatech.com', workspaceId: 'w4', avatar: 'https://i.pravatar.cc/150?u=sophia', password: '123', mustChangePassword: false, assignmentRule: 'Soporte especializado Nivel 1.' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'inbox' | 'contactos' | 'team' | 'atajos' | 'analytics' | 'reports' | 'media' | 'settings' | 'global_dashboard' | 'global_workspaces' | 'global_reports' | 'global_users'>('login');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('Español');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [reports, setReports] = useState(mockReports);
  const [media, setMedia] = useState(mockMedia);
  const [inboxViewMode, setInboxViewMode] = useState<'list' | 'kanban'>('list');
  const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(null);
  const [shortcuts, setShortcuts] = useState([{ command: '/saludo', text: 'Hola, ¿en qué te podemos ayudar hoy?' }]);
  
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [globalReports, setGlobalReports] = useState(MOCK_GLOBAL_REPORTS);
  const [globalUsers, setGlobalUsers] = useState(MOCK_USERS);
  const [globalReportCategories, setGlobalReportCategories] = useState([
    { id: 1, name: 'Falla de Eco', icon: 'bot' },
    { id: 2, name: 'Facturación', icon: 'settings' },
    { id: 3, name: 'Error UI', icon: 'alert' },
    { id: 4, name: 'Soporte Técnico', icon: 'settings' },
    { id: 5, name: 'Ventas', icon: 'bot' },
    { id: 6, name: 'Quejas', icon: 'alert' },
    { id: 7, name: 'Feedback', icon: 'user' },
    { id: 8, name: 'Bug Report', icon: 'settings' }
  ]);
  const [loginError, setLoginError] = useState('');
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [tags, setTags] = useState<Tag[]>([
    { id: 't1', workspaceId: 'w1', name: 'Urgente', color: '#ef4444', triggerInstruction: 'Aplicar cuando el cliente indique que necesita ayuda inmediata o use palabras como "urgente", "ahora", "emergencia".' },
    { id: 't2', workspaceId: 'w1', name: 'Soporte', color: '#3b82f6', triggerInstruction: 'Aplicar cuando el cliente tenga problemas técnicos, errores en la plataforma o dudas de uso.' },
    { id: 't3', workspaceId: 'w1', name: 'Ventas', color: '#10b981', triggerInstruction: 'Aplicar cuando el cliente pregunte por precios, planes, o muestre intención de compra.' },
    { id: 't4', workspaceId: 'w1', name: 'Humano Requerido', color: '#a855f7', triggerInstruction: 'Aplicar cuando el bot no entienda la solicitud después de 2 intentos o el cliente pida explícitamente hablar con un humano.' },
    { id: 't5', workspaceId: 'w2', name: 'Enterprise', color: '#fbbf24', triggerInstruction: 'Lead empresarial interesado en planes customizados y soporte 24/7.' },
    { id: 't6', workspaceId: 'w2', name: 'Integraciones', color: '#8b5cf6', triggerInstruction: 'Cliente que solicita ayuda para integrar via API o Webhooks.' },
    { id: 't7', workspaceId: 'w4', name: 'Feedback Positivo', color: '#10b981', triggerInstruction: 'Cuando el usuario elogie el producto.' },
    { id: 't8', workspaceId: 'w4', name: 'Revisión Manual', color: '#ef4444', triggerInstruction: 'El caso necesita ser analizado manualmente por un operador Nivel 2.' }
  ]);

  const [kanbanColumns, setKanbanColumns] = useState([
    { id: 'nuevo', title: { es: 'Nuevos Leads', en: 'New Leads' }, isFixedStart: true },
    { id: 'interaccion', title: { es: 'Interacción IA', en: 'AI Interaction' } },
    { id: 'reunion', title: { es: 'Lead Cerrado', en: 'Closed Lead' }, isFixedEnd: true }
  ]);

  // Theme isolation
  useEffect(() => {
    const root = document.documentElement;
    if (currentWorkspace?.settings) {
      const s = currentWorkspace.settings;
      if (s.lightBg) root.style.setProperty('--color-light-bg', s.lightBg);
      if (s.darkBg) root.style.setProperty('--color-dark-bg', s.darkBg);
      if (s.primaryColor) root.style.setProperty('--color-primary-1', s.primaryColor);
      if (s.primary2) root.style.setProperty('--color-primary-2', s.primary2);
      if (s.accent) root.style.setProperty('--color-accent', s.accent);
    } else {
      // Reset to default Echoes Admin colors
      root.style.setProperty('--color-light-bg', '#F7FBFF');
      root.style.setProperty('--color-dark-bg', '#040308');
      root.style.setProperty('--color-primary-1', '#00C8FF');
      root.style.setProperty('--color-primary-2', '#005AB7');
      root.style.setProperty('--color-accent', '#EA580C');
    }
  }, [currentWorkspace]);

  const updateWorkspaceSettings = (newSettings: any) => {
    if (!currentWorkspace) return;
    const updatedWorkspace = { ...currentWorkspace, settings: { ...currentWorkspace.settings, ...newSettings } };
    setCurrentWorkspace(updatedWorkspace);
    setWorkspaces(workspaces.map(w => w.id === updatedWorkspace.id ? updatedWorkspace : w));
  };

  const currentCustomFields = currentWorkspace?.settings?.customFields || [];
  const [editingContactId, setEditingContactId] = useState<string | 'new' | null>(null);
  const [editingContactInitialData, setEditingContactInitialData] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileEditData, setProfileEditData] = useState({ name: '', avatar: '' });

  const handleOpenEditContact = (contactId: string | 'new', initialData?: any) => {
    setEditingContactId(contactId);
    setEditingContactInitialData(initialData);
  };

  const [forcePasswordChangeUser, setForcePasswordChangeUser] = useState<any>(null);

  // Filter data by current workspace
  const workspaceConversations = currentWorkspace ? conversations.filter(c => c.workspaceId === currentWorkspace.id) : [];
  const workspaceReports = currentWorkspace ? reports.filter(r => r.workspaceId === currentWorkspace.id) : [];
  const workspaceMedia = currentWorkspace ? media.filter(m => m.workspaceId === currentWorkspace.id) : [];
  const workspaceTags = currentWorkspace ? tags.filter(t => t.workspaceId === currentWorkspace.id) : [];
  const workspaceUsers = currentWorkspace ? globalUsers.filter(u => u.workspaceId === currentWorkspace.id || u.role === 'superadmin') : [];

  const handleLogin = (email: string, pass: string) => {
    setLoginError('');
    
    // TEMPORAL BYPASS FOR DEVELOPMENT: Just clicking login with empty fields logs in as Super Admin
    if (!email && !pass) {
      handleDevLogin('superadmin');
      return;
    }

    const user = globalUsers.find(u => u.email === email && u.password === pass);
    if (user) {
      if (user.role !== 'superadmin') {
        const userWorkspace = workspaces.find(w => w.id === user.workspaceId);
        if (userWorkspace && !userWorkspace.isActive) {
          setLoginError(language === 'Español' ? 'El acceso a esta frecuencia ha sido suspendido. Por favor, comunícate con el administrador principal.' : 'Access to this frequency has been suspended. Please contact the main administrator.');
          return;
        }
      }

      if (user.mustChangePassword) {
        setForcePasswordChangeUser(user);
        setCurrentView('force_password_change' as any);
      } else {
        setCurrentUser(user);
        if (user.role === 'superadmin') {
          setCurrentView('global_dashboard');
        } else {
          setCurrentView('dashboard');
        }
      }
    } else {
      setLoginError(language === 'Español' ? 'Credenciales incorrectas' : 'Invalid credentials');
    }
  };

  const handlePasswordChange = (newPass: string) => {
    const updatedUser = { ...forcePasswordChangeUser, password: newPass, mustChangePassword: false };
    setGlobalUsers(globalUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setForcePasswordChangeUser(null);
    if (updatedUser.role === 'superadmin') {
      setCurrentView('global_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleDevLogin = (role: string, workspaceId?: string) => {
    let user;
    if (role === 'superadmin') {
      user = globalUsers.find(u => u.id === 'sa1');
    } else if (role === 'admin') {
      user = globalUsers.find(u => u.id === 'a1');
    } else if (role === 'asesor1') {
      user = globalUsers.find(u => u.id === 'as1');
    } else if (role === 'asesor2') {
      user = globalUsers.find(u => u.id === 'as2');
    }

    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setCurrentUser(updatedUser);
      
      if (updatedUser.role === 'superadmin') {
        setCurrentWorkspace(null);
        setCurrentView('global_dashboard');
      } else {
        const ws = workspaces.find(w => w.id === updatedUser.workspaceId);
        setCurrentWorkspace(ws || workspaces[0]);
        setCurrentView('dashboard');
      }
    }
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onDevLogin={handleDevLogin} language={language} error={loginError} />;
  }

  if (currentView === 'force_password_change' as any) {
    return <ForcePasswordChange onSave={handlePasswordChange} language={language} />;
  }

  if (currentUser.role === 'superadmin' && !currentWorkspace) {
    return (
      <>
        <div className="fixed top-4 right-4 z-[9999]">
          <select 
            value={currentUser.id} 
            onChange={(e) => {
              const newUser = globalUsers.find(u => u.id === e.target.value) || globalUsers[0];
              setCurrentUser(newUser);
              if (newUser.role !== 'superadmin') {
                setCurrentView('dashboard');
              }
            }}
            className={`border rounded-md shadow-sm px-3 py-1 text-sm font-semibold focus:outline-none ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
          >
            {globalUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <SuperAdminLayout 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          language={language}
          onLogout={() => setCurrentView('login')}
        >
          {currentView === 'global_dashboard' && <GlobalDashboard workspaces={workspaces} globalReports={globalReports} users={globalUsers} isDarkMode={isDarkMode} language={language} />}
          {currentView === 'global_workspaces' && <GlobalWorkspaces workspaces={workspaces} setWorkspaces={setWorkspaces} users={globalUsers} setUsers={setGlobalUsers} onImpersonate={(workspace: any) => {
            setCurrentWorkspace(workspace);
            setCurrentView('dashboard');
          }} isDarkMode={isDarkMode} language={language} />}
          {currentView === 'global_reports' && <Reports 
            isSuperAdminView={true} 
            workspaces={workspaces} 
            reports={globalReports} 
            setReports={setGlobalReports} 
            isDarkMode={isDarkMode} 
            language={language} 
            reportCategories={globalReportCategories} 
            setReportCategories={setGlobalReportCategories}
            media={[]} 
          />}
          {currentView === 'global_users' && <GlobalUsers users={globalUsers} setUsers={setGlobalUsers} workspaces={workspaces} isDarkMode={isDarkMode} language={language} />}
        </SuperAdminLayout>
      </>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden font-body transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Mobile Menu Toggle Checkbox */}
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />

      {/* Mobile Overlay */}
      <label htmlFor="mobile-menu-toggle" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden peer-checked:block md:hidden"></label>

      <div className="fixed top-4 right-4 z-[9999]">
        <select 
          value={currentUser.id} 
          onChange={(e) => setCurrentUser(globalUsers.find(u => u.id === e.target.value) || globalUsers[0])}
          className={`border rounded-md shadow-sm px-3 py-1 text-sm font-semibold focus:outline-none ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
        >
          {globalUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`fixed md:relative z-50 inset-y-0 left-0 transform -translate-x-full peer-checked:translate-x-0 md:translate-x-0 transition-transform duration-300 flex ${isSidebarCollapsed ? 'w-20' : 'w-64'} h-full flex-col shrink-0 border-r backdrop-blur-md ${isDarkMode ? 'bg-[#0a0a0f] md:bg-[#0a0a0f]/80 border-primary-2/30' : 'bg-white md:bg-white/80 border-primary-2/20'}`}>
        {/* Logo & Workspace Card */}
        <div className={`pt-8 px-4 shrink-0 flex flex-col relative`}>
          {/* Mobile Close Button */}
          <label htmlFor="mobile-menu-toggle" className="md:hidden absolute top-4 right-4 p-2 cursor-pointer text-slate-500 hover:text-primary-2">
            <X className="w-6 h-6" />
          </label>

          {!isSidebarCollapsed ? (
            <>
              {/* Logo Principal */}
              <div className="flex items-center gap-3 mb-6 px-2">
                <span className="text-2xl text-primary-1">▶</span>
                <span className="text-2xl font-black tracking-tight text-primary-2 font-headline uppercase">Echoes</span>
              </div>

              {/* Tarjeta del Entorno */}
              <div className={`mx-2 mb-6 p-3 rounded-xl flex items-center gap-3 shadow-sm border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border ${isDarkMode ? 'bg-dark-surface border-primary-2/30' : 'bg-white border-slate-200'}`}>
                  {currentWorkspace?.settings?.logo ? (
                    <img src={currentWorkspace.settings.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentWorkspace?.name?.charAt(0) || 'F'}</span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'Español' ? 'Frecuencia Actual' : 'Current Frequency'}</span>
                  <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{currentWorkspace?.name || 'Cargando...'}</span>
                </div>
              </div>

              {/* Separador Visual */}
              <hr className={`mb-4 mx-2 ${isDarkMode ? 'border-primary-2/20' : 'border-slate-200'}`} />
            </>
          ) : (
            <div className="flex flex-col items-center w-full gap-6 mb-6">
              <span className="text-2xl text-primary-1">▶</span>
              <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border ${isDarkMode ? 'bg-dark-surface border-primary-2/30' : 'bg-white border-slate-200'}`} title={currentWorkspace?.name}>
                {currentWorkspace?.settings?.logo ? (
                  <img src={currentWorkspace.settings.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentWorkspace?.name?.charAt(0) || 'F'}</span>
                )}
              </div>
              <hr className={`w-full ${isDarkMode ? 'border-primary-2/20' : 'border-slate-200'}`} />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'dashboard' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Tablero' : 'Dashboard') : undefined}
          >
            <LayoutDashboard className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Tablero' : 'Dashboard')}
          </button>
          
          <button 
            onClick={() => setCurrentView('inbox')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'inbox' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Bandeja de Entrada' : 'Inbox') : undefined}
          >
            <InboxIcon className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Bandeja de Entrada' : 'Inbox')}
          </button>

          <button 
            onClick={() => setCurrentView('contactos')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'contactos' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Contactos' : 'Contacts') : undefined}
          >
            <Contact className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Contactos' : 'Contacts')}
          </button>

          <button 
            onClick={() => setCurrentView('team')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'team' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Equipo' : 'Team') : undefined}
          >
            <Users className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Equipo' : 'Team')}
          </button>

          <button 
            onClick={() => setCurrentView('atajos')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'atajos' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Respuestas Rápidas' : 'Quick Responses') : undefined}
          >
            <Zap className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Respuestas Rápidas' : 'Quick Responses')}
          </button>

          {currentUser.role !== 'asesor' && (
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'analytics' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
              title={isSidebarCollapsed ? (language === 'Español' ? 'Analítica' : 'Analytics') : undefined}
            >
              <BarChart2 className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
              {!isSidebarCollapsed && (language === 'Español' ? 'Analítica' : 'Analytics')}
            </button>
          )}

          <button 
            onClick={() => setCurrentView('reports')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'reports' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Reportes' : 'Reports') : undefined}
          >
            <FileText className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Reportes' : 'Reports')}
          </button>

          <button 
            onClick={() => setCurrentView('media')}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'media' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
            title={isSidebarCollapsed ? (language === 'Español' ? 'Multimedia' : 'Media') : undefined}
          >
            <ImageIcon className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isSidebarCollapsed && (language === 'Español' ? 'Multimedia' : 'Media')}
          </button>

          {currentUser.role !== 'asesor' && (
            <>
              <button 
                onClick={() => setCurrentView('tags')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'tags' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
                title={isSidebarCollapsed ? (language === 'Español' ? 'Etiquetas' : 'Tags') : undefined}
              >
                <TagIcon className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!isSidebarCollapsed && (language === 'Español' ? 'Etiquetas' : 'Tags')}
              </button>
              <button 
                onClick={() => setCurrentView('settings')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${currentView === 'settings' ? (isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-primary-2')}`}
                title={isSidebarCollapsed ? (language === 'Español' ? 'Configuración' : 'Settings') : undefined}
              >
                <SettingsIcon className={`${isSidebarCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!isSidebarCollapsed && (language === 'Español' ? 'Configuración' : 'Settings')}
              </button>
            </>
          )}
        </nav>

        {/* Bottom Utilities & Profile */}
        <div className={`p-4 mt-auto border-t flex flex-col gap-4 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
          {/* Toggles */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col justify-center gap-4' : 'justify-between'} px-2`}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-primary-2/10'}`}
              title={isSidebarCollapsed ? (language === 'Español' ? 'Cambiar Tema' : 'Toggle Theme') : undefined}
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-primary-2/10'}`}
              title={isSidebarCollapsed ? (language === 'Español' ? 'Expandir Menú' : 'Expand Menu') : (language === 'Español' ? 'Colapsar Menú' : 'Collapse Menu')}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5 text-primary-1" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Profile */}
          <div 
            onClick={() => {
              setProfileEditData({ name: currentUser.name, avatar: currentUser.avatar || '' });
              setIsProfileModalOpen(true);
            }}
            className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-2' : 'gap-3'} p-3 rounded-xl border cursor-pointer transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 hover:bg-white/5' : 'bg-slate-50 border-primary-2/20 hover:bg-slate-100'}`}
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</p>
                <p className={`text-[10px] font-bold text-primary-2 tracking-wider truncate`}>{currentUser.role === 'superadmin' ? 'SUPER ADMIN' : currentUser.role === 'admin' ? 'ADMIN' : 'ASESOR'}</p>
              </div>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('login');
              }}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
              title={language === 'Español' ? 'Cerrar Sesión' : 'Log Out'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative pb-16 md:pb-0 bg-light-bg bg-[linear-gradient(to_right,rgba(0,200,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.15)_1px,transparent_1px)] [background-size:40px_40px] h-full overflow-y-auto ${isDarkMode ? 'bg-dark-bg bg-[linear-gradient(to_right,rgba(0,200,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.05)_1px,transparent_1px)]' : ''}`}>
        {currentUser.role === 'superadmin' && currentWorkspace && (
          <div className="w-full bg-primary-1 text-white text-center py-2 text-sm font-bold flex items-center justify-center gap-2 z-50">
            <Shield className="w-4 h-4" />
            Modo Inspección: {currentWorkspace.name} - 
            <button 
              onClick={() => {
                setCurrentWorkspace(null);
                setCurrentView('global_dashboard');
              }}
              className="underline hover:text-blue-200"
            >
              Volver al Panel Global
            </button>
          </div>
        )}
        {/* Top Header (Mobile Only) */}
        <header className={`flex md:hidden items-center justify-between p-4 border-b shrink-0 z-30 ${isDarkMode ? 'bg-[#0a0a0f]/90 border-primary-2/30' : 'bg-white/90 border-primary-2/20'}`}>
          <h1 className="font-headline text-xl font-bold text-primary-2 tracking-tight flex items-center gap-2">
            <span className="text-primary-1">▶</span> Echoes
          </h1>
          <label htmlFor="mobile-menu-toggle" className="p-2 cursor-pointer text-slate-500 hover:text-primary-2">
            <Menu className="w-6 h-6" />
          </label>
        </header>

        {currentUser.role === 'asesor' && ['analytics', 'reports', 'settings'].includes(currentView) ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className={`text-center p-8 rounded-2xl border max-w-md w-full ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/30' : 'bg-white border-primary-2/20 shadow-xl'}`}>
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {language === 'Español' ? 'Acceso Denegado' : 'Access Denied'}
              </h2>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'No tienes permisos para ver esta página.' : 'You do not have permission to view this page.'}
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-2 bg-primary-1 text-white rounded-xl font-bold hover:bg-primary-1/90 transition-colors"
              >
                {language === 'Español' ? 'Volver al Inicio' : 'Go to Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' && <Dashboard isDarkMode={isDarkMode} language={language} setActiveChatId={setActiveChatId} setCurrentView={setCurrentView} setInboxViewMode={setInboxViewMode} conversations={workspaceConversations} />}
            {currentView === 'inbox' && <Inbox isDarkMode={isDarkMode} language={language} activeChatId={activeChatId} setActiveChatId={setActiveChatId} conversations={workspaceConversations} setConversations={setConversations} reports={workspaceReports} setReports={setReports} inboxViewMode={inboxViewMode} setInboxViewMode={setInboxViewMode} globalKeyFields={currentCustomFields} kanbanColumns={kanbanColumns} setKanbanColumns={setKanbanColumns} onOpenEditContact={handleOpenEditContact} shortcuts={shortcuts} scrollToMessageId={scrollToMessageId} setScrollToMessageId={setScrollToMessageId} currentUser={currentUser} users={workspaceUsers} availableTags={workspaceTags} />}
            {currentView === 'contactos' && <Contactos isDarkMode={isDarkMode} language={language} conversations={workspaceConversations} setConversations={setConversations} globalKeyFields={currentCustomFields} setCurrentView={setCurrentView} setInboxViewMode={setInboxViewMode} setActiveChatId={setActiveChatId} onOpenEditContact={handleOpenEditContact} currentUser={currentUser} users={workspaceUsers} />}
            {currentView === 'team' && <TeamView users={workspaceUsers as any} onUpdateUser={(updatedUser) => setGlobalUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u)) as any} currentUser={currentUser} isDarkMode={isDarkMode} language={language} />}
            {currentView === 'atajos' && <Shortcuts isDarkMode={isDarkMode} language={language} shortcuts={shortcuts} setShortcuts={setShortcuts} />}
            {currentView === 'tags' && <TagsManager isDarkMode={isDarkMode} language={language} tags={tags} setTags={setTags} />}
            {currentView === 'analytics' && <Analytics isDarkMode={isDarkMode} language={language} conversations={workspaceConversations} kanbanColumns={kanbanColumns} reports={workspaceReports} media={workspaceMedia} />}
            {currentView === 'reports' && <Reports 
              isSuperAdminView={currentUser.role === 'superadmin'}
              workspaces={workspaces}
              isDarkMode={isDarkMode}
              language={language}
              reports={workspaceReports}
              setReports={setReports}
              setCurrentView={setCurrentView}
              setInboxViewMode={setInboxViewMode}
              setActiveChatId={setActiveChatId}
              setScrollToMessageId={setScrollToMessageId}
              reportCategories={globalReportCategories}
              setReportCategories={setGlobalReportCategories}
              media={workspaceMedia}
            />}
            {currentView === 'media' && <Media isDarkMode={isDarkMode} language={language} media={workspaceMedia} setMedia={setMedia} />}
            {currentView === 'settings' && <FrequencySettingsForm isDarkMode={isDarkMode} language={language} currentWorkspace={currentWorkspace} updateWorkspaceSettings={updateWorkspaceSettings} isModal={false} />}
          </>
        )}
      </main>

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0a0a0f] border border-primary-2/30' : 'bg-white'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {language === 'Español' ? 'Editar Perfil' : 'Edit Profile'}
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => document.getElementById('profilePicUpload')?.click()}
                >
                  {profileEditData.avatar ? (
                    <img src={profileEditData.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary-1/20" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-1 text-white flex items-center justify-center text-3xl font-bold border-4 border-primary-1/20">
                      {profileEditData.name.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="w-6 h-6 text-white mb-1" />
                    <span className="text-white text-[10px] font-bold text-center leading-tight">
                      {language === 'Español' ? 'Cambiar\nfoto' : 'Change\nphoto'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    id="profilePicUpload" 
                    accept="image/png, image/jpeg" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const localUrl = URL.createObjectURL(file);
                        setProfileEditData({ ...profileEditData, avatar: localUrl });
                      }
                    }} 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Nombre' : 'Name'}
                  </label>
                  <input 
                    type="text" 
                    value={profileEditData.name}
                    onChange={(e) => setProfileEditData({ ...profileEditData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Rol' : 'Role'}
                  </label>
                  <input 
                    type="text" 
                    value={currentUser.role === 'superadmin' ? 'Super Admin' : currentUser.role === 'admin' ? (language === 'Español' ? 'Administrador' : 'Administrator') : (language === 'Español' ? 'Asesor' : 'Agent')}
                    disabled
                    className={`w-full px-3 py-2 rounded-lg border text-sm cursor-not-allowed ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                  />
                </div>
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-slate-100 bg-slate-50'}`}>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                {language === 'Español' ? 'Cancelar' : 'Cancel'}
              </button>
              <button 
                onClick={() => {
                  setCurrentUser({ ...currentUser, name: profileEditData.name, avatar: profileEditData.avatar });
                  setIsProfileModalOpen(false);
                }}
                className="px-6 py-2 bg-primary-1 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-1/20 hover:bg-primary-1/90 transition-all"
              >
                {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <GlobalEditContactModal
        isOpen={editingContactId !== null}
        onClose={() => setEditingContactId(null)}
        contactId={editingContactId}
        initialData={editingContactInitialData}
        conversations={conversations}
        setConversations={setConversations}
        globalKeyFields={currentCustomFields}
        isDarkMode={isDarkMode}
        language={language}
        setActiveChatId={setActiveChatId}
        currentUser={currentUser}
        users={workspaceUsers}
      />

      {/* Bottom Navigation (Mobile Only) */}
      <nav className={`fixed bottom-0 w-full z-50 flex md:hidden justify-around items-center h-16 border-t backdrop-blur-md ${isDarkMode ? 'bg-[#0a0a0f]/90 border-primary-2/30' : 'bg-white/90 border-primary-2/20'}`}>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'dashboard' ? 'text-primary-1' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">{language === 'Español' ? 'Tablero' : 'Dashboard'}</span>
        </button>
        <button 
          onClick={() => setCurrentView('inbox')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'inbox' ? 'text-primary-1' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          <InboxIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{language === 'Español' ? 'Inbox' : 'Inbox'}</span>
        </button>
        <button 
          onClick={() => setCurrentView('contactos')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'contactos' ? 'text-primary-1' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">{language === 'Español' ? 'Contactos' : 'Contacts'}</span>
        </button>
        {currentUser.role !== 'asesor' && (
          <>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'analytics' ? 'text-primary-1' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">{language === 'Español' ? 'Analítica' : 'Analytics'}</span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'settings' ? 'text-primary-1' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{language === 'Español' ? 'Ajustes' : 'Settings'}</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
