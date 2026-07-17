/**
 * Document - Define las interfaces y tipos para la gestión de documentos.
 * Incluye las entidades de documento y colecciones documentales.
 */
export type DocumentCategory = 'regulation' | 'protocol' | 'report' | 'study' | 'manual' | 'policy' | 'statistics';
export type DocumentAccess = 'public' | 'restricted' | 'confidential';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: DocumentCategory;
  access: DocumentAccess;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'csv';
  fileSize: number;
  author: string;
  publisher: string;
  publishDate: string;
  version: string;
  tags: string[];
  downloadCount: number;
  relatedDocuments: string[];
}

export interface DocumentCollection {
  id: string;
  name: string;
  description: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}
