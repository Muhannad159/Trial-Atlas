"use client";
import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers2, Plus, Check, X } from "lucide-react";
import { comparisonHref } from "@/lib/validation/search";

type Selection = { id: string; title: string };
const Context = createContext<{
  selected: Selection[];
  toggle: (s: Selection) => void;
} | null>(null);
export function ComparisonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Selection[]>([]);
  const [message, setMessage] = useState("");
  function toggle(s: Selection) {
    if (selected.some((t) => t.id === s.id)) {
      setSelected(selected.filter((t) => t.id !== s.id));
      setMessage("Study removed from comparison.");
    } else if (selected.length < 3) {
      setSelected([...selected, s]);
      setMessage("Study added to comparison.");
    } else
      setMessage("You can compare up to 3 studies. Remove one to add another.");
  }
  return (
    <Context.Provider value={{ selected, toggle }}>
      {children}
      <p role="status" className="sr-only">
        {message}
      </p>
      {selected.length > 0 && (
        <aside className="comparison-tray" aria-label="Selected studies">
          <div className="flex items-center gap-3">
            <Layers2 size={21} className="text-teal" />
            <div>
              <strong className="text-sm">Your comparison</strong>
              <p className="text-xs text-muted">
                {selected.length} of 3 studies selected · this visit only
              </p>
            </div>
          </div>
          <div className="tray-items">
            {selected.map((s) => (
              <button
                key={s.id}
                title={`Remove ${s.title}`}
                onClick={() => toggle(s)}
                className="chip"
              >
                {s.id}
                <X size={13} />
              </button>
            ))}
          </div>
          <Link
            className="button button-primary"
            href={comparisonHref(selected.map((s) => s.id))}
          >
            Compare <ArrowRight size={16} />
          </Link>
          <button
            className="icon-button"
            aria-label="Clear comparison"
            onClick={() => setSelected([])}
          >
            <X size={18} />
          </button>
        </aside>
      )}
    </Context.Provider>
  );
}
export function CompareButton({ id, title }: Selection) {
  const context = useContext(Context);
  if (!context) return null;
  const active = context.selected.some((s) => s.id === id);
  return (
    <button
      type="button"
      className={`compare-button ${active ? "is-selected" : ""}`}
      aria-pressed={active}
      onClick={() => context.toggle({ id, title })}
    >
      {active ? <Check size={15} /> : <Plus size={15} />}{" "}
      {active ? "Selected" : "Compare"}
    </button>
  );
}

export function RemoveComparisonLink({
  id,
  href,
}: {
  id: string;
  href: string;
}) {
  const context = useContext(Context);
  return (
    <Link
      className="text-xs text-muted underline block mt-3"
      href={href}
      onClick={() => {
        const selection = context?.selected.find((item) => item.id === id);
        if (selection) context?.toggle(selection);
      }}
    >
      Remove
    </Link>
  );
}
