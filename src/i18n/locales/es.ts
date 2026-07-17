export default {
  // Selector de rol
  welcome: '¡Hola,\nBienvenido!',
  welcomeDescription: 'Guardian Salud AI - Vigilancia epidemiológica para la Amazonía',
  selectRole: '¿Con qué rol vas a ingresar?',
  reportProblem: 'Reportar Problema',
  terms: 'Términos y condiciones',
  roleCitizen: 'Ciudadano',
  roleCitizenDesc: 'Reporta síntomas y recibe alertas de tu comunidad.',
  roleAgent: 'Agente Comunitario',
  roleAgentDesc: 'Registra visitas de salud, incluso sin conexión.',
  roleAuthority: 'Autoridad / Analista',
  roleAuthorityDesc: 'Visualiza mapas de riesgo, tendencias y alertas.',

  // Ciudadano - Home
  citizenGreeting: 'Hola 👋',
  citizenSubtitle: 'Guardian Salud AI cuida de tu comunidad',
  currentRisk: 'Riesgo actual en tu distrito',
  districtInfo: 'Callería · Basado en reportes de los últimos 7 días',
  lastReport: 'Tu último reporte',
  reportSymptoms: 'Reportar síntomas',
  riskLow: 'Riesgo bajo',
  riskMedium: 'Riesgo medio',
  riskHigh: 'Riesgo alto',

  // Ciudadano - Reportar
  howAreYou: '¿Cómo te sientes hoy?',
  selectSymptoms: 'Selecciona todos los síntomas que presentas',
  fever: 'Fiebre',
  diarrhea: 'Diarrea',
  cough: 'Tos',
  vomiting: 'Vómitos',
  musclePain: 'Dolor muscular',
  headache: 'Dolor de cabeza',
  district: 'Distrito',
  community: 'Comunidad',
  sendReport: 'Enviar reporte',
  reportSent: 'Reporte enviado',
  reportSentMsg: 'La IA clasificó tu reporte como riesgo {risk}. Gracias por ayudar a proteger a tu comunidad.',
  selectSymptomError: 'Selecciona al menos un síntoma',
  today: 'Hoy',
  defaultDistrict: 'Callería',

  // Ciudadano - Mis Reportes
  myReports: 'Mis reportes',
  noReports: 'Aún no tienes reportes.',

  // Agente - Home
  agentPanel: 'Panel del Agente',
  agentSubtitle: 'Registra la salud de tu comunidad, con o sin Internet',
  registeredVisits: 'Visitas registradas',
  pendingSync: 'Pendientes de sincronizar',
  offlineMode: '📡 Modo offline activo: los datos se guardan en tu dispositivo',
  newVisit: 'Registrar nueva visita',

  // Agente - Registrar Visita
  registerVisit: 'Registrar visita',
  patientName: 'Nombre del paciente',
  bloodPressure: 'Presión arterial',
  glucose: 'Glucosa',
  temperature: 'Temperatura',
  weight: 'Peso (kg)',
  height: 'Talla (cm)',
  saveVisit: 'Guardar visita',
  visitSaved: 'Guardado localmente',
  visitSavedMsg: 'La visita se sincronizará cuando haya conexión.',
  completeFields: 'Completa al menos el nombre y la comunidad',

  // Agente - Sincronización
  sync: 'Sincronización',
  pendingVisits: '{count} visita(s) pendiente(s)',
  syncNow: 'Sincronizar ahora',
  noVisits: 'No hay visitas registradas todavía.',
  synced: '✓ Sincronizado',
  pending: '⏳ Pendiente',

  // Autoridad - Dashboard
  analysisCenter: 'Centro de Análisis',
  dashboardSubtitle: 'Vigilancia epidemiológica en tiempo real · Ucayali',
  totalReports: 'Reportes totales',
  alertDistricts: 'Distritos en alerta',
  monitoredDistricts: 'Distritos monitoreados',
  districtIncidence: 'Incidencia por distrito',
  predictiveAnalytics: '🔮 Analítica predictiva',
  predictiveText: 'Basado en patrones históricos, se estima un incremento de casos de dengue en Callería durante las próximas semanas.',

  // Autoridad - Mapa de Riesgo
  riskMap: 'Mapa de riesgo',
  riskMapSubtitle: 'Vista previa por distrito. La integración con mapa geoespacial interactivo está en desarrollo.',
  activeCases: 'casos activos',

  // Autoridad - Alertas
  alerts: 'Alertas generadas por IA',
  alertsSubtitle: 'Patrones detectados automáticamente a partir de los reportes ciudadanos',

  // Navegación
  tabHome: 'Inicio',
  tabReport: 'Reportar',
  tabMyReports: 'Mis Reportes',
  tabNewVisit: 'Nueva Visita',
  tabSync: 'Sincronizar',
  tabDashboard: 'Dashboard',
  tabRiskMap: 'Mapa de Riesgo',
  tabAlerts: 'Alertas',
  switchRole: 'Cambiar rol',

  // Datos mock traducidos
  symptomFever: 'Fiebre',
  symptomMusclePain: 'Dolor muscular',
  symptomCough: 'Tos',
  date2Days: 'Hace 2 días',
  date3Weeks: 'Hace 3 semanas',
  alertDengue: 'Posible brote de dengue',
  alertDengueDetail: '35 reportes de fiebre en los últimos 7 días dentro del mismo sector.',
  alertRespiratory: 'Incremento de casos respiratorios',
  alertRespiratoryDetail: '18 reportes de tos y fiebre en la última semana.',
  dateTodayTime: 'Hoy, 08:12',
  dateYesterday: 'Ayer, 19:40',
};
