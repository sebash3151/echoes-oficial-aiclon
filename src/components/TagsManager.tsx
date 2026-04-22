import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Wand2, Loader2 } from 'lucide-react';

export interface Tag {
  id: string;
  name: string;
  color: string;
  triggerInstruction: string;
}

interface TagsManagerProps {
  isDarkMode: boolean;
  language: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export default function TagsManager({ isDarkMode, language, tags, setTags }: TagsManagerProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<Partial<Tag>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({ name: '', color: '#3b82f6', triggerInstruction: '' });
    setView('form');
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ ...tag });
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'Español' ? '¿Estás seguro de eliminar esta etiqueta?' : 'Are you sure you want to delete this tag?')) {
      setTags(tags.filter(t => t.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingTag) {
      setTags(tags.map(t => t.id === editingTag.id ? { ...t, ...formData } as Tag : t));
    } else {
      const newTag: Tag = {
        id: `t_${Date.now()}`,
        name: formData.name || '',
        color: formData.color || '#3b82f6',
        triggerInstruction: formData.triggerInstruction || ''
      };
      setTags([...tags, newTag]);
    }
    setView('list');
  };

  const handleOptimize = () => {
    if (!formData.triggerInstruction) return;
    setIsOptimizing(true);
    
    // Simulate API call
    setTimeout(() => {
      const optimizedText = `REGLA DE ACTIVACIÓN: Aplicar esta etiqueta exclusivamente cuando el usuario exprese intenciones relacionadas con: "${formData.triggerInstruction}". Evitar falsos positivos.`;
      setFormData({ ...formData, triggerInstruction: optimizedText });
      setIsOptimizing(false);
    }, 1000);
  };

  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.triggerInstruction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-2">
              {language === 'Español' ? 'Gestión de Etiquetas del Eco' : 'Eco Tags Management'}
            </h1>
            <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'Español' ? 'Administra las categorías de intención para la clasificación automática de chats.' : 'Manage intention categories for automatic chat classification.'}
            </p>
          </div>
          {view === 'list' && (
            <button 
              onClick={handleCreate}
              className="px-4 py-2 bg-gradient-to-r from-primary-1 to-primary-2 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all border-none"
            >
              <Plus className="w-4 h-4" />
              {language === 'Español' ? 'CREAR ETIQUETA' : 'CREATE TAG'}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mb-6">
          {view === 'list' ? (
            <div className="space-y-6">
              <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    placeholder={language === 'Español' ? 'Buscar etiqueta...' : 'Search tag...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                  />
                  <svg className={`absolute left-3 top-2.5 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                {filteredTags.length === 0 ? (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {language === 'Español' ? 'No hay etiquetas creadas.' : 'No tags created.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTags.map(tag => (
                      <div key={tag.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="flex-1 min-w-0 pr-4">
                          <span style={{ backgroundColor: `${tag.color}20`, color: tag.color, borderColor: `${tag.color}50` }} className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-2">
                            {tag.name}
                          </span>
                          <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {tag.triggerInstruction || (language === 'Español' ? 'Sin instrucciones' : 'No instructions')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => handleEdit(tag)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-primary-2'}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(tag.id)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-red-500/20 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-500'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
              <div className="space-y-6">
              <div>
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Nombre de la etiqueta' : 'Tag Name'}
                </label>
                <input 
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                  placeholder={language === 'Español' ? 'Ej: Urgente, Soporte...' : 'E.g. Urgent, Support...'}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Color' : 'Color'}
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={formData.color || '#3b82f6'} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})} 
                    className="w-10 h-10 p-1 bg-white border border-gray-300 rounded cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={formData.color || '#3b82f6'} 
                    onChange={(e) => setFormData({...formData, color: e.target.value})} 
                    className={`border rounded px-2 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`} 
                    placeholder="#000000" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Instrucciones para el Eco (Activador)' : 'Eco Instructions (Trigger)'}
                  </label>
                  <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing || !formData.triggerInstruction}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${isOptimizing ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                  >
                    {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    {language === 'Español' ? 'Optimizar IA' : 'AI Optimize'}
                  </button>
                </div>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {language === 'Español' ? 'Explica al Eco en qué situaciones de la conversación debe aplicar esta etiqueta automáticamente.' : 'Explain to the Eco in which conversation situations it should automatically apply this tag.'}
                </p>
                <textarea 
                  value={formData.triggerInstruction || ''}
                  onChange={(e) => setFormData({ ...formData, triggerInstruction: e.target.value })}
                  className={`w-full h-32 p-4 rounded-xl border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                  placeholder={language === 'Español' ? 'Ej: Aplica esta etiqueta si el cliente menciona...' : 'E.g. Apply this tag if the client mentions...'}
                />
              </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {view === 'form' && (
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setView('list')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
            >
              {language === 'Español' ? 'Cancelar' : 'Cancel'}
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.name}
              className={`px-8 py-2.5 rounded-full text-white text-sm font-bold shadow-md transition-all ${!formData.name ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-1 to-primary-2 hover:opacity-90'}`}
            >
              {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
