export interface Document {
  id: string;
  title: string;
  content: any;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  lastEditedBy: string;
  lastEditedAt: Date;
  collaborators: Collaborator[];
  permissions: Permission[];
}

export interface Collaborator {
  userId: string;
  username: string;
  joinedAt: Date;
}

export interface Permission {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  grantedAt: Date;
}

export interface DocumentChange {
  id: string;
  documentId: string;
  userId: string;
  changes: any;
  timestamp: Date;
}

export interface CreateDocumentDto {
  title: string;
  content?: any;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: any;
  lastEditedBy?: string;
}