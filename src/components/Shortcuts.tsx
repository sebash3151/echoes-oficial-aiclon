import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function Shortcuts({ isDarkMode, language, shortcuts, setShortcuts }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ command: '', text: '' });
  const [error, setError] = useState('');

  const filteredShortcuts = shortcuts.filter((s: any) => 
    s.command.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (shortcut?: any) => {
    if (shortcut) {
      setEditingId(shortcut.command);
      setFormData({ command: shortcut.command.replace(/^\/+/, ''), text: shortcut.text });
    } else {
      setEditingId(null);
      setFormData({ command: '', text: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.command || !formData.text) {
      setError(language === 'Español' ? 'Todos los campos son obligatorios' : 'All fields are required');
      return;
    }

    const commandToSave = `/${formData.command.replace(/^\/+/, '')}`;

    const exists = shortcuts.some((s: any) => s.command === commandToSave && s.command !== editingId);
    if (exists) {
      setError(language === 'Español' ? 'Este comando ya existe.' : 'This command already exists.');
      return;
    }

    const newShortcut = { command: commandToSave, text: formData.text };

    if (editingId) {
      setShortcuts(shortcuts.map((s: any) => s.command === editingId ? newShortcut : s));
    } else {
      setShortcuts([...shortcuts, newShortcut]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (command: string) => {
    if (window.confirm(language === 'Español' ? '¿Estás seguro de eliminar esta respuesta?' : 'Are you sure you want to delete this response?')) {
      setShortcuts(shortcuts.filter((s: any) => s.command !== command));
    }
  };

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-2">
              {language === 'Español' ? 'Gestión de Respuestas Rápidas' : 'Quick Responses Management'}
            </h1>
            <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'Español' ? 'Administra los comandos rápidos para autocompletar mensajes en el chat.' : 'Manage quick commands for autocompleting messages in chat.'}
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-gradient-to-r from-primary-1 to-primary-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all border-none"
          >
            <Plus className="w-4 h-4" />
            {language === 'Español' ? 'NUEVA RESPUESTA' : 'NEW RESPONSE'}
          </button>
        </div>

        <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
          <div className={`p-4 border-b flex items-center gap-4 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
              <Search className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                type="text"
                placeholder={language === 'Español' ? 'Buscar respuestas...' : 'Search responses...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-wider ${isDarkMode ? 'border-primary-2/30 text-slate-400 bg-white/5' : 'border-primary-2/10 text-slate-500 bg-slate-50'}`}>
                  <th className="p-4 font-bold">{language === 'Español' ? 'Comando' : 'Command'}</th>
                  <th className="p-4 font-bold">{language === 'Español' ? 'Texto del Mensaje' : 'Message Text'}</th>
                  <th className="p-4 font-bold text-right">{language === 'Español' ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredShortcuts.map((shortcut: any, index: number) => (
                  <tr key={index} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-primary-2/30 hover:bg-white/5' : 'border-primary-2/10 hover:bg-slate-50'}`}>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}>
                        {shortcut.command}
                      </span>
                    </td>
                    <td className="p-4 text-sm truncate max-w-md">
                      {shortcut.text}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(shortcut)}
                          className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(shortcut.command)}
                          className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredShortcuts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-sm text-slate-500">
                      {language === 'Español' ? 'No se encontraron respuestas.' : 'No responses found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-[95%] md:w-full max-w-md rounded-2xl shadow-xl border flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {editingId 
                  ? (language === 'Español' ? 'Editar Respuesta' : 'Edit Response')
                  : (language === 'Español' ? 'Nueva Respuesta' : 'New Response')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Comando' : 'Command'}
                </label>
                <div className="flex items-center">
                  <span className={`px-3 py-2 border border-r-0 rounded-l-md text-sm font-mono ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-slate-400' : 'bg-slate-100 border-primary-2/20 text-slate-500'}`}>/</span>
                  <input
                    type="text"
                    value={formData.command}
                    onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                    placeholder="comando"
                    className={`w-full px-3 py-2 rounded-r-md border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${
                      isDarkMode 
                        ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                        : 'bg-white border-primary-2/20 text-slate-900'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Texto del Mensaje' : 'Message Text'}
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors resize-none ${
                    isDarkMode 
                      ? 'bg-dark-bg/80 border-primary-2/30 text-white' 
                      : 'bg-white border-primary-2/20 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className={`p-6 border-t flex items-center justify-end gap-3 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
              <button
                onClick={() => setIsModalOpen(false)}
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
                {language === 'Español' ? 'Guardar' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
