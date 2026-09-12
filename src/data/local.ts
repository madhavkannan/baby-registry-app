import type { NewRegistryItem, RegistryItem, Store } from "./types";

/**
 * localStorage-backed store. Used when no Supabase env vars are configured,
 * so the app is fully usable standalone on a single device.
 */

const KEYS = {
  items: "baby-registry:items",
  title: "baby-registry:title",
};

function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return crypto.randomUUID();
}

export class LocalStore implements Store {
  async listItems(): Promise<RegistryItem[]> {
    return read<RegistryItem[]>(KEYS.items, []);
  }

  async addItem(input: NewRegistryItem): Promise<RegistryItem> {
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
    write(KEYS.items, [...(await this.listItems()), item]);
    return item;
  }

  async updateItem(id: string, patch: Partial<RegistryItem>): Promise<void> {
    const items = await this.listItems();
    write(
      KEYS.items,
      items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  }

  async removeItem(id: string): Promise<void> {
    const items = await this.listItems();
    write(
      KEYS.items,
      items.filter((i) => i.id !== id)
    );
  }

  async getTitle(): Promise<string> {
    return read<string>(KEYS.title, "Baby Registry");
  }

  async setTitle(title: string): Promise<void> {
    write(KEYS.title, title);
  }
}
