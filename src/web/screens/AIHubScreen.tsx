/**
 * AIHubScreen - Hub de inteligencia artificial con asistente virtual, análisis predictivo y herramientas de soporte diagnóstico.
 * Ofrece interacción conversacional y recomendaciones basadas en modelos de IA.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { ChatService } from '../../services/chatService';
import type { ChatMessage } from '../../models/chat';
import { PageHeader, SectionGrid, ResourceCard } from '../components/ReusableComponents';

const QUICK_ACTIONS = [
  { id: 'chat', icon: 'chatbubbles' as const, label: 'Chat IA', desc: 'Consulta tus dudas de salud', color: colors.primary },
  { id: 'recommendations', icon: 'bulb' as const, label: 'Recomendaciones', desc: 'Basadas en tu perfil', color: colors.secondary },
  { id: 'predictions', icon: 'analytics' as const, label: 'Predicciones', desc: 'Análisis predictivo de salud', color: colors.warning },
  { id: 'symptoms', icon: 'pulse' as const, label: 'Análisis de Síntomas', desc: 'Evalúa tus síntomas', color: colors.danger },
];

const MOCK_RECOMMENDATIONS = [
  { id: '1', title: 'Mantente hidratado', description: 'Bebe al menos 8 vasos de agua al día para mantener una buena salud.', icon: 'water' as const },
  { id: '2', title: 'Actividad física regular', description: 'Realiza al menos 30 minutos de ejercicio moderado al día.', icon: 'fitness' as const },
  { id: '3', title: 'Vacunación al día', description: 'Revisa tu calendario de vacunación y completa las dosis pendientes.', icon: 'shield-checkmark' as const },
  { id: '4', title: 'Alimentación balanceada', description: 'Incorpora frutas, verduras y proteínas en tu dieta diaria.', icon: 'nutrition' as const },
];

export function AIHubScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [messages] = useState<ChatMessage[]>([
    ChatService.createBotMessage('¡Hola! Soy el asistente de salud de Guardian Salud AI. Puedo ayudarte con información sobre síntomas, prevención y más.'),
    ChatService.createUserMessage('¿Qué es el dengue?'),
    ChatService.createBotMessage('El dengue se transmite por el mosquito Aedes aegypti. Los síntomas incluyen fiebre alta, dolor muscular y detrás de los ojos. Ante estos síntomas, acude al centro de salud. No te automediques.'),
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro de IA'} subtitle={subtitle || 'Asistente inteligente de salud'} />

      <SectionGrid title="Acciones Rápidas">
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable key={action.id} style={[styles.quickCard, { borderLeftColor: action.color }]}>
              <View style={[styles.quickIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickDesc}>{action.desc}</Text>
            </Pressable>
          ))}
        </View>
      </SectionGrid>

      <SectionGrid title="Chat IA - Últimos Mensajes">
        <View style={styles.chatPreview}>
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.chatBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              {msg.sender === 'bot' ? (
                <View style={styles.botAvatar}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                </View>
              ) : null}
              <View style={styles.bubbleContent}>
                <Text style={[styles.bubbleText, msg.sender === 'user' && styles.userText]}>{msg.text}</Text>
              </View>
            </View>
          ))}
          <Pressable style={styles.chatBtn} onPress={() => {}}>
            <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
            <Text style={styles.chatBtnText}>Abrir Chat Completo</Text>
          </Pressable>
        </View>
      </SectionGrid>

      <SectionGrid title="Recomendaciones Personalizadas">
        <View style={styles.recommendationsGrid}>
          {MOCK_RECOMMENDATIONS.map((rec) => (
            <ResourceCard key={rec.id} title={rec.title} description={rec.description} icon={rec.icon} />
          ))}
        </View>
      </SectionGrid>

      <SectionGrid title="Sobre Guardian Salud AI">
        <View style={styles.infoCard}>
          <Ionicons name="sparkles" size={24} color={colors.primary} />
          <Text style={styles.infoTitle}>Impulsado por Gemini</Text>
          <Text style={styles.infoDesc}>
            Utilizamos inteligencia artificial avanzada para proporcionar información de salud precisa y 
            recomendaciones personalizadas basadas en tu perfil y necesidades específicas.
          </Text>
        </View>
      </SectionGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border, borderLeftWidth: 3,
    width: '47%', gap: 6,
  },
  quickIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  quickDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 14 },
  chatPreview: { gap: 8 },
  chatBubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  userBubble: { justifyContent: 'flex-end' },
  botBubble: { justifyContent: 'flex-start' },
  botAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  bubbleContent: {
    maxWidth: '85%', borderRadius: 14, padding: 10,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  bubbleText: { fontSize: 13, color: colors.textPrimary, lineHeight: 18 },
  userText: { color: '#fff' },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, marginTop: 4,
  },
  chatBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  recommendationsGrid: { gap: 10 },
  infoCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 8,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  infoDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
