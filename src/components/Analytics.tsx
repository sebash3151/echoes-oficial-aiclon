import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, Filter, Zap, Send, Bot, User, Sparkles, Calendar, CalendarDays, BarChart3 } from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function Analytics({ isDarkMode, language, conversations, kanbanColumns, reports, media }: any) {
  const [dateRange, setDateRange] = useState('7days');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [chatInput, setChatInput] = useState('');
  const [chartData, setChartData] = useState([
    { day: 'L', ai: 80, human: 20 },
    { day: 'M', ai: 85, human: 15 },
    { day: 'M', ai: 70, human: 30 },
    { day: 'J', ai: 90, human: 10 },
    { day: 'V', ai: 75, human: 25 },
    { day: 'S', ai: 95, human: 5 },
    { day: 'D', ai: 88, human: 12 },
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: language === 'Español' 
        ? 'He procesado los datos de tus chats y el embudo de ventas. ¿Qué insight necesitas descubrir hoy?' 
        : 'I have processed your chat data and sales funnel. What insight do you need to discover today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatMessages.length > 1 || isTyping) {
      scrollToBottom();
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    // Simulate data refresh when date range changes
    setChartData(prev => [...prev].reverse().map(d => ({
      ...d,
      ai: Math.round(Math.min(100, Math.max(0, d.ai + (Math.random() * 20 - 10)))),
      human: Math.round(Math.min(100, Math.max(0, d.human + (Math.random() * 20 - 10))))
    })));
  }, [dateRange]);

  const handleSendMessage = (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : chatInput;
    if (!textToSend.trim()) return;

    const newUserMsg = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: language === 'Español' 
            ? 'Basado en los datos actuales, he analizado tu consulta. Los leads están respondiendo positivamente a la interacción inicial, pero notamos una caída en la fase de agendamiento. Te sugiero revisar los horarios disponibles.'
            : 'Based on current data, I have analyzed your query. Leads are responding positively to the initial interaction, but we noticed a drop-off in the scheduling phase. I suggest reviewing the available time slots.'
        }
      ]);
    }, 1000);
  };

  const handleShortcut = (text: string) => {
    handleSendMessage(text);
  };

  // Calculate funnel metrics dynamically
  const maxLeads = Math.max(
    ...kanbanColumns.map((col: any) => conversations.filter((c: any) => c.stage === col.id).length),
    0
  ) || 1;

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <main className="flex-1 w-full overflow-y-auto relative z-10 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-primary-2">{language === 'Español' ? 'Analítica e Insights' : 'Analytics & Insights'}</h1>
              <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'Visualiza el rendimiento de tu embudo y consulta a la IA.' : 'Visualize your funnel performance and query the AI.'}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 relative z-50">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30' : 'bg-white border-primary-2/20 shadow-sm'}`}>
                <Filter className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <CustomDropdown
                  options={[
                    { value: '24h', label: language === 'Español' ? 'Últimas 24 horas' : 'Last 24 hours', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Calendar className="w-3 h-3" /></div> },
                    { value: '7days', label: language === 'Español' ? 'Últimos 7 días' : 'Last 7 days', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Calendar className="w-3 h-3" /></div> },
                    { value: 'thisMonth', label: language === 'Español' ? 'Este mes' : 'This month', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><CalendarDays className="w-3 h-3" /></div> },
                    { value: 'thisYear', label: language === 'Español' ? 'Este año' : 'This year', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><CalendarDays className="w-3 h-3" /></div> },
                    { value: 'historical', label: language === 'Español' ? 'Histórico' : 'Historical', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><BarChart3 className="w-3 h-3" /></div> },
                    { value: 'custom', label: language === 'Español' ? 'Rango personalizado...' : 'Custom range...', icon: <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2'}`}><Filter className="w-3 h-3" /></div> }
                  ]}
                  value={dateRange}
                  onChange={setDateRange}
                  isDarkMode={isDarkMode}
                />
              </div>

              {dateRange === 'custom' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-dark-bg border-primary-2/30' : 'bg-white border-primary-1/20 shadow-lg'}`}>
                  <input 
                    type="date" 
                    value={customRange.start}
                    onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                    className={`text-xs p-1 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  />
                  <span className="text-xs text-slate-500">→</span>
                  <input 
                    type="date" 
                    value={customRange.end}
                    onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                    className={`text-xs p-1 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid (Migrated from Dashboard) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'TOTAL DE CHATS' : 'TOTAL CHATS'}</h3>
                <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+12.5%</span>
              </div>
              <p className={`text-4xl font-headline font-bold text-primary-1 mt-2`}>42,892</p>
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
              <p className={`text-4xl font-headline font-bold text-accent mt-2`}>1,204</p>
            </div>

            {/* Card 3 */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'CHATS CERRADOS' : 'CLOSED CHATS'}</h3>
                <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+8.4%</span>
              </div>
              <p className={`text-4xl font-headline font-bold text-primary-1 mt-2`}>38,450</p>
            </div>

            {/* Card 4 */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between relative overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30 hover:border-primary-1/50' : 'hover:border-primary-1/50'}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'MENSAJES MANEJADOS POR IA' : 'MESSAGES HANDLED BY AI'}</h3>
                <span className="text-primary-1 text-xs font-bold font-body bg-primary-1/10 px-2 py-0.5 rounded">+4.2%</span>
              </div>
              <p className={`text-4xl font-headline font-bold text-primary-1 mt-2`}>94.8%</p>
              <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
                <div className="h-full bg-primary-1" style={{ width: '94.8%' }}></div>
              </div>
            </div>
          </div>

          {/* Top Analytics Section (Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Chart: Funnel */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary-1" />
                {language === 'Español' ? 'Embudo de Conversión' : 'Conversion Funnel'}
              </h3>
              
              <div className="space-y-4">
                {kanbanColumns.map((column: any, index: number) => {
                  const leadsInStage = conversations.filter((chat: any) => chat.stage === column.id).length;
                  const percentage = maxLeads > 0 ? (leadsInStage / maxLeads) * 100 : 0;
                  
                  // Use primary-2 for first, primary-1 for middle, accent for last, or a gradient
                  let bgColor = 'bg-primary-1';
                  if (index === 0) bgColor = 'bg-primary-2';
                  else if (index === kanbanColumns.length - 1) bgColor = 'bg-accent';

                  return (
                    <div key={column.id} className="relative w-full mx-auto">
                      <div className="flex justify-between text-sm font-bold mb-1">
                        <span>{language === 'Español' ? column.title.es : column.title.en}</span>
                        <span>{leadsInStage}</span>
                      </div>
                      <div className={`h-8 rounded-lg overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className={`h-full ${bgColor} transition-all duration-1000`} style={{ width: leadsInStage === 0 ? '0%' : `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chart: AI Performance (Simulated Bar Chart) */}
            <div className={`bg-white border border-gray-200 shadow-sm rounded-xl p-6 transition-colors ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : ''}`}>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                {language === 'Español' ? 'Rendimiento IA vs Humano' : 'AI vs Human Performance'}
              </h3>
              
              <div className="h-48 flex items-end justify-between gap-2 mt-4 px-2">
                {/* Simulated Days */}
                {chartData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex justify-center items-end gap-1 h-32">
                      <div 
                        className="w-1/2 bg-primary-1 rounded-t-sm transition-all duration-1000 hover:opacity-80 cursor-help" 
                        style={{ height: `${data.ai}%` }}
                        title={language === 'Español' ? `${data.day} - Resolución Autónoma: ${data.ai} chats` : `${data.day} - Autonomous Resolution: ${data.ai} chats`}
                      ></div>
                      <div 
                        className="w-1/2 bg-accent rounded-t-sm transition-all duration-1000 hover:opacity-80 cursor-help" 
                        style={{ height: `${data.human}%` }}
                        title={language === 'Español' ? `${data.day} - Transferencia Humano: ${data.human} chats` : `${data.day} - Human Transfer: ${data.human} chats`}
                      ></div>
                    </div>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{data.day}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-primary-2/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-1"></div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'Español' ? 'Resolución Autónoma' : 'Autonomous Resolution'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'Español' ? 'Transferencia Humano' : 'Human Transfer'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* New Section: AI Executive Summary (Insights) */}
          <div className={`w-full p-6 rounded-2xl border backdrop-blur-xl ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/80 border-primary-2/20 shadow-sm'}`}>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-primary-1">
              <Sparkles className="w-5 h-5" />
              {language === 'Español' ? 'Resumen Ejecutivo de la IA' : 'AI Executive Summary'}
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">🚀</span>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {language === 'Español' 
                    ? 'La tasa de resolución autónoma de la IA se mantiene en un 94.8% esta semana.' 
                    : 'The AI autonomous resolution rate remains at 94.8% this week.'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">⚠️</span>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {language === 'Español' 
                    ? 'El día Miércoles presentó el mayor volumen de transferencias a asesores humanos (posible necesidad de ajuste de prompts).' 
                    : 'Wednesday had the highest volume of transfers to human agents (possible need for prompt adjustments).'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl leading-none mt-0.5">💡</span>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {language === 'Español' 
                    ? 'Tienes conversiones pendientes: 2 clientes en etapa de interacción requieren seguimiento para cierre.' 
                    : 'You have pending conversions: 2 clients in the interaction stage require follow-up for closure.'}
                </p>
              </li>
            </ul>
          </div>

          {/* Bottom Section: Global Analytical Assistant */}
          <div className={`rounded-2xl border backdrop-blur-xl overflow-hidden flex flex-col h-[400px] ${isDarkMode ? 'bg-[#0a0a0f]/80 border-primary-2/50' : 'bg-white/90 border-primary-2/30 shadow-lg'}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${isDarkMode ? 'border-primary-2/30 bg-primary-2/10' : 'border-primary-2/10 bg-primary-1/5'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-2">{language === 'Español' ? 'Asistente de Base de Datos ✨' : 'Database Assistant ✨'}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Pregúntale a tu IA sobre el rendimiento general.' : 'Ask your AI about overall performance.'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary-2 text-white' : 'bg-gradient-to-br from-primary-1 to-primary-2 text-white'}`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-primary-2 text-white rounded-tr-sm' 
                        : (isDarkMode ? 'bg-white/10 text-white rounded-tl-sm border border-white/10' : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200')
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-1 to-primary-2 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`p-4 rounded-2xl rounded-tl-sm flex items-center gap-1 ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}>
                      <div className="w-2 h-2 rounded-full bg-primary-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-1 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-white'}`}>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  language === 'Español' ? 'Resumen de urgencias' : 'Urgency summary',
                  language === 'Español' ? '¿Por qué no cierran los leads?' : 'Why aren\'t leads closing?',
                  language === 'Español' ? 'Tiempos de respuesta' : 'Response times'
                ].map((shortcut, i) => (
                  <button 
                    key={i}
                    onClick={() => handleShortcut(shortcut)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isDarkMode ? 'border-primary-1/30 text-primary-1 hover:bg-primary-1/10' : 'border-primary-1/20 text-primary-2 hover:bg-primary-1/5'}`}
                  >
                    {shortcut}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                  placeholder={language === 'Español' ? 'Escribe tu consulta analítica...' : 'Type your analytical query...'}
                  className={`w-full pl-4 pr-12 py-3 rounded-xl border text-[16px] sm:text-sm focus:outline-none focus:border-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white disabled:opacity-50' : 'bg-slate-50 border-primary-2/20 text-slate-900 shadow-inner disabled:opacity-50'}`}
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!chatInput.trim() || isTyping}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${!chatInput.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-1/10'} ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* New Operational Metrics Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 shrink-0">
            {/* Module A: System Health */}
            <div className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/60 border-primary-2/20'}`}>
              <div>
                <h3 className="text-lg font-bold text-primary-2 mb-2">
                  {language === 'Español' ? 'Estado de Calidad IA' : 'AI Quality Status'}
                </h3>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Requieren revisión en el Centro de Calidad' : 'Requires review in the Quality Center'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-red-500">
                  ⚠️ {reports?.filter((r: any) => r.status !== 'Resuelto').length || 0}
                </div>
                <div className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'Español' ? 'Reportes Activos' : 'Active Reports'}
                </div>
              </div>
            </div>

            {/* Module B: Media Vault Usage */}
            <div className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between ${isDarkMode ? 'bg-[#0a0a0f]/60 border-primary-2/30' : 'bg-white/60 border-primary-2/20'}`}>
              <div>
                <h3 className="text-lg font-bold text-primary-2 mb-2">
                  {language === 'Español' ? 'Almacenamiento' : 'Storage'}
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Uso de Bóveda Multimedia' : 'Media Vault Usage'}
                </p>
              </div>
              
              {(() => {
                const imgMB = media?.filter((f: any) => f.category === 'Imágenes').reduce((acc: number, f: any) => acc + (f.sizeInMB || 0), 0) || 0;
                const vidMB = media?.filter((f: any) => f.category === 'Videos').reduce((acc: number, f: any) => acc + (f.sizeInMB || 0), 0) || 0;
                const docMB = media?.filter((f: any) => f.category === 'Documentos').reduce((acc: number, f: any) => acc + (f.sizeInMB || 0), 0) || 0;
                const totalMB = imgMB + vidMB + docMB;
                const totalGB = (totalMB / 1024).toFixed(2);
                const storagePercentage = Math.min((totalMB / 5000) * 100, 100);
                
                const imgPct = totalMB > 0 ? Math.round((imgMB / totalMB) * 100) : 0;
                const vidPct = totalMB > 0 ? Math.round((vidMB / totalMB) * 100) : 0;
                const docPct = totalMB > 0 ? Math.round((docMB / totalMB) * 100) : 0;

                return (
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{totalGB} GB</span>
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>5.0 GB</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}>
                        <div className="h-full bg-primary-1" style={{ width: `${storagePercentage}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <span>🖼️</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{language === 'Español' ? 'Imágenes' : 'Images'}: {imgPct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🎥</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{language === 'Español' ? 'Videos' : 'Videos'}: {vidPct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{language === 'Español' ? 'Documentos' : 'Documents'}: {docPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
