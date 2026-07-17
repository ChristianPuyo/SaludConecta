/**
 * DocumentService - Servicio que gestiona documentos y colecciones documentales.
 * Proporciona métodos CRUD, búsqueda por texto y categoría, y conteo de descargas.
 * Utiliza AsyncStorage para persistencia local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Document, DocumentCollection } from '../models/document';

const DOCUMENTS_KEY = '@saludconecta/documents';
const COLLECTIONS_KEY = '@saludconecta/document_collections';

export const DocumentService = {
  async getAll(): Promise<Document[]> {
    const raw = await AsyncStorage.getItem(DOCUMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async getById(id: string): Promise<Document | undefined> {
    const list = await this.getAll();
    return list.find(d => d.id === id);
  },

  async save(doc: Document): Promise<void> {
    const list = await this.getAll();
    const idx = list.findIndex(d => d.id === doc.id);
    if (idx >= 0) list[idx] = doc;
    else list.push(doc);
    await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(list));
  },

  async delete(id: string): Promise<void> {
    const list = await this.getAll();
    await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(list.filter(d => d.id !== id)));
  },

  async getByCategory(category: string): Promise<Document[]> {
    const list = await this.getAll();
    return list.filter(d => d.category === category);
  },

  async search(query: string): Promise<Document[]> {
    const list = await this.getAll();
    const q = query.toLowerCase();
    return list.filter(d => d.title.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)));
  },

  async incrementDownload(id: string): Promise<void> {
    const doc = await this.getById(id);
    if (doc) {
      doc.downloadCount++;
      await this.save(doc);
    }
  },
};

export const DocumentCollectionService = {
  async getAll(): Promise<DocumentCollection[]> {
    const raw = await AsyncStorage.getItem(COLLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async save(collection: DocumentCollection): Promise<void> {
    const list = await this.getAll();
    const idx = list.findIndex(c => c.id === collection.id);
    if (idx >= 0) list[idx] = collection;
    else list.push(collection);
    await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(list));
  },
};
