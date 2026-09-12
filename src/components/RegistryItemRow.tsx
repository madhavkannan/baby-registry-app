import { useState } from "react";
import type { RegistryItem } from "../data/types";

interface Props {
  item: RegistryItem;
  onToggle: (item: RegistryItem, checked: boolean) => void;
  onTogglePriority: (item: RegistryItem) => void;
  onRemove: (item: RegistryItem) => void;
}

export default function RegistryItemRow({
  item,
  onToggle,
  onTogglePriority,
  onRemove,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 rounded-full border transition-colors ${
          item.checked
            ? "bg-accent border-accent text-white"
            : "bg-transparent border-accent text-ink"
        }`}
      >
        <button
          onClick={() => onToggle(item, !item.checked)}
          className="flex flex-1 items-center gap-3 py-3 pl-4 text-left min-w-0"
        >
          <span
            aria-hidden
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
              item.checked ? "border-white/70 bg-white/15" : "border-accent/50"
            }`}
          >
            {item.checked && (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7.5L5.5 10.5L11.5 3.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-medium">
              {item.priority && !item.checked ? "★ " : ""}
              {item.name}
            </span>
            {item.notes && (
              <span
                className={`block truncate text-xs ${
                  item.checked ? "text-white/75" : "text-ink/60"
                }`}
              >
                {item.notes}
              </span>
            )}
          </span>
        </button>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={`Options for ${item.name}`}
          className={`shrink-0 py-3 pl-1 pr-4 text-lg leading-none ${
            item.checked ? "text-white/80" : "text-ink/50"
          }`}
        >
          &#8943;
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-2 top-11 z-20 w-56 rounded-2xl bg-white p-3 shadow-lg">
            <button
              onClick={() => {
                setMenuOpen(false);
                onTogglePriority(item);
              }}
              className="w-full rounded-full py-2 text-left text-sm font-medium text-ink px-2 active:bg-panel"
            >
              {item.priority ? "★ Unmark priority" : "☆ Mark as priority"}
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onRemove(item);
              }}
              className="mt-1 w-full rounded-full border border-red-700/40 py-2 text-sm font-medium text-red-800"
            >
              Remove from list
            </button>
          </div>
        </>
      )}
    </div>
  );
}
