import { LayoutDashboard, Inbox as InboxIcon, Bot, BookOpen, Network, Settings, Plus, HelpCircle, LogOut, Search, Bell } from 'lucide-react';

export function Sidebar({ currentView, onNavigate }: { currentView: string, onNavigate: (v: any) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Network },
    { id: 'inbox', label: 'Inbox', icon: InboxIcon },
    { id: 'analytics', label: 'Analytics', icon: Bot },
    { id: 'security', label: 'Security', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-800/50 bg-slate-950/90 z-40 flex flex-col shadow-[4px_0_24px_rgba(0,200,255,0.05)]">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg velocity-gradient flex items-center justify-center shadow-[0_0_15px_rgba(0,200,255,0.4)]">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-headline text-lg font-bold tracking-tighter text-white uppercase leading-none">Echoes</h1>
          <p className="text-[10px] text-celestial tracking-[0.2em] font-medium mt-1 uppercase">Enterprise AI</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id === 'dashboard' || item.id === 'inbox' ? item.id : currentView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-celestial bg-celestial/10 border-l-4 border-celestial rounded-l-none' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-body font-medium text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800/50 mt-auto space-y-4">
        <button className="w-full py-3 px-4 rounded-md velocity-gradient text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,90,183,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform">
          <Plus className="w-4 h-4" />
          New Agent
        </button>
        <div className="pt-4 flex flex-col gap-2">
          <button className="flex items-center gap-3 text-slate-500 hover:text-celestial transition-colors">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Support</span>
          </button>
          <button onClick={() => onNavigate('login')} className="flex items-center gap-3 text-slate-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 z-30 border-b border-slate-800/50">
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-celestial border-b-2 border-celestial pb-1 text-[11px] font-bold uppercase tracking-widest" href="#">Dashboard</a>
          <a className="text-slate-400 hover:text-celestial transition-colors text-[11px] font-bold uppercase tracking-widest" href="#">Analytics</a>
          <a className="text-slate-400 hover:text-celestial transition-colors text-[11px] font-bold uppercase tracking-widest" href="#">Reports</a>
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800/50 focus-within:ring-1 focus-within:ring-celestial/50 w-64 lg:w-96">
          <Search className="text-slate-500 w-4 h-4" />
          <input 
            className="bg-transparent border-none text-[16px] sm:text-xs text-slate-300 focus:ring-0 w-full placeholder:text-slate-600 outline-none" 
            placeholder="Search across communications..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
          <button className="text-slate-400 hover:text-celestial transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-celestial rounded-full border border-slate-950"></span>
          </button>
          <button className="text-slate-400 hover:text-celestial transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white tracking-wide">Alex Sterling</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Admin Account</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-celestial/30 p-0.5">
            <img alt="User profile" className="w-full h-full rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
          </div>
        </div>
      </div>
    </header>
  );
}
