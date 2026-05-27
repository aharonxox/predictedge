import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Store {
  knowledge: KnowledgeItem[];
  categories: Category[];
}

const DATA_PATH = path.join(process.cwd(), "data", "store.json");

const DEFAULT_CATEGORIES: Category[] = [
  { id: "links", name: "Links & URLs", description: "Web links, bookmarks, and URLs", color: "#6366f1" },
  { id: "passwords", name: "Passwords & Credentials", description: "Login info and access credentials", color: "#ef4444" },
  { id: "ideas", name: "Ideas & Thoughts", description: "Creative ideas and brainstorming", color: "#f59e0b" },
  { id: "tasks", name: "Tasks & To-Do", description: "Things to do and action items", color: "#10b981" },
  { id: "contacts", name: "Contacts & People", description: "Phone numbers, emails, people info", color: "#8b5cf6" },
  { id: "finance", name: "Finance & Money", description: "Financial info, transactions, budgets", color: "#06b6d4" },
  { id: "personal", name: "Personal Notes", description: "Personal thoughts and reflections", color: "#ec4899" },
  { id: "work", name: "Work & Business", description: "Work-related notes and business info", color: "#3b82f6" },
  { id: "learning", name: "Learning & Reference", description: "Things learned, reference material", color: "#14b8a6" },
  { id: "other", name: "Other", description: "Miscellaneous items", color: "#6b7280" },
];

function getStore(): Store {
  if (!existsSync(DATA_PATH)) {
    const initial: Store = { knowledge: [], categories: DEFAULT_CATEGORIES };
    writeFileSync(DATA_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function saveStore(store: Store): void {
  writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

export function getKnowledge(): KnowledgeItem[] {
  return getStore().knowledge;
}

export function getKnowledgeByCategory(categoryId: string): KnowledgeItem[] {
  return getStore().knowledge.filter((k) => k.category === categoryId);
}

export function addKnowledge(item: Omit<KnowledgeItem, "createdAt" | "updatedAt">): KnowledgeItem {
  const store = getStore();
  const now = new Date().toISOString();
  const newItem: KnowledgeItem = { ...item, createdAt: now, updatedAt: now };
  store.knowledge.push(newItem);
  saveStore(store);
  return newItem;
}

export function addManyKnowledge(items: Omit<KnowledgeItem, "createdAt" | "updatedAt">[]): KnowledgeItem[] {
  const store = getStore();
  const now = new Date().toISOString();
  const newItems: KnowledgeItem[] = items.map((item) => ({ ...item, createdAt: now, updatedAt: now }));
  store.knowledge.push(...newItems);
  saveStore(store);
  return newItems;
}

export function updateKnowledge(id: string, updates: Partial<KnowledgeItem>): KnowledgeItem | null {
  const store = getStore();
  const idx = store.knowledge.findIndex((k) => k.id === id);
  if (idx === -1) return null;
  store.knowledge[idx] = { ...store.knowledge[idx], ...updates, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.knowledge[idx];
}

export function deleteKnowledge(id: string): boolean {
  const store = getStore();
  const idx = store.knowledge.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  store.knowledge.splice(idx, 1);
  saveStore(store);
  return true;
}

export function getCategories(): Category[] {
  return getStore().categories;
}

export function addCategory(cat: Category): Category {
  const store = getStore();
  store.categories.push(cat);
  saveStore(store);
  return cat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const store = getStore();
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  store.categories[idx] = { ...store.categories[idx], ...updates };
  saveStore(store);
  return store.categories[idx];
}

export function deleteCategory(id: string): boolean {
  const store = getStore();
  const idx = store.categories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.categories.splice(idx, 1);
  saveStore(store);
  return true;
}
