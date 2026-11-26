/**
 * Core data types for Morrow
 */

export type IdeaStatus = "active" | "developed" | "archived";

export interface Idea {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  status: IdeaStatus;
}

export type ContentStatus = "draft" | "ready" | "published";
export type ContentPlatform = "x" | "linkedin" | "whatsapp-status" | null;

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  platform: ContentPlatform;
  status: ContentStatus;
  sourceIdeaId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaInput {
  text: string;
}

export interface UpdateIdeaInput {
  text?: string;
  status?: IdeaStatus;
}

export interface CreateContentInput {
  title: string;
  body: string;
  platform?: ContentPlatform;
  sourceIdeaId?: string | null;
}

export interface UpdateContentInput {
  title?: string;
  body?: string;
  platform?: ContentPlatform;
  status?: ContentStatus;
}
