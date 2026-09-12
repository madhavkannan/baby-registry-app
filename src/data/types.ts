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
