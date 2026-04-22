import React, { useState } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export default function ForcePasswordChange({ onSave, language }: { onSave: (newPass: string) => void, language: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError(language === 'Español' ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(language === 'Español' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }
    onSave(newPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg text-slate-900 px-4">
      <div className="w-full max-w-[480px] bg-white rounded-xl p-10 md:p-12 ambient-shadow relative">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-primary-2 mb-2">
            {language === 'Español' ? 'Cambio de Contraseña Requerido' : 'Password Change Required'}
          </h1>
          <p className="text-slate-500 text-sm font-medium font-body">
            {language === 'Español' ? 'Por razones de seguridad, debes cambiar tu contraseña temporal antes de continuar.' : 'For security reasons, you must change your temporary password before continuing.'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[0.6875rem] font-bold tracking-[0.05em] text-slate-700 uppercase font-body">
              {language === 'Español' ? 'NUEVA CONTRASEÑA' : 'NEW PASSWORD'}
            </label>
            <input 
              className="w-full bg-[#F0F4F8] border-none rounded-md px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-2/20 transition-all outline-none font-body text-[16px] sm:text-sm" 
              placeholder="••••••••" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[0.6875rem] font-bold tracking-[0.05em] text-slate-700 uppercase font-body">
              {language === 'Español' ? 'CONFIRMAR NUEVA CONTRASEÑA' : 'CONFIRM NEW PASSWORD'}
            </label>
            <input 
              className="w-full bg-[#F0F4F8] border-none rounded-md px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-2/20 transition-all outline-none font-body text-[16px] sm:text-sm" 
              placeholder="••••••••" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            className="velocity-gradient w-full flex items-center justify-center gap-3 py-4 rounded-md text-white font-bold tracking-wide hover:brightness-110 active:scale-[0.98] transition-all group font-body mt-4" 
            type="submit"
          >
            {language === 'Español' ? 'Guardar y Continuar' : 'Save and Continue'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
