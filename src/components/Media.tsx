import { Bell, ChevronDown, Moon, Sun, LogOut, Search, Plus, Copy, MoreVertical, FileText, Image as ImageIcon, Video as VideoIcon, Edit2, RefreshCw, Trash2, X, Upload, Wand2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import CustomDropdown from './CustomDropdown';

function MediaCard({ file, isDarkMode, language, activeDropdown, setActiveDropdown, onDelete, onEdit, onPreview }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(file.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`h-full flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
      {/* Preview Area */}
      <div 
        className={`h-40 w-full relative flex items-center justify-center border-b shrink-0 cursor-pointer ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50 border-primary-2/10'}`}
        onClick={() => onPreview(file)}
      >
        {file.category === 'Imágenes' ? (
          <img src={file.previewUrl || file.url || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop'} alt={file.alias} className="w-full h-full object-cover" />
        ) : file.category === 'Videos' ? (
          <>
            <video src={file.previewUrl || file.url} className="w-full h-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <VideoIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </>
        ) : (
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-primary-2/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}>
            <FileText className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className={`font-headline font-bold text-base truncate mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} title={file.alias}>
          {file.alias}
        </h3>
        <p className={`text-xs truncate mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} title={file.filename}>
          {file.filename}
        </p>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isDarkMode ? 'bg-primary-2/20 border-primary-2/30 text-primary-1' : 'bg-primary-1/10 border-primary-1/20 text-primary-2'}`}>
            {file.format}
          </span>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {file.size}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`p-3 border-t flex items-center justify-between mt-auto shrink-0 ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/30' : 'border-primary-2/10 bg-slate-50/50'}`}>
        <button 
          onClick={handleCopyId}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${copied ? 'text-green-500' : (isDarkMode ? 'text-slate-400 hover:text-primary-1' : 'text-slate-500 hover:text-primary-2')}`}
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? (language === 'Español' ? '¡Copiado!' : 'Copied!') : (language === 'Español' ? 'Copiar ID' : 'Copy ID')}
        </button>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(activeDropdown === file.id ? null : file.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {activeDropdown === file.id && (
            <div className={`absolute bottom-full right-0 mb-2 w-48 rounded-xl border shadow-xl py-1 z-20 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
              <button onClick={() => { onEdit(file); setActiveDropdown(null); }} className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm whitespace-nowrap transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <Edit2 className="w-4 h-4 shrink-0" />
                {language === 'Español' ? 'Editar Alias' : 'Edit Alias'}
              </button>
              <button className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm whitespace-nowrap transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <RefreshCw className="w-4 h-4 shrink-0" />
                {language === 'Español' ? 'Reemplazar Archivo' : 'Replace File'}
              </button>
              <button 
                onClick={() => {
                  if (window.confirm(language === 'Español' ? '¿Seguro que deseas eliminar este archivo?' : 'Are you sure you want to delete this file?')) {
                    onDelete(file.id);
                  }
                  setActiveDropdown(null);
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm whitespace-nowrap transition-colors text-red-600 hover:bg-red-50 ${isDarkMode ? 'hover:bg-red-500/10' : ''}`}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                {language === 'Español' ? 'Eliminar Archivo' : 'Delete File'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Media({ isDarkMode, language, media, setMedia }: any) {
  const [activeTab, setActiveTab] = useState<'Imágenes' | 'Videos' | 'Documentos'>('Imágenes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [previewingFile, setPreviewingFile] = useState<any>(null);
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingFile, setEditingFile] = useState<any>(null);
  
  // Form State
  const [aliasInput, setAliasInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<'Imágenes' | 'Videos' | 'Documentos'>('Imágenes');
  const [fileNameInput, setFileNameInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const autoClassify = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'Imágenes';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'Videos';
    return 'Documentos';
  };

  const filteredMedia = media.filter((item: any) => {
    const matchesTab = item.category === activeTab;
    const matchesSearch = item.alias.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setMedia(media.filter((item: any) => item.id !== id));
  };

  const handleOpenModal = (mode: 'add' | 'edit', file?: any) => {
    setModalMode(mode);
    if (mode === 'edit' && file) {
      setEditingFile(file);
      setAliasInput(file.alias);
      setCategoryInput(file.category);
      setFileNameInput(file.filename);
      setSelectedFile(null);
    } else {
      setEditingFile(null);
      setAliasInput('');
      setCategoryInput(activeTab);
      setFileNameInput('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isUploading) return;
    setIsModalOpen(false);
    setEditingFile(null);
    setAliasInput('');
    setFileNameInput('');
    setSelectedFile(null);
  };

  const handleMagicFormat = () => {
    if (!aliasInput) return;
    let formatted = aliasInput.toUpperCase().replace(/_/g, '-');
    if (!formatted.startsWith('IMAGEN-') && !formatted.startsWith('VIDEO-') && !formatted.startsWith('DOC-')) {
      const prefix = selectedFile ? (selectedFile.type.startsWith('image/') ? 'IMAGEN-' : selectedFile.type.startsWith('video/') ? 'VIDEO-' : 'DOC-') : 'DOC-';
      formatted = prefix + formatted;
    }
    setAliasInput(formatted);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && !isUploading) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isUploading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileNameInput(file.name);
      setSelectedFile(file);
    }
  };

  const handleUploadSimulation = () => {
    if (modalMode === 'edit' && editingFile) {
      if (!aliasInput.trim()) return;
      setMedia(media.map((item: any) => 
        item.id === editingFile.id 
          ? { ...item, alias: aliasInput, category: categoryInput } 
          : item
      ));
      handleCloseModal();
      return;
    }

    if (!selectedFile) return alert("Por favor, selecciona un archivo.");
    if (!aliasInput.trim()) return alert("Por favor, ingresa un alias.");

    // Alerta de peso
    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > 10) {
      alert("⚠️ Advertencia: Este archivo supera los 10MB. Podría fallar al enviarse por WhatsApp.");
    }

    setIsUploading(true);
    setProgress(0);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15; // Saltos simulados
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        
        // Esperar medio segundo para que el usuario vea el 100%
        setTimeout(() => {
          // AQUÍ DEBE IR TU LÓGICA ORIGINAL PARA GUARDAR EL ARCHIVO EN mockFiles
          const previewUrl = URL.createObjectURL(selectedFile);
          const finalCategory = autoClassify(selectedFile.name);
          const newFile = {
            id: `m${Date.now()}`,
            alias: aliasInput,
            filename: fileNameInput || 'archivo_nuevo.png',
            category: finalCategory,
            format: fileNameInput ? fileNameInput.split('.').pop()?.toUpperCase() || 'PNG' : 'PNG',
            size: `${sizeMB.toFixed(1)} MB`,
            sizeInMB: sizeMB,
            url: finalCategory === 'Imágenes' || finalCategory === 'Videos' ? 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop' : '#',
            previewUrl
          };
          setMedia([newFile, ...media]);
          setActiveTab(finalCategory as 'Imágenes' | 'Videos' | 'Documentos');
          
          setIsUploading(false);
          setProgress(0);
          // CIERRA EL MODAL AQUÍ
          handleCloseModal();
        }, 500);
      } else {
        setProgress(currentProgress);
      }
    }, 300);
  };

  const totalMB = media.reduce((acc: number, file: any) => acc + (file.sizeInMB || 0), 0);
  const totalGB = (totalMB / 1024).toFixed(2);
  const storagePercentage = Math.min((totalMB / 5000) * 100, 100);

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <main className="flex-1 w-full flex flex-col overflow-hidden relative z-10 p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 shrink-0 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-2">
                {language === 'Español' ? 'Multimedia' : 'Media'}
              </h1>
              <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Gestiona los archivos que tu IA puede enviar a los clientes.' : 'Manage the files your AI can send to clients.'}
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

          {/* Actions & Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 shrink-0 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 flex-1 w-full">
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input 
                  type="text" 
                  placeholder={language === 'Español' ? "Buscar por nombre o alias..." : "Search by name or alias..."} 
                  className={`w-full h-10 border rounded-xl pl-10 pr-4 text-[16px] sm:text-sm focus:outline-none focus:border-primary-1/50 transition-colors shadow-sm ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/30 text-white placeholder:text-slate-600' : 'bg-white/80 border-primary-2/20 text-slate-900 placeholder:text-slate-500'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tabs */}
              <div className={`flex items-center p-1 rounded-lg border w-full md:w-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0 ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/30' : 'bg-white border-gray-200'}`}>
                <button 
                  onClick={() => setActiveTab('Imágenes')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'Imágenes' ? 'bg-primary-2 text-white shadow-sm' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-2')}`}
                >
                  {language === 'Español' ? 'Imágenes' : 'Images'}
                </button>
                <button 
                  onClick={() => setActiveTab('Videos')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'Videos' ? 'bg-primary-2 text-white shadow-sm' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-2')}`}
                >
                  {language === 'Español' ? 'Videos' : 'Videos'}
                </button>
                <button 
                  onClick={() => setActiveTab('Documentos')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'Documentos' ? 'bg-primary-2 text-white shadow-sm' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-2')}`}
                >
                  {language === 'Español' ? 'Documentos' : 'Documents'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => setIsRecommendationsModalOpen(true)}
                className={`flex-1 md:flex-none h-10 px-4 rounded-xl flex items-center justify-center font-bold transition-colors gap-2 border ${isDarkMode ? 'bg-dark-bg/50 border-primary-1 text-primary-1 hover:bg-primary-1/10' : 'bg-white border-primary-2 text-primary-2 hover:bg-primary-2/5'}`}
              >
                💡 {language === 'Español' ? 'Recomendaciones' : 'Recommendations'}
              </button>
              <button 
                onClick={() => handleOpenModal('add')}
                className="flex-1 md:flex-none h-10 px-6 rounded-xl flex items-center justify-center text-white font-bold shadow-md hover:opacity-90 transition-opacity gap-2 bg-gradient-to-r from-primary-1 to-primary-2"
              >
                <Plus className="w-4 h-4" />
                {language === 'Español' ? 'Subir Archivo' : 'Upload File'}
              </button>
            </div>
          </div>

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-8" onClick={() => setActiveDropdown(null)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((file: any) => (
                <MediaCard 
                  key={file.id} 
                  file={file} 
                  isDarkMode={isDarkMode} 
                  language={language}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  onDelete={handleDelete}
                  onEdit={(f: any) => handleOpenModal('edit', f)}
                  onPreview={setPreviewingFile}
                />
              ))}
              
              {filteredMedia.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-dark-bg border border-primary-2/30' : 'bg-slate-100 border border-primary-2/20'}`}>
                    <Search className={`w-8 h-8 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'Español' ? 'No se encontraron archivos' : 'No files found'}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Intenta con otro término de búsqueda o cambia de categoría.' : 'Try another search term or change category.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {previewingFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setPreviewingFile(null)}>
          <button 
            onClick={() => setPreviewingFile(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-5xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {previewingFile.category === 'Imágenes' ? (
              <img src={previewingFile.previewUrl || previewingFile.url} alt={previewingFile.alias} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
            ) : previewingFile.category === 'Videos' ? (
              <video src={previewingFile.previewUrl || previewingFile.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
            ) : (
              <div className="w-64 h-64 rounded-3xl bg-white/10 flex flex-col items-center justify-center text-white">
                <FileText className="w-24 h-24 mb-4" />
                <p className="font-bold text-lg text-center px-4">{previewingFile.filename}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      {isRecommendationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsRecommendationsModalOpen(false)}>
          <div 
            className={`w-[95%] md:w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <h3 className={`font-headline font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                💡 {language === 'Español' ? 'Recomendaciones para WhatsApp' : 'Recommendations for WhatsApp'}
              </h3>
              <button 
                onClick={() => setIsRecommendationsModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-6 text-sm space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <ul className="space-y-4 list-disc pl-5">
                <li>
                  <strong>Títulos Explícitos:</strong> Nombra los archivos de la forma más detallada posible para que la IA los entienda (Ej: "imagen recepción", "imagen de la entrada", "foto del perro").
                </li>
                <li>
                  <strong>Series de Archivos:</strong> Si hay varias imágenes de lo mismo, numéralas (Ej: "imagen habitación orquídea 1", "imagen habitación orquídea 2"). Aplica igual para "video de bienvenida", "documento del menú", etc.
                </li>
                <li>
                  <strong>Límites para WhatsApp:</strong> Para garantizar el envío, mantente cerca de estos límites:
                  <ul className="mt-2 space-y-1 list-none pl-0">
                    <li>🖼️ Imágenes: máximo 5 MB</li>
                    <li>🎥 Videos: máximo 10 MB</li>
                    <li>📄 Documentos: máximo 10 MB</li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div className={`px-6 py-4 border-t flex justify-end ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <button 
                onClick={() => setIsRecommendationsModalOpen(false)}
                className="px-6 py-2 bg-primary-2 text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                {language === 'Español' ? 'Entendido' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload/Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !isUploading && handleCloseModal()}>
          <div 
            className={`w-[95%] md:w-full max-w-md max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <h3 className={`font-headline font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {modalMode === 'add' 
                  ? (language === 'Español' ? 'Subir Archivo' : 'Upload File') 
                  : (language === 'Español' ? 'Editar Archivo' : 'Edit File')}
              </h3>
              <button 
                onClick={handleCloseModal}
                disabled={isUploading}
                className={`p-1.5 rounded-lg transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
              {/* Alias Input */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'Español' ? 'Alias / Nombre de identificación *' : 'Alias / Identification Name *'}
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    placeholder={language === 'Español' ? 'Ej: Logo Principal' : 'Ex: Main Logo'}
                    className={`w-full h-10 pl-3 pr-10 rounded-lg border text-[16px] sm:text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg border-primary-2/30 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                  <button 
                    onClick={handleMagicFormat}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-amber-500 hover:bg-white/10' : 'text-amber-500 hover:bg-slate-100'}`}
                    title={language === 'Español' ? 'Auto-formato mágico' : 'Magic auto-format'}
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* File Input (Simulated Drag & Drop) */}
              {modalMode === 'add' && (
                <div className="flex flex-col gap-1.5 relative z-0">
                  <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {language === 'Español' ? 'Archivo' : 'File'}
                  </label>
                  <div 
                    className={`mt-4 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-primary-2/30 hover:border-primary-1/50 bg-dark-bg/50 hover:bg-white/5' : 'border-gray-300 hover:border-primary-1/50 bg-slate-50 hover:bg-gray-50'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className={`p-4 rounded-xl border mb-3 flex items-center gap-3 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                          <span className="text-2xl">📄</span>
                          <span className={`font-medium text-sm truncate max-w-[200px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedFile.name}</span>
                        </div>
                        <p className="text-sm font-medium text-green-500">
                          {language === 'Español' ? 'Clasificado automáticamente como:' : 'Automatically classified as:'} {autoClassify(selectedFile.name)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-8 h-8 mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {language === 'Español' ? 'Haz clic para subir un archivo' : 'Click to upload a file'}
                        </p>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          {language === 'Español' ? 'PNG, JPG, MP4, PDF hasta 50MB' : 'PNG, JPG, MP4, PDF up to 50MB'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              {isUploading ? (
                <div className="w-full mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm font-medium text-gray-500 mt-2">
                    Subiendo archivo... {progress}%
                  </p>
                </div>
              ) : (
                <div className="flex justify-end gap-3 mt-6">
                  {modalMode === 'edit' && (
                    <button 
                      onClick={() => {
                        handleDelete(editingFile.id);
                        handleCloseModal();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border mr-auto ${isDarkMode ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {language === 'Español' ? 'Eliminar Archivo' : 'Delete File'}
                    </button>
                  )}
                  <button onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    Cancelar
                  </button>
                  <button onClick={handleUploadSimulation} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow">
                    Guardar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
