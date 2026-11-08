import { useEffect, useId, useState, type KeyboardEvent } from "react";
import type { ProductType, WallItem } from "@/lib/products";

type Filter = "all" | ProductType;

interface FilterOption {
  value: Filter;
  label: string;
  /** Value written to the URL query, e.g. "oyun". Empty for "all". */
  slug: string;
}

interface Props {
  items: WallItem[];
  /** Renders the type filter and enables client-side filtering. */
  filters?: FilterOption[];
  /** Query parameter used for the filter, e.g. "tur". */
  filterParam?: string;
  filterLabel?: string;
  emptyText?: string;
  /** Plays the one-time "hung on the wall" entrance on first load. */
  animate?: boolean;
}

export default function ProductWall({
  items,
  filters,
  filterParam = "tur",
  filterLabel,
  emptyText,
  animate = false,
}: Props) {
  const [active, setActive] = useState<Filter>("all");
  const labelId = useId();

  // Read the initial filter from the URL so shared links open filtered.
  useEffect(() => {
    if (!filters) return;
    const slug = new URLSearchParams(window.location.search).get(filterParam);
    const match = filters.find((f) => f.slug && f.slug === slug);
    if (match) setActive(match.value);
  }, [filters, filterParam]);

  function select(option: FilterOption) {
    setActive(option.value);
    const url = new URL(window.location.href);
    if (option.slug) url.searchParams.set(filterParam, option.slug);
    else url.searchParams.delete(filterParam);
    window.history.replaceState(null, "", url);
  }

  function onFilterKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!filters) return;
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = filters.findIndex((f) => f.value === active);
    const next = filters[(index + step + filters.length) % filters.length];
    select(next);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]");
    buttons[filters.indexOf(next)]?.focus();
  }

  const visible = active === "all" ? items : items.filter((item) => item.type === active);

  return (
    <div>
      {filters && (
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          onKeyDown={onFilterKeyDown}
          className="mb-14 inline-flex flex-wrap gap-1 rounded-full bg-neutral p-1"
        >
          <span id={labelId} className="sr-only">
            {filterLabel}
          </span>
          {filters.map((option) => {
            const checked = option.value === active;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => select(option)}
                className={
                  "rounded-full px-4 py-2 text-label font-medium transition-colors duration-150 " +
                  (checked ? "bg-surface text-primary" : "text-secondary hover:text-primary")
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-body-md text-secondary">{emptyText}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {visible.map((item, index) => (
            <li
              key={item.id}
              className={animate ? "wall-item" : undefined}
              style={animate ? { animationDelay: `${index * 60}ms` } : undefined}
            >
              <a href={item.href} className="group block">
                <img
                  src={item.iconSrc}
                  alt=""
                  width={160}
                  height={160}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="shape-icon object-depth aspect-square w-full max-w-[160px]"
                />
                <span className="mt-5 block text-title font-semibold decoration-1 underline-offset-[3px] group-hover:underline">
                  {item.name}
                </span>
                <span className="mt-1 block text-body-sm text-secondary">{item.caption}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
