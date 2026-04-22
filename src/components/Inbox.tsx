import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, Calendar, Link as LinkIcon, Mail, Zap, Bot, X, Plus, Pencil, Trash2, Save, Flag, AlertTriangle, ChevronDown, List, LayoutGrid, Pin, Settings as SettingsIcon, GripVertical, ChevronRight, ChevronLeft, Mic, Mic2, Play, Sparkles, User, Copy, FileText, Upload, Globe, MessageSquare, Bold, Italic, Underline, CaseUpper, CaseLower, CaseSensitive, ArrowUpDown, Filter, Clock } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import CreateReportModal from './CreateReportModal';

const EMOJI_CATEGORIES = [
  { name: 'Caritas', icon: '😀', emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','☺️','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓'] },
  { name: 'Naturaleza', icon: '🐻', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇'] },
  { name: 'Comida', icon: '🍔', emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶','🫑','🌽','🥕','🫒','🧄','🧅'] },
  { name: 'Actividades', icon: '⚽', emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷'] },
  { name: 'Objetos', icon: '💡', emojis: ['⌚','📱','📲','💻','⌨','🖥','🖨','🖱','🖲','🕹','🗜','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽','🎞','📞','☎','📟','📠','📺','📻','🎙','🎚'] },
  { name: 'Símbolos', icon: '❤️', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮','✝','☪','🕉','☸','✡','🔯','🕎','☯','☦','🛐'] }
];

export default function Inbox({ isDarkMode, language, activeChatId, setActiveChatId, conversations, setConversations, reports, setReports, inboxViewMode, setInboxViewMode, globalKeyFields, kanbanColumns, setKanbanColumns, onOpenEditContact, shortcuts, scrollToMessageId, setScrollToMessageId, currentUser, users, availableTags = [] }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'message' | 'note'>('message');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showShortcutsMenu, setShowShortcutsMenu] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reportData, setReportData] = useState({ title: '', category: 'Alucinación', severity: 'Media', description: '' });
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const [isKanbanEditMode, setIsKanbanEditMode] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editColumnTitle, setEditColumnTitle] = useState('');
  const [selectedKanbanCard, setSelectedKanbanCard] = useState<any>(null);
  const [searchTermKanban, setSearchTermKanban] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('Todos');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAiFilterOpen, setIsAiFilterOpen] = useState(false);
  const [aiFilter, setAiFilter] = useState('Todas');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortType, setSortType] = useState('recent');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [micMode, setMicMode] = useState<'none' | 'recording' | 'dictating'>('none');
  const [showMagicRedactor, setShowMagicRedactor] = useState(false);
  const [showMultimediaPicker, setShowMultimediaPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState<any>(null);
  const [activeTranslateDropdown, setActiveTranslateDropdown] = useState<string | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isChatSearchActive, setIsChatSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummaryDropdownOpen, setIsSummaryDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  const adjustTextareaHeight = () => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const applyFormatting = (type: 'bold' | 'italic' | 'underline' | 'uppercase' | 'lowercase' | 'sentence') => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    if (['bold', 'italic', 'underline'].includes(type)) {
      document.execCommand(type, false);
      updateActiveFormats();
    } else {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      if (!selectedText) return;

      let newText = '';
      if (type === 'uppercase') newText = selectedText.toUpperCase();
      else if (type === 'lowercase') newText = selectedText.toLowerCase();
      else if (type === 'sentence') {
        newText = selectedText.toLowerCase().replace(/(^\w|\.\s+\w|!\s+\w|\?\s+\w)/g, (m) => m.toUpperCase());
      }

      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
      
      // Attempt to re-select or at least keep focus
      const newRange = document.createRange();
      newRange.selectNodeContents(editor); // Simple fallback: select all or just keep caret
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    setInputValue(editor.innerText);
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log('Interacción requerida para audio', e));
    } catch (error) {}
  };

  const simulateNewMessage = () => {
    if (!activeChatId) return;
    playNotificationSound();
    
    const newMsg = {
      id: `msg_${Date.now()}`,
      type: 'incoming',
      text: language === 'Español' ? 'Mensaje de prueba recibido.' : 'Test message received.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMsg],
          lastMessage: newMsg.text,
          time: { es: 'ahora', en: 'just now' },
          unreadCount: (chat.unreadCount || 0) + 1
        };
      }
      return chat;
    }));
  };

  const allTags = availableTags.map((t: any) => t.name);

  useEffect(() => {
    // Meeting expiration check
    const interval = setInterval(() => {
      setConversations((prev: any[]) => prev.map(chat => {
        if (chat.contactInfo?.meetingScheduled?.date) {
          const meetingDate = new Date(chat.contactInfo.meetingScheduled.date);
          if (meetingDate < new Date()) {
            const newContactInfo = { ...chat.contactInfo };
            delete newContactInfo.meetingScheduled;
            return { ...chat, contactInfo: newContactInfo };
          }
        }
        return chat;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find((t: any) => t.name === tagName);
    if (!tag) return '#64748b'; // default slate-500
    return tag.color;
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return '';
    
    // If text contains HTML tags (detected by < and >), wrap in a div and safely render
    const hasHtml = /<[a-z][\s\S]*>/i.test(text);

    if (hasHtml) {
      // In a real app we would sanitize this. Here we assume it's created by our custom editor.
      return <div dangerouslySetInnerHTML={{ __html: text }} className="rich-text-content" />;
    }

    if (!isChatSearchActive || !chatSearchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${chatSearchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === chatSearchQuery.toLowerCase() ? <mark key={i} className="bg-yellow-300 text-slate-900 rounded-sm px-0.5">{part}</mark> : part
    );
  };

  const filteredConversations = conversations.filter((chat: any) => {
    let isVisible = true;
    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
      isVisible = true;
    } else {
      isVisible = chat.assignedTo === currentUser.id;
    }

    if (assignmentFilter === 'Unassigned') {
      isVisible = isVisible && !chat.assignedTo;
    } else if (assignmentFilter !== 'Todos') {
      isVisible = isVisible && chat.assignedTo === assignmentFilter;
    }

    if (!isVisible) return false;

    if (sortType === 'unreplied') {
      const lastMsg = chat.messages?.[chat.messages.length - 1];
      if (lastMsg && lastMsg.type === 'outgoing') return false;
    }

    const cleanSearch = searchQuery.replace(/[\s\-\+]/g, '');
    const cleanPhone = chat.phone ? chat.phone.replace(/[\s\-\+]/g, '') : '';
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cleanPhone.includes(cleanSearch);
    const matchesTag = selectedTag === '' || (chat.tags && chat.tags.includes(selectedTag));
    
    let matchesAi = true;
    if (aiFilter === 'IA Activa') matchesAi = chat.aiEnabled !== false;
    if (aiFilter === 'IA Desactivada/Manual') matchesAi = chat.aiEnabled === false;

    return matchesSearch && matchesTag && matchesAi;
  }).sort((a: any, b: any) => {
    // Pinned chats always stay on top
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortType === 'recent') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortType === 'oldest') {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }
    if (sortType === 'waiting') {
      const aIsWaiting = a.statusBadge?.en === 'HUMAN TAKEOVER' || a.statusBadge?.en === 'INTERVENTION REQUIRED';
      const bIsWaiting = b.statusBadge?.en === 'HUMAN TAKEOVER' || b.statusBadge?.en === 'INTERVENTION REQUIRED';
      if (aIsWaiting && !bIsWaiting) return -1;
      if (!aIsWaiting && bIsWaiting) return 1;
      return (b.unreadCount || 0) - (a.unreadCount || 0);
    }
    return 0;
  });

  const activeChat = filteredConversations.find((c: any) => c.id === activeChatId) || filteredConversations[0];

  useEffect(() => {
    if (!isChatSearchActive || !chatSearchQuery.trim() || !activeChat) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
      return;
    }

    const searchLower = chatSearchQuery.toLowerCase();
    const results = activeChat.messages
      ?.filter((msg: any) => 
        (msg.text && msg.text.toLowerCase().includes(searchLower)) || 
        (msg.transcription && msg.transcription.toLowerCase().includes(searchLower))
      )
      .map((msg: any) => msg.id) || [];
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
  }, [chatSearchQuery, isChatSearchActive, activeChat?.id]);

  useEffect(() => {
    if (searchResults.length > 0 && searchResults[currentSearchIndex]) {
      const element = document.getElementById(`message-${searchResults[currentSearchIndex]}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSearchIndex, searchResults]);

  const handlePrevMatch = () => {
    if (searchResults.length > 0) {
      setCurrentSearchIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    }
  };

  const handleNextMatch = () => {
    if (searchResults.length > 0) {
      setCurrentSearchIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    }
  };

  const isUnknownContact = activeChat?.name === activeChat?.phone || activeChat?.name.startsWith('+');

  useEffect(() => {
    if (scrollToMessageId) {
      setTimeout(() => {
        const element = document.getElementById(`message-${scrollToMessageId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setScrollToMessageId(null);
      }, 300);
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages, scrollToMessageId, setScrollToMessageId]);

  const handleCreateReportFromMessage = (message: any) => {
    if (!activeChat) return;
    setReportingMessageId(message.id);
    setIsReportModalOpen(true);
  };

  const handleAssignationChange = (chatId: string, newAssignee: string) => {
    const val = newAssignee === '' ? null : newAssignee;
    setConversations(conversations.map((c: any) => c.id === chatId ? { ...c, assignedTo: val } : c));
  };

  const handleSendMessage = () => {
    const currentChatId = activeChatId || conversations[0]?.id;
    const editor = editorRef.current;
    const currentHtml = editor ? editor.innerHTML : inputValue;
    const currentText = editor ? editor.innerText : inputValue;

    if (!currentText.trim() && !attachedFile) return;

    if (inputMode === 'message') {
      const newMsg = {
        id: `msg_${Date.now()}`,
        type: 'outgoing',
        text: currentHtml,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations((prev: any[]) => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...(chat.messages || []), newMsg],
            lastMessage: stripHtml(currentHtml),
            time: { es: 'ahora', en: 'just now' },
            unreadCount: 0
          };
        }
        return chat;
      }));
    } else {
      const newNote = {
        id: Date.now().toString(),
        text: currentHtml,
        time: language === 'Español' ? 'Justo ahora' : 'Just now'
      };

      setConversations((prev: any[]) => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            notes: [...(chat.notes || []), newNote]
          };
        }
        return chat;
      }));
    }

    setInputValue('');
    if (editor) editor.innerHTML = '';
    setAttachedFile(null);
    setShowEmojiPicker(false);
  };

  const handleTranslate = (messageId: string, lang: string) => {
    setConversations((prev: any[]) => prev.map(chat => ({
      ...chat,
      messages: chat.messages?.map((msg: any) => {
        if (msg.id === messageId) {
          const originalText = msg.text || msg.transcription || '';
          // 1. Limpiar prefijos anteriores (busca "[Traducido al <CualquierIdioma>]: " y lo borra)
          const cleanText = originalText.replace(/^\[Traducido al .*?\]:\s*/, '');
          // 2. Aplicar el nuevo prefijo limpio
          const newTranslatedText = `[Traducido al ${lang}]: ${cleanText}`;
          return { ...msg, text: newTranslatedText };
        }
        return msg;
      }) || []
    })));
    setActiveTranslateDropdown(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleBot = () => {
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, isEcoActive: !chat.isEcoActive };
      }
      return chat;
    }));
  };

  const removeTag = (tagToRemove: string) => {
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, tags: chat.tags?.filter((t: string) => t !== tagToRemove) || [] };
      }
      return chat;
    }));
  };

  const addTag = (tagToAdd: string) => {
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, tags: [...(chat.tags || []), tagToAdd] };
      }
      return chat;
    }));
    setIsAddTagOpen(false);
  };

  const deleteNote = (noteId: string) => {
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, notes: chat.notes?.filter((n: any) => n.id !== noteId) || [] };
      }
      return chat;
    }));
  };

  const saveEditNote = (noteId: string) => {
    if (!editNoteText.trim()) return;
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          notes: chat.notes?.map((n: any) => n.id === noteId ? { ...n, text: editNoteText } : n) || []
        };
      }
      return chat;
    }));
    setEditingNoteId(null);
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  const moveColumn = (index: number, direction: number) => {
    const newCols = [...kanbanColumns];
    const temp = newCols[index];
    newCols[index] = newCols[index + direction];
    newCols[index + direction] = temp;
    setKanbanColumns(newCols);
  };

  const deleteColumn = (colId: string, index: number) => {
    const prevColId = kanbanColumns[index - 1].id;
    
    // Migrate conversations
    setConversations((prev: any[]) => prev.map(chat => {
      if (chat.stage === colId) {
        return { ...chat, stage: prevColId };
      }
      return chat;
    }));

    // Remove column
    setKanbanColumns(prev => prev.filter(c => c.id !== colId));
  };

  const renderKanbanColumn = (col: any) => {
    const cleanSearch = searchTermKanban.replace(/[\s\-\+]/g, '').toLowerCase();
    
    const stageChats = conversations.filter((c: any) => {
      if (c.stage !== col.id) return false;
      
      let isVisible = true;
      if (currentUser.role === 'admin') {
        isVisible = true;
      } else {
        isVisible = c.assignedTo === currentUser.id;
      }

      if (assignmentFilter === 'Unassigned') {
        isVisible = isVisible && !c.assignedTo;
      } else if (assignmentFilter !== 'Todos') {
        isVisible = isVisible && c.assignedTo === assignmentFilter;
      }

      if (!isVisible) return false;
      
      if (!cleanSearch) return true;
      
      const cleanName = c.name ? c.name.replace(/[\s\-\+]/g, '').toLowerCase() : '';
      const cleanPhone = c.phone ? c.phone.replace(/[\s\-\+]/g, '').toLowerCase() : '';
      
      return cleanName.includes(cleanSearch) || cleanPhone.includes(cleanSearch);
    });
    
    // Sort pinned first
    stageChats.sort((a: any, b: any) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    const colIndex = kanbanColumns.findIndex(c => c.id === col.id);
    const canMoveLeft = colIndex > 1; // Index 0 is fixed start
    const canMoveRight = colIndex < kanbanColumns.length - 2; // Last index is fixed end

    return (
      <div key={col.id} className={`flex flex-col w-[85vw] md:w-[320px] shrink-0 rounded-xl border snap-center ${isDarkMode ? 'bg-[#0a0a0f]/40 border-primary-2/20' : 'bg-slate-50/50 border-primary-2/10'}`}>
        <div className={`p-4 border-b font-bold text-sm flex items-center justify-between group ${isDarkMode ? 'border-primary-2/20 text-white' : 'border-primary-2/10 text-slate-800'}`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isKanbanEditMode && !col.isFixedStart && !col.isFixedEnd && (
              <GripVertical className="w-4 h-4 text-slate-400 cursor-grab shrink-0" />
            )}
            {editingColumnId === col.id ? (
              <input
                type="text"
                value={editColumnTitle}
                onChange={(e) => setEditColumnTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setKanbanColumns(prev => prev.map(c => c.id === col.id ? { ...c, title: { ...c.title, [language === 'Español' ? 'es' : 'en']: editColumnTitle } } : c));
                    setEditingColumnId(null);
                  }
                  if (e.key === 'Escape') {
                    setEditingColumnId(null);
                  }
                }}
                autoFocus
                className={`w-full px-2 py-1 text-sm rounded border focus:outline-none ${isDarkMode ? 'bg-dark-bg border-primary-1/50 text-white' : 'bg-white border-primary-1/50 text-slate-900'}`}
              />
            ) : (
              <span className="truncate">{col.title[language === 'Español' ? 'es' : 'en']}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isKanbanEditMode ? (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!col.isFixedStart && !col.isFixedEnd && (
                  <>
                    <button
                      onClick={() => moveColumn(colIndex, -1)}
                      disabled={!canMoveLeft}
                      className={`p-1 rounded ${canMoveLeft ? (isDarkMode ? 'hover:bg-primary-2/10 text-slate-400 hover:text-white' : 'hover:bg-primary-2/10 text-slate-500 hover:text-primary-2') : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveColumn(colIndex, 1)}
                      disabled={!canMoveRight}
                      className={`p-1 rounded ${canMoveRight ? (isDarkMode ? 'hover:bg-primary-2/10 text-slate-400 hover:text-white' : 'hover:bg-primary-2/10 text-slate-500 hover:text-primary-2') : 'opacity-30 cursor-not-allowed'}`}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                {editingColumnId === col.id ? (
                  <button
                    onClick={() => {
                      setKanbanColumns(prev => prev.map(c => c.id === col.id ? { ...c, title: { ...c.title, [language === 'Español' ? 'es' : 'en']: editColumnTitle } } : c));
                      setEditingColumnId(null);
                    }}
                    className={`p-1 rounded hover:bg-primary-1/20 ${isDarkMode ? 'text-primary-1' : 'text-primary-2'}`}
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingColumnId(col.id);
                      setEditColumnTitle(col.title[language === 'Español' ? 'es' : 'en']);
                    }}
                    className={`p-1 rounded hover:bg-primary-2/10 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-primary-2'}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {editingColumnId === col.id && !col.isFixedStart && !col.isFixedEnd && (
                  <button
                    onClick={() => deleteColumn(col.id, colIndex)}
                    className={`p-1 rounded hover:bg-red-500/10 ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-primary-2/20 text-primary-1' : 'bg-primary-2/10 text-primary-2'}`}>{stageChats.length}</span>
            )}
          </div>
        </div>
        <div 
          className="flex-1 overflow-y-auto p-3 space-y-3"
          onDragOver={(e) => {
            if (!isKanbanEditMode) e.preventDefault();
          }}
          onDrop={(e) => {
            if (isKanbanEditMode) return;
            e.preventDefault();
            const draggedChatId = e.dataTransfer.getData('chatId');
            if (draggedChatId && draggedChatId !== '') {
              setConversations((prev: any[]) => prev.map(chat => chat.id === draggedChatId ? { ...chat, stage: col.id } : chat));
            }
          }}
        >
          {stageChats.map((chat: any) => (
            <div 
              key={chat.id}
              draggable={!isKanbanEditMode}
              onDragStart={(e) => {
                if (!isKanbanEditMode) {
                  e.dataTransfer.setData('chatId', chat.id);
                }
              }}
              onClick={() => !isKanbanEditMode && setSelectedKanbanCard(chat)}
              className={`p-4 rounded-lg border transition-all shadow-sm ${isKanbanEditMode ? 'opacity-50 cursor-default' : 'cursor-pointer hover:shadow-md'} ${isDarkMode ? 'bg-[#13131a] border-primary-2/30 hover:border-primary-1/50' : 'bg-white border-primary-2/20 hover:border-primary-1/50'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full border shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                        <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    )}
                    {chat.isEcoActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-1 rounded-full flex items-center justify-center border-2 border-white dark:border-[#13131a]">
                        <Bot className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{chat.name}</h4>
                    {chat.name !== chat.phone && (
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{chat.phone}</p>
                    )}
                  </div>
                </div>
                {chat.isPinned && <Pin className="w-4 h-4 text-accent fill-accent/20" />}
              </div>
              
              {chat.tags && chat.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {chat.tags.map((tag: string) => (
                    <span key={tag} style={{ backgroundColor: `${getTagColor(tag)}20`, color: getTagColor(tag), borderColor: `${getTagColor(tag)}50` }} className="text-[10px] px-2 py-0.5 rounded-full border">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {chat.urgency && (
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${chat.urgency.en === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`} />
                  <span className={`text-xs font-semibold ${chat.urgency.en === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {language === 'Español' ? chat.urgency.es : chat.urgency.en}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 flex flex-col font-body relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}
      
      {/* Main Content Area - Inbox Layout */}
      <main className="flex-1 w-full flex overflow-hidden relative z-10">
        
        {inboxViewMode === 'kanban' ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className={`p-6 border-b shrink-0 flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/60' : 'border-primary-2/20 bg-white/60'}`}>
              <div>
                <h1 className="text-3xl font-bold text-primary-2">{language === 'Español' ? 'Conversaciones' : 'Conversations'}</h1>
                <p className={`mt-1 font-body text-sm max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Tablero Kanban' : 'Kanban Board'}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 focus-within:border-primary-1/50' : 'bg-white border-primary-2/20 focus-within:border-primary-1/50'}`}>
                  <select
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                    className={`bg-transparent text-sm font-semibold focus:outline-none w-32 md:w-48 ${isDarkMode ? 'text-white' : 'text-slate-700'}`}
                  >
                    <option value="Todos">{language === 'Español' ? 'Todos los chats' : 'All chats'}</option>
                    <option value="Unassigned">{language === 'Español' ? 'Sin Asignar' : 'Unassigned'}</option>
                    <option value="asesor1">Asesor Uno</option>
                    <option value="asesor2">Asesor Dos</option>
                  </select>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 focus-within:border-primary-1/50' : 'bg-white border-primary-2/20 focus-within:border-primary-1/50'}`}>
                  <Search className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    placeholder={language === 'Español' ? 'Buscar en tablero...' : 'Search board...'}
                    value={searchTermKanban}
                    onChange={(e) => setSearchTermKanban(e.target.value)}
                    className={`bg-transparent border-none focus:ring-0 text-sm outline-none w-48 ${isDarkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                  />
                </div>
                <button
                  onClick={() => setIsKanbanEditMode(!isKanbanEditMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${isKanbanEditMode ? (isDarkMode ? 'bg-primary-1/20 border-primary-1 text-primary-1' : 'bg-primary-1/10 border-primary-1 text-primary-2') : (isDarkMode ? 'border-primary-2/30 text-slate-300 hover:bg-white/5' : 'border-primary-2/20 text-slate-600 hover:bg-slate-50')}`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  {language === 'Español' ? (isKanbanEditMode ? 'Terminar Edición' : 'Editar Tablero') : (isKanbanEditMode ? 'Done Editing' : 'Edit Board')}
                </button>
                <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30' : 'bg-slate-100 border-primary-2/20'}`}>
                  <button
                    onClick={() => setInboxViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${inboxViewMode === 'list' ? (isDarkMode ? 'bg-primary-2 text-white shadow-sm' : 'bg-white shadow-sm text-primary-2') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
                    title={language === 'Español' ? 'Vista Lista' : 'List View'}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setInboxViewMode('kanban')}
                    className={`p-1.5 rounded-md transition-all ${inboxViewMode === 'kanban' ? (isDarkMode ? 'bg-primary-2 text-white shadow-sm' : 'bg-white shadow-sm text-primary-2') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
                    title={language === 'Español' ? 'Vista Tablero' : 'Board View'}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row overflow-x-auto snap-x snap-mandatory flex-nowrap gap-6 p-6 h-full">
              {kanbanColumns.map(col => renderKanbanColumn(col))}
              {isKanbanEditMode && (
                <button
                  onClick={() => {
                    const newId = `col_${Date.now()}`;
                    const newCols = [...kanbanColumns];
                    newCols.splice(newCols.length - 1, 0, { id: newId, title: { es: 'Nueva Columna', en: 'New Column' } });
                    setKanbanColumns(newCols);
                    setEditingColumnId(newId);
                    setEditColumnTitle(language === 'Español' ? 'Nueva Columna' : 'New Column');
                  }}
                  className={`flex flex-col items-center justify-center w-[85vw] md:w-[320px] shrink-0 rounded-xl border-2 border-dashed transition-colors snap-center ${isDarkMode ? 'border-primary-2/30 text-slate-400 hover:border-primary-1/50 hover:text-primary-1 bg-[#0a0a0f]/20' : 'border-primary-2/20 text-slate-500 hover:border-primary-1/50 hover:text-primary-2 bg-slate-50/50'}`}
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-bold text-sm">{language === 'Español' ? '+ Añadir Nueva Columna' : '+ Add New Column'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Column 1: Conversations */}
            <section className={`${activeChatId ? 'hidden lg:flex' : 'flex'} w-full lg:w-[380px] flex-col border-r shrink-0 backdrop-blur-xl ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/60' : 'border-primary-2/20 bg-white/60'}`}>
              <div className={`p-4 pb-3 border-b shrink-0 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-primary-2">{language === 'Español' ? 'Conversaciones' : 'Conversations'}</h1>
                    <p className={`mt-1 font-body text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Gestiona los mensajes entrantes.' : 'Manage incoming messages.'}</p>
                  </div>
                  <div className={`flex p-1 rounded-lg border ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30' : 'bg-slate-100 border-primary-2/20'}`}>
                    <button
                      onClick={() => setInboxViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${inboxViewMode === 'list' ? (isDarkMode ? 'bg-primary-2 text-white shadow-sm' : 'bg-white shadow-sm text-primary-2') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
                      title={language === 'Español' ? 'Vista Lista' : 'List View'}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setInboxViewMode('kanban')}
                      className={`p-1.5 rounded-md transition-all ${inboxViewMode === 'kanban' ? (isDarkMode ? 'bg-primary-2 text-white shadow-sm' : 'bg-white shadow-sm text-primary-2') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
                      title={language === 'Español' ? 'Vista Tablero' : 'Board View'}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
            
            {/* Toolbar */}
            <div className="flex flex-col gap-2 mb-1 relative">
              <div className="flex items-center gap-2">
                {/* Search Button */}
                <button 
                  onClick={() => { setIsSearchOpen(!isSearchOpen); setIsFilterOpen(false); setIsAiFilterOpen(false); }}
                  className={`p-2 rounded-full transition-colors ${isSearchOpen || searchQuery ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Filter Button */}
                <div className="relative">
                  <button 
                    onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSearchOpen(false); setIsAiFilterOpen(false); }}
                    className={`p-2 rounded-full transition-colors ${isFilterOpen || assignmentFilter !== 'Todos' || selectedTag !== '' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  {isFilterOpen && (
                    <div className={`absolute left-0 top-full mt-2 w-56 rounded-xl shadow-xl border z-50 overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b ${isDarkMode ? 'border-primary-2/30 text-slate-400' : 'border-primary-2/10 text-slate-500'}`}>
                        {language === 'Español' ? 'Por Asesor' : 'By Agent'}
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setAssignmentFilter('Todos'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${assignmentFilter === 'Todos' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          {language === 'Español' ? 'Todos' : 'All'}
                        </button>
                        <button onClick={() => { setAssignmentFilter('Unassigned'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${assignmentFilter === 'Unassigned' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          {language === 'Español' ? 'Sin Asignar' : 'Unassigned'}
                        </button>
                        {users.filter((u: any) => u.role === 'asesor').map((u: any) => (
                          <button key={u.id} onClick={() => { setAssignmentFilter(u.id); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${assignmentFilter === u.id ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                            {u.name}
                          </button>
                        ))}
                      </div>
                      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b border-t ${isDarkMode ? 'border-primary-2/30 text-slate-400' : 'border-primary-2/10 text-slate-500'}`}>
                        {language === 'Español' ? 'Por Etiqueta' : 'By Tag'}
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setSelectedTag(''); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedTag === '' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          {language === 'Español' ? 'Todas' : 'All'}
                        </button>
                        {allTags.map((tag: string) => (
                          <button key={tag} onClick={() => { setSelectedTag(tag); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${selectedTag === tag ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                            <span style={{ backgroundColor: getTagColor(tag) }} className="w-2 h-2 rounded-full"></span>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Button */}
                <div className="relative">
                  <button 
                    onClick={() => { setIsAiFilterOpen(!isAiFilterOpen); setIsSearchOpen(false); setIsFilterOpen(false); setIsSortOpen(false); }}
                    className={`p-2 rounded-full transition-colors ${isAiFilterOpen || aiFilter !== 'Todas' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                  >
                    <Bot className="w-5 h-5" />
                  </button>
                  {isAiFilterOpen && (
                    <div className={`absolute left-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden py-1 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      {['Todas', 'IA Activa', 'IA Desactivada/Manual'].map(f => (
                        <button key={f} onClick={() => { setAiFilter(f); setIsAiFilterOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${aiFilter === f ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort Button */}
                <div className="relative ml-auto">
                  <button 
                    onClick={() => { setIsSortOpen(!isSortOpen); setIsSearchOpen(false); setIsFilterOpen(false); setIsAiFilterOpen(false); }}
                    className={`p-2 rounded-full transition-colors ${isSortOpen || sortType !== 'recent' ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                    title={language === 'Español' ? 'Ordenar' : 'Sort'}
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </button>
                  {isSortOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border z-50 overflow-hidden py-1 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b ${isDarkMode ? 'border-primary-2/30 text-slate-400' : 'border-primary-2/10 text-slate-500'}`}>
                        {language === 'Español' ? 'Ordenar por' : 'Sort by'}
                      </div>
                      {[
                        { id: 'recent', label: { es: 'Más recientes primero', en: 'Most recent first' } },
                        { id: 'oldest', label: { es: 'Más antiguos primero', en: 'Oldest first' } },
                        { id: 'waiting', label: { es: 'Mayor tiempo de espera', en: 'Longest wait time' } },
                        { id: 'unreplied', label: { es: 'Solo sin responder', en: 'Only unreplied' } }
                      ].map(option => (
                        <button 
                          key={option.id} 
                          onClick={() => { setSortType(option.id); setIsSortOpen(false); }} 
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${sortType === option.id ? (isDarkMode ? 'bg-primary-1/20 text-primary-1' : 'bg-primary-1/10 text-primary-2') : (isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}
                        >
                          {language === 'Español' ? option.label.es : option.label.en}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Search Input */}
              {isSearchOpen && (
                <div className="relative w-full mt-2">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input 
                    type="text" 
                    placeholder={language === 'Español' ? "Buscar..." : "Search..."} 
                    className={`w-full h-10 border rounded-lg pl-9 pr-3 py-2 text-[16px] sm:text-sm focus:outline-none focus:border-primary-1/50 transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white placeholder:text-slate-600' : 'bg-white/50 border-primary-2/20 text-slate-900 placeholder:text-slate-500'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredConversations.map((chat) => (
              <ChatItem 
                key={chat.id}
                name={chat.name}
                time={language === 'Español' ? chat.time.es : chat.time.en}
                msg={chat.lastMessage}
                active={activeChat.id === chat.id}
                img={chat.avatar}
                tags={chat.tags}
                isPinned={chat.isPinned}
                isEcoActive={chat.isEcoActive}
                onClick={() => setActiveChatId(chat.id)}
                isDarkMode={isDarkMode}
                getTagColor={getTagColor}
                unreadCount={chat.unreadCount}
              />
            ))}
          </div>
        </section>

        {/* Column 2: Chat Area */}
        <section className={`${!activeChatId ? 'hidden lg:flex' : 'flex'} flex-1 flex-col min-w-0 h-full ${isDarkMode ? 'bg-dark-bg/40' : 'bg-transparent'}`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-[#13131a] text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                <Search className="w-10 h-10" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {language === 'Español' ? 'No hay conversaciones' : 'No conversations found'}
              </h3>
              <p className={`text-sm max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'Español' ? 'No se encontraron conversaciones que coincidan con los filtros actuales.' : 'No conversations found matching the current filters.'}
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className={`h-20 shrink-0 border-b flex items-center justify-between px-4 lg:px-8 backdrop-blur-md ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/80' : 'border-primary-2/20 bg-white/80'}`}>
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setActiveChatId(null)}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="relative">
                {activeChat.avatar ? (
                  <img className={`w-10 h-10 rounded-full object-cover border ${isDarkMode ? 'border-primary-2/50' : 'border-white shadow-sm'}`} src={activeChat.avatar} alt={activeChat.name} />
                ) : (
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                    <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 w-3 h-3 bg-accent border-2 rounded-full ${isDarkMode ? 'border-dark-bg' : 'border-white'}`}></span>
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeChat.name}</h3>
                <p className={`text-[10px] flex items-center gap-1 font-bold uppercase tracking-wider mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  {language === 'Español' ? 'ESPERANDO RESPUESTA MANUAL' : 'WAITING FOR MANUAL RESPONSE'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isChatSearchActive ? (
                <div className={`flex items-center border-b ${isDarkMode ? 'border-primary-1/50' : 'border-primary-1/30'}`}>
                  <input 
                    type="text" 
                    placeholder={language === 'Español' ? 'Buscar en esta conversación...' : 'Search in this conversation...'}
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className={`bg-transparent focus:outline-none text-sm px-2 py-1 w-48 ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <span className={`text-xs mr-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {currentSearchIndex + 1} / {searchResults.length}
                    </span>
                  )}
                  {searchResults.length > 0 && (
                    <div className="flex items-center">
                      <button onClick={handlePrevMatch} className={`p-1 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>↑</button>
                      <button onClick={handleNextMatch} className={`p-1 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>↓</button>
                    </div>
                  )}
                  <button onClick={() => { setIsChatSearchActive(false); setChatSearchQuery(''); }} className={`p-1 ml-1 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsChatSearchActive(true)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <Search className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => {
                  setReportingMessageId(null);
                  setIsReportModalOpen(true);
                }}
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-400 hover:text-accent hover:border-accent hover:bg-accent/10' : 'border-slate-300 text-slate-500 hover:text-accent hover:border-accent hover:bg-accent/10'}`}
              >
                <AlertTriangle className="w-4 h-4" />
                {language === 'Español' ? 'Reportar Falla' : 'Report Issue'}
              </button>
              <button onClick={simulateNewMessage} className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${isDarkMode ? 'border-slate-700 text-slate-400 hover:text-green-400 hover:border-green-400 hover:bg-green-400/10' : 'border-slate-300 text-slate-500 hover:text-green-600 hover:border-green-600 hover:bg-green-50'}`}>
                <MessageSquare className="w-4 h-4" />
                {language === 'Español' ? 'Simular Mensaje' : 'Simulate Message'}
              </button>
              <label htmlFor="mobile-crm-toggle" className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer">
                <MoreVertical className="w-6 h-6" />
              </label>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col scrollbar-hide">
            {activeChat.messages?.map((msg: any, idx: number) => {
              if (msg.type === 'incoming') {
                return (
                  <div key={idx} id={`message-${msg.id}`} className={`max-w-[70%] mr-auto group relative ${activeTranslateDropdown === msg.id ? 'z-50' : 'z-10'}`}>
                    <div className={`p-4 rounded-2xl rounded-tl-none border text-sm leading-relaxed shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-slate-200' : 'bg-white/80 border-primary-2/20 text-slate-700'}`}>
                      {msg.isAudio ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-primary-1 text-white' : 'bg-primary-1 text-white'}`}>
                              <Play className="w-4 h-4 ml-1" />
                            </button>
                            <div className="flex-1 flex items-center gap-1 h-8">
                              {/* Simulated waveform */}
                              {[...Array(15)].map((_, i) => (
                                <div key={i} className={`w-1 rounded-full ${isDarkMode ? 'bg-primary-1/50' : 'bg-primary-1/40'}`} style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                              ))}
                            </div>
                            <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{msg.duration}</span>
                          </div>
                          {msg.transcription && (
                            <div className={`pt-3 mt-1 border-t flex gap-2 ${isDarkMode ? 'border-primary-2/20' : 'border-primary-2/10'}`}>
                              <Zap className="w-4 h-4 text-primary-1 shrink-0 mt-0.5" />
                              <p className={`text-xs italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <span className="font-bold text-primary-1 mr-1">Transcripción IA:</span>
                                {renderHighlightedText(msg.transcription)}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        renderHighlightedText(msg.text)
                      )}
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-24 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => navigator.clipboard.writeText(msg.text || msg.transcription || '')} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Copiar' : 'Copy'}>
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button onClick={() => setActiveTranslateDropdown(activeTranslateDropdown === msg.id ? null : msg.id)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Traducir' : 'Translate'}>
                          <Globe className="w-4 h-4" />
                        </button>
                        {activeTranslateDropdown === msg.id && (
                          <div className={`absolute z-50 top-full mt-1 right-0 w-40 shadow-lg rounded-lg border overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-gray-200'}`}>
                            <button onClick={() => handleTranslate(msg.id, 'Inglés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Inglés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Español')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Español</button>
                            <hr className={`my-1 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`} />
                            <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Más idiomas...</div>
                            <button onClick={() => handleTranslate(msg.id, 'Portugués')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Portugués</button>
                            <button onClick={() => handleTranslate(msg.id, 'Francés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Francés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Alemán')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Alemán</button>
                            <button onClick={() => handleTranslate(msg.id, 'Italiano')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Italiano</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleCreateReportFromMessage(msg)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Reportar Falla' : 'Report Issue'}>
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`text-[10px] mt-2 block ml-1 font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{msg.time}</span>
                  </div>
                );
              } else if (msg.type === 'bot') {
                return (
                  <div key={idx} id={`message-${msg.id}`} className={`max-w-[70%] ml-auto flex gap-3 group flex-row-reverse relative ${activeTranslateDropdown === msg.id ? 'z-50' : 'z-10'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 border ${isDarkMode ? 'bg-primary-1/10 border-primary-1/30' : 'bg-white border-primary-1/30 shadow-sm'}`}>
                      <Bot className="text-primary-1 w-4 h-4" />
                    </div>
                    <div className="relative">
                      <div className={`p-4 rounded-2xl rounded-tr-none border text-sm italic shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-primary-1/5 border-primary-1/30 text-primary-1' : 'bg-light-bg/80 border-primary-1/30 text-primary-2'}`}>
                        {renderHighlightedText(msg.text)}
                      </div>
                      <span className={`text-[10px] mt-2 block mr-1 text-right font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{msg.time}</span>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -left-24 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => navigator.clipboard.writeText(msg.text || '')} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Copiar' : 'Copy'}>
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button onClick={() => setActiveTranslateDropdown(activeTranslateDropdown === msg.id ? null : msg.id)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Traducir' : 'Translate'}>
                          <Globe className="w-4 h-4" />
                        </button>
                        {activeTranslateDropdown === msg.id && (
                          <div className={`absolute z-50 top-full mt-1 right-0 w-40 shadow-lg rounded-lg border overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-gray-200'}`}>
                            <button onClick={() => handleTranslate(msg.id, 'Inglés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Inglés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Español')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Español</button>
                            <hr className={`my-1 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`} />
                            <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Más idiomas...</div>
                            <button onClick={() => handleTranslate(msg.id, 'Portugués')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Portugués</button>
                            <button onClick={() => handleTranslate(msg.id, 'Francés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Francés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Alemán')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Alemán</button>
                            <button onClick={() => handleTranslate(msg.id, 'Italiano')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Italiano</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleCreateReportFromMessage(msg)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Reportar Falla' : 'Report Issue'}>
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} id={`message-${msg.id}`} className={`max-w-[70%] ml-auto group relative ${activeTranslateDropdown === msg.id ? 'z-50' : 'z-10'}`}>
                    <div className="p-4 rounded-2xl rounded-tr-none bg-gradient-to-r from-primary-1 to-primary-2 text-white text-sm shadow-md">
                      {renderHighlightedText(msg.text)}
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 -left-24 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button onClick={() => navigator.clipboard.writeText(msg.text || '')} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Copiar' : 'Copy'}>
                        <Copy className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button onClick={() => setActiveTranslateDropdown(activeTranslateDropdown === msg.id ? null : msg.id)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Traducir' : 'Translate'}>
                          <Globe className="w-4 h-4" />
                        </button>
                        {activeTranslateDropdown === msg.id && (
                          <div className={`absolute z-50 top-full mt-1 right-0 w-40 shadow-lg rounded-lg border overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-gray-200'}`}>
                            <button onClick={() => handleTranslate(msg.id, 'Inglés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Inglés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Español')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Español</button>
                            <hr className={`my-1 ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`} />
                            <div className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Más idiomas...</div>
                            <button onClick={() => handleTranslate(msg.id, 'Portugués')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Portugués</button>
                            <button onClick={() => handleTranslate(msg.id, 'Francés')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Francés</button>
                            <button onClick={() => handleTranslate(msg.id, 'Alemán')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Alemán</button>
                            <button onClick={() => handleTranslate(msg.id, 'Italiano')} className={`px-4 py-2 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>Italiano</button>
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleCreateReportFromMessage(msg)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary-2 hover:bg-slate-100'}`} title={language === 'Español' ? 'Reportar Falla' : 'Report Issue'}>
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`text-[10px] mt-2 block text-right mr-1 font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{msg.time} • {language === 'Español' ? 'Leído' : 'Read'}</span>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`shrink-0 p-6 border-t backdrop-blur-md flex flex-col items-center ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/80' : 'border-primary-2/20 bg-white/80'}`}>
            <div className="w-[95%] max-w-4xl flex flex-col">
              {/* Tabs */}
              <div className="flex gap-6 mb-3 px-2">
                <button 
                  onClick={() => setInputMode('message')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors outline-none focus:outline-none ${inputMode === 'message' ? 'border-primary-2 text-primary-2' : 'border-transparent text-slate-400 hover:text-slate-500'}`}
                >
                  {language === 'Español' ? 'Mensaje' : 'Message'}
                </button>
                <button 
                  onClick={() => setInputMode('note')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors outline-none focus:outline-none ${inputMode === 'note' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-slate-400 hover:text-slate-500'}`}
                >
                  {language === 'Español' ? 'Nota Interna' : 'Internal Note'}
                </button>
              </div>

              {attachedFile && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-max mb-2 text-sm border border-blue-100">
                  <Paperclip className="w-4 h-4" />
                  <span className="font-medium truncate max-w-[200px]">{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="hover:text-red-500 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className={`flex items-center gap-3 p-3 rounded-2xl border focus-within:border-primary-1/50 transition-colors shadow-sm w-full relative ${inputMode === 'note' ? (isDarkMode ? 'bg-yellow-900/30 border-yellow-700/50' : 'bg-yellow-50 border-yellow-300') : (isDarkMode ? 'bg-dark-bg/80 border-primary-2/50' : 'bg-white border-primary-2/20')}`}>
                {micMode !== 'none' && (
                  <div className="absolute -top-8 left-0 right-0 flex justify-center">
                    <div className="bg-primary-1 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-md">
                      {micMode === 'recording' ? (language === 'Español' ? 'Grabando...' : 'Recording...') : (language === 'Español' ? 'Escuchando...' : 'Listening...')}
                    </div>
                  </div>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className={`shrink-0 p-2 transition-colors outline-none focus:outline-none ${isDarkMode ? 'text-slate-500 hover:text-primary-1' : 'text-slate-400 hover:text-primary-2'}`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  {showAttachmentMenu && (
                    <div className={`absolute bottom-full left-0 mb-2 w-48 rounded-xl border shadow-xl flex flex-col overflow-hidden z-50 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      <label className={`flex items-center gap-2 px-4 py-3 text-sm cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                        <Upload className="w-4 h-4" />
                        {language === 'Español' ? 'Subir desde PC' : 'Upload from PC'}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setAttachedFile(e.target.files[0]);
                              setShowAttachmentMenu(false);
                            }
                          }}
                        />
                      </label>
                      <button 
                        onClick={() => {
                          setShowAttachmentMenu(false);
                          setShowMultimediaPicker(true);
                        }}
                        className={`flex items-center gap-2 px-4 py-3 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        {language === 'Español' ? 'Elegir de Multimedia' : 'Choose from Media'}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col relative">
                  {/* TOOLBAR DE FORMATO FUNCIONAL */}
                  <div className="flex flex-wrap gap-1 mb-1 px-2 text-slate-500 border-b border-transparent">
                    <button 
                      className={`rounded transition-colors p-1.5 ${
                        activeFormats.bold 
                          ? (isDarkMode ? 'bg-primary-1/20 text-primary-1 shadow-[0_0_8px_rgba(0,200,255,0.4)]' : 'bg-primary-1/10 text-primary-2 shadow-sm border border-primary-1/20') 
                          : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-primary-1 hover:bg-primary-1/5')
                      }`}
                      onClick={() => applyFormatting('bold')}
                      title={language === 'Español' ? 'Negrita' : 'Bold'}
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className={`rounded transition-colors p-1.5 ${
                        activeFormats.italic 
                          ? (isDarkMode ? 'bg-primary-1/20 text-primary-1 shadow-[0_0_8px_rgba(0,200,255,0.4)]' : 'bg-primary-1/10 text-primary-2 shadow-sm border border-primary-1/20') 
                          : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-primary-1 hover:bg-primary-1/5')
                      }`}
                      onClick={() => applyFormatting('italic')}
                      title={language === 'Español' ? 'Cursiva' : 'Italic'}
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className={`rounded transition-colors p-1.5 ${
                        activeFormats.underline 
                          ? (isDarkMode ? 'bg-primary-1/20 text-primary-1 shadow-[0_0_8px_rgba(0,200,255,0.4)]' : 'bg-primary-1/10 text-primary-2 shadow-sm border border-primary-1/20') 
                          : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-primary-1 hover:bg-primary-1/5')
                      }`}
                      onClick={() => applyFormatting('underline')}
                      title={language === 'Español' ? 'Subrayado' : 'Underline'}
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className={`w-px h-4 self-center mx-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                    <button 
                      className={`hover:text-primary-1 hover:bg-primary-1/5 rounded transition-colors p-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      onClick={() => applyFormatting('uppercase')}
                      title={language === 'Español' ? 'MAYÚSCULAS' : 'UPPERCASE'}
                    >
                      <CaseUpper className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className={`hover:text-primary-1 hover:bg-primary-1/5 rounded transition-colors p-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      onClick={() => applyFormatting('lowercase')}
                      title={language === 'Español' ? 'minúsculas' : 'lowercase'}
                    >
                      <CaseLower className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className={`hover:text-primary-1 hover:bg-primary-1/5 rounded transition-colors p-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                      onClick={() => applyFormatting('sentence')}
                      title={language === 'Español' ? 'Tipo oración' : 'Sentence case'}
                    >
                      <CaseSensitive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div 
                    ref={editorRef}
                    contentEditable
                    data-placeholder={inputMode === 'note' ? (language === 'Español' ? "Escribe una nota interna oculta..." : "Type a hidden internal note...") : (language === 'Español' ? "Escribe un mensaje..." : "Type a message...")}
                    className={`w-full bg-transparent border-none focus:ring-0 text-[16px] sm:text-sm outline-none py-2 min-h-[44px] max-h-[200px] overflow-y-auto ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}
                    onInput={(e: any) => {
                      setInputValue(e.target.innerText);
                      updateActiveFormats();
                      if (e.target.innerText.startsWith('/')) {
                        setShowShortcutsMenu(true);
                      } else {
                        setShowShortcutsMenu(false);
                      }
                    }}
                    onKeyUp={updateActiveFormats}
                    onMouseUp={updateActiveFormats}
                    onFocus={updateActiveFormats}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                        updateActiveFormats();
                      }
                    }}
                  ></div>
                </div>

                {showShortcutsMenu && shortcuts && shortcuts.length > 0 && (
                  <div className={`absolute bottom-full left-0 w-full md:w-[80%] max-w-2xl mb-2 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? '!bg-[#0a0a0f] !border-primary-2/30' : ''}`}>
                    <div className={`px-3 py-2 border-b text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'border-primary-2/30 text-slate-400 bg-dark-bg/50' : 'border-primary-2/10 text-slate-500 bg-slate-50'}`}>
                      {language === 'Español' ? 'Respuestas Rápidas' : 'Quick Responses'}
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {shortcuts.filter((s: any) => s.command.startsWith(inputValue)).map((shortcut: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputValue(shortcut.text);
                            setShowShortcutsMenu(false);
                          }}
                          className={`w-full text-left p-3 rounded-lg cursor-pointer text-sm transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          <div className="font-mono text-xs text-primary-1 font-bold mb-0.5">{shortcut.command}</div>
                          <div className="truncate">{shortcut.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 shrink-0 relative">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 transition-colors outline-none focus:outline-none bg-transparent hover:bg-gray-100 rounded-lg text-gray-500`}
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  {showEmojiPicker && (
                    <div className={`absolute bottom-full right-0 mb-4 w-72 rounded-xl border shadow-2xl flex flex-col z-50 overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      <div className={`flex border-b ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
                        {EMOJI_CATEGORIES.map((cat, idx) => (
                          <button 
                            key={cat.name}
                            onClick={() => setActiveEmojiCategory(idx)}
                            className={`flex-1 py-2 text-sm transition-colors outline-none focus:outline-none ${activeEmojiCategory === idx ? (isDarkMode ? 'bg-white/10' : 'bg-white shadow-sm') : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100')}`}
                            title={cat.name}
                          >
                            {cat.icon}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 h-48 overflow-y-auto grid grid-cols-6 gap-1 content-start">
                        {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map(emoji => (
                          <button 
                            key={emoji} 
                            onClick={() => addEmoji(emoji)}
                            className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-colors outline-none focus:outline-none ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-primary-2/10'}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {inputMode === 'message' && (
                    <button 
                      onClick={() => {
                        if (!inputValue.trim()) {
                          setInputValue(language === 'Español' ? 'Hola, ¿en qué te puedo ayudar hoy?' : 'Hello, how can I help you today?');
                        } else {
                          setShowMagicRedactor(true);
                        }
                      }}
                      className={`p-2 transition-colors outline-none focus:outline-none bg-transparent hover:bg-gray-100 rounded-lg text-yellow-500`}
                      title={language === 'Español' ? 'Redactor IA' : 'AI Redactor'}
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  )}

                  {inputMode === 'message' && (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          if (micMode === 'none') setMicMode('recording');
                          else if (micMode === 'recording') setMicMode('dictating');
                          else setMicMode('none');
                        }}
                        className={`p-2 transition-colors outline-none focus:outline-none bg-transparent hover:bg-gray-100 rounded-lg text-red-500 ${micMode !== 'none' ? 'animate-pulse' : ''}`}
                        title={language === 'Español' ? 'Grabar nota de voz / Dictado' : 'Record voice note / Dictation'}
                      >
                        {micMode === 'dictating' ? <Mic2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      {micMode !== 'none' && (
                        <div className={`absolute bottom-full right-0 mb-2 w-48 rounded-xl border shadow-xl flex flex-col overflow-hidden z-50 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                          <button onClick={() => setMicMode('recording')} className={`px-4 py-3 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                            {language === 'Español' ? 'Grabar nota de voz' : 'Record voice note'}
                          </button>
                          <button onClick={() => setMicMode('dictating')} className={`px-4 py-3 text-sm text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                            {language === 'Español' ? 'Dictado a texto' : 'Speech to text'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={handleSendMessage} 
                    className={`h-10 px-4 rounded-xl flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity gap-2 outline-none focus:outline-none ${inputMode === 'note' ? 'bg-yellow-500' : 'bg-blue-600'}`}
                  >
                    {inputMode === 'note' ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span className="text-xs font-bold whitespace-nowrap">{language === 'Español' ? 'Guardar Nota' : 'Save Note'}</span>
                      </>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </section>

        {/* Column 3: Contact Info */}
        <input type="checkbox" id="mobile-crm-toggle" className="hidden peer/crm" />
        <section className={`hidden peer-checked/crm:flex lg:peer-checked/crm:flex lg:flex fixed inset-0 z-50 lg:static lg:z-auto w-full lg:w-[320px] border-l backdrop-blur-xl flex-col shrink-0 h-full ${isDarkMode ? 'border-primary-2/30 bg-[#0a0a0f]/95 lg:bg-[#0a0a0f]/60' : 'border-primary-2/20 bg-white/95 lg:bg-white/60'}`}>
          <label htmlFor="mobile-crm-toggle" className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 z-50 cursor-pointer">
            <X className="w-5 h-5" />
          </label>
          {activeChat ? (
            <div className="p-6 overflow-y-auto scrollbar-hide flex-1 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-lg font-bold text-primary-2 tracking-tight">{language === 'Español' ? 'Ficha del Cliente' : 'Client Card'}</h2>
                <div className="flex items-center gap-1">
                  {isUnknownContact ? (
                    <button 
                      onClick={() => onOpenEditContact('new', { phone: activeChat.phone, extractedData: activeChat.contactInfo?.extractedData || {} })}
                      className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                      title={language === 'Español' ? 'Añadir a Contactos' : 'Add to Contacts'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onOpenEditContact(activeChat.id, activeChat)}
                      className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                      title={language === 'Español' ? 'Editar Contacto' : 'Edit Contact'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const updatedChats = conversations.map((c: any) => 
                        c.id === activeChat.id ? { ...c, isPinned: !c.isPinned } : c
                      );
                      setConversations(updatedChats);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${activeChat.isPinned ? 'text-primary-1' : (isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500')}`}
                    title={language === 'Español' ? 'Fijar Chat' : 'Pin Chat'}
                  >
                    <Pin className={`w-4 h-4 ${activeChat.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Asignación Manual */}
              <div className={`mb-6 p-4 rounded-xl border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50/50 border-primary-2/20'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'Español' ? 'Asignación' : 'Assignment'}
                </h3>
                {currentUser.role === 'admin' ? (
                  <div className="relative">
                    <select
                      value={activeChat.assignedTo || ''}
                      onChange={(e) => handleAssignationChange(activeChat.id, e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 pl-10 text-sm focus:outline-none focus:border-primary-1 appearance-none ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                    >
                      <option value="">{language === 'Español' ? 'Sin Asignar' : 'Unassigned'}</option>
                      {users.filter((u: any) => u.role === 'asesor').map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {activeChat.assignedTo ? (
                        <img src={users.find((u: any) => u.id === activeChat.assignedTo)?.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <User className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`w-full border rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}>
                    {activeChat.assignedTo ? (
                      <>
                        <img src={users.find((u: any) => u.id === activeChat.assignedTo)?.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                        <span>{users.find((u: any) => u.id === activeChat.assignedTo)?.name}</span>
                      </>
                    ) : (
                      <>
                        <User className={`w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span>{language === 'Español' ? 'Sin Asignar' : 'Unassigned'}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-24 h-24 rounded-3xl p-1 border relative mb-4 ${isDarkMode ? 'border-primary-1/30 bg-dark-bg' : 'border-primary-2/20 bg-white shadow-sm'}`}>
                  {activeChat.avatar ? (
                    <img className="w-full h-full rounded-[20px] object-cover" src={activeChat.avatar} alt="Profile" />
                  ) : (
                    <div className={`w-full h-full rounded-[20px] flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <User className={`w-10 h-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                  )}
                </div>
                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeChat.name}</h4>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? activeChat.contactInfo?.role?.es : activeChat.contactInfo?.role?.en} {language === 'Español' ? 'en' : 'at'} {activeChat.contactInfo?.extractedData?.['Empresa'] || ''}</p>
              </div>

              {/* Extracted CRM Fields */}
              <div className="space-y-3">
                {globalKeyFields.map((field: string) => {
                  const value = activeChat.contactInfo?.extractedData?.[field];
                  return (
                    <div key={field} className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={value || ''}
                          onChange={(e) => {
                            const newConversations = conversations.map((c: any) => {
                              if (c.id === activeChat.id) {
                                return {
                                  ...c,
                                  contactInfo: {
                                    ...c.contactInfo,
                                    extractedData: {
                                      ...c.contactInfo?.extractedData,
                                      [field]: e.target.value
                                    }
                                  }
                                };
                              }
                              return c;
                            });
                            setConversations(newConversations);
                          }}
                          placeholder={language === 'Español' ? 'Esperando datos...' : 'Waiting for data...'}
                          className={`w-full text-[16px] sm:text-sm py-2 px-3 pr-8 rounded-lg border transition-colors outline-none focus:border-primary-1 ${value ? (isDarkMode ? 'bg-primary-1/5 border-primary-1/30 text-white' : 'bg-primary-1/5 border-primary-1/30 text-slate-900') : (isDarkMode ? 'bg-dark-bg/50 border-primary-2/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')}`}
                        />
                        {value && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2" title={language === 'Español' ? 'Extraído por IA' : 'Extracted by AI'}>
                            <Sparkles className="w-3.5 h-3.5 text-primary-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            {/* AI Summary Card */}
            <div className={`p-5 rounded-xl border relative overflow-hidden group ${isDarkMode ? 'border-primary-1/40 bg-primary-1/5' : 'border-primary-1/30 bg-white shadow-sm'}`}>
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                <Zap className="text-primary-1 w-4 h-4" />
              </div>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-[10px] font-bold text-primary-1 uppercase tracking-widest">{language === 'Español' ? 'Resumen del Eco ✨' : 'Eco Summary ✨'}</h5>
                <div className="relative">
                  <button 
                    onClick={() => setIsSummaryDropdownOpen(!isSummaryDropdownOpen)}
                    disabled={isGeneratingSummary}
                    className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} disabled:opacity-50`}
                  >
                    <Sparkles className={`w-3 h-3 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                    {isGeneratingSummary ? (language === 'Español' ? 'Generando...' : 'Generating...') : (language === 'Español' ? 'Generar Resumen' : 'Generate Summary')}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {isSummaryDropdownOpen && !isGeneratingSummary && (
                    <div className={`absolute right-0 top-full mt-1 w-40 rounded-xl border shadow-xl flex flex-col overflow-hidden z-50 ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                      <button 
                        onClick={() => {
                          setIsSummaryDropdownOpen(false);
                          setIsGeneratingSummary(true);
                          setTimeout(() => {
                            setConversations((prev: any[]) => prev.map(chat => {
                              if (chat.id === activeChat.id) {
                                return {
                                  ...chat,
                                  contactInfo: {
                                    ...chat.contactInfo,
                                    summary: {
                                      es: 'Resumen actualizado (Últimas 24h): El cliente mostró interés en la propuesta y solicitó una reunión.',
                                      en: 'Updated summary (Last 24h): The client showed interest in the proposal and requested a meeting.'
                                    }
                                  }
                                };
                              }
                              return chat;
                            }));
                            setIsGeneratingSummary(false);
                          }, 1500);
                        }}
                        className={`px-4 py-2 text-xs text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {language === 'Español' ? 'Últimas 24 horas' : 'Last 24 hours'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsSummaryDropdownOpen(false);
                          setIsGeneratingSummary(true);
                          setTimeout(() => {
                            setConversations((prev: any[]) => prev.map(chat => {
                              if (chat.id === activeChat.id) {
                                return {
                                  ...chat,
                                  contactInfo: {
                                    ...chat.contactInfo,
                                    summary: {
                                      es: 'Resumen actualizado (Todo el chat): Historial completo analizado. El cliente ha tenido dudas técnicas previas pero ahora está listo para avanzar.',
                                      en: 'Updated summary (Entire chat): Full history analyzed. The client had previous technical doubts but is now ready to move forward.'
                                    }
                                  }
                                };
                              }
                              return chat;
                            }));
                            setIsGeneratingSummary(false);
                          }, 1500);
                        }}
                        className={`px-4 py-2 text-xs text-left transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {language === 'Español' ? 'Todo el chat' : 'Entire chat'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="w-1 h-1 bg-primary-1 rounded-full mt-1.5 shrink-0"></span>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'Español' ? activeChat.contactInfo?.summary?.es : activeChat.contactInfo?.summary?.en}</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-1 h-1 bg-primary-1 rounded-full mt-1.5 shrink-0"></span>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{language === 'Español' ? 'Nivel de urgencia' : 'Urgency level'} <span className="text-accent font-bold">{language === 'Español' ? activeChat.urgency?.es : activeChat.urgency?.en}</span>.</p>
                </div>
              </div>
            </div>

            {/* AI Meeting Scheduled */}
            {activeChat.contactInfo?.meetingScheduled ? (
              <div className={`p-5 rounded-xl border relative overflow-hidden ${isDarkMode ? 'border-accent/30 bg-accent/10' : 'border-accent/20 bg-accent/5 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h5 className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {language === 'Español' ? 'Reunión Agendada por el Eco' : 'Eco Scheduled Meeting'}
                  </h5>
                  <div className="flex gap-1">
                    <button className={`p-1 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`} title={language === 'Español' ? 'Editar' : 'Edit'}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        setConversations((prev: any[]) => prev.map(chat => {
                          if (chat.id === activeChat.id) {
                            const newContactInfo = { ...chat.contactInfo };
                            delete newContactInfo.meetingScheduled;
                            return { ...chat, contactInfo: newContactInfo };
                          }
                          return chat;
                        }));
                      }}
                      className={`p-1 rounded-md transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-slate-500 hover:text-red-600 hover:bg-red-50'}`} title={language === 'Español' ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeChat.contactInfo.meetingScheduled.title} - {activeChat.contactInfo.meetingScheduled.date}
                </p>
                <button className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-accent/20 text-accent hover:bg-accent/30' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}>
                  <LinkIcon className="w-3.5 h-3.5" />
                  {language === 'Español' ? 'Copiar Enlace de Calendario' : 'Copy Calendar Link'}
                </button>
              </div>
            ) : (
              <button className={`w-full mt-4 border font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'bg-[#0a0a0f] border-blue-500 text-blue-400 hover:bg-blue-500/10' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                <Calendar className="w-4 h-4" />
                {language === 'Español' ? 'Agendar Reunión Manual' : 'Schedule Manual Meeting'}
              </button>
            )}

            {/* AI Control */}
            <div className="space-y-3">
              <h5 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'Español' ? 'Control del Eco' : 'Eco Control'}</h5>
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-white border-primary-2/20 shadow-sm'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${!activeChat.isEcoActive ? 'text-accent' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                  {activeChat.isEcoActive ? (language === 'Español' ? 'ECO ACTIVO' : 'ECO ACTIVE') : (language === 'Español' ? 'MODO HUMANO' : 'HUMAN MODE')}
                </span>
                <button 
                  onClick={toggleBot}
                  className={`relative w-12 h-6 rounded-full transition-colors ${activeChat.isEcoActive ? 'bg-primary-2' : 'bg-accent'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${activeChat.isEcoActive ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>
            </div>

            {/* Client Tags */}
            <div className="space-y-3">
              <h5 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'Español' ? 'Etiquetas del Cliente' : 'Client Tags'}</h5>
              <div className="flex flex-wrap gap-2">
                {activeChat.tags?.map((tag: string, i: number) => (
                  <span key={i} style={{ backgroundColor: `${getTagColor(tag)}20`, color: getTagColor(tag), borderColor: `${getTagColor(tag)}50` }} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:opacity-70 ml-0.5"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsAddTagOpen(!isAddTagOpen)}
                  className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed text-xs font-bold transition-colors ${isDarkMode ? 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-400' : 'border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400'}`}
                >
                  <Plus className="w-3 h-3" />
                  {language === 'Español' ? 'Añadir etiqueta' : 'Add tag'}
                </button>
                {isAddTagOpen && (
                  <div className={`absolute top-full left-0 mt-1 w-48 border rounded-lg shadow-xl z-50 overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
                    {allTags.filter((t: string) => !activeChat.tags?.includes(t)).map((tag: string) => (
                      <button 
                        key={tag}
                        onClick={() => addTag(tag)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-primary-2/5 text-slate-700'}`}
                      >
                        <span style={{ backgroundColor: getTagColor(tag) }} className="w-2 h-2 rounded-full shrink-0"></span>
                        <span className="truncate">{tag}</span>
                      </button>
                    ))}
                    {allTags.filter((t: string) => !activeChat.tags?.includes(t)).length === 0 && (
                      <div className={`px-3 py-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {language === 'Español' ? 'No hay más etiquetas' : 'No more tags'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-3">
              <h5 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{language === 'Español' ? 'Notas Personales' : 'Personal Notes'}</h5>
              <div className="space-y-3">
                <textarea 
                  className={`w-full text-sm p-3 rounded-xl border outline-none resize-y min-h-[100px] transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white focus:border-primary-1' : 'bg-white border-primary-2/20 text-slate-900 focus:border-primary-1 shadow-sm'}`}
                  placeholder={language === 'Español' ? 'Añade una nota privada...' : 'Add a private note...'}
                  value={activeChat.personalNotes || ''}
                  onChange={(e) => {
                    const newConversations = conversations.map((c: any) => 
                      c.id === activeChat.id ? { ...c, personalNotes: e.target.value } : c
                    );
                    setConversations(newConversations);
                  }}
                />
              </div>
            </div>
          </div>
          ) : (
            <div className="p-6 flex-1 flex items-center justify-center text-center">
              <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {language === 'Español' ? 'Selecciona una conversación para ver los detalles del cliente.' : 'Select a conversation to view client details.'}
              </p>
            </div>
          )}
        </section>
          </>
        )}
      </main>

      {/* Kanban Card Detail Modal */}
      {selectedKanbanCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
          <div className={`w-[95%] md:w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 ${isDarkMode ? 'bg-[#0a0a0f] border border-primary-2/30' : 'bg-white border border-primary-2/20'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
              <h3 className="font-headline text-xl font-bold text-primary-2">{language === 'Español' ? 'Detalle del Lead' : 'Lead Detail'}</h3>
              <button onClick={() => setSelectedKanbanCard(null)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* IZQUIERDA: Perfil, Etiquetas, Control Bot */}
                <div className="space-y-8">
                  {/* Ficha del Cliente */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      {selectedKanbanCard.avatar ? (
                        <img src={selectedKanbanCard.avatar} alt={selectedKanbanCard.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary-2/30 shrink-0" />
                      ) : (
                        <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
                          <User className={`w-10 h-10 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                      )}
                      <div>
                        <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedKanbanCard.name}</h4>
                        <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedKanbanCard.contactInfo?.role?.[language === 'Español' ? 'es' : 'en']} • {selectedKanbanCard.contactInfo?.extractedData?.['Empresa'] || ''}</p>
                      </div>
                    </div>

                    {/* Extracted CRM Fields */}
                    <div className="space-y-3">
                      {globalKeyFields.map((field: string) => {
                        const value = selectedKanbanCard.contactInfo?.extractedData?.[field];
                        return (
                          <div key={field} className="flex flex-col gap-1">
                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field}</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={value || ''}
                                onChange={(e) => {
                                  const newConversations = conversations.map((c: any) => {
                                    if (c.id === selectedKanbanCard.id) {
                                      return {
                                        ...c,
                                        contactInfo: {
                                          ...c.contactInfo,
                                          extractedData: {
                                            ...c.contactInfo?.extractedData,
                                            [field]: e.target.value
                                          }
                                        }
                                      };
                                    }
                                    return c;
                                  });
                                  setConversations(newConversations);
                                  setSelectedKanbanCard({
                                    ...selectedKanbanCard,
                                    contactInfo: {
                                      ...selectedKanbanCard.contactInfo,
                                      extractedData: {
                                        ...selectedKanbanCard.contactInfo?.extractedData,
                                        [field]: e.target.value
                                      }
                                    }
                                  });
                                }}
                                placeholder={language === 'Español' ? 'Esperando datos...' : 'Waiting for data...'}
                                className={`w-full text-[16px] sm:text-sm py-2 px-3 pr-8 rounded-lg border transition-colors outline-none focus:border-primary-1 ${value ? (isDarkMode ? 'bg-primary-1/5 border-primary-1/30 text-white' : 'bg-primary-1/5 border-primary-1/30 text-slate-900') : (isDarkMode ? 'bg-dark-bg/50 border-primary-2/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')}`}
                              />
                              {value && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2" title={language === 'Español' ? 'Extraído por IA' : 'Extracted by AI'}>
                                  <Sparkles className="w-3.5 h-3.5 text-primary-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div>
                    <h5 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Etiquetas' : 'Tags'}</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedKanbanCard.tags?.map((tag: string) => (
                        <span key={tag} style={{ backgroundColor: `${getTagColor(tag)}20`, color: getTagColor(tag), borderColor: `${getTagColor(tag)}50` }} className="text-xs px-3 py-1 rounded-full border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Control del Bot */}
                  <div>
                    <h5 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Estado del Asistente' : 'Assistant Status'}</h5>
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30' : 'bg-slate-50 border-primary-2/20'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedKanbanCard.isEcoActive ? 'bg-primary-1 text-white' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500')}`}>
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {selectedKanbanCard.isEcoActive ? (language === 'Español' ? 'Eco Activo' : 'Eco Active') : (language === 'Español' ? 'Eco Pausado' : 'Eco Paused')}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {selectedKanbanCard.isEcoActive ? (language === 'Español' ? 'Gestionando la conversación' : 'Managing the conversation') : (language === 'Español' ? 'Control manual requerido' : 'Manual control required')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DERECHA: Datos Relevantes, Notas */}
                <div className="space-y-8">
                  {/* Resumen Inteligente ✨ */}
                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-primary-2/10 border-primary-2/30' : 'bg-primary-1/5 border-primary-2/20'}`}>
                    <h5 className="text-xs font-bold uppercase tracking-widest text-primary-2 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {language === 'Español' ? 'Resumen Inteligente ✨' : 'Smart Summary ✨'}
                    </h5>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/90' : 'text-slate-700'}`}>
                      {selectedKanbanCard.contactInfo?.summary?.[language === 'Español' ? 'es' : 'en']}
                    </p>
                  </div>

                  {/* AI Meeting Scheduled */}
                  {selectedKanbanCard.contactInfo?.meetingScheduled && (
                    <div className={`p-5 rounded-xl border relative overflow-hidden ${isDarkMode ? 'border-accent/30 bg-accent/10' : 'border-accent/20 bg-accent/5 shadow-sm'}`}>
                      <h5 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {language === 'Español' ? 'Reunión Agendada por el Eco' : 'Eco Scheduled Meeting'}
                      </h5>
                      <p className={`text-sm font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {selectedKanbanCard.contactInfo.meetingScheduled.title} - {selectedKanbanCard.contactInfo.meetingScheduled.date}
                      </p>
                      <button className={`w-full py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-accent/20 text-accent hover:bg-accent/30' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}>
                        <LinkIcon className="w-3.5 h-3.5" />
                        {language === 'Español' ? 'Copiar Enlace de Calendario' : 'Copy Calendar Link'}
                      </button>
                    </div>
                  )}

                  {/* Notas Personales */}
                  <div className="flex-1 flex flex-col">
                    <h5 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'Español' ? 'Notas Personales' : 'Personal Notes'}</h5>
                    <textarea 
                      className={`w-full flex-1 text-sm p-4 rounded-xl border outline-none resize-none transition-colors ${isDarkMode ? 'bg-dark-bg/50 border-primary-2/30 text-white focus:border-primary-1' : 'bg-slate-50 border-primary-2/20 text-slate-900 focus:border-primary-1'}`}
                      placeholder={language === 'Español' ? 'Añade una nota privada...' : 'Add a private note...'}
                      value={selectedKanbanCard.personalNotes || ''}
                      onChange={(e) => {
                        const newConversations = conversations.map((c: any) => 
                          c.id === selectedKanbanCard.id ? { ...c, personalNotes: e.target.value } : c
                        );
                        setConversations(newConversations);
                        setSelectedKanbanCard({ ...selectedKanbanCard, personalNotes: e.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t flex justify-end ${isDarkMode ? 'border-primary-2/30' : 'border-primary-2/10'}`}>
              <button 
                onClick={() => {
                  setActiveChatId(selectedKanbanCard.id);
                  setInboxViewMode('list');
                  setSelectedKanbanCard(null);
                }}
                className="px-8 py-3 rounded-xl bg-primary-2 text-white font-bold shadow-lg shadow-primary-2/20 hover:bg-primary-2/90 transition-all flex items-center gap-2"
              >
                {language === 'Español' ? 'Ir al Chat' : 'Go to Chat'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <CreateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        isDarkMode={isDarkMode}
        language={language}
        reports={reports}
        setReports={setReports}
        activeChat={activeChat}
        reportingMessageId={reportingMessageId}
        setReportingMessageId={setReportingMessageId}
        conversations={conversations}
      />

      {/* Magic Redactor Modal */}
      {showMagicRedactor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'Español' ? 'Redactor Mágico IA' : 'AI Magic Redactor'}
                </h3>
              </div>
              <button onClick={() => setShowMagicRedactor(false)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full h-32 p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                placeholder={language === 'Español' ? 'Escribe aquí...' : 'Type here...'}
              />
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Tono' : 'Tone'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Más profesional', 'Más amigable', 'Más persuasivo', 'Más conciso', 'Más serio'].map(tone => (
                      <button 
                        key={tone} 
                        onClick={() => setInputValue(`[Versión ${tone.toLowerCase()}]: ${inputValue}`)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isDarkMode ? 'border-primary-2/30 text-slate-300 hover:bg-white/5' : 'border-primary-2/20 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'Español' ? 'Traducción' : 'Translation'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          setInputValue(`[Traducido al ${e.target.options[e.target.selectedIndex].text}]: ${inputValue}`);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-1 transition-colors ${isDarkMode ? 'bg-dark-bg/80 border-primary-2/30 text-white' : 'bg-white border-primary-2/20 text-slate-900'}`}
                    >
                      <option value="">{language === 'Español' ? 'Sin traducción' : 'No translation'}</option>
                      <option value="en">Inglés (US)</option>
                      <option value="pt">Portugués (BR)</option>
                      <option value="fr">Francés</option>
                      <option value="de">Alemán</option>
                      <option value="it">Italiano</option>
                      <option value="zh">Chino</option>
                      <option value="ja">Japonés</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <button 
                onClick={() => setInputValue(language === 'Español' ? '[Texto ajustado por IA simulada]' : '[Text adjusted by simulated AI]')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
              >
                {language === 'Español' ? 'Ajustar con IA' : 'Adjust with AI'}
              </button>
              <button 
                onClick={() => setShowMagicRedactor(false)}
                className="px-6 py-2 rounded-xl bg-primary-1 text-white text-sm font-bold shadow-lg shadow-primary-1/20 hover:bg-primary-1/90 transition-all"
              >
                {language === 'Español' ? 'Reemplazar en Chat' : 'Replace in Chat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multimedia Picker Modal (Empty for now) */}
      {showMultimediaPicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0a0a0f] border-primary-2/30' : 'bg-white border-primary-2/20'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-primary-2/30 bg-dark-bg/50' : 'border-primary-2/10 bg-slate-50'}`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {language === 'Español' ? 'Elegir de Multimedia' : 'Choose from Media'}
              </h3>
              <button onClick={() => setShowMultimediaPicker(false)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 1, name: 'Logo_Echoes.png', type: 'image', url: 'https://picsum.photos/seed/1/200/200' },
                  { id: 2, name: 'Presentacion_Ventas.pdf', type: 'document', url: '' },
                  { id: 3, name: 'Video_Promocional.mp4', type: 'video', url: 'https://picsum.photos/seed/2/200/200' },
                  { id: 4, name: 'Banner_Web.jpg', type: 'image', url: 'https://picsum.photos/seed/3/200/200' },
                  { id: 5, name: 'Contrato_Base.docx', type: 'document', url: '' },
                  { id: 6, name: 'Audio_Entrevista.mp3', type: 'audio', url: '' },
                ].map(file => (
                  <div 
                    key={file.id}
                    onClick={() => {
                      setAttachedFile(file);
                      setShowMultimediaPicker(false);
                    }}
                    className={`group relative aspect-square rounded-xl border overflow-hidden cursor-pointer transition-all ${isDarkMode ? 'border-primary-2/30 hover:border-primary-1 bg-dark-bg/50' : 'border-primary-2/20 hover:border-primary-1 bg-slate-50'}`}
                  >
                    {file.type === 'image' || file.type === 'video' ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <FileText className={`w-12 h-12 mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-medium truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatItem({ name, time, msg, active, img, opacity = "", isDarkMode, onClick, tags, isPinned, isEcoActive, getTagColor, unreadCount }: any) {
  return (
    <div onClick={onClick} className={`p-4 border-b cursor-pointer transition-all ${isDarkMode ? 'border-primary-2/20' : 'border-primary-2/10'} ${active ? (isDarkMode ? 'bg-white/5 border-l-4 border-l-primary-1' : 'bg-primary-2/5 border-l-4 border-l-primary-1') : (isDarkMode ? 'hover:bg-white/5 border-l-4 border-l-transparent' : 'hover:bg-primary-2/5 border-l-4 border-l-transparent')} ${opacity}`}>
      <div className="flex gap-3">
        {img ? (
          <img className={`w-10 h-10 rounded-full object-cover border shrink-0 ${isDarkMode ? 'border-dark-bg' : 'border-white shadow-sm'}`} src={img} alt={name} />
        ) : (
          <div className={`w-10 h-10 rounded-full border shrink-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
            <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-sm ${active ? (isDarkMode ? 'text-white' : 'text-primary-2') : (isDarkMode ? 'text-slate-300' : 'text-slate-700')}`}>{name}</span>
              {isEcoActive && <Bot className="w-4 h-4 text-blue-500" />}
              {isPinned && <Pin className="w-3 h-3 text-primary-1 fill-current" />}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{time}</span>
              {unreadCount > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <p className={`text-xs truncate mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{msg}</p>
          
          {/* Status Badge & Tags */}
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            {tags && tags.map((t: string, i: number) => (
              <span key={i} style={{ backgroundColor: `${getTagColor ? getTagColor(t) : '#64748b'}20`, color: getTagColor ? getTagColor(t) : '#64748b', borderColor: `${getTagColor ? getTagColor(t) : '#64748b'}50` }} className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
