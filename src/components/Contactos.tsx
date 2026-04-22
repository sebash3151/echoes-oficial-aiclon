import React, { useState } from 'react';
import { Search, Download, Plus, Edit2, X, Sparkles, User } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function Contactos({ isDarkMode, language, conversations, setConversations, globalKeyFields, setCurrentView, setInboxViewMode, setActiveChatId, onOpenEditContact, currentUser, users }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('Todos');
  const [showToast, setShowToast] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const filteredContacts = conversations.filter((c: any) => {
    let isVisible = true;
    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
      isVisible = true;
    } else {
      isVisible = c.assignedTo === currentUser.id;
    }

    if (assignmentFilter === 'Unassigned') {
      isVisible = isVisible && !c.assignedTo;
    } else if (assignmentFilter !== 'Todos') {
      isVisible = isVisible && c.assignedTo === assignmentFilter;
    }

    if (!isVisible) return false;
    if (c.name === c.phone) return false;
    const cleanSearch = searchTerm.replace(/[\s\-\+]/g, '').toLowerCase();
    const cleanPhone = c.phone ? c.phone.replace(/[\s\-\+]/g, '').toLowerCase() : '';
    const cleanName = c.name ? c.name.replace(/[\s\-\+]/g, '').toLowerCase() : '';
    return cleanName.includes(cleanSearch) || cleanPhone.includes(cleanSearch);
  });

  const formatSafeDate = (dateString: string) => {
    if (!dateString) return language === 'Español' ? 'Recientemente' : 'Recently';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? (language === 'Español' ? 'Recientemente' : 'Recently') : date.toLocaleDateString(language === 'Español' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRowClick = (contact: any) => {
    setSelectedContact(contact);
  };

  const handleGoToChat = () => {
    if (selectedContact) {
      setCurrentView('inbox');
      setInboxViewMode('list');
      setActiveChatId(selectedContact.id);
    }
  };

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <main className="flex-1 w-full flex flex-col overflow-hidden relative z-10 p-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary-2">
                {language === 'Español' ? 'Directorio de Contactos' : 'Contacts Directory'}
              </h1>
              <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Gestiona tu base de clientes y exporta datos.' : 'Manage your customer base and export data.'}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border w-full md:w-auto ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30' : 'bg-white border-primary-2/20 shadow-sm'}`}>
                  <Search className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input 
                    type="text" 
                    placeholder={language === 'Español' ? 'Buscar por nombre o teléfono...' : 'Search by name or phone...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-transparent text-sm font-semibold focus:outline-none w-full md:w-48 lg:w-64 ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'}`}
                  />
                </div>
                <div className="w-48 md:w-56">
                  <CustomDropdown
                    options={[
                      { value: 'Todos', label: language === 'Español' ? 'Todos los contactos' : 'All contacts' },
                      { 
                        value: 'Unassigned', 
                        label: language === 'Español' ? 'Sin Asignar' : 'Unassigned',
                        icon: <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300"><User className="w-3 h-3 text-gray-400" /></div>
                      },
                      ...users.filter((u: any) => u.role === 'asesor').map((u: any) => ({
                        value: u.id,
                        label: u.name,
                        icon: <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                      }))
                    ]}
                    value={assignmentFilter}
                    onChange={setAssignmentFilter}
                    isDarkMode={isDarkMode}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <button 
                  onClick={handleExport}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-accent/20"
                >
                  <Download className="w-4 h-4" />
                  {language === 'Español' ? 'Exportar' : 'Export'}
                </button>
                <button 
                  onClick={() => onOpenEditContact('new')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-1 hover:bg-primary-1/90 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-primary-1/20"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'Español' ? 'Nuevo' : 'New'}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={`flex-1 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl mb-6 flex flex-col transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
            <div className="overflow-x-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-primary-2/30 bg-primary-2/10' : 'border-primary-2/10 bg-primary-1/5'}`}>
                    <th className={`p-4 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Cliente' : 'Client'}</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Correo' : 'Email'}</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Asesor' : 'Agent'}</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Fecha de Creación' : 'Creation Date'}</th>
                    <th className={`p-4 text-xs font-bold uppercase tracking-widest text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Acciones' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact: any) => {
                    const assignedUser = users?.find((u: any) => u.id === contact.assignedTo);
                    return (
                    <tr 
                      key={contact.id} 
                      onClick={() => handleRowClick(contact)}
                      className={`border-b last:border-0 cursor-pointer transition-colors ${isDarkMode ? 'border-primary-2/10 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {contact.avatar ? (
                            <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-primary-2/30 shrink-0" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full border shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                              <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                          )}
                          <div>
                            <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{contact.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{contact.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className={`text-sm ${contact.contactInfo?.extractedData?.['Correo electrónico'] ? (isDarkMode ? 'text-slate-300' : 'text-slate-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                          {contact.contactInfo?.extractedData?.['Correo electrónico'] || (language === 'Español' ? 'Sin correo' : 'No email')}
                        </p>
                      </td>
                      <td className="p-4">
                        {assignedUser ? (
                          <div className="flex items-center gap-2">
                            <img src={assignedUser.avatar} alt={assignedUser.name} className="w-6 h-6 rounded-full object-cover" />
                            <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{assignedUser.name}</span>
                          </div>
                        ) : (
                          <span className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {language === 'Español' ? 'Sin Asignar' : 'Unassigned'}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatSafeDate(contact.createdAt)}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditContact(contact.id, contact);
                          }}
                          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-primary-1/20 text-primary-1' : 'hover:bg-primary-1/10 text-primary-2'}`}
                          title={language === 'Español' ? 'Editar' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal (Same as Kanban) */}
      {selectedContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedContact(null)}>
          <div 
            className={`w-[95%] md:w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${isDarkMode ? 'border-primary-2/30 bg-primary-2/10' : 'border-primary-2/10 bg-primary-1/5'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-2">{language === 'Español' ? 'Ficha del Cliente' : 'Client Profile'}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Detalles y resumen de la interacción' : 'Details and interaction summary'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* IZQUIERDA: Info Básica */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="text-center">
                    {selectedContact.avatar ? (
                      <img src={selectedContact.avatar} alt={selectedContact.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary-2/30 mx-auto mb-3 shrink-0" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full border-2 mx-auto mb-3 flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                        <User className={`w-10 h-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    )}
                    <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedContact.name}</h4>
                    <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedContact.phone}</p>
                  </div>

                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-3">
                      {globalKeyFields.map((field: string) => {
                        const value = selectedContact.contactInfo?.extractedData?.[field];
                        return (
                          <div key={field} className="flex flex-col gap-1">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field}</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={value || ''}
                                readOnly
                                placeholder={language === 'Español' ? 'Esperando datos...' : 'Waiting for data...'}
                                className={`w-full text-[16px] sm:text-sm py-2 px-3 pr-8 rounded-lg border transition-colors outline-none focus:border-primary-1 ${value ? (isDarkMode ? 'bg-primary-1/5 border-primary-1/30 text-white' : 'bg-primary-1/5 border-primary-1/30 text-slate-900') : (isDarkMode ? 'bg-dark-bg/50 border-primary-2/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')}`}
                              />
                              {value && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2" title={language === 'Español' ? 'Extraído por IA' : 'Extracted by AI'}>
                                  <Sparkles className="w-3.5 h-3.5 text-primary-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Asesor Asignado */}
                  <div>
                    <h5 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Asesor Asignado' : 'Assigned Agent'}</h5>
                    <div className={`w-full border rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}>
                      {selectedContact.assignedTo ? (
                        <>
                          <img src={users?.find((u: any) => u.id === selectedContact.assignedTo)?.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                          <span>{users?.find((u: any) => u.id === selectedContact.assignedTo)?.name}</span>
                        </>
                      ) : (
                        <>
                          <User className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={`italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'Español' ? 'Sin Asignar' : 'Unassigned'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <h5 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Etiquetas' : 'Tags'}</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags?.map((tag: string) => (
                        <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DERECHA: Datos Relevantes, Notas */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Resumen Inteligente ✨ */}
                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-primary-2/10 border-primary-2/30' : 'bg-primary-1/5 border-primary-2/20'}`}>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-primary-2 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {language === 'Español' ? 'Resumen Inteligente ✨' : 'Smart Summary ✨'}
                    </h5>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/90' : 'text-slate-700'}`}>
                      {selectedContact.contactInfo?.summary?.[language === 'Español' ? 'es' : 'en']}
                    </p>
                  </div>

                  {/* Botón Ir al Chat */}
                  <div className="flex justify-end">
                    <button 
                      onClick={handleGoToChat}
                      className="px-6 py-3 bg-primary-1 hover:bg-primary-1/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary-1/20 flex items-center gap-2"
                    >
                      {language === 'Español' ? 'Ir al Chat' : 'Go to Chat'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Download className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm">
            {language === 'Español' ? 'Descargando base_de_datos.xlsx...' : 'Downloading database.xlsx...'}
          </span>
        </div>
      )}
    </div>
  );
}
