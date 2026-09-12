import { useCallback, useEffect, useMemo, useState } from "react";
import { store } from "./data";
import { DEFAULT_CATEGORIES } from "./data/categories";
import type { NewRegistryItem, RegistryItem } from "./data/types";
import RegistryItemRow from "./components/RegistryItemRow";
import AddItemSheet from "./components/AddItemSheet";

export default function App() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [title, setTitle] = useState("Baby Registry");
  const [editingTitle, setEditingTitle] = useState(false);
  const [adding, setAdding] = useState(false);
  const [hideChecked, setHideChecked] = useState(false);

  const load = useCallback(async () => {
    const [loadedItems, loadedTitle] = await Promise.all([
      store.listItems(),
      store.getTitle(),
    ]);
    setItems(loadedItems);
    setTitle(loadedTitle);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Pick up the other person's edits when this tab regains focus, since data
  // may now live in a shared backend instead of only this device's storage.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void load();
    }
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [load]);

  const categories = useMemo(() => {
    const used = Array.from(new Set(items.map((i) => i.category)));
    const extra = used.filter((c) => !(DEFAULT_CATEGORIES as readonly string[]).includes(c));
    return [...DEFAULT_CATEGORIES, ...extra];
  }, [items]);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, RegistryItem[]>();
    for (const item of items) {
      if (hideChecked && item.checked) continue;
      const list = byCategory.get(item.category) ?? [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    return categories
      .filter((c) => byCategory.has(c))
      .map((c) => ({ category: c, items: byCategory.get(c)! }));
  }, [items, categories, hideChecked]);

  const checkedCount = items.filter((i) => i.checked).length;

  async function saveTitle(next: string) {
    const trimmed = next.trim() || "Baby Registry";
    setTitle(trimmed);
    setEditingTitle(false);
    await store.setTitle(trimmed);
  }

  async function toggle(item: RegistryItem, checked: boolean) {
    await store.updateItem(item.id, {
      checked,
      checkedAt: checked ? new Date().toISOString() : null,
    });
    await load();
  }

  async function togglePriority(item: RegistryItem) {
    await store.updateItem(item.id, { priority: !item.priority });
    await load();
  }

  async function remove(item: RegistryItem) {
    await store.removeItem(item.id);
    await load();
  }

  async function addItem(newItem: NewRegistryItem) {
    await store.addItem(newItem);
    setAdding(false);
    await load();
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md p-4 pb-10">
      <header className="mb-3 flex items-center justify-between px-1">
        {editingTitle ? (
          <input
            autoFocus
            defaultValue={title}
            onBlur={(e) => void saveTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void saveTitle(e.currentTarget.value);
              if (e.key === "Escape") setEditingTitle(false);
            }}
            className="rounded-lg border border-accent/40 bg-white px-2 py-1 text-lg font-semibold tracking-tight outline-none"
          />
        ) : (
          <h1
            onClick={() => setEditingTitle(true)}
            className="text-lg font-semibold tracking-tight active:opacity-70"
          >
            {title}
          </h1>
        )}
        <button
          onClick={() => setHideChecked((v) => !v)}
          className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 active:bg-panel"
        >
          {hideChecked ? "Show all" : "Hide completed"}
        </button>
      </header>

      <main className="rounded-3xl bg-panel p-5">
        <div className="flex items-baseline justify-between px-1">
          <span className="text-sm font-semibold">
            {items.length === 0
              ? "No items yet"
              : `${checkedCount} of ${items.length} completed`}
          </span>
        </div>
        {items.length > 0 && (
          <div className="mt-2 h-2 rounded-full bg-panel-deep">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{
                width: `${(checkedCount / items.length) * 100}%`,
              }}
            />
          </div>
        )}

        <div className="mt-5 space-y-5">
          {grouped.map(({ category, items: catItems }) => (
            <section key={category}>
              <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide">
                {category}
              </h2>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <RegistryItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggle}
                    onTogglePriority={togglePriority}
                    onRemove={remove}
                  />
                ))}
              </div>
            </section>
          ))}
          {items.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-ink/60">
              Add your first item to start the list.
            </p>
          )}
        </div>

        <button
          onClick={() => setAdding(true)}
          className="mt-6 w-full rounded-full border border-dashed border-accent/60 py-3 text-sm font-semibold text-accent"
        >
          + Add item
        </button>
      </main>

      {adding && (
        <AddItemSheet
          categories={categories.length ? categories : [...DEFAULT_CATEGORIES]}
          onAdd={addItem}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}
