/**
 * Local storage persistence for Morrow
 *
 * This is a simple localStorage-based persistence layer for browser-local operation.
 * It can be replaced with a database implementation without rewriting UI components.
 */

import type { Idea, ContentItem, CreateIdeaInput, UpdateIdeaInput, CreateContentInput, UpdateContentInput } from "@/types";

const IDEAS_KEY = "morrow:ideas";
const CONTENT_KEY = "morrow:content";

export type LocalReadResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasDates(value: Record<string, unknown>): boolean {
  return [value.createdAt, value.updatedAt].every(
    (date) => typeof date === "string" && !Number.isNaN(Date.parse(date))
  );
}

function isIdea(value: unknown): value is Idea {
  return isRecord(value) && typeof value.id === "string" && !!value.id &&
    typeof value.text === "string" && hasDates(value) &&
    typeof value.status === "string" && ["active", "developed", "archived"].includes(value.status);
}

function isContent(value: unknown): value is ContentItem {
  return isRecord(value) && typeof value.id === "string" && !!value.id &&
    typeof value.title === "string" && typeof value.body === "string" &&
    hasDates(value) && typeof value.status === "string" && ["draft", "ready", "published"].includes(value.status) &&
    [null, "x", "linkedin", "whatsapp-status"].includes(value.platform as string | null) &&
    (value.sourceIdeaId === null || typeof value.sourceIdeaId === "string");
}

function readCollection<T>(key: string, validate: (value: unknown) => value is T): LocalReadResult<T[]> {
  try {
    if (typeof window === "undefined") {
      return { ok: false, error: "Browser storage is unavailable. Try again in your browser." };
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { ok: true, data: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(validate)) {
      return { ok: false, error: "Saved work could not be read. Your stored data has been kept unchanged." };
    }
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: "Could not read saved work. Browser storage may be blocked or contain unreadable data. Try again; your stored data has been kept unchanged." };
  }
}

/** Unlike legacy list helpers, these distinguish a load failure from an empty workspace. */
export function readIdeas(): LocalReadResult<Idea[]> {
  return readCollection(IDEAS_KEY, isIdea);
}

export function readContentItems(): LocalReadResult<ContentItem[]> {
  return readCollection(CONTENT_KEY, isContent);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function requireRead<T>(result: LocalReadResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

function writeCollection<T>(key: string, records: T[]) {
  try {
    if (typeof window === "undefined") throw new Error("No browser storage");
    window.localStorage.setItem(key, JSON.stringify(records));
  } catch {
    throw new Error("Could not save to browser storage. Keep or copy your work, then try again. Storage may be full or blocked.");
  }
}

// Ideas

export function getIdeas(): Idea[] {
  return requireRead(readIdeas());
}

export function getIdea(id: string): Idea | null {
  const ideas = getIdeas();
  return ideas.find((idea) => idea.id === id) || null;
}

export function createIdea(input: CreateIdeaInput): Idea {
  if (!input.text.trim()) throw new Error("Write a thought before saving.");
  // Never overwrite unreadable data with a fresh array after a failed read.
  const existing = readIdeas();
  if (!existing.ok) throw new Error(existing.error);
  const now = new Date().toISOString();
  const idea: Idea = {
    id: generateId(),
    text: input.text,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const ideas = [idea, ...existing.data];
  writeCollection(IDEAS_KEY, ideas);

  return idea;
}

export function updateIdea(id: string, input: UpdateIdeaInput): Idea | null {
  const ideas = getIdeas();
  const index = ideas.findIndex((idea) => idea.id === id);

  if (index === -1) return null;

  const updated: Idea = {
    ...ideas[index],
    text: input.text !== undefined ? input.text : ideas[index].text,
    status: input.status !== undefined ? input.status : ideas[index].status,
    updatedAt: new Date().toISOString(),
  };
  if (!isIdea(updated) || !updated.text.trim()) throw new Error("An idea needs valid text and status before saving.");
  if (updated.text === ideas[index].text && updated.status === ideas[index].status) return ideas[index];

  ideas[index] = updated;
  writeCollection(IDEAS_KEY, ideas);

  return updated;
}

export function deleteIdea(id: string): boolean {
  const ideas = getIdeas();
  const filtered = ideas.filter((idea) => idea.id !== id);

  if (filtered.length === ideas.length) return false;

  writeCollection(IDEAS_KEY, filtered);
  return true;
}

// Content

export function getContentItems(): ContentItem[] {
  return requireRead(readContentItems());
}

export function getContentItem(id: string): ContentItem | null {
  const items = getContentItems();
  return items.find((item) => item.id === id) || null;
}

export function getContentBySourceIdea(ideaId: string): ContentItem[] {
  const items = getContentItems();
  return items.filter((item) => item.sourceIdeaId === ideaId);
}

export function createContent(input: CreateContentInput): ContentItem {
  const items = getContentItems();
  const now = new Date().toISOString();
  const content: ContentItem = {
    id: generateId(),
    title: input.title,
    body: input.body,
    platform: input.platform || null,
    status: "draft",
    sourceIdeaId: input.sourceIdeaId || null,
    createdAt: now,
    updatedAt: now,
  };

  if (!isContent(content)) throw new Error("The draft could not be saved because its fields are invalid.");
  writeCollection(CONTENT_KEY, [content, ...items]);

  return content;
}

export function updateContent(id: string, input: UpdateContentInput): ContentItem | null {
  const items = getContentItems();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const updated: ContentItem = {
    ...items[index],
    title: input.title !== undefined ? input.title : items[index].title,
    body: input.body !== undefined ? input.body : items[index].body,
    platform: input.platform !== undefined ? input.platform : items[index].platform,
    status: input.status !== undefined ? input.status : items[index].status,
    updatedAt: new Date().toISOString(),
  };
  if (!isContent(updated)) throw new Error("The draft could not be saved because its fields are invalid.");
  const previous = items[index];
  if (updated.title === previous.title && updated.body === previous.body &&
      updated.platform === previous.platform && updated.status === previous.status) return previous;

  items[index] = updated;
  writeCollection(CONTENT_KEY, items);

  return updated;
}

export function deleteContent(id: string): boolean {
  const items = getContentItems();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) return false;

  writeCollection(CONTENT_KEY, filtered);
  return true;
}
