import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import { ICON_LIBRARY } from '../lib/categoryIcons';

export default function CreateReportModal({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  language, 
  reports, 
  setReports, 
  activeChat, 
  reportingMessageId, 
  setReportingMessageId,
  conversations,
  reportCategories
}: any) {
  const [reportData, setReportData] = useState({ title: '', category: reportCategories?.[0]?.name || 'Alucinación', severity: 'Media', description: '', selectedClientId: '' });

  if (!isOpen) return null;

  const handleSave = () => {
    let linkedChats = [];
    let reportedMessageText = '';
    let aiContext = 'Contexto general del chat';

    if (activeChat) {
      linkedChats = [{ id: activeChat.id, name: activeChat.name, phone: activeChat.phone }];
      const reportedMsg = reportingMessageId ? activeChat.messages?.find((m: any) => m.id === reportingMessageId) : null;
      if (reportedMsg) {
        reportedMessageText = reportedMsg.text || reportedMsg.transcription || '';
        aiContext = reportedMessageText;
      }
    } else if (reportData.selectedClientId && reportData.selectedClientId !== 'general') {
      const selectedClient = conversations?.find((c: any) => c.id === reportData.selectedClientId);
      if (selectedClient) {
        linkedChats = [{ id: selectedClient.id, name: selectedClient.name, phone: selectedClient.phone }];
      }
    }

    const newReport = {
      id: Date.now().toString(),
      title: reportData.title || (language === 'Español' ? 'Reporte sin título' : 'Untitled Report'),
      date: new Date().toLocaleDateString(),
      description: reportData.description,
      linkedChats,
      targetMessageId: reportingMessageId || null,
      category: reportData.category,
      severity: reportData.severity,
      status: 'Pendiente',
      reportedMessageText,
      aiContext
    };
    
    setReports([...reports, newReport]);
    setReportData({ title: '', category: reportCategories?.[0]?.name || 'General', severity: 'Media', description: '', selectedClientId: '' });
    if (setReportingMessageId) setReportingMessageId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-[95%] md:w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/20'}`}>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <AlertTriangle className="w-5 h-5 text-accent" />
            {language === 'Español' ? 'Nuevo Reporte' : 'New Report'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          <div className={`p-3 rounded-lg border text-sm ${isDarkMode ? 'bg-primary-1/10 border-primary-1/20 text-slate-300' : 'bg-primary-1/5 border-primary-1/20 text-slate-700'}`}>
            {activeChat ? (
              <><span className="font-bold">{language === 'Español' ? 'Cliente Afectado:' : 'Affected Client:'}</span> {activeChat.name}</>
            ) : (
              <div className="flex flex-col gap-1">
                <label className="font-bold">{language === 'Español' ? 'Cliente Afectado:' : 'Affected Client:'}</label>
                <select 
                  value={reportData.selectedClientId}
                  onChange={(e) => setReportData({...reportData, selectedClientId: e.target.value})}
                  className={`w-full px-2 py-1.5 rounded border text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                >
                  <option value="">{language === 'Español' ? 'Selecciona un cliente...' : 'Select a client...'}</option>
                  <option value="general">{language === 'Español' ? 'Reporte General (Sin cliente)' : 'General Report (No client)'}</option>
                  {conversations?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {activeChat && reportingMessageId && (
            <blockquote className={`p-3 rounded-lg border-l-4 text-sm italic ${isDarkMode ? 'bg-dark-bg/50 border-l-slate-500 text-slate-400' : 'bg-slate-50 border-l-slate-400 text-slate-600'}`}>
              <span className="font-bold not-italic block mb-1">{language === 'Español' ? 'Mensaje reportado:' : 'Reported message:'}</span>
              "{activeChat.messages?.find((m: any) => m.id === reportingMessageId)?.text || activeChat.messages?.find((m: any) => m.id === reportingMessageId)?.transcription || ''}"
            </blockquote>
          )}

          <div>
            <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'Español' ? 'Título del Reporte' : 'Report Title'}
            </label>
            <input 
              type="text" 
              value={reportData.title}
              onChange={(e) => setReportData({...reportData, title: e.target.value})}
              placeholder={language === 'Español' ? 'Ej. Respuesta incorrecta sobre precios' : 'E.g. Incorrect pricing response'}
              className={`w-full px-3 py-2 rounded-lg border text-[16px] sm:text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white placeholder:text-slate-600' : 'bg-white border-primary-2/20 text-slate-900 placeholder:text-slate-400'}`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Categoría' : 'Category'}
              </label>
              <CustomDropdown
                options={reportCategories?.map((cat: any) => ({ value: cat.name, label: cat.name, icon: ICON_LIBRARY[cat.icon] || ICON_LIBRARY['bot'] })) || []}
                value={reportData.category}
                onChange={(val) => setReportData({...reportData, category: val})}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Severidad' : 'Severity'}
              </label>
              <CustomDropdown
                options={[
                  { value: 'Baja', label: language === 'Español' ? 'Baja' : 'Low', icon: <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5"></div> },
                  { value: 'Media', label: language === 'Español' ? 'Media' : 'Medium', icon: <div className="w-3 h-3 rounded-full bg-yellow-500 mt-0.5"></div> },
                  { value: 'Alta', label: language === 'Español' ? 'Alta' : 'High', icon: <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5"></div> },
                  { value: 'Crítica', label: language === 'Español' ? 'Crítica' : 'Critical', icon: <div className="w-3 h-3 rounded-full bg-red-700 mt-0.5"></div> }
                ]}
                value={reportData.severity}
                onChange={(val) => setReportData({...reportData, severity: val})}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'Español' ? 'Descripción' : 'Description'}
            </label>
            <textarea 
              value={reportData.description}
              onChange={(e) => setReportData({...reportData, description: e.target.value})}
              placeholder={language === 'Español' ? 'Describe el problema con detalle...' : 'Describe the issue in detail...'}
              className={`w-full px-3 py-2 rounded-lg border text-sm h-32 resize-none focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white placeholder:text-slate-600' : 'bg-white border-primary-2/20 text-slate-900 placeholder:text-slate-400'}`}
            />
          </div>
        </div>

        <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/30 rounded-b-2xl' : 'border-primary-2/20 bg-slate-50 rounded-b-2xl'}`}>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-200'}`}
          >
            {language === 'Español' ? 'Cancelar' : 'Cancel'}
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            {language === 'Español' ? 'Guardar Reporte' : 'Save Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
