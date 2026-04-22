import React, { useState, useEffect } from 'react';
import { X, Trash2, User, ChevronDown } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

interface GlobalEditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string | 'new' | null;
  initialData?: any;
  conversations: any[];
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
  globalKeyFields: string[];
  isDarkMode: boolean;
  language: string;
  setActiveChatId?: (id: string | null) => void;
  currentUser?: any;
  users?: any[];
}

export default function GlobalEditContactModal({
  isOpen,
  onClose,
  contactId,
  initialData,
  conversations,
  setConversations,
  globalKeyFields,
  isDarkMode,
  language,
  setActiveChatId,
  currentUser,
  users
}: GlobalEditContactModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    extractedData: {},
    assignedTo: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (contactId === 'new') {
        setFormData({
          name: initialData?.name || '',
          phone: initialData?.phone || '',
          extractedData: initialData?.extractedData || {},
          assignedTo: ''
        });
      } else if (contactId) {
        const contact = conversations.find(c => c.id === contactId);
        if (contact) {
          setFormData({
            name: contact.name || '',
            phone: contact.phone || '',
            extractedData: contact.contactInfo?.extractedData || {},
            assignedTo: contact.assignedTo || ''
          });
        }
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, contactId, initialData, conversations]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (contactId === 'new') {
      const existingChat = initialData?.phone ? conversations.find(c => c.phone === initialData.phone) : null;
      
      if (existingChat) {
        setConversations(prev => prev.map(chat => 
          chat.id === existingChat.id 
            ? { 
                ...chat, 
                name: formData.name || formData.phone,
                phone: formData.phone,
                assignedTo: formData.assignedTo,
                avatar: chat.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || formData.phone || 'User') + '&background=random',
                contactInfo: {
                  ...chat.contactInfo,
                  extractedData: {
                    ...(chat.contactInfo?.extractedData || {}),
                    ...formData.extractedData
                  }
                }
              } 
            : chat
        ));
      } else {
        const newContact = {
          id: `contact-${Date.now()}`,
          name: formData.name || formData.phone,
          phone: formData.phone,
          assignedTo: formData.assignedTo,
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || 'User') + '&background=random',
          lastMessage: '',
          time: { es: 'Ahora', en: 'Just now' },
          unread: 0,
          stage: 'nuevo',
          tags: [],
          messages: [],
          notes: [],
          contactInfo: {
            role: { es: 'Cliente', en: 'Client' },
            extractedData: formData.extractedData
          }
        };
        setConversations(prev => [newContact, ...prev]);
      }
    } else {
      setConversations(prev => prev.map(chat => {
        if (chat.id === contactId) {
          const newName = formData.name || formData.phone;
          return {
            ...chat,
            name: newName,
            phone: formData.phone,
            assignedTo: formData.assignedTo,
            avatar: chat.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(newName || 'User') + '&background=random',
            contactInfo: {
              ...chat.contactInfo,
              extractedData: {
                ...(chat.contactInfo?.extractedData || {}),
                ...formData.extractedData
              }
            }
          };
        }
        return chat;
      }));
    }
    onClose();
  };

  const handleDelete = () => {
    if (contactId !== 'new') {
      setConversations(prev => prev.map(chat => {
        if (chat.id === contactId) {
          return {
            ...chat,
            name: chat.phone,
            avatar: ''
          };
        }
        return chat;
      }));
      if (setActiveChatId) {
        setActiveChatId(null);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-[95%] md:w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl border ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {contactId === 'new' 
              ? (language === 'Español' ? 'Nuevo Contacto' : 'New Contact')
              : (language === 'Español' ? 'Editar Perfil del Cliente' : 'Edit Client Profile')}
          </h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] custom-scrollbar flex-1 space-y-8">
          {/* Basic Section */}
          <div>
            <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}>
              {language === 'Español' ? 'Información Básica' : 'Basic Information'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Nombre Completo' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                    isDarkMode 
                      ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                      : 'bg-white border-primary-2/20 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Teléfono' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                    isDarkMode 
                      ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                      : 'bg-white border-primary-2/20 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* CRM Section */}
          <div>
            <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}>
              {language === 'Español' ? 'Datos Clave (CRM)' : 'Key Data (CRM)'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(new Set([...globalKeyFields, ...Object.keys(formData.extractedData)]))
                .filter(f => f !== 'Nombre completo' && f !== 'Teléfono')
                .map((field) => (
                <div key={field}>
                  <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData.extractedData[field] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      extractedData: {
                        ...formData.extractedData,
                        [field]: e.target.value
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                      isDarkMode 
                        ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                        : 'bg-white border-primary-2/20 text-slate-900'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Asignación de Asesor Section */}
          <div className={`mb-5 pb-5 border-b ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
            <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}>
              {language === 'Español' ? 'Asignación de Asesor' : 'Agent Assignment'}
            </h4>
            <div className="w-full">
              <label className={`block text-xs font-bold mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Asesor Asignado' : 'Assigned Agent'}
              </label>
              {currentUser?.role === 'admin' ? (
                <CustomDropdown
                  options={[
                    { 
                      value: '', 
                      label: language === 'Español' ? 'Sin Asignar' : 'Unassigned',
                      icon: <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300"><User className="w-3 h-3 text-gray-400" /></div>
                    },
                    ...(users?.filter(u => u.role === 'asesor').map(u => ({
                      value: u.id,
                      label: u.name,
                      icon: <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    })) || [])
                  ]}
                  value={formData.assignedTo || ''}
                  onChange={(val) => setFormData({ ...formData, assignedTo: val })}
                  isDarkMode={isDarkMode}
                  className="w-full"
                />
              ) : (
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  {formData.assignedTo ? (
                    <>
                      <img src={users?.find(u => u.id === formData.assignedTo)?.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-gray-700 font-medium">
                        {users?.find(u => u.id === formData.assignedTo)?.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="italic text-sm text-gray-500">
                        Sin Asignar
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t shrink-0 flex items-center justify-between ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
          <div>
            {contactId !== 'new' && (
              showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {language === 'Español' ? '¿Estás seguro?' : 'Are you sure?'}
                  </span>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {language === 'Español' ? 'Sí, eliminar' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {language === 'Español' ? 'No' : 'No'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {language === 'Español' ? 'Eliminar Contacto' : 'Delete Contact'}
                </button>
              )
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'Español' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-2 hover:bg-primary-2/90 text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary-2/20"
            >
              {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
