export const mockMedia = [
  {
    workspaceId: 'w1',
    id: 'm1',
    alias: 'Logo Principal',
    filename: 'logo_aiclon_2026.png',
    category: 'Imágenes',
    format: 'PNG',
    size: '1.2 MB',
    sizeInMB: 1.2,
    url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=400&fit=crop'
  },
  {
    workspaceId: 'w1',
    id: 'm2',
    alias: 'Brochure Ventas 2026',
    filename: 'brochure_vfinal_print.pdf',
    category: 'Documentos',
    format: 'PDF',
    size: '2.4 MB',
    sizeInMB: 2.4,
    url: '#'
  },
  {
    workspaceId: 'w2',
    id: 'm6',
    alias: 'Presentación Corporativa',
    filename: 'corp_pres.pdf',
    category: 'Documentos',
    format: 'PDF',
    size: '5.4 MB',
    sizeInMB: 5.4,
    url: '#'
  },
  {
    workspaceId: 'w4',
    id: 'm7',
    alias: 'Video Onboarding',
    filename: 'onboarding.mp4',
    category: 'Videos',
    format: 'MP4',
    size: '102.4 MB',
    sizeInMB: 102.4,
    url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop'
  }
];

export const mockReports = [
  {
    workspaceId: 'w1',
    id: 'r1',
    date: '2026-03-24T10:00:00Z',
    title: 'Error en planes ofrecidos',
    category: 'Alucinación',
    severity: 'Alta',
    status: 'Abierto',
    description: 'El bot sigue ofreciendo planes estándar cuando el cliente claramente pidió integraciones personalizadas para más de 500 empleados.',
    linkedChats: [{ workspaceId: 'w1',
    id: '1', name: 'Isabella Rojas', phone: '+57 300 123 4567' }],
    comments: [
      { id: 'c1', date: '2026-03-24T10:30:00Z', text: 'Revisando el prompt de ventas.', author: 'Felipe' }
    ],
    completedAt: null
  },
  {
    workspaceId: 'w1',
    id: 'r2',
    date: '2026-03-23T15:30:00Z',
    title: 'Bucle en agendamiento',
    category: 'Error Técnico',
    severity: 'Media',
    status: 'En Revisión',
    description: 'El bot no pudo procesar la solicitud de agendamiento y se quedó en un bucle infinito pidiendo la fecha.',
    linkedChats: [{ workspaceId: 'w1',
    id: '2', name: 'Mateo Silva', phone: '+56 9 8765 4321' }],
    comments: [],
    completedAt: null
  },
  {
    workspaceId: 'w1',
    id: 'r3',
    date: '2026-03-22T09:15:00Z',
    title: 'Tono informal en queja',
    category: 'Tono Inadecuado',
    severity: 'Baja',
    status: 'Resuelto',
    description: 'El bot respondió con un tono demasiado informal a una queja seria sobre facturación.',
    linkedChats: [{ workspaceId: 'w1',
    id: '3', name: 'Valentina Castro', phone: '+52 55 1234 5678' }],
    comments: [
      { id: 'c2', date: '2026-03-22T10:00:00Z', text: 'Se ajustó el prompt de soporte.', author: 'Admin' }
    ],
    completedAt: '2026-03-22T10:05:00Z'
  },
  {
    workspaceId: 'w2',
    id: 'r5',
    date: '2026-03-24T11:00:00Z',
    title: 'Cobro duplicado',
    category: 'Facturación',
    severity: 'Media',
    status: 'En Revisión',
    description: 'El sistema registró dos veces el pago del último mes.',
    linkedChats: [{ workspaceId: 'w2',
    id: '6', name: 'Laura Gómez', phone: '+34 600 111 222' }],
    comments: [],
    completedAt: null
  },
  {
    workspaceId: 'w4',
    id: 'r6',
    date: '2026-03-26T08:00:00Z',
    title: 'Fallo al cargar dashboard',
    category: 'Bug Report',
    severity: 'Alta',
    status: 'Abierto',
    description: 'El usuario reportó que la página principal se queda en blanco tras el login.',
    linkedChats: [],
    comments: [],
    completedAt: null
  }
];

export const mockConversations = [
  {
    workspaceId: 'w1',
    id: '1',
    name: 'Isabella Rojas',
    phone: '+57 300 123 4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    lastMessage: 'Necesito hablar con un asesor sobre mi reserva.',
    time: { es: 'hace 2 min', en: '2 mins ago' },
    statusBadge: { es: 'TOMA DE CONTROL HUMANO', en: 'HUMAN TAKEOVER' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Urgente', 'Soporte'],
    stage: 'interaccion',
    isPinned: true,
    isEcoActive: false,
    assignedTo: 'asesor1',
    unreadCount: 3,
    notes: [],
    createdAt: '2026-03-25T10:00:00Z',
    contactInfo: {
      role: { es: 'Cliente VIP', en: 'VIP Client' },
      summary: {
        es: 'El cliente tiene problemas con una reserva existente y solicita asistencia inmediata.',
        en: 'The client has issues with an existing reservation and requests immediate assistance.'
      },
      extractedData: {
        'Nombre completo': 'Isabella Rojas',
        'Teléfono': '+57 300 123 4567',
        'Correo electrónico': 'isabella.rojas@acme.com',
        'Empresa': 'Acme Corp',
        'Motivo de consulta': 'Agendar visita apartamento',
        'Metros cuadrados': '80 m²'
      },
      meetingScheduled: {
        title: 'Visita Apartamento',
        date: '2026-04-09T10:00:00Z'
      }
    },
    messages: [
      { id: 'msg1', type: 'incoming', text: 'Hola, tengo un problema con mi reserva #12345.', time: '10:00 AM' },
      { id: 'msg2', type: 'bot', text: 'Hola Isabella. Veo tu reserva #12345. ¿En qué puedo ayudarte?', time: '10:01 AM' },
      { id: 'msg3', type: 'incoming', text: 'Necesito hablar con un asesor sobre mi reserva.', time: '10:02 AM' },
      { id: 'msg4', type: 'incoming', isAudio: true, duration: '0:15', transcription: 'Necesito agendar una visita para el apartamento de 80 metros cuadrados.', time: '10:05 AM' }
    ]
  },
  {
    workspaceId: 'w1',
    id: '2',
    name: 'Marcus Thorne',
    phone: '+1 415 555 0198',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    lastMessage: 'El bot no está entendiendo mis requerimientos empresariales.',
    time: { es: 'hace 12 min', en: '12 mins ago' },
    statusBadge: { es: 'ALTA PRIORIDAD', en: 'HIGH PRIORITY' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Ventas', 'Humano Requerido'],
    stage: 'nuevo',
    isPinned: false,
    isEcoActive: true,
    assignedTo: null,
    unreadCount: 1,
    notes: [],
    contactInfo: {
      role: { es: 'Director de Ventas', en: 'Sales Director' },
      summary: {
        es: 'El lead busca soluciones empresariales complejas que el bot no puede resolver.',
        en: 'The lead is looking for complex enterprise solutions that the bot cannot resolve.'
      },
      extractedData: {
        'Nombre completo': 'Marcus Thorne',
        'Teléfono': '+1 415 555 0198',
        'Correo electrónico': 'marcus@globaltech.com',
        'Empresa': 'Global Tech',
        'Motivo de consulta': 'Planes empresariales',
        'Metros cuadrados': ''
      }
    },
    messages: [
      { id: 'msg5', type: 'incoming', text: 'Me gustaría información sobre sus planes empresariales.', time: '09:30 AM' },
      { id: 'msg6', type: 'bot', text: '¡Claro! Tenemos varios planes. ¿De qué tamaño es tu empresa?', time: '09:31 AM' },
      { id: 'msg7', type: 'incoming', text: 'Somos más de 500 empleados, pero necesitamos integraciones personalizadas.', time: '09:35 AM' },
      { id: 'msg8', type: 'bot', text: 'Nuestros planes incluyen integraciones estándar con CRMs populares.', time: '09:35 AM' },
      { id: 'msg9', type: 'incoming', text: 'El bot no está entendiendo mis requerimientos empresariales.', time: '09:40 AM' }
    ]
  },
  {
    workspaceId: 'w1',
    id: '3',
    name: 'Alex Jameson',
    phone: '+44 20 7123 4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    lastMessage: 'Estoy recibiendo un error 403 Forbidden en el webhook.',
    time: { es: 'hace 18 min', en: '18 mins ago' },
    statusBadge: { es: 'TOMA DE CONTROL HUMANO', en: 'HUMAN TAKEOVER' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Soporte', 'Urgente'],
    stage: 'reunion',
    isPinned: false,
    isEcoActive: false,
    assignedTo: 'asesor2',
    unreadCount: 0,
    notes: [],
    contactInfo: {
      role: { es: 'CTO', en: 'CTO' },
      summary: {
        es: 'El lead es técnico, enfocado en límites de API y Webhooks. Bloqueo de integración.',
        en: 'The lead is technical, focused on API limits and Webhooks. Integration blocker.'
      },
      extractedData: {
        'Nombre completo': 'Alex Jameson',
        'Teléfono': '+44 20 7123 4567',
        'Correo electrónico': 'alex@techflow.io',
        'Empresa': 'TechFlow Systems',
        'Motivo de consulta': 'Error 403 Webhook',
        'Metros cuadrados': ''
      }
    },
    messages: [
      { id: 'msg10', type: 'incoming', text: 'Hola equipo, tengo problemas con la configuración del Webhook para la suite empresarial. El bot sugirió unos pasos pero recibo un error 403 Forbidden.', time: '12:42 PM' },
      { id: 'msg11', type: 'bot', text: 'Analizando registros... Parece que tu API Key carece del permiso \'webhook_write\'. ¿Te gustaría que te guíe para actualizar los permisos?', time: '12:43 PM' },
      { id: 'msg12', type: 'incoming', text: 'Ya lo intenté, pero sigue fallando. ¿Puedo hablar con un representante humano para revisar mi estado?', time: '12:45 PM' },
      { id: 'msg13', type: 'outgoing', text: '¡Hola Alex! He tomado el control del chat. Estoy revisando tu cuenta ahora mismo. Un momento mientras sincronizo con el equipo de infraestructura.', time: '12:48 PM' }
    ]
  },
  {
    workspaceId: 'w1',
    id: '4',
    name: '+57 320 123 4567',
    phone: '+57 320 123 4567',
    avatar: '',
    lastMessage: 'Necesito ayuda urgente con mi cuenta.',
    time: { es: 'hace 5 min', en: '5 mins ago' },
    statusBadge: { es: 'INTERVENCIÓN REQUERIDA', en: 'INTERVENTION REQUIRED' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Soporte'],
    stage: 'interaccion',
    isPinned: false,
    isEcoActive: true,
    assignedTo: 'asesor1',
    unreadCount: 0,
    notes: [],
    contactInfo: {
      role: { es: 'Desconocido', en: 'Unknown' },
      summary: {
        es: 'Usuario no registrado solicitando soporte urgente.',
        en: 'Unregistered user requesting urgent support.'
      },
      extractedData: {}
    },
    messages: [
      { id: 'msg14', type: 'incoming', text: 'Necesito ayuda urgente con mi cuenta.', time: '11:00 AM' },
      { id: 'msg15', type: 'bot', text: 'Hola. Para poder ayudarte, por favor indícame tu correo electrónico.', time: '11:01 AM' }
    ]
  },
  {
    workspaceId: 'w1',
    id: '5',
    name: '+1 305 555 1234',
    phone: '+1 305 555 1234',
    avatar: '',
    lastMessage: 'Quiero hablar con un humano, el bot no me entiende.',
    time: { es: 'hace 1 min', en: '1 min ago' },
    statusBadge: { es: 'TOMA DE CONTROL HUMANO', en: 'HUMAN TAKEOVER' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Queja', 'Humano Requerido'],
    stage: 'nuevo',
    isPinned: false,
    isEcoActive: false,
    assignedTo: null,
    unreadCount: 2,
    notes: [],
    contactInfo: {
      role: { es: 'Desconocido', en: 'Unknown' },
      summary: {
        es: 'Usuario frustrado con el bot, solicita intervención humana.',
        en: 'Frustrated user requesting human intervention.'
      },
      extractedData: {}
    },
    messages: [
      { id: 'msg16', type: 'incoming', text: 'Quiero hablar con un humano, el bot no me entiende.', time: '11:30 AM' }
    ]
  },
  {
    workspaceId: 'w2',
    id: '6',
    name: 'Laura Gómez',
    phone: '+34 600 111 222',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
    lastMessage: 'Me han cobrado dos veces el plan Enterprise.',
    time: { es: 'hace 30 min', en: '30 mins ago' },
    statusBadge: { es: 'QUEJA FACTURACIÓN', en: 'BILLING COMPLAINT' },
    urgency: { es: 'ALTO', en: 'HIGH' },
    tags: ['Enterprise'],
    stage: 'nuevo',
    isPinned: true,
    isEcoActive: false,
    assignedTo: 'as3',
    unreadCount: 1,
    notes: [
      { id: 'n1', text: 'Revisar pasarela de pago para validar el doble cargo.', author: 'Carlos Ventas', date: '2026-03-24T12:00:00Z' }
    ],
    contactInfo: {
      role: { es: 'Directora Financiera', en: 'CFO' },
      summary: {
        es: 'Problema con cobro duplicado',
        en: 'Duplicate charge issue'
      },
      extractedData: {
        'Industria': 'Retail',
        'Empleados': '250'
      }
    },
    messages: [
      { id: 'msg17', type: 'incoming', text: 'Me han cobrado dos veces el plan Enterprise.', time: '11:00 AM' },
      { id: 'msg18', type: 'bot', text: 'He detectado que esto está relacionado con facturación, transferiré el caso a un experto.', time: '11:05 AM' }
    ]
  },
  {
    workspaceId: 'w4',
    id: '7',
    name: 'Tech Lead',
    phone: '+52 555 999 8888',
    avatar: '',
    lastMessage: 'Excelente servicio con la nueva API',
    time: { es: 'hace 2 horas', en: '2 hours ago' },
    statusBadge: { es: 'FEEDBACK', en: 'FEEDBACK' },
    urgency: { es: 'BAJO', en: 'LOW' },
    tags: ['Feedback Positivo'],
    stage: 'reunion',
    isPinned: false,
    isEcoActive: true,
    assignedTo: null,
    unreadCount: 0,
    notes: [],
    contactInfo: {
      role: { es: 'Desarrollador', en: 'Developer' },
      summary: {
        es: 'Elogio por la nueva implementación de la API.',
        en: 'Praise for the new API implementation.'
      },
      extractedData: {
        'Proyecto': 'Migración V2',
        'Rol': 'Tech Lead'
      }
    },
    messages: [
      { id: 'msg19', type: 'incoming', text: 'Excelente servicio con la nueva API, me funcionó a la perfección.', time: '09:00 AM' },
      { id: 'msg20', type: 'bot', text: '¡Muchas gracias por su comentario! Seguiremos mejorando.', time: '09:05 AM' }
    ]
  }
];
