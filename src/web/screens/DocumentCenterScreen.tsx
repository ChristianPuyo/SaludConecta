/**
 * DocumentCenterScreen - Biblioteca digital de documentos y recursos de salud.
 * Permite buscar, filtrar por categoría (normativas, protocolos, reportes, estudios, manuales) y visualizar documentos.
 * Carga datos desde DocumentService y muestra metadatos como tipo de archivo, fecha y descargas.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, FilterBar, EmptyState, StatusBadge } from '../components/ReusableComponents';
import { SearchBar } from '../../components/SearchBar';
import { DocumentService } from '../../services/documentService';
import type { Document } from '../../models/document';

const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'regulation', label: 'Normativas' },
  { id: 'protocol', label: 'Protocolos' },
  { id: 'report', label: 'Reportes' },
  { id: 'study', label: 'Estudios' },
  { id: 'manual', label: 'Manuales' },
];

const categoryLabels: Record<string, string> = {
  regulation: 'Normativa', protocol: 'Protocolo', report: 'Reporte', study: 'Estudio', manual: 'Manual', policy: 'Política',
};

const fileTypeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  pdf: 'document', doc: 'document-text', xls: 'grid', csv: 'grid', ppt: 'easel',
};

export function DocumentCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [loading, setLoading] = useState(true);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      let result: Document[];
      if (search) {
        result = await DocumentService.search(search);
      } else if (activeCategory !== 'todos') {
        result = await DocumentService.getByCategory(activeCategory);
      } else {
        result = await DocumentService.getAll();
      }
      setDocuments(result);
    } catch { /* service handles internally */ }
    setLoading(false);
  }, [search, activeCategory]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const filtered = documents;

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={title || 'Centro de Documentos'} subtitle={subtitle || 'Biblioteca de documentos y recursos'} />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar documentos..." />

      <FilterBar filters={categories} active={activeCategory} onFilter={setActiveCategory} />

      {filtered.length === 0 && !loading ? (
        <EmptyState icon="folder-open" title="Sin documentos" subtitle="No se encontraron documentos con los filtros actuales" />
      ) : (
        <View style={styles.grid}>
          {filtered.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View style={styles.docIconBox}>
                  <Ionicons name={fileTypeIcons[doc.fileType] || 'document'} size={22} color={colors.primary} />
                </View>
                <StatusBadge label={categoryLabels[doc.category] || doc.category} status="info" />
              </View>
              <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
              <Text style={styles.docDesc} numberOfLines={2}>{doc.description}</Text>
              <View style={styles.docFooter}>
                <Text style={styles.docDate}>{doc.publishDate}</Text>
                <View style={styles.docDownloads}>
                  <Ionicons name="download" size={14} color={colors.textSecondary} />
                  <Text style={styles.docDownloadCount}>{doc.downloadCount}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  docCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: 280,
    gap: 8,
  },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  docTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  docDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  docFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  docDate: { fontSize: 12, color: colors.textSecondary },
  docDownloads: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docDownloadCount: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
});
