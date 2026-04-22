import React, { useState, useEffect } from 'react';
import { Save, X, Upload, Plus } from 'lucide-react';

export default function FrequencySettingsForm({ isDarkMode, language, currentWorkspace, updateWorkspaceSettings, isModal, onClose }: any) {
  const [globalKeyFields, setGlobalKeyFields] = useState<string[]>(currentWorkspace?.settings?.customFields || []);

  const [newKeyField, setNewKeyField] = useState('');
  
  const [colors, setColors] = useState({
    lightBg: currentWorkspace?.settings?.lightBg || '#F7FBFF',
    darkBg: currentWorkspace?.settings?.darkBg || '#040308',
    primary1: currentWorkspace?.settings?.primaryColor || '#00C8FF',
    primary2: currentWorkspace?.settings?.primary2 || '#005AB7',
    accent: currentWorkspace?.settings?.accent || '#EA580C'
  });
  const [logo, setLogo] = useState(currentWorkspace?.settings?.logo || '');

  const handleSave = () => {
    updateWorkspaceSettings({ 
      customFields: globalKeyFields,
      primaryColor: colors.primary1,
      primary2: colors.primary2,
      lightBg: colors.lightBg,
      darkBg: colors.darkBg,
      accent: colors.accent,
      logo 
    });
    if (onClose) onClose();
  };

  const content = (
    <div className="flex flex-col gap-8 pb-24">
      {/* Apariencia y Marca */}
      <SettingsCard title={language === 'Español' ? 'Apariencia y Marca' : 'Appearance & Branding'} isDarkMode={isDarkMode}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Logo de la Frecuencia' : 'Frequency Logo'}</label>
            <div className="flex items-center gap-4">
              <label htmlFor="logo-upload" className={`flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'border-primary-2/30 hover:border-primary-1 hover:bg-primary-1/10 text-slate-300' : 'border-slate-300 hover:border-primary-1 hover:bg-primary-1/5 text-slate-700'}`}>
                <Upload className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{language === 'Español' ? 'Subir nuevo logo' : 'Upload new logo'}</span>
              </label>
              <input 
                type="file" 
                id="logo-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const tempUrl = URL.createObjectURL(file);
                    setLogo(tempUrl);
                  }
                }}
              />
              {logo && (
                <div className={`w-12 h-12 rounded-lg border overflow-hidden flex items-center justify-center shrink-0 ${isDarkMode ? 'border-primary-2/30 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ColorPicker label={language === 'Español' ? 'FONDO CLARO' : 'LIGHT BACKGROUND'} colorKey="lightBg" colors={colors} setColors={setColors} isDarkMode={isDarkMode} />
            <ColorPicker label={language === 'Español' ? 'FONDO OSCURO' : 'DARK BACKGROUND'} colorKey="darkBg" colors={colors} setColors={setColors} isDarkMode={isDarkMode} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <ColorPicker label={language === 'Español' ? 'COLOR PRINCIPAL 1' : 'PRIMARY COLOR 1'} colorKey="primary1" colors={colors} setColors={setColors} isDarkMode={isDarkMode} />
            <ColorPicker label={language === 'Español' ? 'COLOR PRINCIPAL 2' : 'PRIMARY COLOR 2'} colorKey="primary2" colors={colors} setColors={setColors} isDarkMode={isDarkMode} />
            <ColorPicker label={language === 'Español' ? 'COLOR DE ACENTO' : 'ACCENT COLOR'} colorKey="accent" colors={colors} setColors={setColors} isDarkMode={isDarkMode} />
          </div>
        </div>
      </SettingsCard>

      {/* Datos Clave */}
      <SettingsCard title={language === 'Español' ? 'Datos Clave (Extracción IA)' : 'Key Data (AI Extraction)'} isDarkMode={isDarkMode}>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {language === 'Español' ? 'Define los campos específicos que la IA debe recolectar durante la conversación.' : 'Define the specific fields that the AI should collect during the conversation.'}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {globalKeyFields.map((field: string) => (
            <div key={field} className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              {field}
              <button 
                onClick={() => setGlobalKeyFields(globalKeyFields.filter((f: string) => f !== field))}
                className={`p-0.5 rounded-full transition-colors ${isDarkMode ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={newKeyField}
            onChange={(e) => setNewKeyField(e.target.value)}
            placeholder={language === 'Español' ? 'Ej. Presupuesto estimado...' : 'e.g. Estimated budget...'}
            className={`flex-1 px-4 py-2.5 rounded-lg border text-[16px] sm:text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900 shadow-sm'}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = newKeyField.trim();
                if (val && !globalKeyFields.includes(val)) {
                  setGlobalKeyFields([...globalKeyFields, val]);
                  setNewKeyField('');
                }
              }
            }}
          />
          <button 
            onClick={() => {
              const val = newKeyField.trim();
              if (val && !globalKeyFields.includes(val)) {
                setGlobalKeyFields([...globalKeyFields, val]);
                setNewKeyField('');
              }
            }}
            className="px-6 py-2.5 bg-primary-2 text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {language === 'Español' ? '+ Añadir Dato' : '+ Add Data'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );

  const floatingSaveButton = (
    <div className={`sticky bottom-0 w-full p-4 border-t flex justify-end z-50 ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/30 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
      <button 
        onClick={handleSave}
        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-1 to-primary-2 text-white rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
      >
        <Save className="w-4 h-4" />
        {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
      </button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl overflow-hidden relative ${isDarkMode ? 'bg-[#13131a] border border-primary-2/30' : 'bg-white'}`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-primary-2/30' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {language === 'Español' ? 'Configuración Global: ' : 'Global Config: '} {currentWorkspace?.name}
            </h3>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 relative">
            {content}
          </div>
          <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-slate-100 bg-slate-50'}`}>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-1 to-primary-2 text-white rounded-full font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              {language === 'Español' ? 'Guardar Cambios' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-2">
            {language === 'Español' ? 'Configuración de Frecuencia' : 'Frequency Configuration'}
          </h1>
          <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {language === 'Español' ? 'Personaliza la apariencia, reglas de negocio y datos clave de este entorno.' : 'Customize the appearance, business rules, and key data of this environment.'}
          </p>
        </div>
        {content}
      </div>
      {floatingSaveButton}
    </div>
  );
}

function SettingsCard({ title, children, isDarkMode }: any) {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm rounded-xl mb-6 overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
      <div className={`px-8 py-6 border-b ${isDarkMode ? 'border-primary-2/30' : 'border-gray-100'}`}>
        <h4 className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

function ColorPicker({ label, colorKey, colors, setColors, isDarkMode }: any) {
  return (
    <div className="space-y-2">
      <label className={`block text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border shadow-sm shrink-0">
          <input 
            type="color" 
            value={colors[colorKey]}
            onChange={(e) => setColors({...colors, [colorKey]: e.target.value})}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
          />
        </div>
        <input 
          type="text" 
          value={colors[colorKey]}
          onChange={(e) => setColors({...colors, [colorKey]: e.target.value})}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
        />
      </div>
    </div>
  );
}
