import { useState } from "react";
import { DEFAULT_CATEGORIES } from "../data/categories";
import type { NewRegistryItem } from "../data/types";

interface Props {
  categories: string[];
  onAdd: (item: NewRegistryItem) => void;
  onClose: () => void;
}

export default function AddItemSheet({ categories, onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] ?? DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const finalCategory = addingCategory
      ? customCategory.trim() || "Misc"
      : category;
    onAdd({
      name: trimmed,
      category: finalCategory,
      notes: notes.trim() || null,
      priority,
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-page p-5 pb-8">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-panel-deep" />
        <h2 className="mb-4 text-lg font-semibold">Add item</h2>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          Item name
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Convertible car seat"
          className="mb-4 w-full rounded-2xl border border-panel-deep bg-white px-4 py-3 text-[15px] outline-none focus:border-accent"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          Category
        </label>
        {!addingCategory ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                  category === c
                    ? "border-accent bg-accent text-white"
                    : "border-panel-deep text-ink/80"
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setAddingCategory(true)}
              className="rounded-full border border-dashed border-accent/60 px-3 py-1.5 text-sm font-medium text-accent"
            >
              + New
            </button>
          </div>
        ) : (
          <div className="mb-4 flex gap-2">
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 rounded-2xl border border-panel-deep bg-white px-4 py-2.5 text-[15px] outline-none focus:border-accent"
            />
            <button
              onClick={() => setAddingCategory(false)}
              className="rounded-full px-3 text-sm font-medium text-ink/60"
            >
              Cancel
            </button>
          </div>
        )}

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
          Notes (optional)
        </label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Brand, size, link, color..."
          className="mb-4 w-full rounded-2xl border border-panel-deep bg-white px-4 py-3 text-[15px] outline-none focus:border-accent"
        />

        <button
          onClick={() => setPriority((v) => !v)}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-ink/80"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              priority ? "border-accent bg-accent text-white" : "border-accent/50"
            }`}
          >
            {priority && "★"}
          </span>
          Mark as priority
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-panel-deep py-3 text-sm font-semibold text-ink/70"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Add item
          </button>
        </div>
      </div>
    </div>
  );
}
