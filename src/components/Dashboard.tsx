import { useState, useEffect } from 'react';
import { Download, Calendar, CheckCircle2, AlertTriangle, Database, Bot, FileText, Bell, Rocket, Trophy, MessageSquare, User, ChevronDown } from 'lucide-react';
import { mockConversations } from '../data/mockData';

export default function Dashboard({ isDarkMode, language, setActiveChatId, setCurrentView, setInboxViewMode, conversations }: any) {
  const isRefreshing = false;

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 relative z-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-2">{language === 'Español' ? 'Tablero' : 'Dashboard'}</h1>
            <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Monitorea tu ecosistema de IA y la cola de atención en tiempo real.' : 'Monitor your AI ecosystem and the attention queue in real time.'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border font-bold text-xs uppercase tracking-widest ${isDarkMode ? 'bg-primary-1/10 border-primary-1/30 text-primary-1' : 'bg-primary-1/5 border-primary-1/20 text-primary-2'}`}>
              <Calendar className="w-4 h-4" />
              {language === 'Español' ? '📅 Últimas 24 horas' : '📅 Last 24 hours'}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'TOTAL DE CHATS' : 'TOTAL CHATS'}</h3>
              <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+12.5%</span>
            </div>
            <p className={`text-4xl font-headline font-bold text-primary-1 mt-2 transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>42,892</p>
          </div>

          {/* Card 2 */}
          <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'CHATS ACTIVOS' : 'ACTIVE CHATS'}</h3>
              <div className="relative flex h-2.5 w-2.5 mt-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </div>
            </div>
            <p className={`text-4xl font-headline font-bold text-accent mt-2 transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>1,204</p>
          </div>

          {/* Card 3 */}
          <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'CHATS CERRADOS' : 'CLOSED CHATS'}</h3>
              <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+8.4%</span>
            </div>
            <p className={`text-4xl font-headline font-bold text-primary-1 mt-2 transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>38,450</p>
          </div>

          {/* Card 4 */}
          <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'MENSAJES MANEJADOS POR IA' : 'MESSAGES HANDLED BY AI'}</h3>
              <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+4.2%</span>
            </div>
            <p className={`text-4xl font-headline font-bold text-primary-1 mt-2 transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>94.8%</p>
            <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
              <div className="h-full bg-primary-1" style={{ width: '94.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Lower Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Left Column: Live Attention Queue */}
          <section className="space-y-6">
            <h3 className={`font-headline text-xl font-bold tracking-tight ${isDarkMode ? 'text-white/90' : 'text-primary-2'}`}>{language === 'Español' ? 'Acción Requerida: Chats en Vivo' : 'Action Required: Live Chats'}</h3>
            <div className="flex flex-col gap-4">
              
              {conversations.filter((chat: any) => chat.urgency?.es === 'ALTO' || chat.urgency?.es === 'Alta' || chat.urgency?.es === 'Urgente' || chat.requiresHuman || chat.needsHuman).map((chat: any) => (
                <ChatAlertCard
                  key={chat.id}
                  chat={chat}
                  language={language}
                  onClick={() => {
                    setCurrentView('inbox');
                    setInboxViewMode('list');
                    setActiveChatId(chat.id);
                  }}
                  isDarkMode={isDarkMode}
                />
              ))}

            </div>
          </section>

          {/* Right Column: Notifications and Updates */}
          <section className="space-y-6">
            <h3 className={`font-headline text-xl font-bold tracking-tight ${isDarkMode ? 'text-white/90' : 'text-primary-2'}`}>{language === 'Español' ? 'Notificaciones y Actualizaciones' : 'Notifications and Updates'}</h3>
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6 flex flex-col gap-4 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
              
              {/* Mock Notifications Feed */}
              <div className="space-y-4">
                {/* Notification 1 */}
                <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'Español' ? 'Asistencia Humana Requerida en chat de Carlos Gómez' : 'Human Assistance Required in chat with Carlos Gómez'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hace 2 min</p>
                  </div>
                </div>

                {/* Notification 2 */}
                <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'Español' ? 'María Fernanda avanzó a la etapa: Reunión / Cierre' : 'María Fernanda advanced to stage: Meeting / Closing'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hace 15 min</p>
                  </div>
                </div>

                {/* Notification 3 */}
                <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'Español' ? 'IA logró cierre exitoso con Juan Pérez' : 'AI achieved successful closing with Juan Pérez'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hace 1 hora</p>
                  </div>
                </div>

                {/* Notification 4 */}
                <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'Español' ? 'El estado del reporte #45 cambió a: En Revisión' : 'Report #45 status changed to: Under Review'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hace 2 horas</p>
                  </div>
                </div>

                {/* Notification 5 */}
                <div className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {language === 'Español' ? 'Nuevo comentario en el reporte de Ana López' : 'New comment on Ana López\'s report'}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hace 3 horas</p>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const tagColors: Record<string, string> = {
  'Urgente': 'bg-[#EF4444] text-white border-[#EF4444]',
  'Soporte': 'bg-[#8B5CF6] text-white border-[#8B5CF6]',
  'Ventas': 'bg-[#10B981] text-white border-[#10B981]',
  'Humano Requerido': 'bg-[#F97316] text-white border-[#F97316]',
};
const getTagColor = (tag: string) => tagColors[tag] || 'bg-slate-500 text-white border-slate-500';

function ChatAlertCard({ chat, onClick, isDarkMode, language }: any) {
  return (
    <div 
      onClick={onClick}
      className={`w-full backdrop-blur-xl border rounded-xl p-5 flex items-center gap-4 transition-all duration-200 text-left group cursor-pointer ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:bg-white/5 hover:border-primary-1/50 hover:shadow-md' : 'bg-white/60 border-primary-2/20 hover:bg-slate-50 hover:border-primary-1/50 hover:shadow-md'}`}
    >
      {chat.avatar ? (
        <img src={chat.avatar} alt={chat.name} className={`w-12 h-12 rounded-full border shrink-0 object-cover ${isDarkMode ? 'border-dark-bg' : 'border-white shadow-sm'}`} />
      ) : (
        <div className={`w-12 h-12 rounded-full border shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
          <User className={`w-6 h-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h4>
        <p className={`text-xs truncate mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{chat.lastMessage}</p>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {language === 'Español' ? chat.time.es : chat.time.en}
        </span>
        
        <div className="flex flex-wrap gap-1 justify-end items-center">
          {chat.urgency && (
            <div className="flex items-center gap-1 mr-1">
              <AlertTriangle className={`w-3 h-3 ${chat.urgency.en === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${chat.urgency.en === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`}>
                {language === 'Español' ? chat.urgency.es : chat.urgency.en}
              </span>
            </div>
          )}
          {chat.tags && chat.tags.map((tag: string) => (
            <span key={tag} className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
