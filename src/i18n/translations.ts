/**
 * SaludConecta — Central i18n Translations File
 * Supports: Spanish (es), English (en), Shipibo-Conibo (shp)
 *
 * HOW TO ADD A NEW STRING:
 *   1. Add the key to the `AppTranslations` interface
 *   2. Add the translated value to each language block below
 *
 * HOW TO ADD A NEW LANGUAGE:
 *   1. Add a new locale key to `LanguageType`
 *   2. Add a full translations object matching `AppTranslations`
 *   3. Register it in the `LANGUAGES` map at the bottom
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type LanguageType = 'es' | 'en' | 'shp';

export interface AppTranslations {
  // ── Language names (for the picker UI) ───────────────────────────────────
  lang_es: string;
  lang_en: string;
  lang_shp: string;

  // ── App identity ──────────────────────────────────────────────────────────
  app_name: string;
  app_tagline: string;

  // ── Common actions ────────────────────────────────────────────────────────
  cancel: string;
  confirm: string;
  yes: string;
  no: string;
  save: string;
  back: string;
  loading: string;
  error: string;
  retry: string;
  close: string;
  send: string;
  ok: string;

  // ── Role Selector Screen ──────────────────────────────────────────────────
  role_select_prompt: string;
  role_citizen_title: string;
  role_citizen_desc: string;
  role_agent_title: string;
  role_agent_desc: string;
  role_authority_title: string;
  role_authority_desc: string;

  // ── Navigation tab labels ─────────────────────────────────────────────────
  tab_home: string;
  tab_report: string;
  tab_scanner: string;
  tab_my_reports: string;
  tab_new_visit: string;
  tab_sync: string;
  tab_dashboard: string;
  tab_risk_map: string;
  tab_alerts: string;

  // ── Switch Role button ────────────────────────────────────────────────────
  switch_role: string;

  // ── Citizen Home Screen ───────────────────────────────────────────────────
  home_greeting: string;
  home_subtitle: string;
  home_district_risk_label: string;
  home_risk_hint: string;
  home_action_report_title: string;
  home_action_report_desc: string;
  home_action_scanner_title: string;
  home_action_scanner_desc: string;
  home_last_report_label: (date: string) => string;
  home_campaigns_section: string;
  home_tips_section: string;
  home_campaign_alert_type: string;
  home_campaign_info_type: string;
  home_campaign_directed: (district: string) => string;
  // Campaign content (translatable)
  home_campaign1_title: string;
  home_campaign1_text: string;
  home_campaign2_title: string;
  home_campaign2_text: string;
  // Health tips (translatable)
  home_tip1: string;
  home_tip2: string;
  home_tip3: string;

  // ── Report Symptoms Screen ────────────────────────────────────────────────
  report_title: string;
  report_subtitle: string;
  report_symptom_fever: string;
  report_symptom_diarrhea: string;
  report_symptom_cough: string;
  report_symptom_vomiting: string;
  report_symptom_muscle_pain: string;
  report_symptom_headache: string;
  report_personal_data: string;
  report_age: string;
  report_sex: string;
  report_sex_male: string;
  report_sex_female: string;
  report_location: string;
  report_district: string;
  report_district_placeholder: string;
  report_community: string;
  report_community_placeholder: string;
  report_submit: string;
  report_modal_title: string;
  report_modal_analysis_label: string;
  report_modal_disclaimer: string;
  report_modal_button: string;

  // ── My Reports Screen ─────────────────────────────────────────────────────
  my_reports_title: string;
  my_reports_empty: string;
  my_reports_patient_label: (age: string) => string;
  my_reports_symptoms_label: string;
  my_reports_ai_analysis_title: string;

  // ── AI Scanner Screen ─────────────────────────────────────────────────────
  scanner_title: string;
  scanner_subtitle: string;
  scanner_mode_vector: string;
  scanner_mode_test: string;
  scanner_viewport_vector_hint: string;
  scanner_viewport_test_hint: string;
  scanner_offline_note: string;
  scanner_btn_open: string;
  scanner_btn_retake: string;
  scanner_btn_rescan: string;
  scanner_btn_clear: string;
  scanner_analyzing: string;
  scanner_processing: string;
  scanner_confidence_label: (pct: string) => string;
  scanner_recommendation_label: string;
  scanner_disclaimer: string;

  // ── Agent Home Screen ─────────────────────────────────────────────────────
  agent_home_title: string;
  agent_home_subtitle: string;
  agent_stat_visited: string;
  agent_stat_pending: string;
  agent_offline_banner: string;
  agent_critical_section: (count: number) => string;
  agent_critical_pregnant: string;
  agent_critical_empty: string;
  agent_tasks_section: string;
  agent_task1: string;
  agent_task2: string;
  agent_task3: string;
  agent_register_btn: string;

  // ── Register Visit Screen ─────────────────────────────────────────────────
  visit_title: string;
  visit_field_name: string;
  visit_field_community: string;
  visit_field_bp: string;
  visit_field_glucose: string;
  visit_field_temperature: string;
  visit_field_weight: string;
  visit_field_height: string;
  visit_field_pregnant: string;
  visit_field_vaccines: string;
  visit_save_btn: string;

  // ── Sync Screen ───────────────────────────────────────────────────────────
  sync_title: string;
  sync_subtitle: string;
  sync_stat_pending: string;
  sync_stat_synced: string;
  sync_stat_total: string;
  sync_btn_idle: (count: number) => string;
  sync_btn_done: string;
  sync_btn_syncing: (count: number) => string;
  sync_btn_retry: string;
  sync_feedback_success: (count: number) => string;
  sync_feedback_error: string;
  sync_history_label: (count: number) => string;
  sync_empty_title: string;
  sync_empty_subtitle: string;
  sync_tag_pregnant: string;
  sync_tag_vaccines_ok: string;
  sync_tag_vaccines_pending: string;
  sync_status_synced: string;
  sync_status_pending: string;

  // ── Authority Dashboard ───────────────────────────────────────────────────
  dash_title: string;
  dash_subtitle: string;
  dash_kpi_reports: string;
  dash_kpi_alert_districts: string;
  dash_kpi_monitored: string;
  dash_risk_breakdown_title: string;
  dash_risk_breakdown_subtitle: (count: number) => string;
  dash_risk_high: string;
  dash_risk_medium: string;
  dash_risk_low: string;
  dash_district_chart_title: string;
  dash_predictive_title: string;
  dash_predictive_text: string;

  // ── Alerts Screen ─────────────────────────────────────────────────────────
  alerts_title: string;
  alerts_subtitle: string;

  // ── Permissions & Camera Alerts ───────────────────────────────────────────
  perm_camera_title: string;
  perm_camera_body: string;
  perm_camera_retry: string;
  perm_camera_denied_title: string;
  perm_camera_denied_body: string;

  // ── Alert / Validation messages ───────────────────────────────────────────
  alert_visit_validation: string;
  alert_visit_saved_title: string;
  alert_visit_saved_body: string;
  alert_sync_no_pending_title: string;
  alert_sync_no_pending_body: string;
  alert_symptom_validation: string;

  // ── IA Campaign Alerts ────────────────────────────────────────────────────
  alert_campaign_title: string;
  alert_campaign_body: (disease: string, district: string) => string;
  alert_campaign_sent_title: string;
  alert_campaign_sent_body: (disease: string, district: string, count: string) => string;

  // ── Risk Map Screen ───────────────────────────────────────────────────────
  map_layer_cases: string;
  map_layer_vectors: string;
  map_layer_prediction: string;
  map_trend_up: string;
  map_trend_down: string;
  map_trend_stable: string;
  map_active_cases: string;
  map_trend: string;
  map_population: string;
  map_chart_title: string;
  map_chart_peak: (max: number) => string;
  map_chart_min: (min: number) => string;
  map_btn_campaign: string;
  map_btn_expand: string;
  map_updated: (date: string) => string;

  // ── Map Legend & Components ───────────────────────────────────────────────
  legend_title: string;
  legend_high: string;
  legend_medium: string;
  legend_low: string;
  marker_cases: (cases: number, risk: string) => string;
  marker_hint: string;
  risk_badge_high: string;
  risk_badge_medium: string;
  risk_badge_low: string;

  // ── Offline Map Modal ─────────────────────────────────────────────────────
  dl_modal_title: string;
  dl_modal_subtitle: string;
  dl_modal_downloaded_on: (date: string) => string;
  dl_modal_progress: (pct: number) => string;
  dl_modal_success: string;
  dl_modal_btn_clear: string;
  dl_modal_btn_downloading: string;
  dl_modal_btn_update: string;
  dl_modal_btn_download: string;
  dl_modal_btn_close: string;
  offline_banner_ready: (date: string) => string;
  offline_banner_none: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPANISH (DEFAULT)
// ─────────────────────────────────────────────────────────────────────────────
const es: AppTranslations = {
  lang_es: 'Español 🇪🇸',
  lang_en: 'English 🇺🇸',
  lang_shp: 'Shipibo 🪶',

  app_name: 'Guardian Salud AI',
  app_tagline: 'SaludConecta · Vigilancia epidemiológica para la Amazonía',

  cancel: 'Cancelar',
  confirm: 'Confirmar',
  yes: 'Sí',
  no: 'No',
  save: 'Guardar',
  back: 'Atrás',
  loading: 'Cargando...',
  error: 'Error',
  retry: 'Reintentar',
  close: 'Cerrar',
  send: 'Enviar',
  ok: 'Entendido',

  role_select_prompt: '¿Con qué rol vas a ingresar?',
  role_citizen_title: 'Ciudadano',
  role_citizen_desc: 'Reporta síntomas y recibe alertas de tu comunidad.',
  role_agent_title: 'Agente Comunitario',
  role_agent_desc: 'Registra visitas de salud, incluso sin conexión.',
  role_authority_title: 'Autoridad / Analista',
  role_authority_desc: 'Visualiza mapas de riesgo, tendencias y alertas.',

  tab_home: 'Inicio',
  tab_report: 'Reportar',
  tab_scanner: 'Escanear IA',
  tab_my_reports: 'Mis Reportes',
  tab_new_visit: 'Nueva Visita',
  tab_sync: 'Sincronizar',
  tab_dashboard: 'Dashboard',
  tab_risk_map: 'Mapa de Riesgo',
  tab_alerts: 'Alertas',

  switch_role: 'Cambiar rol',

  home_greeting: 'Hola 👋',
  home_subtitle: 'Guardian Salud AI cuida de tu comunidad',
  home_district_risk_label: 'Riesgo en tu distrito',
  home_risk_hint: 'Alerta moderada. Se detectaron ligeros incrementos de cuadros febriles en los últimos 7 días.',
  home_action_report_title: 'Reportar Síntomas',
  home_action_report_desc: 'Alerta rápida para la IA',
  home_action_scanner_title: 'Escanear con IA',
  home_action_scanner_desc: 'Detección por fotos',
  home_last_report_label: (date) => `Tu último reporte (${date})`,
  home_campaigns_section: '📢 Campañas de Prevención Activas',
  home_tips_section: '💡 Consejos de Salud para la Selva',
  home_campaign_alert_type: 'Alerta',
  home_campaign_info_type: 'Informativo',
  home_campaign_directed: (district) => `📍 Dirigido a: ${district}`,
  home_campaign1_title: 'Campaña contra el Dengue',
  home_campaign1_text: 'Se reporta incremento de mosquitos. Lava y tapa bien los depósitos donde almacenas agua.',
  home_campaign2_title: 'Vacunación de Control',
  home_campaign2_text: 'Agentes comunitarios visitarán comunidades nativas para aplicar dosis de refuerzo. Prepara tu carnet.',
  home_tip1: 'Usa mosquiteros en camas y cunas para evitar picaduras de zancudos durante la noche.',
  home_tip2: 'Evita acumular llantas, baldes o chapas donde pueda empozarse el agua de lluvia.',
  home_tip3: 'Hierve el agua o usa tabletas de cloro antes de consumirla para evitar infecciones (EDAs).',

  report_title: '¿Cómo te sientes hoy?',
  report_subtitle: 'Selecciona todos los síntomas que presentas',
  report_symptom_fever: 'Fiebre',
  report_symptom_diarrhea: 'Diarrea',
  report_symptom_cough: 'Tos',
  report_symptom_vomiting: 'Vómitos',
  report_symptom_muscle_pain: 'Dolor muscular',
  report_symptom_headache: 'Dolor de cabeza',
  report_personal_data: 'Datos Personales (Opcional)',
  report_age: 'Edad (años)',
  report_sex: 'Sexo',
  report_sex_male: 'Masculino',
  report_sex_female: 'Femenino',
  report_location: 'Ubicación',
  report_district: 'Distrito',
  report_district_placeholder: 'ej. Callería, Yarinacocha',
  report_community: 'Comunidad / Barrio',
  report_community_placeholder: 'ej. San José',
  report_submit: 'Enviar reporte a la IA',
  report_modal_title: 'Evaluación Clínica Automatizada',
  report_modal_analysis_label: '🔍 Análisis Explicativo de la IA:',
  report_modal_disclaimer: 'Esta es una clasificación automatizada basada en reglas epidemiológicas de la Amazonía. No reemplaza un diagnóstico médico profesional. Si tus síntomas empeoran, acude de inmediato al centro de salud más cercano.',
  report_modal_button: 'Entendido, ver mis reportes',

  my_reports_title: 'Mis reportes',
  my_reports_empty: 'Aún no tienes reportes.',
  my_reports_patient_label: (age) => `Paciente: ${age} años`,
  my_reports_symptoms_label: 'Síntomas:',
  my_reports_ai_analysis_title: '🔍 Análisis Explicativo de la IA',

  scanner_title: 'Escáner de Visión IA',
  scanner_subtitle: 'Fotografía un criadero de mosquitos o una prueba rápida de laboratorio para que la IA lo analice localmente.',
  scanner_mode_vector: 'Criadero de Vector',
  scanner_mode_test: 'Prueba Rápida',
  scanner_viewport_vector_hint: 'Apunta a recipientes con agua estancada',
  scanner_viewport_test_hint: 'Encuadra la tira de prueba rápida',
  scanner_offline_note: 'La IA funciona completamente offline — sin conexión a internet',
  scanner_btn_open: 'Abrir Cámara IA',
  scanner_btn_retake: 'Tomar foto',
  scanner_btn_rescan: 'Volver a Escanear',
  scanner_btn_clear: 'Limpiar escaneo',
  scanner_analyzing: 'IA analizando imagen...',
  scanner_processing: 'Procesando píxeles localmente',
  scanner_confidence_label: (pct) => `Confianza de la IA: ${pct}`,
  scanner_recommendation_label: 'Recomendación Médica',
  scanner_disclaimer: 'Análisis automático por IA. No reemplaza diagnóstico médico profesional.',

  agent_home_title: 'Panel del Agente',
  agent_home_subtitle: 'Vigilancia epidemiológica comunitaria y visitas de campo',
  agent_stat_visited: 'Pacientes visitados',
  agent_stat_pending: 'Visitas offline por subir',
  agent_offline_banner: 'Modo Offline-First activo. Registra visitas sin cobertura y sincronízalas en el centro médico.',
  agent_critical_section: (count) => `⚠️ Pacientes en Seguimiento Crítico (${count})`,
  agent_critical_pregnant: 'Gestante',
  agent_critical_empty: 'No hay alertas de gestantes ni fiebre alta registradas localmente.',
  agent_tasks_section: '📋 Tareas Pendientes en Comunidad',
  agent_task1: 'Control vectorial en estanque comunitario (Sector San José)',
  agent_task2: 'Ficha familiar en comunidad nativa Callería',
  agent_task3: 'Distribución de mosquiteros y repelente local',
  agent_register_btn: 'Registrar Visita Médica',

  visit_title: 'Registrar visita',
  visit_field_name: 'Nombre del paciente',
  visit_field_community: 'Comunidad',
  visit_field_bp: 'Presión arterial',
  visit_field_glucose: 'Glucosa',
  visit_field_temperature: 'Temperatura (°C)',
  visit_field_weight: 'Peso (kg)',
  visit_field_height: 'Talla (cm)',
  visit_field_pregnant: '¿Es gestante?',
  visit_field_vaccines: '¿Vacunas al día?',
  visit_save_btn: 'Guardar visita localmente',

  sync_title: 'Sincronización Offline',
  sync_subtitle: 'Registra visitas sin cobertura y súbelas cuando tengas conexión.',
  sync_stat_pending: 'Pendientes de subir',
  sync_stat_synced: 'Ya sincronizadas',
  sync_stat_total: 'Total visitas',
  sync_btn_idle: (count) => count > 0 ? `Sincronizar ${count} visita(s) ahora` : 'Todo sincronizado ✓',
  sync_btn_done: '¡Sincronización exitosa!',
  sync_btn_syncing: (count) => `Subiendo ${count} visita(s)…`,
  sync_btn_retry: 'Reintentar sincronización',
  sync_feedback_success: (count) => `¡${count} visita(s) sincronizadas exitosamente al servidor!`,
  sync_feedback_error: 'Error de conexión. Verifica tu red e intenta de nuevo.',
  sync_history_label: (count) => `Historial de visitas (${count})`,
  sync_empty_title: 'Sin visitas registradas',
  sync_empty_subtitle: 'Ve al Panel del Agente y registra la primera visita médica de campo.',
  sync_tag_pregnant: '🤰 Gestante',
  sync_tag_vaccines_ok: '💉 Vacunas al día',
  sync_tag_vaccines_pending: '💉 Vacunas pendientes',
  sync_status_synced: '✓ Sincronizado',
  sync_status_pending: '⏳ Pendiente',

  dash_title: 'Centro de Análisis',
  dash_subtitle: 'Vigilancia epidemiológica en tiempo real · Ucayali',
  dash_kpi_reports: 'Reportes ciudadanos',
  dash_kpi_alert_districts: 'Distritos en alerta',
  dash_kpi_monitored: 'Distritos monitoreados',
  dash_risk_breakdown_title: 'Distribución por Nivel de Riesgo',
  dash_risk_breakdown_subtitle: (count) => `Basado en ${count} reportes ciudadanos activos`,
  dash_risk_high: 'Alto riesgo',
  dash_risk_medium: 'Riesgo medio',
  dash_risk_low: 'Bajo riesgo',
  dash_district_chart_title: 'Incidencia por Distrito',
  dash_predictive_title: 'Analítica Predictiva IA',
  dash_predictive_text: 'Basado en datos históricos y la temporada de lluvias actual, se estima un incremento del +18% en casos de Dengue en Callería durante las próximas 2 semanas. Se recomienda activar brigadas preventivas.',

  alerts_title: 'Alertas generadas por IA',
  alerts_subtitle: 'Patrones detectados automáticamente a partir de los reportes ciudadanos',

  perm_camera_title: 'Permiso de Cámara Requerido',
  perm_camera_body: 'GuardianSalud AI necesita acceso a la cámara para que la IA pueda analizar criaderos o tiras reactivas.\n\nPor favor, habilita el permiso en: Configuración → Aplicaciones → GuardianSalud AI → Permisos → Cámara.',
  perm_camera_retry: 'Conceder permiso',
  perm_camera_denied_title: 'Permiso denegado',

  alert_visit_validation: 'Completa al menos el nombre y la comunidad',
  alert_visit_saved_title: 'Guardado localmente',
  alert_visit_saved_body: 'La visita se sincronizará cuando haya conexión.',
  alert_sync_no_pending_title: 'Sin pendientes',
  alert_sync_no_pending_body: 'Todas las visitas ya están sincronizadas.',
  alert_symptom_validation: 'Selecciona al menos un síntoma',
  alert_campaign_title: '🤖 Campaña Preventiva con IA',
  alert_campaign_body: (disease, district) => `¿Deseas enviar una campaña educativa preventiva sobre ${disease} dirigida a todos los ciudadanos y agentes comunitarios del distrito de ${district}?\n\nLa IA adaptará el mensaje en base a la sintomatología actual registrada en la zona.`,
  alert_campaign_sent_title: '✅ Alerta Enviada',
  alert_campaign_sent_body: (disease, district, count) => `Campaña preventiva de ${disease} iniciada con IA para ${district}. Se ha enviado una notificación de alerta a ${count} dispositivos móviles en la zona.`,

  map_layer_cases: 'Casos',
  map_layer_vectors: 'Criaderos',
  map_layer_prediction: 'Predicción',
  map_trend_up: 'Subiendo',
  map_trend_down: 'Bajando',
  map_trend_stable: 'Estable',
  map_active_cases: 'Casos activos',
  map_trend: 'Tendencia',
  map_population: 'Población',
  map_chart_title: 'Evolución últimas 6 semanas',
  map_chart_peak: (max) => `Pico: ${max} casos`,
  map_chart_min: (min) => `Mínimo: ${min} casos`,
  map_btn_campaign: 'Enviar Campaña Preventiva IA',
  map_btn_expand: 'Ver análisis completo',
  map_updated: (date) => `Actualizado: ${date}`,

  legend_title: 'Nivel de Riesgo',
  legend_high: 'Alto',
  legend_medium: 'Medio',
  legend_low: 'Bajo',
  marker_cases: (cases, risk) => `${cases} casos activos · Riesgo ${risk}`,
  marker_hint: 'Toca para ver detalles →',
  risk_badge_high: 'Riesgo alto',
  risk_badge_medium: 'Riesgo medio',
  risk_badge_low: 'Riesgo bajo',

  dl_modal_title: 'Mapa Offline',
  dl_modal_subtitle: 'Descarga los tiles de la región de Coronel Portillo, Ucayali para usar el mapa sin conexión a internet en zonas rurales y selva.',
  dl_modal_downloaded_on: (date) => `Descargado el ${date}`,
  dl_modal_progress: (pct) => `${pct}% descargado…`,
  dl_modal_success: '¡Mapa guardado exitosamente!',
  dl_modal_btn_clear: 'Borrar caché',
  dl_modal_btn_downloading: 'Descargando…',
  dl_modal_btn_update: 'Actualizar mapa',
  dl_modal_btn_download: 'Descargar ahora',
  dl_modal_btn_close: 'Listo',
  offline_banner_ready: (date) => `Mapa offline disponible · Actualizado: ${date}`,
  offline_banner_none: 'Visualización en tiempo real · Sin datos offline',
  perm_camera_denied_body: 'Sin acceso a la cámara no es posible realizar el escaneo IA. Actívalo manualmente desde la Configuración del sistema.',
};

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────────────────────────────────────
const en: AppTranslations = {
  lang_es: 'Español 🇪🇸',
  lang_en: 'English 🇺🇸',
  lang_shp: 'Shipibo 🪶',

  app_name: 'Guardian Health AI',
  app_tagline: 'SaludConecta · Epidemiological surveillance for the Amazon',

  cancel: 'Cancel',
  confirm: 'Confirm',
  yes: 'Yes',
  no: 'No',
  save: 'Save',
  back: 'Back',
  loading: 'Loading...',
  error: 'Error',
  retry: 'Retry',
  close: 'Close',
  send: 'Send',
  ok: 'Got it',

  role_select_prompt: 'Which role are you entering as?',
  role_citizen_title: 'Citizen',
  role_citizen_desc: 'Report symptoms and receive alerts from your community.',
  role_agent_title: 'Community Agent',
  role_agent_desc: 'Register health visits, even without connectivity.',
  role_authority_title: 'Authority / Analyst',
  role_authority_desc: 'View risk maps, trends, and epidemiological alerts.',

  tab_home: 'Home',
  tab_report: 'Report',
  tab_scanner: 'AI Scanner',
  tab_my_reports: 'My Reports',
  tab_new_visit: 'New Visit',
  tab_sync: 'Sync',
  tab_dashboard: 'Dashboard',
  tab_risk_map: 'Risk Map',
  tab_alerts: 'Alerts',

  switch_role: 'Switch role',

  home_greeting: 'Hello 👋',
  home_subtitle: 'Guardian Health AI protects your community',
  home_district_risk_label: 'Risk in your district',
  home_risk_hint: 'Moderate alert. Slight increases in fever cases detected in the last 7 days.',
  home_action_report_title: 'Report Symptoms',
  home_action_report_desc: 'Quick AI alert',
  home_action_scanner_title: 'AI Scanner',
  home_action_scanner_desc: 'Detection from photos',
  home_last_report_label: (date) => `Your last report (${date})`,
  home_campaigns_section: '📢 Active Prevention Campaigns',
  home_tips_section: '💡 Health Tips for the Jungle',
  home_campaign_alert_type: 'Alert',
  home_campaign_info_type: 'Informational',
  home_campaign_directed: (district) => `📍 Directed to: ${district}`,
  home_campaign1_title: 'Dengue Prevention Campaign',
  home_campaign1_text: 'Increased mosquito activity reported. Wash and cover all water storage containers.',
  home_campaign2_title: 'Booster Vaccination Drive',
  home_campaign2_text: 'Community agents will visit native communities to administer booster doses. Prepare your vaccination card.',
  home_tip1: 'Use mosquito nets on beds and cribs to prevent mosquito bites during the night.',
  home_tip2: 'Avoid accumulating tires, buckets, or containers where rainwater can pool.',
  home_tip3: 'Boil water or use chlorine tablets before drinking to prevent infections (diarrhea).',

  report_title: 'How are you feeling today?',
  report_subtitle: 'Select all symptoms you are experiencing',
  report_symptom_fever: 'Fever',
  report_symptom_diarrhea: 'Diarrhea',
  report_symptom_cough: 'Cough',
  report_symptom_vomiting: 'Vomiting',
  report_symptom_muscle_pain: 'Muscle pain',
  report_symptom_headache: 'Headache',
  report_personal_data: 'Personal Information (Optional)',
  report_age: 'Age (years)',
  report_sex: 'Sex',
  report_sex_male: 'Male',
  report_sex_female: 'Female',
  report_location: 'Location',
  report_district: 'District',
  report_district_placeholder: 'e.g. Callería, Yarinacocha',
  report_community: 'Community / Neighborhood',
  report_community_placeholder: 'e.g. San José',
  report_submit: 'Submit report to AI',
  report_modal_title: 'Automated Clinical Assessment',
  report_modal_analysis_label: '🔍 AI Explanatory Analysis:',
  report_modal_disclaimer: 'This is an automated classification based on Amazonian epidemiological rules. It does not replace a professional medical diagnosis. If your symptoms worsen, go to the nearest health center immediately.',
  report_modal_button: 'Got it, view my reports',

  my_reports_title: 'My Reports',
  my_reports_empty: 'No reports yet.',
  my_reports_patient_label: (age) => `Patient: ${age} years old`,
  my_reports_symptoms_label: 'Symptoms:',
  my_reports_ai_analysis_title: '🔍 AI Explanatory Analysis',

  scanner_title: 'AI Vision Scanner',
  scanner_subtitle: 'Photograph a mosquito breeding site or a rapid lab test for the AI to analyze locally.',
  scanner_mode_vector: 'Mosquito Breeding Site',
  scanner_mode_test: 'Rapid Test Strip',
  scanner_viewport_vector_hint: 'Point at containers with stagnant water',
  scanner_viewport_test_hint: 'Frame the rapid test strip',
  scanner_offline_note: 'AI works completely offline — no internet required',
  scanner_btn_open: 'Open AI Camera',
  scanner_btn_retake: 'Take photo',
  scanner_btn_rescan: 'Scan Again',
  scanner_btn_clear: 'Clear scan',
  scanner_analyzing: 'AI analyzing image...',
  scanner_processing: 'Processing pixels locally',
  scanner_confidence_label: (pct) => `AI confidence: ${pct}`,
  scanner_recommendation_label: 'Medical Recommendation',
  scanner_disclaimer: 'Automatic AI analysis. Does not replace professional medical diagnosis.',

  agent_home_title: 'Agent Panel',
  agent_home_subtitle: 'Community epidemiological surveillance and field visits',
  agent_stat_visited: 'Patients visited',
  agent_stat_pending: 'Offline visits to upload',
  agent_offline_banner: 'Offline-First mode active. Register visits without coverage and sync them at the medical center.',
  agent_critical_section: (count) => `⚠️ Critical Monitoring Patients (${count})`,
  agent_critical_pregnant: 'Pregnant',
  agent_critical_empty: 'No alerts for pregnant women or high fever registered locally.',
  agent_tasks_section: '📋 Pending Community Tasks',
  agent_task1: 'Vector control at community pond (San José Sector)',
  agent_task2: 'Family record for native community Callería',
  agent_task3: 'Distribution of mosquito nets and local repellent',
  agent_register_btn: 'Register Medical Visit',

  visit_title: 'Register visit',
  visit_field_name: 'Patient name',
  visit_field_community: 'Community',
  visit_field_bp: 'Blood pressure',
  visit_field_glucose: 'Glucose',
  visit_field_temperature: 'Temperature (°C)',
  visit_field_weight: 'Weight (kg)',
  visit_field_height: 'Height (cm)',
  visit_field_pregnant: 'Is the patient pregnant?',
  visit_field_vaccines: 'Up-to-date vaccines?',
  visit_save_btn: 'Save visit locally',

  sync_title: 'Offline Sync',
  sync_subtitle: 'Register visits without coverage and upload them when you have connectivity.',
  sync_stat_pending: 'Pending upload',
  sync_stat_synced: 'Already synced',
  sync_stat_total: 'Total visits',
  sync_btn_idle: (count) => count > 0 ? `Sync ${count} visit(s) now` : 'All synced ✓',
  sync_btn_done: 'Sync successful!',
  sync_btn_syncing: (count) => `Uploading ${count} visit(s)…`,
  sync_btn_retry: 'Retry sync',
  sync_feedback_success: (count) => `${count} visit(s) successfully synced to server!`,
  sync_feedback_error: 'Connection error. Check your network and try again.',
  sync_history_label: (count) => `Visit history (${count})`,
  sync_empty_title: 'No visits recorded',
  sync_empty_subtitle: 'Go to the Agent Panel and register the first field medical visit.',
  sync_tag_pregnant: '🤰 Pregnant',
  sync_tag_vaccines_ok: '💉 Vaccines up-to-date',
  sync_tag_vaccines_pending: '💉 Vaccines pending',
  sync_status_synced: '✓ Synced',
  sync_status_pending: '⏳ Pending',

  dash_title: 'Analysis Center',
  dash_subtitle: 'Real-time epidemiological surveillance · Ucayali',
  dash_kpi_reports: 'Citizen reports',
  dash_kpi_alert_districts: 'Alert districts',
  dash_kpi_monitored: 'Monitored districts',
  dash_risk_breakdown_title: 'Distribution by Risk Level',
  dash_risk_breakdown_subtitle: (count) => `Based on ${count} active citizen reports`,
  dash_risk_high: 'High risk',
  dash_risk_medium: 'Medium risk',
  dash_risk_low: 'Low risk',
  dash_district_chart_title: 'Incidence by District',
  dash_predictive_title: 'AI Predictive Analytics',
  dash_predictive_text: 'Based on historical data and the current rainy season, a +18% increase in Dengue cases is estimated in Callería over the next 2 weeks. Activating preventive brigades is recommended.',

  alerts_title: 'AI-Generated Alerts',
  alerts_subtitle: 'Patterns automatically detected from citizen reports',

  perm_camera_title: '📷 Camera Permission Required',
  perm_camera_body: 'GuardianHealth AI needs access to your camera to analyze mosquito breeding sites and rapid lab tests.\n\nPlease go to Settings → Apps → GuardianHealth AI → Permissions → Camera and enable it.',
  perm_camera_retry: 'Request permission again',
  perm_camera_denied_title: 'Permission denied',
  perm_camera_denied_body: 'Without camera access, AI scanning is not possible. Enable it manually from system Settings.',

  alert_visit_validation: 'Please complete at least the patient name and community',
  alert_visit_saved_title: 'Saved locally',
  alert_visit_saved_body: 'The visit will be synced when connectivity is available.',
  alert_sync_no_pending_title: 'Nothing to sync',
  alert_sync_no_pending_body: 'All visits are already synchronized.',
  alert_symptom_validation: 'Please select at least one symptom',
  alert_campaign_title: '🤖 AI Preventive Campaign',
  alert_campaign_body: (disease, district) => `Do you want to send a preventive educational campaign about ${disease} targeting all citizens and community agents in the ${district} district?\n\nAI will adapt the message based on current symptoms reported in the area.`,
  alert_campaign_sent_title: '✅ Alert Sent',
  alert_campaign_sent_body: (disease, district, count) => `Preventive campaign for ${disease} launched with AI for ${district}. An alert notification has been sent to ${count} mobile devices in the area.`,

  map_layer_cases: 'Cases',
  map_layer_vectors: 'Breeding Sites',
  map_layer_prediction: 'Prediction',
  map_trend_up: 'Rising',
  map_trend_down: 'Falling',
  map_trend_stable: 'Stable',
  map_active_cases: 'Active cases',
  map_trend: 'Trend',
  map_population: 'Population',
  map_chart_title: 'Last 6 weeks trend',
  map_chart_peak: (max) => `Peak: ${max} cases`,
  map_chart_min: (min) => `Min: ${min} cases`,
  map_btn_campaign: 'Send AI Preventive Campaign',
  map_btn_expand: 'View full analysis',
  map_updated: (date) => `Updated: ${date}`,

  legend_title: 'Risk Level',
  legend_high: 'High',
  legend_medium: 'Medium',
  legend_low: 'Low',
  marker_cases: (cases, risk) => `${cases} active cases · Risk ${risk}`,
  marker_hint: 'Tap to view details →',
  risk_badge_high: 'High Risk',
  risk_badge_medium: 'Medium Risk',
  risk_badge_low: 'Low Risk',

  dl_modal_title: 'Offline Map',
  dl_modal_subtitle: 'Download tiles for Coronel Portillo, Ucayali to use the map offline in rural and jungle areas.',
  dl_modal_downloaded_on: (date) => `Downloaded on ${date}`,
  dl_modal_progress: (pct) => `${pct}% downloaded…`,
  dl_modal_success: 'Map saved successfully!',
  dl_modal_btn_clear: 'Clear cache',
  dl_modal_btn_downloading: 'Downloading…',
  dl_modal_btn_update: 'Update map',
  dl_modal_btn_download: 'Download now',
  dl_modal_btn_close: 'Done',
  offline_banner_ready: (date) => `Offline map ready · Updated: ${date}`,
  offline_banner_none: 'Live view · No offline data',
};

// ─────────────────────────────────────────────────────────────────────────────
// SHIPIBO-CONIBO
// ─────────────────────────────────────────────────────────────────────────────
const shp: AppTranslations = {
  lang_es: 'Español 🇪🇸',
  lang_en: 'English 🇺🇸',
  lang_shp: 'Shipibo 🪶',

  app_name: 'Guardian Salud AI',
  app_tagline: 'SaludConecta · Amazonia jemaon rao oninti shinan',

  cancel: 'Jinki',
  confirm: 'Tapan',
  yes: 'Jatibo',
  no: 'Yamake',
  save: 'Aksikwe',
  back: 'Jema',
  loading: 'Jinkian...',
  error: 'Katon',
  retry: 'Ementi',
  close: 'Kiti',
  send: 'Emeti',
  ok: 'Tapaki',

  role_select_prompt: '¿Jawe rol biton jokani?',
  role_citizen_title: 'Joni',
  role_citizen_desc: 'Min yoba jati tapankwe shinan oninti betan.',
  role_agent_title: 'Jema Agente',
  role_agent_desc: 'Médico visitas shinankwe, jema yamake bires.',
  role_authority_title: 'Autoridad / Analista',
  role_authority_desc: 'Mapa oninti shinan yoba jati, alertas oninti.',

  tab_home: 'Jema',
  tab_report: 'Tapankwe',
  tab_scanner: 'IA Escáner',
  tab_my_reports: 'Min Reportes',
  tab_new_visit: 'Visita Kena',
  tab_sync: 'Sincronizar',
  tab_dashboard: 'Dashboard',
  tab_risk_map: 'Riesgo Mapa',
  tab_alerts: 'Alertas',

  switch_role: 'Rol kawe',

  home_greeting: 'Kena 👋',
  home_subtitle: 'Guardian Salud AI min jema oninti',
  home_district_risk_label: 'Min distrito riesgo',
  home_risk_hint: 'Alerta josho. Patsa tsoa jorikin bicho betan 7 nete.',
  home_action_report_title: 'Yoba Tapankwe',
  home_action_report_desc: 'IA alerta raoninkanti',
  home_action_scanner_title: 'IA Escáner',
  home_action_scanner_desc: 'Foto bires oninti',
  home_last_report_label: (date) => `Min raonin tapon (${date})`,
  home_campaigns_section: '📢 Prevención Campaña Oninti',
  home_tips_section: '💡 Salud Shinan Amazonia',
  home_campaign_alert_type: 'Alerta',
  home_campaign_info_type: 'Informativo',
  home_campaign_directed: (district) => `📍 ${district} joniki:`,
  home_campaign1_title: 'Dengue Campaña',
  home_campaign1_text: 'Bicho jawen tsoa betan. Noa rao betan tapa tapankwe yowa.',
  home_campaign2_title: 'Vacunación Control',
  home_campaign2_text: 'Jema agentes jema nativa visitariti kena dosis betan. Min carnet tapankwe.',
  home_tip1: 'Mostirito jemaon betan kama ikibo, neti bicho bitan katakwe.',
  home_tip2: 'Llantas, baldes yoma jato jinki, poa empozarse katon.',
  home_tip3: 'Noa tsinotira o cloro betan tapankwe, EDA katakwe.',

  report_title: '¿Jawekeskataki min joiba?',
  report_subtitle: 'Min yoba jati wenebo tapani katakwe',
  report_symptom_fever: 'Patsa / Jonika 🌡️',
  report_symptom_diarrhea: 'Poi kene 🚽',
  report_symptom_cough: 'Osa 🗣️',
  report_symptom_vomiting: 'Xana 🤮',
  report_symptom_muscle_pain: 'Nami yoba 💪',
  report_symptom_headache: 'Mapo yoba 🧠',
  report_personal_data: 'Jonin Shinan (Opcional)',
  report_age: 'Baritia (años)',
  report_sex: 'Joni / Xanu',
  report_sex_male: 'Joni',
  report_sex_female: 'Xanu',
  report_location: 'Jema',
  report_district: 'Distrito',
  report_district_placeholder: 'Callería, Yarinacocha betan',
  report_community: 'Jema / Barrio',
  report_community_placeholder: 'San José betan',
  report_submit: 'IA Sino Reporte Emeti',
  report_modal_title: 'IA XAI Raoninti Shinan',
  report_modal_analysis_label: '🔍 IA shinan oninti:',
  report_modal_disclaimer: 'Jato oninti shinan riki. Joni rao oniyapabo manchati jinki. Rao yora wesoa katon, rao xoboain kawe.',
  report_modal_button: 'Tapaki, reportes ointi',

  my_reports_title: 'Min Reportes',
  my_reports_empty: 'Yamake reportes.',
  my_reports_patient_label: (age) => `Joni: ${age} baritia`,
  my_reports_symptoms_label: 'Wenebo:',
  my_reports_ai_analysis_title: '🔍 IA Shinan Oninti',

  scanner_title: 'IA Visión Escáner',
  scanner_subtitle: 'Foto tapankwe criadero betan tira reactiva IA oninti.',
  scanner_mode_vector: 'Noa Vector Criadero',
  scanner_mode_test: 'Tira Raoninti',
  scanner_viewport_vector_hint: 'Noa poa yoma betan apunta',
  scanner_viewport_test_hint: 'Tira reactiva encuadra',
  scanner_offline_note: 'IA offline oninti — internet yamake',
  scanner_btn_open: 'IA Kamera Tapa',
  scanner_btn_retake: 'Foto tapankwe',
  scanner_btn_rescan: 'Ementi Escanear',
  scanner_btn_clear: 'Escaneo kiti',
  scanner_analyzing: 'IA foto oninkain...',
  scanner_processing: 'Píxeles oninti localmente',
  scanner_confidence_label: (pct) => `IA confianza: ${pct}`,
  scanner_recommendation_label: 'Médico Shinan',
  scanner_disclaimer: 'IA oninti automático. Médico jinki yamake.',

  agent_home_title: 'Agente Panel',
  agent_home_subtitle: 'Jema epidemiológica vigilancia betan campo visitas',
  agent_stat_visited: 'Joni visitados',
  agent_stat_pending: 'Visitas offline subi boinke',
  agent_offline_banner: 'Modo Offline-First oninti. Visitas yamake cobertura tapankwe betan médico centro sincronizariti.',
  agent_critical_section: (count) => `⚠️ Seguimiento Crítico Joni (${count})`,
  agent_critical_pregnant: 'Xanu',
  agent_critical_empty: 'Yamake alertas xanu betan fiebre oninti localmente.',
  agent_tasks_section: '📋 Tareas Jema Pendientes',
  agent_task1: 'Vector control estanque jema (San José Sector)',
  agent_task2: 'Ficha familiar jema nativa Callería',
  agent_task3: 'Mosquiteros betan repelente local raoninti',
  agent_register_btn: 'Médico Visita Tapankwe',

  visit_title: 'Visita Tapankwe',
  visit_field_name: 'Joni jane',
  visit_field_community: 'Jema',
  visit_field_bp: 'Noa patsa tsikia',
  visit_field_glucose: 'Glucosa',
  visit_field_temperature: 'Patsa (°C)',
  visit_field_weight: 'Peso (kg)',
  visit_field_height: 'Talla (cm)',
  visit_field_pregnant: '¿Xanu betan?',
  visit_field_vaccines: '¿Vacunas tapakibo?',
  visit_save_btn: 'Visita localmente aksikwe',

  sync_title: 'Offline Sincronización',
  sync_subtitle: 'Visitas yamake cobertura tapankwe betan conexión binon subi.',
  sync_stat_pending: 'Subi pendientes',
  sync_stat_synced: 'Sincronizadabo',
  sync_stat_total: 'Total visitas',
  sync_btn_idle: (count) => count > 0 ? `${count} visita(s) sincronizar` : 'Jatibi sincronizado ✓',
  sync_btn_done: '¡Sincronización exitosa!',
  sync_btn_syncing: (count) => `${count} visita(s) subiain…`,
  sync_btn_retry: 'Sincronización ementi',
  sync_feedback_success: (count) => `¡${count} visita(s) servidor sincronizadabo!`,
  sync_feedback_error: 'Conexión katon. Min red tapankwe ementi.',
  sync_history_label: (count) => `Visitas historial (${count})`,
  sync_empty_title: 'Visitas yamake',
  sync_empty_subtitle: 'Agente Panel kanawe betan kena médico visita campo tapankwe.',
  sync_tag_pregnant: '🤰 Xanu',
  sync_tag_vaccines_ok: '💉 Vacunas tapakibo',
  sync_tag_vaccines_pending: '💉 Vacunas pendientes',
  sync_status_synced: '✓ Sincronizado',
  sync_status_pending: '⏳ Pendiente',

  dash_title: 'Análisis Centro',
  dash_subtitle: 'Tiempo real vigilancia epidemiológica · Ucayali',
  dash_kpi_reports: 'Joni reportes',
  dash_kpi_alert_districts: 'Distrito alertas',
  dash_kpi_monitored: 'Distritos monitoreados',
  dash_risk_breakdown_title: 'Riesgo Nivel Raoninti',
  dash_risk_breakdown_subtitle: (count) => `${count} joni reportes activos`,
  dash_risk_high: 'Alto riesgo',
  dash_risk_medium: 'Josho riesgo',
  dash_risk_low: 'Bajo riesgo',
  dash_district_chart_title: 'Distrito Incidencia',
  dash_predictive_title: 'IA Predictivo Analítica',
  dash_predictive_text: 'Historial datos betan lluvia temporada, Dengue casos +18% Callería 2 semanas. Brigadas preventivas activar boinke.',

  alerts_title: 'IA Alertas Raoninti',
  alerts_subtitle: 'Patrones automático joni reportes betan',

  perm_camera_title: '📷 Kamera Permiso Boinke',
  perm_camera_body: 'GuardianSalud AI kamera oninti boinke criaderos betan tira reactiva.\n\nConfiguración → Aplicaciones → GuardianSalud AI → Permisos → Cámara tapankwe.',
  perm_camera_retry: 'Permiso ementi',
  perm_camera_denied_title: 'Permiso yamake',
  perm_camera_denied_body: 'Kamera yamake escaneo IA yamake. Configuración manual tapankwe.',

  alert_visit_validation: 'Joni jane betan jema tapankwe',
  alert_visit_saved_title: 'Localmente aksikibo',
  alert_visit_saved_body: 'Visita conexión binon sincronizariti.',
  alert_sync_no_pending_title: 'Jatiki yamake',
  alert_sync_no_pending_body: 'Jatibi visitas synchronizadabo.',
  alert_symptom_validation: 'Wenebo katakwe',
  alert_campaign_title: 'Campaña Preventiva IA',
  alert_campaign_body: (disease, district) =>
    `¿Deseas enviar una alerta SMS/WhatsApp a todos los pobladores de ${district} informando sobre el aumento de casos de ${disease}?`,
  alert_campaign_sent_title: 'Campaña Enviada',
  alert_campaign_sent_body: (disease, district, count) =>
    `Se han enviado alertas de prevención de ${disease} a ${count} pobladores registrados en ${district}.`,

  map_layer_cases: 'Casos',
  map_layer_vectors: 'Criaderos',
  map_layer_prediction: 'Predicción',
  map_trend_up: 'Subiendo',
  map_trend_down: 'Bajando',
  map_trend_stable: 'Estable',
  map_active_cases: 'Casos activos',
  map_trend: 'Tendencia',
  map_population: 'Población',
  map_chart_title: 'Evolución últimas 6 semanas',
  map_chart_peak: (max) => `Pico: ${max} casos`,
  map_chart_min: (min) => `Mínimo: ${min} casos`,
  map_btn_campaign: 'Enviar Campaña Preventiva IA',
  map_btn_expand: 'Ver análisis completo',
  map_updated: (date) => `Actualizado: ${date}`,

  legend_title: 'Nivel de Riesgo',
  legend_high: 'Alto',
  legend_medium: 'Medio',
  legend_low: 'Bajo',
  marker_cases: (cases, risk) => `${cases} casos activos · Riesgo ${risk}`,
  marker_hint: 'Toca para ver detalles →',
  risk_badge_high: 'Riesgo alto',
  risk_badge_medium: 'Riesgo medio',
  risk_badge_low: 'Riesgo bajo',

  dl_modal_title: 'Mapa Offline',
  dl_modal_subtitle: 'Descarga los tiles de la región de Coronel Portillo, Ucayali para usar el mapa sin conexión a internet en zonas rurales y selva.',
  dl_modal_downloaded_on: (date) => `Descargado el ${date}`,
  dl_modal_progress: (pct) => `${pct}% descargado…`,
  dl_modal_success: '¡Mapa guardado exitosamente!',
  dl_modal_btn_clear: 'Borrar caché',
  dl_modal_btn_downloading: 'Descargando…',
  dl_modal_btn_update: 'Actualizar mapa',
  dl_modal_btn_download: 'Descargar ahora',
  dl_modal_btn_close: 'Listo',
  offline_banner_ready: (date) => `Mapa offline disponible · Actualizado: ${date}`,
  offline_banner_none: 'Visualización en tiempo real · Sin datos offline',
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY — add new languages here
// ─────────────────────────────────────────────────────────────────────────────
export const LANGUAGES: Record<LanguageType, AppTranslations> = { es, en, shp };

export const LANGUAGE_OPTIONS: { code: LanguageType; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'shp', label: 'Shipibo', flag: '🪶' },
];
