import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';

type InfoType = 'system' | 'citizen' | 'agent' | 'authority';

const INFO_DETAILS: Record<InfoType, { title: string; subtitle: string; icon: string; description: string; highlights: string[] }> = {
  system: {
    title: 'Sobre Guardian Salud AI',
    subtitle: 'Vigilancia Epidemiológica Inteligente',
    icon: 'shield-checkmark-outline',
    description: 'Es una plataforma integral de salud pública y vigilancia epidemiológica diseñada para la Amazonía Peruana. Permite el reporte oportuno de síntomas, el monitoreo territorial de agentes comunitarios y el análisis de brotes de dengue, malaria y leptospirosis para evitar epidemias en la región Ucayali.',
    highlights: [
      'Detección temprana: Analiza reportes ciudadanos para alertar sobre posibles brotes antes de que se propaguen de forma masiva.',
      'Operación offline: Diseñado específicamente para funcionar sin señal de internet en comunidades rurales a lo largo de los ríos.',
      'Clasificación inteligente: Evalúa la combinación de síntomas mediante algoritmos locales de riesgo para orientar al ciudadano.',
      'Campañas preventivas: Genera automáticamente alertas de concientización basadas en los distritos con mayor incidencia.'
    ]
  },
  citizen: {
    title: 'Rol: Ciudadano',
    subtitle: 'El guardián de su propia salud',
    icon: 'person-outline',
    description: 'El módulo del ciudadano es una herramienta ágil y accesible para que las familias de Ucayali reporten su estado de salud de forma preventiva, conozcan su nivel de riesgo y reciban recomendaciones médicas oportunas.',
    highlights: [
      'Reporte rápido de síntomas: Permite registrar de forma guiada fiebre, diarrea, tos, vómitos, dolor de cabeza y muscular en pocos segundos.',
      'Clasificación de riesgo inmediata: Evalúa los síntomas seleccionados y asigna un nivel de riesgo (Bajo, Medio, Alto) explicando la lógica aplicada.',
      'Historial de reportes: Permite hacer un seguimiento continuo de reportes anteriores para observar la evolución clínica del usuario.',
      'Monitoreo del distrito: Muestra información actualizada sobre el estado epidemiológico de tu localidad (como Callería o Manantay).'
    ]
  },
  agent: {
    title: 'Rol: Agente Comunitario',
    subtitle: 'Nexo de salud en comunidades remotas',
    icon: 'medkit-outline',
    description: 'El módulo de agente comunitario permite al personal sanitario de campo registrar las fichas de visitas domiciliarias en zonas de difícil acceso y sin cobertura móvil, facilitando el censo y el control de salud familiar.',
    highlights: [
      'Ficha médica offline: Registra peso, talla, temperatura, presión arterial, niveles de glucosa y estado de vacunación de cada paciente.',
      'Almacenamiento local seguro: Guarda de forma persistente todas las visitas en la memoria interna para evitar pérdidas de información en el campo.',
      'Sincronización en un clic: Al regresar a un centro urbano con internet, carga en lote toda la información recopilada al sistema central.',
      'Seguimiento familiar continuo: Facilita el monitoreo de niños en crecimiento, gestantes y personas con patologías crónicas.'
    ]
  },
  authority: {
    title: 'Rol: Autoridad / Analista',
    subtitle: 'Decisiones inteligentes basadas en datos',
    icon: 'bar-chart-outline',
    description: 'La plataforma de análisis sanitario está reservada para el personal médico, epidemiólogos, DIRESA y MINSA. Proporciona herramientas avanzadas de análisis y visualización de datos en tiempo real para planificar intervenciones de salud eficaces.',
    highlights: [
      'Centro de control (KPIs): Monitorea la cantidad total de reportes recibidos, alertas activas y la evolución epidemiológica semanal.',
      'Mapas de riesgo geoespacial: Visualiza a través de un mapa a color las zonas calientes y comunidades con mayor concentración de contagios.',
      'Alertas automatizadas por IA: Agrupa y analiza reportes de un mismo barrio, disparando alarmas de brotes de dengue de manera temprana.',
      'Analítica predictiva de brotes: Emplea históricos estacionales para anticipar probabilidades de brote en distritos específicos de Ucayali.'
    ]
  }
};

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const [activeInfo, setActiveInfo] = useState<InfoType | null>(null);

  const openInfo = (type: InfoType) => {
    setActiveInfo(type);
  };

  const closeInfo = () => {
    setActiveInfo(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.splitLayout}>
        
        {/* ================= MITAD IZQUIERDA: IMAGEN E INFORMACIÓN ================= */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop' }}
          style={styles.leftPane}
          resizeMode="cover"
        >
          {/* Overlay oscuro para lectura legible */}
          <View style={styles.leftOverlay} />
          
          <View style={styles.leftContent}>
            <View style={styles.brandTitleWrap}>
              <View style={styles.logoBadge}>
                <Ionicons name="medical" size={26} color="#fff" />
              </View>
              <Text style={styles.leftAppName}>Guardian Salud AI</Text>
            </View>
            
            <Text style={styles.leftTagline}>SaludConecta · Ucayali</Text>
            
            <View style={styles.appDescriptionContainer}>
              <Text style={styles.leftDescription}>
                Sistema inteligente y predictivo de vigilancia epidemiológica para la Amazonía Peruana. 
              </Text>
              <Text style={styles.leftSubDescription}>
                Monitorea en tiempo real brotes de enfermedades endémicas (Dengue, Malaria, Leptospirosis) mediante el registro offline de agentes comunitarios y la participación activa de los ciudadanos.
              </Text>
            </View>
            
            {/* Ubicación */}
            <View style={styles.locationWrap}>
              <Ionicons name="location-sharp" size={18} color={colors.secondary} />
              <Text style={styles.locationText}>Región Ucayali, Perú</Text>
            </View>
          </View>
        </ImageBackground>

        {/* ================= MITAD DERECHA: OPCIONES DE ACCESO ================= */}
        <View style={styles.rightPane}>
          <ScrollView 
            contentContainerStyle={styles.rightScrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.rightHeaderWrap}>
              <Text style={styles.optionsPrompt}>Selecciona tu Acceso</Text>
              <Text style={styles.optionsSubtitle}>Elige tu rol correspondiente para ingresar al sistema:</Text>
            </View>

            <View style={styles.optionsList}>
              {ROLE_OPTIONS.map((option) => (
                <View key={option.id} style={styles.cardContainer}>
                  <Pressable style={styles.card} onPress={() => selectRole(option.id)}>
                    <View style={styles.iconWrap}>
                      <Ionicons name={option.icon as any} size={22} color={colors.primary} />
                    </View>
                    <View style={styles.cardTextWrap}>
                      <Text style={styles.cardTitle}>{option.title}</Text>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {option.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} style={styles.chevron} />
                  </Pressable>
                  
                  {/* Botón Info individual */}
                  <Pressable 
                    style={styles.cardInfoButton} 
                    onPress={() => openInfo(option.id as InfoType)} 
                    hitSlop={8}
                  >
                    <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Botón de información general abajo a la derecha */}
            <Pressable 
              style={styles.infoSystemButton} 
              onPress={() => openInfo('system')}
              hitSlop={12}
            >
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.infoSystemText}>Saber más sobre el sistema</Text>
            </Pressable>
          </ScrollView>
        </View>

      </View>

      {/* Modal de Información de las Herramientas */}
      <Modal
        visible={activeInfo !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInfo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeInfo && (
              <ScrollView 
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <View style={styles.modalIconWrap}>
                    <Ionicons name={INFO_DETAILS[activeInfo].icon as any} size={30} color={colors.primary} />
                  </View>
                  <View style={styles.modalHeaderTitle}>
                    <Text style={styles.modalTitle}>{INFO_DETAILS[activeInfo].title}</Text>
                    <Text style={styles.modalSubtitle}>{INFO_DETAILS[activeInfo].subtitle}</Text>
                  </View>
                  <Pressable onPress={closeInfo} hitSlop={8} style={styles.modalCloseIcon}>
                    <Ionicons name="close" size={28} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <Text style={styles.modalDescription}>{INFO_DETAILS[activeInfo].description}</Text>

                <Text style={styles.highlightsTitle}>Características clave y funciones:</Text>
                <View style={styles.highlightsWrap}>
                  {INFO_DETAILS[activeInfo].highlights.map((highlight, index) => (
                    <View key={index} style={styles.highlightRow}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.checkIcon} />
                      <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                  ))}
                </View>

                <Pressable style={styles.closeButton} onPress={closeInfo}>
                  <Text style={styles.closeButtonText}>Entendido</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  
  // Layout dividido 50/50 horizontalmente
  splitLayout: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },

  // ================= ESTILOS MITAD IZQUIERDA =================
  leftPane: {
    flex: 1.15, // Un poco más de espacio para la descripción
    height: '100%',
    justifyContent: 'center',
    padding: 32, // Padding aumentado
    position: 'relative',
  },
  leftOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 4, 94, 0.82)', 
  },
  leftContent: {
    zIndex: 1,
    gap: 16,
  },
  brandTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoBadge: {
    width: 48, // Aumentado de 40
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  leftAppName: {
    fontSize: 26, // Aumentado de 22
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  leftTagline: {
    fontSize: 15, // Aumentado de 13
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  appDescriptionContainer: {
    gap: 10,
    marginTop: 8,
  },
  leftDescription: {
    fontSize: 18, // Aumentado de 15
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26, // Aumentado de 22
  },
  leftSubDescription: {
    fontSize: 13, // Aumentado de 11
    color: '#E2E8F0',
    lineHeight: 20, // Aumentado de 17
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  locationText: {
    color: '#E0F2FE',
    fontSize: 14, // Aumentado de 12
    fontWeight: '600',
  },

  // ================= ESTILOS MITAD DERECHA =================
  rightPane: {
    flex: 0.85, 
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  rightScrollContent: {
    flexGrow: 1,
    padding: 24, // Aumentado de 20
    justifyContent: 'center',
    gap: 24,
  },
  rightHeaderWrap: {
    gap: 6,
  },
  optionsPrompt: {
    fontSize: 22, // Aumentado de 18
    fontWeight: '800',
    color: colors.primaryDark,
  },
  optionsSubtitle: {
    fontSize: 13, // Aumentado de 11
    color: colors.textSecondary,
    lineHeight: 18,
  },
  optionsList: {
    gap: 16, // Aumentado de 12
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 16, // Aumentado de 12
    padding: 16, // Aumentado de 12
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80, // Aumentado de 64
  },
  iconWrap: {
    width: 44, // Aumentado de 36
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16, // Aumentado de 13
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 11, // Aumentado de 9
    color: colors.textSecondary,
    lineHeight: 15,
  },
  chevron: {
    marginLeft: 4,
  },
  cardInfoButton: {
    width: 44, // Aumentado de 36
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoSystemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
  },
  infoSystemText: {
    color: colors.primary,
    fontSize: 13, // Aumentado de 11
    fontWeight: '700',
  },

  // ================= ESTILOS DEL MODAL =================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Reducido para dar más espacio interno
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%', // Límite para pantallas pequeñas
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalScrollContent: {
    gap: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22, // Aumentado de 18
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14, // Aumentado de 12
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalCloseIcon: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 15, // Aumentado de 14
    color: colors.textPrimary,
    lineHeight: 22, // Aumentado de 20
  },
  highlightsTitle: {
    fontSize: 15, // Aumentado de 14
    fontWeight: '700',
    color: colors.textPrimary,
  },
  highlightsWrap: {
    gap: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    fontSize: 14, // Aumentado de 13
    color: colors.textSecondary,
    lineHeight: 20, // Aumentado de 18
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16, // Aumentado de 15
  },
});
