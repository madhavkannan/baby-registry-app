import type { NewRegistryItem, RegistryItem } from "./types";

const ITEMS_KEY = "baby-registry:items";
const TITLE_KEY = "baby-registry:title";

function readItems(): RegistryItem[] {
  const raw = localStorage.getItem(ITEMS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RegistryItem[];
  } catch {
    return [];
  }
}

function writeItems(items: RegistryItem[]) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

function uid() {
  return crypto.randomUUID();
}

export const store = {
  listItems(): RegistryItem[] {
    return readItems();
  },

  addItem(input: NewRegistryItem): RegistryItem {
    const item: RegistryItem = {
      id: uid(),
      name: input.name,
      category: input.category,
      notes: input.notes,
      priority: input.priority,
      checked: false,
      checkedAt: null,
      createdAt: new Date().toISOString(),
    };
    writeItems([...readItems(), item]);
    return item;
  },

  updateItem(id: string, patch: Partial<RegistryItem>): void {
    writeItems(readItems().map((i) => (i.id === id ? { ...i, ...patch } : i)));
  },

  removeItem(id: string): void {
    writeItems(readItems().filter((i) => i.id !== id));
  },

  getTitle(): string {
    return localStorage.getItem(TITLE_KEY) ?? "Baby Registry";
  },

  setTitle(title: string): void {
    localStorage.setItem(TITLE_KEY, title);
  },
};
