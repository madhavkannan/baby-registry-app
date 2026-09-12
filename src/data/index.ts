import type { Store } from "./types";
import { LocalStore } from "./local";
import { SupabaseStore } from "./supabase";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const usingSupabase = Boolean(url && anonKey);

export const store: Store = usingSupabase
  ? new SupabaseStore(url!, anonKey!)
  : new LocalStore();
