import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NewRegistryItem, RegistryItem, Store } from "./types";

const META_ID = 1;

export class SupabaseStore implements Store {
  private db: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.db = createClient(url, anonKey);
  }

  async listItems(): Promise<RegistryItem[]> {
    const { data, error } = await this.db
      .from("registry_item")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      notes: r.notes,
      priority: r.priority,
      checked: r.checked,
      checkedAt: r.checked_at,
      createdAt: r.created_at,
    }));
  }

  async addItem(input: NewRegistryItem): Promise<RegistryItem> {
    const { data, error } = await this.db
      .from("registry_item")
      .insert({
        name: input.name,
        category: input.category,
        notes: input.notes,
        priority: input.priority,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      notes: data.notes,
      priority: data.priority,
      checked: data.checked,
      checkedAt: data.checked_at,
      createdAt: data.created_at,
    };
  }

  async updateItem(id: string, patch: Partial<RegistryItem>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.checked !== undefined) row.checked = patch.checked;
    if (patch.checkedAt !== undefined) row.checked_at = patch.checkedAt;
    if (patch.priority !== undefined) row.priority = patch.priority;
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.category !== undefined) row.category = patch.category;
    if (patch.notes !== undefined) row.notes = patch.notes;
    const { error } = await this.db.from("registry_item").update(row).eq("id", id);
    if (error) throw error;
  }

  async removeItem(id: string): Promise<void> {
    const { error } = await this.db.from("registry_item").delete().eq("id", id);
    if (error) throw error;
  }

  async getTitle(): Promise<string> {
    const { data, error } = await this.db
      .from("registry_meta")
      .select("title")
      .eq("id", META_ID)
      .maybeSingle();
    if (error) throw error;
    return data?.title ?? "Baby Registry";
  }

  async setTitle(title: string): Promise<void> {
    const { error } = await this.db
      .from("registry_meta")
      .upsert({ id: META_ID, title });
    if (error) throw error;
  }
}
