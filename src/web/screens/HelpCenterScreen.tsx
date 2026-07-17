/**
 * HelpCenterScreen - Centro de ayuda con preguntas frecuentes, creación de tickets de soporte e información de contacto.
 * Ofrece búsqueda en FAQs, formulario de nuevo ticket por categoría y listado de tickets del usuario.
 * Carga datos desde SupportService y permite la autogestión de incidencias.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, StatusBadge, EmptyState } from '../components/ReusableComponents';
import { SearchBar } from '../../components/SearchBar';
import { SupportService } from '../../services/communityService';
import type { SupportTicket } from '../../models/community';

const faqs = [
  { q: '¿Cómo reporto síntomas?', a: 'Ve a la sección Reportar Síntomas, selecciona tus síntomas y envía el reporte. Recibirás recomendaciones automáticas basadas en tus síntomas.', category: 'reportes' },
  { q: '¿Cómo encuentro un centro de salud?', a: 'Usa la sección Directorio de Centros de Salud para encontrar el centro más cercano. Puedes filtrar por tipo de servicio y distrito.', category: 'centros' },
  { q: '¿Cómo funciona el chat de salud?', a: 'El chat te permite hacer preguntas sobre síntomas y recibir respuestas automáticas. También puedes contactar a profesionales de salud.', category: 'chat' },
  { q: '¿Cómo se calcula mi nivel de riesgo?', a: 'El nivel de riesgo se calcula basado en la cantidad y tipo de síntomas reportados, así como datos epidemiológicos de tu zona.', category: 'reportes' },
  { q: '¿Cómo puedo ver mi historial médico?', a: 'En la sección Historial Médico puedes ver todos tus reportes anteriores, diagnósticos y recomendaciones.', category: 'cuenta' },
  { q: '¿Cómo configuro mis notificaciones?', a: 'Ve a Configuración > Notificaciones para activar o desactivar notificaciones Push, Email y SMS según tu preferencia.', category: 'cuenta' },
];

const ticketCategories = [
  { id: 'technical', label: 'Técnico' },
  { id: 'medical', label: 'Médico' },
  { id: 'account', label: 'Cuenta' },
  { id: 'other', label: 'Otro' },
];

export function HelpCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [showForm, setShowForm] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      const result = await SupportService.getTickets();
      setTickets(result);
    } catch { /* service handles internally */ }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitTicket = useCallback(async () => {
    if (!subject.trim() || !description.trim()) return;
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      userId: 'current',
      subject: subject.trim(),
      description: description.trim(),
      category: ticketCategory as SupportTicket['category'],
      status: 'open',
      priority: 'medium',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await SupportService.saveTicket(ticket);
    setTickets(prev => [ticket, ...prev]);
    setSubject('');
    setDescription('');
    setShowForm(false);
  }, [subject, description, ticketCategory]);

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={title || 'Centro de Ayuda'} subtitle={subtitle || 'Preguntas frecuentes y soporte'} />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar preguntas frecuentes..." />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        {filteredFaqs.length === 0 ? (
          <EmptyState icon="search" title="Sin resultados" subtitle="No se encontraron preguntas con ese término" />
        ) : (
          <View style={styles.faqList}>
            {filteredFaqs.map((faq, i) => (
              <Pressable
                key={i}
                style={[styles.faqItem, expandedFaq === String(i) && styles.faqItemExpanded]}
                onPress={() => setExpandedFaq(expandedFaq === String(i) ? null : String(i))}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <Ionicons name={expandedFaq === String(i) ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
                </View>
                {expandedFaq === String(i) && <Text style={styles.faqAnswer}>{faq.a}</Text>}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tickets de Soporte</Text>
          <Pressable style={styles.newTicketBtn} onPress={() => setShowForm(!showForm)}>
            <Ionicons name={showForm ? 'close' : 'add'} size={18} color="#fff" />
            <Text style={styles.newTicketBtnText}>{showForm ? 'Cerrar' : 'Nuevo Ticket'}</Text>
          </Pressable>
        </View>

        {showForm && (
          <View style={styles.ticketForm}>
            <TextInput style={styles.ticketInput} placeholder="Asunto" placeholderTextColor={colors.textSecondary} value={subject} onChangeText={setSubject} />
            <View style={styles.categoryRow}>
              {ticketCategories.map(c => (
                <Pressable
                  key={c.id}
                  style={[styles.categoryChip, ticketCategory === c.id && styles.categoryChipActive]}
                  onPress={() => setTicketCategory(c.id)}
                >
                  <Text style={[styles.categoryChipText, ticketCategory === c.id && styles.categoryChipTextActive]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              style={[styles.ticketInput, styles.ticketTextArea]}
              placeholder="Describe tu problema..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Pressable style={styles.submitBtn} onPress={handleSubmitTicket}>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Enviar Ticket</Text>
            </Pressable>
          </View>
        )}

        {tickets.length > 0 && (
          <View style={styles.ticketList}>
            {tickets.map(t => (
              <View key={t.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketSubject}>{t.subject}</Text>
                  <StatusBadge
                    label={t.status === 'open' ? 'Abierto' : t.status === 'in_progress' ? 'En Progreso' : t.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                    status={t.status === 'open' ? 'warning' : t.status === 'in_progress' ? 'info' : t.status === 'resolved' ? 'success' : 'neutral'}
                  />
                </View>
                <Text style={styles.ticketDesc} numberOfLines={2}>{t.description}</Text>
                <Text style={styles.ticketDate}>{new Date(t.createdAt).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={18} color={colors.primary} />
            <Text style={styles.contactText}>0800-123-456</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={18} color={colors.primary} />
            <Text style={styles.contactText}>soporte@saludconecta.pe</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="globe" size={18} color={colors.primary} />
            <Text style={styles.contactText}>www.saludconecta.pe/ayuda</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  faqList: { gap: 8 },
  faqItem: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16 },
  faqItemExpanded: { borderColor: colors.primary },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 13, color: colors.textSecondary, marginTop: 10, lineHeight: 20 },
  newTicketBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  newTicketBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  ticketForm: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 12, marginBottom: 16 },
  ticketInput: { fontSize: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12 },
  ticketTextArea: { minHeight: 100, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  categoryChipTextActive: { color: '#fff' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12 },
  submitBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  ticketList: { gap: 8 },
  ticketCard: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketSubject: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  ticketDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  ticketDate: { fontSize: 12, color: colors.textSecondary },
  contactCard: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 14 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactText: { fontSize: 14, color: colors.textPrimary },
});
