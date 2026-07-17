import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from '../../models/chat';
import { ChatService } from '../../services/chatService';
import { colors } from '../../theme/colors';
import { formatTime } from '../../utils/date';

export function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    ChatService.createBotMessage('¡Hola! Soy el asistente de salud de Guardian Salud AI. Puedo ayudarte con información sobre síntomas, prevención, centros de salud, vacunas y más. ¿En qué puedo ayudarte?'),
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = ChatService.createUserMessage(text);
    const botMsg = ChatService.createBotMessage(ChatService.findAnswer(text));

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const suggestions = ['¿Qué es el dengue?', '¿Dónde vacunarme?', 'Síntomas de COVID', 'Primeros auxilios', '¿Qué hago si tengo fiebre?', 'Centro de salud cerca'];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <FlatList
        ref={flatListRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.botRow]}>
            {item.sender === 'bot' && (
              <View style={styles.botAvatar}>
                <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
              </View>
            )}
            <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.bubbleText, item.sender === 'user' && styles.userBubbleText]}>{item.text}</Text>
              <Text style={[styles.time, item.sender === 'user' ? styles.userTime : styles.botTime]}>{formatTime(item.timestamp)}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          messages.length === 1 ? (
            <View style={styles.suggestionsWrap}>
              <Text style={styles.suggestionsTitle}>Preguntas frecuentes</Text>
              <View style={styles.suggestionsGrid}>
                {suggestions.map((s) => (
                  <Pressable key={s} style={styles.suggestionChip} onPress={() => { setInput(s); }}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <Pressable style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!input.trim()}>
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start', gap: 8 },
  botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  time: { fontSize: 10, marginTop: 4 },
  userTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  botTime: { color: colors.textSecondary },
  suggestionsWrap: { marginBottom: 16 },
  suggestionsTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  suggestionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  suggestionText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  textInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, backgroundColor: colors.background, color: colors.textPrimary, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
