import { useState, MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Login({ onLogin, onDevLogin, language, error }: { onLogin: (email: string, pass: string) => void, onDevLogin?: (role: string, workspaceId?: string) => void, language: string, error?: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden bg-light-bg text-slate-900"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,200,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,200,255,0.15)_1px,transparent_1px)] [background-size:40px_40px]"></div>
      
      {/* Interactive Highlighted Grid Lines */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `linear-gradient(to right, #005AB7 1px, transparent 1px), linear-gradient(to bottom, #005AB7 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          WebkitMaskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          opacity: 0.5
        }}
      ></div>

      {/* Hover Glow Effect (Soft Fill) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,200,255,0.08), transparent 40%)`
        }}
      ></div>

      {/* TopNavBar */}
      <header className="absolute top-8 left-8 z-50">
        <div className="text-2xl font-black tracking-tighter font-headline uppercase text-primary-2">
          Echoes
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative">
          
          <div className="mb-10 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-2 mb-3">{language === 'Español' ? 'Bienvenido' : 'Welcome back'}</h1>
            <p className="text-slate-500 text-sm font-medium font-body">{language === 'Español' ? 'Inicia sesión para acceder a tu espacio de Echoes.' : 'Sign in to access your Echoes workspace.'}</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded-lg flex items-start gap-2">
                <span className="font-bold flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[0.6875rem] font-bold tracking-[0.05em] text-slate-700 uppercase font-body">{language === 'Español' ? 'CORREO ELECTRÓNICO' : 'EMAIL ADDRESS'}</label>
              <input 
                className="w-full bg-[#F0F4F8] border-none rounded-md px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-2/20 transition-all outline-none font-body text-[16px] sm:text-sm" 
                placeholder={language === 'Español' ? 'nombre@empresa.com' : 'name@company.com'}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[0.6875rem] font-bold tracking-[0.05em] text-slate-700 uppercase font-body">{language === 'Español' ? 'CONTRASEÑA' : 'PASSWORD'}</label>
              <input 
                className="w-full bg-[#F0F4F8] border-none rounded-md px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-2/20 transition-all outline-none font-body text-[16px] sm:text-sm" 
                placeholder="........" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* EXACT ALIGNMENT: Checkbox on far left, Forgot Password on far right, same line */}
            <div className="flex justify-between items-center pt-1 pb-2">
              <div className="flex items-center space-x-2">
                <input 
                  className="w-4 h-4 rounded-sm border-slate-300 text-primary-2 focus:ring-primary-2 transition-all cursor-pointer" 
                  id="remember" 
                  type="checkbox" 
                />
                <label className="text-xs font-medium text-slate-600 cursor-pointer select-none font-body" htmlFor="remember">{language === 'Español' ? 'Mantener sesión iniciada' : 'Keep me logged in'}</label>
              </div>
              <a className="text-[0.6875rem] font-bold tracking-[0.05em] text-primary-2 hover:text-primary-1 uppercase transition-colors font-body" href="#">{language === 'Español' ? '¿OLVIDASTE TU CONTRASEÑA?' : 'FORGOT PASSWORD?'}</a>
            </div>
            
            <button 
              className="bg-gradient-to-r from-primary-1 to-primary-2 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 w-full flex items-center justify-center gap-3 group font-body shadow-md" 
              type="submit"
            >
              {language === 'Español' ? 'Iniciar sesión en Echoes' : 'Sign in to Echoes'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-4 px-8 flex justify-between items-center bg-white/60 backdrop-blur-md border-t border-gray-200/50 text-sm text-gray-600 z-10">
        <p className="font-body text-xs tracking-widest uppercase text-slate-500">{language === 'Español' ? '© 2026 Echoes. TODOS LOS DERECHOS RESERVADOS.' : '© 2026 Echoes. ALL RIGHTS RESERVED.'}</p>
        <div className="flex items-center space-x-8">
          <a className="font-body text-xs tracking-widest uppercase text-slate-500 hover:text-primary-2 transition-colors" href="#">{language === 'Español' ? 'TÉRMINOS Y PRIVACIDAD' : 'TERMS & PRIVACY'}</a>
        </div>
      </footer>
    </div>
  );
}
