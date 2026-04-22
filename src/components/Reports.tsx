import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, AlertCircle, Clock, CheckCircle2, Edit2, Trash2, MessageSquare, Plus, X, User, Folder, Download, Globe, FileText, Settings } from 'lucide-react';
import { mockConversations } from '../data/mockData';
import CustomDropdown from './CustomDropdown';
import CreateReportModal from './CreateReportModal';
import { ICON_LIBRARY } from '../lib/categoryIcons';

export default function Reports({ isSuperAdminView, workspaces, isDarkMode, language, reports, setReports, setCurrentView, setInboxViewMode, setActiveChatId, setScrollToMessageId, reportCategories, setReportCategories, media }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [workspaceFilter, setWorkspaceFilter] = useState('Todas');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState('Todas');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [isManagingCategories, setIsManagingCategories] = useState(false);

  // Logic for Global Categories Management (Super Admin only)
  const [inputName, setInputName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('bot');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('');

  const getTimeElapsed = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return { text: language === 'Español' ? `Hace ${hours}h` : `${hours}h ago`, color: isDarkMode ? 'text-slate-400' : 'text-slate-500' };
    return { text: language === 'Español' ? `Hace ${Math.floor(hours/24)}d` : `${Math.floor(hours/24)}d ago`, color: 'text-red-500 font-medium' };
  };

  // Auto-archive logic (simulated cronjob)
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const cleanedReports = reports.filter((r: any) => {
      if (!r.completedAt) return true;
      const completedDate = new Date(r.completedAt);
      return completedDate >= thirtyDaysAgo;
    });

    if (cleanedReports.length !== reports.length) {
      setReports(cleanedReports);
    }
  }, []);

  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  const activeReports = reports.filter((r: any) => !r.completedAt || new Date(r.completedAt) >= fiveDaysAgo);
  const historyReports = reports.filter((r: any) => r.completedAt && new Date(r.completedAt) < fiveDaysAgo);

  const currentReportsList = activeTab === 'activos' ? activeReports : historyReports;

  const filteredReports = currentReportsList.filter((report: any) => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.linkedChats?.some((chat: any) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'Todos' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'Todas' || report.severity === severityFilter;
    const matchesCategory = categoryFilter === 'Todas' || report.category === categoryFilter;
    const matchesWorkspace = !isSuperAdminView || workspaceFilter === 'Todas' || report.workspaceId === workspaceFilter;
    return matchesSearch && matchesStatus && matchesSeverity && matchesCategory && matchesWorkspace;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setReports(reports.map((r: any) => {
      if (r.id === id) {
        const completedAt = newStatus === 'Resuelto' ? new Date().toISOString() : null;
        return { ...r, status: newStatus, completedAt };
      }
      return r;
    }));
  };

  const handleMagicButtonClick = (chatId: string, targetMessageId?: string) => {
    if (isSuperAdminView) {
      alert(language === 'Español' ? 'Debes entrar a la frecuencia para ver este chat.' : 'You must enter the frequency to view this chat.');
      return;
    }
    setCurrentView('inbox');
    setInboxViewMode('list');
    setActiveChatId(chatId);
    if (targetMessageId && setScrollToMessageId) {
      setScrollToMessageId(targetMessageId);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Alta': return 'bg-red-500 text-white';
      case 'Media': return 'bg-yellow-500 text-white';
      case 'Baja': return 'bg-green-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Abierto': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'En Revisión': return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
      case 'Resuelto': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Abierto': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'En Revisión': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Resuelto': return 'bg-green-500/10 text-green-500 border-green-500/30';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
    }
  };

  const handleAddComment = (reportId: string) => {
    if (!newCommentText.trim()) return;
    
    const newComment = {
      id: `c${Date.now()}`,
      date: new Date().toISOString(),
      text: newCommentText,
      author: 'Admin'
    };

    const updatedReports = reports.map((r: any) => 
      r.id === reportId ? { ...r, comments: [...(r.comments || []), newComment] } : r
    );
    setReports(updatedReports);
    
    if (selectedReport?.id === reportId) {
      setSelectedReport(updatedReports.find((r: any) => r.id === reportId));
    }
    
    setNewCommentText('');
  };

  const handleDeleteReport = (reportId: string) => {
    setDeleteReportId(reportId);
  };

  const confirmDeleteReport = () => {
    if (deleteReportId) {
      setReports(reports.filter((r: any) => r.id !== deleteReportId));
      if (selectedReport?.id === deleteReportId) {
        setSelectedReport(null);
      }
      setDeleteReportId(null);
    }
  };

  const handleEditClick = (report: any) => {
    setEditForm({ ...report });
    setEditingReportId(report.id);
  };

  const handleSaveEdit = () => {
    let finalForm = { ...editForm };
    if (finalForm.status === 'Resuelto' && !finalForm.completedAt) {
      finalForm.completedAt = new Date().toISOString();
    } else if (finalForm.status !== 'Resuelto') {
      finalForm.completedAt = null;
    }
    const updatedReports = reports.map((r: any) => r.id === editingReportId ? finalForm : r);
    setReports(updatedReports);
    if (selectedReport?.id === editingReportId) {
      setSelectedReport(finalForm);
    }
    setEditingReportId(null);
    setEditForm(null);
  };

  const handleAddLinkedChat = (chat: any) => {
    if (!editForm.linkedChats?.find((c: any) => c.id === chat.id)) {
      setEditForm({
        ...editForm,
        linkedChats: [...(editForm.linkedChats || []), { id: chat.id, name: chat.name, phone: chat.phone }]
      });
    }
    setChatSearchTerm('');
    setIsChatSearchOpen(false);
  };

  const handleRemoveLinkedChat = (chatId: string) => {
    setEditForm({
      ...editForm,
      linkedChats: editForm.linkedChats.filter((c: any) => c.id !== chatId)
    });
  };

  const chatSearchResults = mockConversations.filter(c => 
    c.name.toLowerCase().includes(chatSearchTerm.toLowerCase()) || 
    c.phone.includes(chatSearchTerm)
  );

  // Storage calculation
  const totalMB = media?.reduce((acc: number, file: any) => acc + (file.sizeInMB || 0), 0) || 0;
  const totalGB = (totalMB / 1024).toFixed(2);
  const storagePercentage = Math.min((totalMB / 5000) * 100, 100);

  // KPI calculations
  const totalReports = reports.length;
  const openReports = reports.filter((r: any) => r.status === 'Abierto').length;
  const reviewReports = reports.filter((r: any) => r.status === 'En Revisión').length;
  const resolvedReports = reports.filter((r: any) => r.status === 'Resuelto').length;

  // Category distribution
  const categoryCounts = reports.reduce((acc: any, r: any) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <main className="flex-1 w-full flex flex-col relative z-10 p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-primary-2">
                {language === 'Español' ? 'Centro de Reportes y Calidad' : 'Reports & Quality Center'}
              </h1>
              <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Trazabilidad de interacciones y feedback de la IA.' : 'Interaction traceability and AI feedback.'}
              </p>
            </div>
            
            {/* Storage Meter */}
            <div className={`flex flex-col items-end p-3 rounded-xl border backdrop-blur-md ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/60 border-primary-2/20'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? `Almacenamiento: ${totalGB} GB / 5.0 GB` : `Storage: ${totalGB} GB / 5.0 GB`}
              </span>
              <div className={`w-48 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}>
                <div className="h-full bg-primary-1" style={{ width: `${storagePercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
            {/* Total Reports */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}>
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Total Reportes' : 'Total Reports'}</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalReports}</p>
              </div>
            </div>
            {/* Open */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-red-500/30' : ''}`}>
              <div className="p-3 rounded-lg bg-red-500/10 text-red-500 relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Abiertos' : 'Open'}</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{openReports}</p>
              </div>
            </div>
            {/* In Review */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-yellow-500/30' : ''}`}>
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'En Revisión' : 'In Review'}</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{reviewReports}</p>
              </div>
            </div>
            {/* Resolved */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-green-500/30' : ''}`}>
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Resueltos' : 'Resolved'}</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{resolvedReports}</p>
              </div>
            </div>
          </div>

          {/* Actions & Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto flex-1">
              {/* Tabs */}
              <div className={`flex gap-2 p-1 rounded-xl w-full md:w-fit ${isDarkMode ? 'bg-[#0a0a0f]/60 border border-primary-2/30' : 'bg-white/60 border border-primary-2/20'}`}>
                <button
                  onClick={() => setActiveTab('activos')}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'activos' 
                      ? 'bg-primary-1 text-white shadow-md' 
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {language === 'Español' ? 'Activos' : 'Active'}
                </button>
                <button
                  onClick={() => setActiveTab('historial')}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'historial' 
                      ? 'bg-primary-1 text-white shadow-md' 
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {language === 'Español' ? 'Historial' : 'History'}
                </button>
              </div>
              
              {/* Search */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder={language === 'Español' ? 'Buscar por título o cliente...' : 'Search by title or client...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                    isDarkMode 
                      ? 'bg-[#0a0a0f]/60 border-primary-2/30 text-white placeholder-slate-500' 
                      : 'bg-white/60 border-primary-2/20 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              
              {/* Dropdown */}
              {isSuperAdminView && workspaces && (
                <div className="relative w-full md:w-auto min-w-[200px]">
                  <CustomDropdown
                    options={[
                      { value: 'Todas', label: language === 'Español' ? 'Todas las frecuencias' : 'All frequencies', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Globe className="w-3 h-3" /></div> },
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
              )}
              <div className="relative w-full md:w-auto min-w-[200px]">
                <CustomDropdown
                  options={[
                    { value: 'Todos', label: language === 'Español' ? 'Todos los estados' : 'All statuses', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}><FileText className="w-3 h-3" /></div> },
                    { value: 'Abierto', label: language === 'Español' ? 'Abierto' : 'Open', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-red-500/20 text-red-500"><AlertCircle className="w-3 h-3" /></div> },
                    { value: 'En Revisión', label: language === 'Español' ? 'En Revisión' : 'In Review', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-yellow-500/20 text-yellow-500"><Clock className="w-3 h-3" /></div> },
                    { value: 'Resuelto', label: language === 'Español' ? 'Resuelto' : 'Resolved', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><CheckCircle2 className="w-3 h-3" /></div> }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  isDarkMode={isDarkMode}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 bg-primary-2 text-white rounded-lg font-bold text-sm hover:bg-primary-2/90 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                {language === 'Español' ? 'Nuevo Reporte' : 'New Report'}
              </button>
            </div>
          </div>

          {/* New Dropdown Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-30">
            <div className="relative w-full md:w-auto min-w-[180px]">
              <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {language === 'Español' ? 'Severidad' : 'Severity'}
              </span>
              <CustomDropdown
                options={[
                  { value: 'Todas', label: language === 'Español' ? 'Todas' : 'All', icon: <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div> },
                  { value: 'Baja', label: language === 'Español' ? 'Baja' : 'Low', icon: <div className="w-3 h-3 rounded-full bg-green-500"></div> },
                  { value: 'Media', label: language === 'Español' ? 'Media' : 'Medium', icon: <div className="w-3 h-3 rounded-full bg-yellow-500"></div> },
                  { value: 'Alta', label: language === 'Español' ? 'Alta' : 'High', icon: <div className="w-3 h-3 rounded-full bg-red-500"></div> },
                  { value: 'Crítica', label: language === 'Español' ? 'Crítica' : 'Critical', icon: <div className="w-3 h-3 rounded-full bg-red-800"></div> }
                ]}
                value={severityFilter}
                onChange={setSeverityFilter}
                isDarkMode={isDarkMode}
                className="w-full"
              />
            </div>

            <div className="relative w-full md:w-auto min-w-[220px]">
              <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {language === 'Español' ? 'Categoría' : 'Category'}
              </span>
              <CustomDropdown
                options={[
                  { value: 'Todas', label: language === 'Español' ? 'Todas' : 'All', icon: <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div> },
                  ...(reportCategories?.map((cat: any) => ({
                    value: cat.name,
                    label: cat.name,
                    icon: ICON_LIBRARY[cat.icon] || ICON_LIBRARY['bot']
                  })) || []),
                  ...(isSuperAdminView ? [{
                    value: 'Administrar',
                    label: language === 'Español' ? 'Administrar' : 'Manage',
                    icon: <Settings className="w-4 h-4 text-primary-1" />
                  }] : [])
                ]}
                value={categoryFilter === 'Todas' ? 'Todas' : categoryFilter}
                onChange={(val) => {
                  if (val === 'Administrar') {
                    setIsManagingCategories(true);
                  } else {
                    setCategoryFilter(val);
                  }
                }}
                isDarkMode={isDarkMode}
                className="w-full"
              />
            </div>
          </div>

          {/* Global Categories Management (ONLY Super Admin, toggleable) */}
          {isSuperAdminView && isManagingCategories && (
            <div className={`mb-8 p-6 rounded-2xl border transition-colors relative ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white border-primary-2/20 shadow-xl'}`}>
              <button 
                onClick={() => setIsManagingCategories(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-1/10 text-primary-1 flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'Español' ? 'Gestión Global de Categorías' : 'Global Categories Management'}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Define las categorías disponibles para todas las frecuencias.' : 'Define the categories available for all frequencies.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder={language === 'Español' ? 'Nueva categoría...' : 'New category...'}
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900 shadow-sm'}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = inputName.trim();
                            if (val && !reportCategories.some((c: any) => c.name === val)) {
                              setReportCategories([...reportCategories, { id: Date.now(), name: val, icon: selectedIcon }]);
                              setInputName('');
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const val = inputName.trim();
                          if (val && !reportCategories.some((c: any) => c.name === val)) {
                            setReportCategories([...reportCategories, { id: Date.now(), name: val, icon: selectedIcon }]);
                            setInputName('');
                          }
                        }}
                        className="px-6 py-2.5 bg-primary-2 text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        {language === 'Español' ? '+ Añadir Categoría' : '+ Add Category'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(ICON_LIBRARY).map((iconKey) => (
                        <button
                          key={iconKey}
                          onClick={() => setSelectedIcon(iconKey)}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedIcon === iconKey
                              ? 'bg-primary-1 text-white ring-2 ring-primary-1 ring-offset-1'
                              : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {ICON_LIBRARY[iconKey]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl border p-4 max-h-[300px] overflow-y-auto ${isDarkMode ? 'bg-black/20 border-primary-2/20' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="space-y-2">
                    {reportCategories.map((cat: any) => (
                      <div key={cat.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDarkMode ? 'bg-white/5 border-primary-2/20' : 'bg-white border-slate-200 hover:border-primary-1/30 shadow-sm'}`}>
                        {editingCategoryId === cat.id ? (
                          <div className="flex flex-col gap-3 w-full">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editCatName}
                                onChange={(e) => setEditCatName(e.target.value)}
                                className={`flex-1 px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                              />
                              <button
                                onClick={() => {
                                  if (editCatName.trim()) {
                                    setReportCategories(reportCategories.map((c: any) => 
                                      c.id === cat.id ? { ...c, name: editCatName.trim(), icon: editCatIcon || 'bot' } : c
                                    ));
                                    setEditingCategoryId(null);
                                  }
                                }}
                                className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow-sm"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingCategoryId(null)} className="p-2 rounded-lg bg-slate-500 text-white hover:bg-slate-600 shadow-sm"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-700/30">
                              {Object.keys(ICON_LIBRARY).map((iconKey) => (
                                <button
                                  key={iconKey}
                                  onClick={() => setEditCatIcon(iconKey)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    editCatIcon === iconKey
                                      ? 'bg-primary-1 text-white'
                                      : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {ICON_LIBRARY[iconKey]}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-primary-1/10 text-primary-1' : 'bg-primary-1/5 text-primary-2'}`}>
                                {ICON_LIBRARY[cat.icon] || ICON_LIBRARY['bot']}
                              </div>
                              <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  setEditingCategoryId(cat.id);
                                  setEditCatName(cat.name);
                                  setEditCatIcon(cat.icon);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-400/10' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setReportCategories(reportCategories.filter((c: any) => c.id !== cat.id))}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Area (List + Chart) */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Ticket List */}
            <div className="flex-1 pr-2 space-y-4 lg:w-3/4 h-fit">
              {filteredReports.map((report: any) => {
              const isSelected = selectedReport?.id === report.id;
              const isEditing = editingReportId === report.id;
              const formattedDate = new Date(report.date).toLocaleDateString(language === 'Español' ? 'es-ES' : 'en-US', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              
              const categoryData = reportCategories?.find((c: any) => c.name === report.category);
              const icon = categoryData ? ICON_LIBRARY[categoryData.icon] : null;

              return (
                <div 
                  key={report.id} 
                  className={`rounded-xl border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                    isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/60 border-primary-2/20'
                  } ${isSelected ? 'shadow-lg ring-1 ring-primary-1/50' : 'hover:border-primary-1/50'}`}
                >
                  {/* Card Header (Clickable for Panel) */}
                  <div 
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                    onClick={() => !isEditing && setSelectedReport(report)}
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                      {/* Date & Category */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {formattedDate}
                          </span>
                          {report.status !== 'Resuelto' && (
                            <span className={`text-sm flex items-center gap-2 ${getTimeElapsed(report.date).color}`}>
                              <Clock className="w-3 h-3" />
                              {getTimeElapsed(report.date).text}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-2 [&>svg]:w-3 [&>svg]:h-3 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            {icon}
                            <span>{report.category}</span>
                          </span>
                          {isSuperAdminView && workspaces && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                              {workspaces.find((w: any) => w.id === report.workspaceId)?.name || report.workspaceId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title / Clients */}
                      <div className="flex flex-col gap-1">
                        <span className={`font-medium text-base truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {report.title || report.category}
                        </span>
                        <span className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {report.linkedChats?.length || 0} {language === 'Español' ? 'clientes afectados' : 'affected clients'}
                        </span>
                      </div>

                      {/* Status Badge (Read-Only) */}
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusBadge(report.status)}`}>
                          <span>{getStatusIcon(report.status)}</span>
                          <span>{report.status}</span>
                        </div>
                        
                        {/* Accordion Toggle Icon (Removed) */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className={`text-center py-16 rounded-2xl border border-dashed ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/30' : 'border-primary-2/20 bg-white/30'}`}>
                <AlertCircle className={`w-12 h-12 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'Español' ? 'No se encontraron reportes' : 'No reports found'}
                </p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Intenta ajustar los filtros de búsqueda.' : 'Try adjusting the search filters.'}
                </p>
              </div>
            )}
            </div>

            {/* Category Distribution Chart (1/4) */}
            <div className={`hidden lg:flex flex-col w-1/4 shrink-0 rounded-xl border backdrop-blur-xl h-fit ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/60 border-primary-2/20'}`}>
              <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
                <h3 className="font-headline font-bold text-primary-2">{language === 'Español' ? 'Distribución de Errores' : 'Error Distribution'}</h3>
              </div>
              <div className="p-5">
                <div className="space-y-5">
                  {Object.entries(categoryCounts).sort((a: any, b: any) => b[1] - a[1]).map(([cat, count]: any) => {
                    const percentage = Math.round((count / totalReports) * 100) || 0;
                    const categoryData = reportCategories?.find((c: any) => c.name === cat);
                    const icon = categoryData ? ICON_LIBRARY[categoryData.icon] : null;
                    return (
                      <div key={cat} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className={`flex items-center gap-2 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                            <span className="truncate max-w-[120px]">{cat}</span>
                          </span>
                          <span className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{percentage}%</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <div className="h-full bg-primary-1 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(categoryCounts).length === 0 && (
                    <div className="text-center py-8 opacity-50">
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'Español' ? 'No hay datos suficientes' : 'Not enough data'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Delete Confirmation Modal */}
      {deleteReportId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-[95%] md:w-full max-w-md p-6 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {language === 'Español' ? 'Eliminar Reporte' : 'Delete Report'}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'Español' ? '¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.' : 'Are you sure you want to delete this report? This action cannot be undone.'}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteReportId(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {language === 'Español' ? 'Cancelar' : 'Cancel'}
              </button>
              <button 
                onClick={confirmDeleteReport}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                {language === 'Español' ? 'Eliminar' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Panel for Report Details */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedReport(null)}
          />
          
          {/* Panel */}
          <div className={`relative w-full max-w-2xl h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'bg-[#0a0a0f] border-l border-primary-2/30' : 'bg-white border-l border-primary-2/20'}`}>
            {/* Panel Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/20'}`}>
              <div className="flex items-center gap-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedReport.title || selectedReport.category}
                </h3>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusBadge(selectedReport.status)}`}>
                  <span>{getStatusIcon(selectedReport.status)}</span>
                  <span>{selectedReport.status}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {editingReportId === selectedReport.id && editForm ? (
                /* Edit Mode Form */
                <div className="space-y-6">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'Español' ? 'Título' : 'Title'}
                    </label>
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                        isDarkMode 
                          ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                          : 'bg-white border-primary-2/20 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'Español' ? 'Categoría' : 'Category'}
                      </label>
                      <CustomDropdown
                        options={reportCategories?.map((cat: any) => ({ value: cat.name, label: cat.name, icon: ICON_LIBRARY[cat.icon] || ICON_LIBRARY['bot'] })) || []}
                        value={editForm.category}
                        onChange={(val) => setEditForm({ ...editForm, category: val })}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'Español' ? 'Severidad' : 'Severity'}
                      </label>
                      <CustomDropdown
                        options={[
                          { value: 'Alta', label: 'Alta', icon: <div className="w-4 h-4 rounded-full bg-red-500 mt-0.5"></div> },
                          { value: 'Media', label: 'Media', icon: <div className="w-4 h-4 rounded-full bg-yellow-500 mt-0.5"></div> },
                          { value: 'Baja', label: 'Baja', icon: <div className="w-4 h-4 rounded-full bg-green-500 mt-0.5"></div> }
                        ]}
                        value={editForm.severity}
                        onChange={(val) => setEditForm({ ...editForm, severity: val })}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'Español' ? 'Estado' : 'Status'}
                      </label>
                      <CustomDropdown
                        options={[
                          { value: 'Abierto', label: language === 'Español' ? 'Abierto' : 'Open', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-red-500/20 text-red-500"><AlertCircle className="w-3 h-3" /></div> },
                          { value: 'En Revisión', label: language === 'Español' ? 'En Revisión' : 'In Review', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-yellow-500/20 text-yellow-500"><Clock className="w-3 h-3" /></div> },
                          { value: 'Resuelto', label: language === 'Español' ? 'Resuelto' : 'Resolved', icon: <div className="w-5 h-5 rounded-md flex items-center justify-center bg-green-500/20 text-green-500"><CheckCircle2 className="w-3 h-3" /></div> }
                        ]}
                        value={editForm.status || 'Abierto'}
                        onChange={(val) => setEditForm({ ...editForm, status: val })}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'Español' ? 'Descripción' : 'Description'}
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors resize-none ${
                        isDarkMode 
                          ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                          : 'bg-white border-primary-2/20 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'Español' ? 'Chats Vinculados' : 'Linked Chats'}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editForm.linkedChats?.map((chat: any) => (
                        <div key={chat.id} className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                          <span>{chat.name}</span>
                          <button onClick={() => handleRemoveLinkedChat(chat.id)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={language === 'Español' ? 'Buscar chat para vincular...' : 'Search chat to link...'}
                        value={chatSearchTerm}
                        onChange={(e) => {
                          setChatSearchTerm(e.target.value);
                          setIsChatSearchOpen(true);
                        }}
                        onFocus={() => setIsChatSearchOpen(true)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                          isDarkMode 
                            ? 'bg-dark-bg/80 border-primary-2/30 text-white placeholder-slate-500' 
                            : 'bg-white border-primary-2/20 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      {isChatSearchOpen && chatSearchTerm && (
                        <div className={`absolute z-20 w-full mt-1 rounded-lg border shadow-lg max-h-40 overflow-y-auto ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                          {chatSearchResults.map(chat => (
                            <div 
                              key={chat.id}
                              onClick={() => handleAddLinkedChat(chat)}
                              className={`px-3 py-2 cursor-pointer text-sm flex justify-between items-center ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-50 text-slate-900'}`}
                            >
                              <span>{chat.name}</span>
                              <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{chat.phone}</span>
                            </div>
                          ))}
                          {chatSearchResults.length === 0 && (
                            <div className={`px-3 py-2 text-sm text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {language === 'Español' ? 'No se encontraron chats' : 'No chats found'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-primary-2/20">
                    <button
                      onClick={() => handleDeleteReport(selectedReport.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        isDarkMode 
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' 
                          : 'border-red-200 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {language === 'Español' ? 'Eliminar Reporte' : 'Delete Report'}
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingReportId(null);
                          setEditForm(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {language === 'Español' ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-primary-1 hover:bg-primary-1/90 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-primary-1/20"
                      >
                        {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-8">
                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(selectedReport.severity)}`}>
                        {selectedReport.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-2 [&>svg]:w-3.5 [&>svg]:h-3.5 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        {(() => {
                          const categoryData = reportCategories?.find((c: any) => c.name === selectedReport.category);
                          const icon = categoryData ? ICON_LIBRARY[categoryData.icon] : null;
                          return (
                            <>
                              {icon}
                              <span>{selectedReport.category}</span>
                            </>
                          );
                        })()}
                      </span>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(selectedReport.date).toLocaleDateString(language === 'Español' ? 'es-ES' : 'en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                    
                    {isSuperAdminView && workspaces && (() => {
                      const workspace = workspaces.find((w: any) => w.id === selectedReport.workspaceId);
                      return (
                        <div className={`mt-2 p-3 border rounded-xl flex items-center gap-3 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                          {workspace?.settings?.logo ? (
                            <img src={workspace.settings.logo} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" alt="" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${workspace?.settings?.primaryColor || '#cbd5e1'}20`, color: workspace?.settings?.primaryColor || '#475569' }}>
                              {workspace?.name?.charAt(0) || 'W'}
                            </div>
                          )}
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
                              {language === 'Español' ? 'Frecuencia de Origen' : 'Source Frequency'}
                            </p>
                            <p className={`text-sm font-bold leading-none ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                              {workspace?.name || selectedReport.workspaceId}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {language === 'Español' ? 'Descripción del Problema' : 'Problem Description'}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedReport.description}
                    </p>
                  </div>

                  {/* Affected Clients */}
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {language === 'Español' ? 'Clientes Afectados' : 'Affected Clients'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.linkedChats?.map((chat: any) => (
                        <button
                          key={chat.id}
                          onClick={() => handleMagicButtonClick(chat.id, selectedReport.targetMessageId)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            isDarkMode 
                              ? 'bg-primary-1/10 text-primary-1 border-primary-1/30 hover:bg-primary-1/20' 
                              : 'bg-primary-1/10 text-primary-2 border-primary-1/20 hover:bg-primary-1/20'
                          }`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedReport.targetMessageId 
                            ? (language === 'Español' ? 'Ir al Mensaje 🔗' : 'Go to Message 🔗')
                            : (language === 'Español' ? 'Ir al Chat 🔗' : 'Go to Chat 🔗')}
                        </button>
                      ))}
                      {(!selectedReport.linkedChats || selectedReport.linkedChats.length === 0) && (
                        <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {language === 'Español' ? 'Ningún chat vinculado' : 'No linked chats'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resolution Note */}
                  {selectedReport.status === 'Resuelto' && selectedReport.completedAt && (
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-green-500/5 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                      <div className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        {language === 'Español' ? 'Fecha de Completado: ' : 'Completed on: '}
                        {new Date(selectedReport.completedAt).toLocaleDateString(language === 'Español' ? 'es-ES' : 'en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      <div className="space-y-1">
                        <h5 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-green-500/70' : 'text-green-600/70'}`}>
                          {language === 'Español' ? 'Nota de Resolución (Post-mortem)' : 'Resolution Note (Post-mortem)'}
                        </h5>
                        <p className={`text-sm ${isDarkMode ? 'text-green-100' : 'text-green-900'}`}>
                          {selectedReport.postMortem || (language === 'Español' ? 'El problema fue identificado y resuelto exitosamente. Se aplicaron medidas preventivas para evitar futuras incidencias similares.' : 'The issue was identified and successfully resolved. Preventive measures were applied to avoid similar incidents in the future.')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-primary-2/10">
                    <button
                      onClick={() => handleEditClick(selectedReport)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        isDarkMode 
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                      {language === 'Español' ? 'Editar Reporte' : 'Edit Report'}
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className={`mt-8 flex flex-col rounded-xl border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50 border-primary-2/20'}`}>
                    <div className={`p-4 border-b font-medium text-sm flex items-center gap-2 ${isDarkMode ? 'border-primary-2/30 text-slate-300' : 'border-primary-2/20 text-slate-700'}`}>
                      <MessageSquare className="w-4 h-4" />
                      {language === 'Español' ? 'Comentarios / Historial' : 'Comments / History'}
                    </div>
                    
                    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {selectedReport.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold flex items-center gap-2 ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}>
                              <User className="w-3 h-3" />
                              {comment.author}
                            </span>
                            <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {new Date(comment.date).toLocaleDateString(language === 'Español' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{comment.text}</p>
                        </div>
                      ))}
                      {(!selectedReport.comments || selectedReport.comments.length === 0) && (
                        <p className={`text-sm text-center italic mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {language === 'Español' ? 'No hay comentarios aún.' : 'No comments yet.'}
                        </p>
                      )}
                    </div>

                    <div className={`p-4 border-t ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/20'}`}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder={language === 'Español' ? 'Añadir comentario...' : 'Add comment...'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(selectedReport.id);
                            }
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                            isDarkMode 
                              ? 'bg-[#0a0a0f] border-primary-2/30 text-white placeholder-slate-500' 
                              : 'bg-white border-primary-2/20 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                        <button
                          onClick={() => handleAddComment(selectedReport.id)}
                          className="p-2 bg-primary-1 hover:bg-primary-1/90 text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isDarkMode={isDarkMode}
        language={language}
        reports={reports}
        setReports={setReports}
        conversations={mockConversations}
      />
    </div>
  );
}
