export interface RegistryItem {
  id: string;
  name: string;
  category: string;
  notes: string | null;
  priority: boolean;
  checked: boolean;
  checkedAt: string | null;
  createdAt: string;
}

export type NewRegistryItem = Pick<
  RegistryItem,
  "name" | "category" | "notes" | "priority"
>;

export interface Store {
  listItems(): Promise<RegistryItem[]>;
  addItem(item: NewRegistryItem): Promise<RegistryItem>;
  updateItem(id: string, patch: Partial<RegistryItem>): Promise<void>;
  removeItem(id: string): Promise<void>;
  getTitle(): Promise<string>;
  setTitle(title: string): Promise<void>;
}
