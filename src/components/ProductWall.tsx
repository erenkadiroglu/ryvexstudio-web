import { useEffect, useId, useState, type KeyboardEvent } from "react";
import type { ProductType, WallItem } from "@/lib/products";
import { iconTransitionName } from "@/lib/transitions";

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
  /** Hangs the products on the wall once, when the wall scrolls into view. */
  animate?: boolean;
  /** "icons" is the compact wall; "cards" shows each product with its real screen. */
  variant?: "icons" | "cards";
}

export default function ProductWall({
  items,
  filters,
  filterParam = "tur",
  filterLabel,
  emptyText,
  animate = false,
  variant = "icons",
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
      ) : variant === "cards" ? (
        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <li key={item.id} data-product={item.id}>
              <ProductCard item={item} eager={index < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6"
          data-reveal={animate ? "" : undefined}
        >
          {visible.map((item, index) => (
            <li
              key={item.id}
              data-product={item.id}
              className={animate ? "wall-item" : undefined}
              style={animate ? { animationDelay: `${index * 80}ms` } : undefined}
            >
              <a
                href={item.href}
                className="wall-link group block"
                data-color={item.color}
                data-flood={item.color}
              >
                <div className="wall-figure relative isolate max-w-[160px]">
                  {item.shotSrc && <PeekPhone src={item.shotSrc} avif={item.shotAvif} />}
                  <Pic avif={item.iconAvif}>
                    <img
                      src={item.iconSrc}
                      alt=""
                      width={160}
                      height={160}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="wall-icon shape-icon object-depth aspect-square w-full max-w-[160px]"
                      style={{ viewTransitionName: iconTransitionName(item.id) }}
                    />
                  </Pic>
                </div>
                <span className="mt-5 block text-title font-semibold decoration-1 underline-offset-[3px] group-hover:underline">
                  {item.name}
                </span>
                <span className="mt-1 block text-body-sm text-secondary">{item.caption}</span>
                {item.status && (
                  <span className="mt-2 inline-flex rounded-full border border-outline px-2.5 py-0.5 text-[0.8125rem] font-medium text-primary">
                    {item.status}
                  </span>
                )}
                {item.newLabel && <NewChip id={item.id} label={item.newLabel} className="mt-2" />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A product with its own colour, a real screen in a phone and its one-line description. */
function ProductCard({ item, eager }: { item: WallItem; eager: boolean }) {
  // Same proportions as the PhoneFrame component.
  const width = 236;
  const bezel = Math.round(width * 0.034);
  const radius = Math.round(width * 0.155);
  const camera = Math.round(width * 0.036);
  return (
    <a
      href={item.href}
      className="wall-link group block"
      data-color={item.color}
      data-flood={item.color}
    >
      <div
        className="relative h-[340px] overflow-hidden rounded-2xl"
        style={{ backgroundColor: `color-mix(in srgb, ${item.color} 16%, var(--rv-surface))` }}
      >
        {item.shotSrc ? (
          <div
            className="phone phone-compact absolute top-10 left-1/2 -translate-x-1/2 transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-y-2"
            style={{ width, padding: bezel, borderRadius: radius }}
            aria-hidden="true"
          >
            <div className="phone-screen" style={{ borderRadius: radius - bezel }}>
              <Pic avif={item.shotAvif}>
                <img
                  src={item.shotSrc}
                  alt=""
                  width={480}
                  height={1067}
                  loading={eager ? "eager" : "lazy"}
                  decoding="async"
                  className="size-full object-cover object-top"
                />
              </Pic>
            </div>
            <span
              className="phone-camera"
              style={{ width: camera, height: camera, top: bezel + camera }}
            />
          </div>
        ) : (
          <Pic avif={item.iconAvif}>
            <img
              src={item.iconSrc}
              alt=""
              width={128}
              height={128}
              className="shape-icon object-depth absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2"
            />
          </Pic>
        )}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <Pic avif={item.iconAvif}>
          <img
            src={item.iconSrc}
            alt=""
            width={48}
            height={48}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="shape-icon size-12 shrink-0"
            style={{ viewTransitionName: iconTransitionName(item.id) }}
          />
        </Pic>
        <span className="min-w-0 flex-1">
          <span className="block text-title font-semibold decoration-1 underline-offset-[3px] group-hover:underline">
            {item.name}
          </span>
          <span className="mt-0.5 block text-body-sm text-secondary">{item.caption}</span>
        </span>
        {item.status && (
          <span className="shrink-0 rounded-full border border-outline px-2.5 py-0.5 text-[0.8125rem] font-medium text-primary">
            {item.status}
          </span>
        )}
        {item.newLabel && <NewChip id={item.id} label={item.newLabel} className="shrink-0" />}
      </div>
      {item.tagline && (
        <span className="mt-4 block max-w-[44ch] text-body-md text-secondary">{item.tagline}</span>
      )}
    </a>
  );
}

/**
 * "Yeni" for 30 days after a release. Hidden by default; a rule written by the page head shows it
 * only while the product is still new, so the mark ends on time without a rebuild.
 */
function NewChip({ id, label, className }: { id: string; label: string; className: string }) {
  return (
    <span data-new-chip={id} className={`new-chip hidden ${className}`}>
      {label}
    </span>
  );
}

/** On the wall, a small phone with the product's real screen rises from behind its icon on hover. */
function PeekPhone({ src, avif }: { src: string; avif?: string }) {
  const width = 108;
  const bezel = Math.round(width * 0.034);
  const radius = Math.round(width * 0.155);
  const camera = Math.max(4, Math.round(width * 0.036));
  return (
    <div
      className="wall-peek pointer-events-none absolute bottom-[45%] left-1/2 -z-10 hidden md:block"
      aria-hidden="true"
    >
      <div className="phone phone-compact" style={{ width, padding: bezel, borderRadius: radius }}>
        <div className="phone-screen" style={{ borderRadius: radius - bezel }}>
          <Pic avif={avif}>
            <img
              src={src}
              alt=""
              width={240}
              height={533}
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top"
            />
          </Pic>
        </div>
        <span
          className="phone-camera"
          style={{ width: camera, height: camera, top: bezel + camera }}
        />
      </div>
    </div>
  );
}

/** Offers the AVIF version first; the <picture> takes no space, so the <img> styles still apply. */
function Pic({ avif, children }: { avif?: string; children: React.ReactElement }) {
  if (!avif) return children;
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={avif} />
      {children}
    </picture>
  );
}
