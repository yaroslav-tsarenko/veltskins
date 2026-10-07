"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrency } from "@/providers/CurrencyProvider";
import { Checkbox } from "@/components/ui/Choice";
import { ConditionCells } from "@/components/skin/ConditionGrid";
import { EXTERIORS, WEAPON_TYPES, raritySlug, weaponSlug } from "@/lib/skins/cs2";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Dialog";
import { FilterChip, FilterChipRow } from "@/components/ui/Chip";
import { NOT_PAINTED, toggleValue, type CatalogFacets, type FacetOption, type ListFilter } from "@/components/catalog/catalog-url";

export interface FilterSelection {
  brand: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  onSale: boolean;
  types: string[];
  weapons: string[];
  rarities: string[];
  exteriors: string[];
  qualities: string[];
  phases: string[];
  collections: string[];
  floatMin: number | null;
  floatMax: number | null;
}

export function FilterGroup({
  title,
  selectedCount = 0,
  defaultOpen = false,
  children,
}: {
  title: string;
  selectedCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("catalog");
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-open={open || undefined} className="border-b border-line">
      <h3 className="m-0 font-sans font-normal tracking-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          onClick={() => setOpen((v) => !v)}
          className="flex h-[46px] w-full cursor-pointer items-center gap-3 text-left text-ink"
        >
          <span className="eyebrow flex-1">{title}</span>
          {selectedCount > 0 ? (
            <span className="font-mono text-data-sm font-medium text-ink" aria-label={t("selectedCount", { count: selectedCount })}>
              {selectedCount}
            </span>
          ) : null}
          <ChevronDown size={16} aria-hidden="true" className={cn("text-ink-muted transition-transform duration-[220ms] ease-[var(--ease-std)]", open && "rotate-180")} />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        inert={!open}
        className={cn("grid transition-[grid-template-rows] duration-[220ms] ease-[var(--ease-std)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="relative min-h-0 overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export interface PriceRangeProps {
  bounds: { min: number; max: number };
  value: { min: number; max: number };
  onCommit: (value: { min: number; max: number }) => void;
  format: (n: number) => string;
  step?: number;
}

export function PriceRange({ bounds, value, onCommit, format, step = 1 }: PriceRangeProps) {
  const t = useTranslations("catalog");
  const trackRef = useRef<HTMLDivElement>(null);
  const signature = `${value.min}|${value.max}`;
  const [state, setState] = useState({ signature, min: value.min, max: value.max });
  if (state.signature !== signature) setState({ signature, min: value.min, max: value.max });
  const local = { min: state.min, max: state.max };
  const setLocal = (fn: (cur: { min: number; max: number }) => { min: number; max: number }) => setState((s) => ({ ...s, ...fn({ min: s.min, max: s.max }) }));
  const dragging = useRef<"min" | "max" | null>(null);
  const span = Math.max(step, bounds.max - bounds.min);

  const pct = (n: number) => ((n - bounds.min) / span) * 100;
  const clampStep = (n: number) => Math.round(Math.min(bounds.max, Math.max(bounds.min, n)) / step) * step;

  const fromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return bounds.min;
    return clampStep(bounds.min + ((clientX - rect.left) / rect.width) * span);
  };

  const update = (thumb: "min" | "max", next: number) => {
    setLocal((cur) => (thumb === "min" ? { min: Math.min(next, cur.max), max: cur.max } : { min: cur.min, max: Math.max(next, cur.min) }));
  };

  const commit = () => {
    if (local.min !== value.min || local.max !== value.max) onCommit(local);
  };

  const onKey = (thumb: "min" | "max") => (e: KeyboardEvent<HTMLSpanElement>) => {
    const current = local[thumb];
    const big = Math.max(step, Math.round(span / 10));
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = current + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = current - step;
    else if (e.key === "PageUp") next = current + big;
    else if (e.key === "PageDown") next = current - big;
    else if (e.key === "Home") next = bounds.min;
    else if (e.key === "End") next = bounds.max;
    if (next === null) return;
    e.preventDefault();
    update(thumb, clampStep(next));
  };

  const thumb = (which: "min" | "max") => (
    <span
      role="slider"
      tabIndex={0}
      aria-label={which === "min" ? t("minPrice") : t("maxPrice")}
      aria-valuemin={which === "min" ? bounds.min : local.min}
      aria-valuemax={which === "min" ? local.max : bounds.max}
      aria-valuenow={local[which]}
      aria-valuetext={format(local[which])}
      onKeyDown={onKey(which)}
      onKeyUp={commit}
      onBlur={commit}
      onPointerDown={(e: PointerEvent<HTMLSpanElement>) => {
        dragging.current = which;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e: PointerEvent<HTMLSpanElement>) => {
        if (dragging.current === which) update(which, fromPointer(e.clientX));
      }}
      onPointerUp={() => {
        dragging.current = null;
        commit();
      }}
      style={{ left: `${pct(local[which])}%` }}
      className="absolute bottom-0 z-[1] flex h-8 w-6 -translate-x-1/2 cursor-grab touch-none items-end justify-center active:cursor-grabbing"
    >
      <span aria-hidden="true" className="block h-3.5 w-2 rounded-control bg-ink" />
    </span>
  );

  return (
    <div className="px-1.5 pb-1 pt-3">
      <div ref={trackRef} className="relative h-8">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-[6px] h-px bg-rule" />
        <span aria-hidden="true" className="absolute bottom-[6px] h-px bg-ink" style={{ left: `${pct(local.min)}%`, right: `${100 - pct(local.max)}%` }} />
        {thumb("min")}
        {thumb("max")}
      </div>
      <div className="mt-2 flex justify-between font-mono text-data-sm text-ink-muted" aria-hidden="true">
        <span>{format(local.min)}</span>
        <span>{format(local.max)}</span>
      </div>
    </div>
  );
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function useDisplayPrice() {
  const { currency, rates } = useCurrency();
  const rate = rates[currency] || 1;
  const symbol = new Intl.NumberFormat("en-GB", { style: "currency", currency }).formatToParts(0).find((p) => p.type === "currency")?.value ?? "";
  const format = (n: number, digits = 0) => new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  return {
    currency,
    rate,
    symbol,
    format,
    toDisplay: (base: number) => round2(base * rate),
    toBase: (display: number) => round2(display / rate),
  };
}

function PriceGroup({
  bounds,
  minPrice,
  maxPrice,
  onChange,
}: {
  bounds: { min: number; max: number } | null;
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (next: { minPrice: number | null; maxPrice: number | null }) => void;
}) {
  const t = useTranslations("catalog");
  const { rate, symbol, format, toDisplay, toBase } = useDisplayPrice();
  const signature = `${minPrice}|${maxPrice}|${rate}`;
  const fromBase = (v: number | null) => (v === null ? "" : String(toDisplay(v)));
  const [draft, setDraft] = useState({ signature, min: fromBase(minPrice), max: fromBase(maxPrice) });
  if (draft.signature !== signature) setDraft({ signature, min: fromBase(minPrice), max: fromBase(maxPrice) });

  const parse = (s: string) => (s.trim() === "" || !Number.isFinite(Number(s)) ? null : toBase(Number(s)));
  const commit = (min: string, max: string) => {
    const nextMin = parse(min);
    const nextMax = parse(max);
    if (nextMin === minPrice && nextMax === maxPrice) return;
    onChange({ minPrice: nextMin, maxPrice: nextMax });
  };

  const lo = bounds ? Math.floor(bounds.min * rate) : 0;
  const hi = bounds ? Math.ceil(bounds.max * rate) : 0;

  return (
    <>
      <form
        className="grid grid-cols-2 gap-3 pt-1"
        onSubmit={(e) => {
          e.preventDefault();
          commit(draft.min, draft.max);
        }}
      >
        <Input
          label={t("min")}
          size="sm"
          mono
          inputMode="decimal"
          prefix={symbol}
          placeholder={bounds ? String(lo) : undefined}
          value={draft.min}
          onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value.replace(/[^0-9.]/g, "") }))}
          onBlur={() => commit(draft.min, draft.max)}
        />
        <Input
          label={t("max")}
          size="sm"
          mono
          inputMode="decimal"
          prefix={symbol}
          placeholder={bounds ? String(hi) : undefined}
          value={draft.max}
          onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value.replace(/[^0-9.]/g, "") }))}
          onBlur={() => commit(draft.min, draft.max)}
        />
        <button type="submit" className="sr-only">
          {t("applyPrice")}
        </button>
      </form>
      {bounds && hi > lo ? (
        <PriceRange
          bounds={{ min: lo, max: hi }}
          value={{
            min: minPrice !== null ? Math.max(lo, Math.floor(toDisplay(minPrice))) : lo,
            max: maxPrice !== null ? Math.min(hi, Math.ceil(toDisplay(maxPrice))) : hi,
          }}
          format={(n) => format(n)}
          onCommit={(v) =>
            onChange({
              minPrice: v.min > lo ? toBase(v.min) : null,
              maxPrice: v.max < hi ? toBase(v.max) : null,
            })
          }
        />
      ) : null}
    </>
  );
}

function ConditionGroup({
  options,
  selected,
  floatMin,
  floatMax,
  onChange,
}: {
  options: FacetOption[];
  selected: string[];
  floatMin: number | null;
  floatMax: number | null;
  onChange: (next: Partial<FilterSelection>) => void;
}) {
  const t = useTranslations("catalog");
  const [showFloat, setShowFloat] = useState(floatMin !== null || floatMax !== null);
  const signature = `${floatMin}|${floatMax}`;
  const [draft, setDraft] = useState({ signature, from: floatMin !== null ? String(floatMin) : "", to: floatMax !== null ? String(floatMax) : "" });
  if (draft.signature !== signature) setDraft({ signature, from: floatMin !== null ? String(floatMin) : "", to: floatMax !== null ? String(floatMax) : "" });

  const counts: Record<string, number> = {};
  for (const e of EXTERIORS) counts[e.code] = options.find((o) => o.key === e.code.toLowerCase())?.count ?? 0;
  const notPainted = options.find((o) => o.key === NOT_PAINTED);

  const parse = (s: string) => {
    const n = Number(s);
    return s.trim() === "" || !Number.isFinite(n) || n < 0 || n > 1 ? null : Math.round(n * 10000) / 10000;
  };
  const commitFloat = (from: string, to: string) => {
    const nextMin = parse(from);
    const nextMax = parse(to);
    if (nextMin === floatMin && nextMax === floatMax) return;
    onChange({ floatMin: nextMin, floatMax: nextMax });
  };

  return (
    <div className="pt-1">
      <ConditionCells
        selected={selected.map((c) => c.toUpperCase())}
        counts={counts}
        onToggle={(code) => onChange({ exteriors: toggleValue(selected, code.toLowerCase()) })}
      />
      {notPainted && (notPainted.count > 0 || notPainted.selected) ? (
        <div className="mt-2">
          <Checkbox
            dense
            label="Not painted"
            count={notPainted.count}
            checked={selected.includes(NOT_PAINTED)}
            onChange={() => onChange({ exteriors: toggleValue(selected, NOT_PAINTED) })}
          />
        </div>
      ) : null}
      <div className="mt-3 border-t border-line pt-2">
        <button
          type="button"
          aria-expanded={showFloat}
          onClick={() => setShowFloat((v) => !v)}
          className="flex min-h-9 w-full cursor-pointer items-center gap-2 text-left text-ui-sm text-ink-muted hover-device:hover:text-ink"
        >
          <span className="flex-1">{t("groupFloat")}</span>
          <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform duration-[220ms]", showFloat && "rotate-180")} />
        </button>
        {showFloat ? (
          <form
            className="grid grid-cols-2 gap-3 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              commitFloat(draft.from, draft.to);
            }}
          >
            <Input
              label={t("floatMin")}
              size="sm"
              mono
              inputMode="decimal"
              placeholder="0.00"
              value={draft.from}
              onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value.replace(/[^0-9.]/g, "") }))}
              onBlur={() => commitFloat(draft.from, draft.to)}
            />
            <Input
              label={t("floatMax")}
              size="sm"
              mono
              inputMode="decimal"
              placeholder="1.00"
              value={draft.to}
              onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value.replace(/[^0-9.]/g, "") }))}
              onBlur={() => commitFloat(draft.from, draft.to)}
            />
            <button type="submit" className="sr-only">
              {t("applyFloat")}
            </button>
            <p className="col-span-2 m-0 text-ui-sm text-ink-muted">{t("floatHint")}</p>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function OptionRows({
  options,
  selected,
  onToggle,
  rarity = false,
}: {
  options: FacetOption[];
  selected: string[];
  onToggle: (key: string) => void;
  rarity?: boolean;
}) {
  return (
    <div>
      {options.map((option) => {
        const slug = rarity ? raritySlug(option.key) : undefined;
        return (
          <div key={option.key} data-rarity={slug} className={cn(rarity && "relative mt-2 border-t-2 border-rarity pt-0.5 first:mt-0")}>
            <Checkbox
              dense
              label={rarity ? <span className="label-caps text-rarity">{option.label}</span> : option.label}
              count={option.count}
              checked={selected.includes(option.key)}
              disabled={option.count === 0 && !selected.includes(option.key)}
              onChange={() => onToggle(option.key)}
            />
          </div>
        );
      })}
    </div>
  );
}

function WeaponRows({ options, selected, onToggle }: { options: FacetOption[]; selected: string[]; onToggle: (key: string) => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  const groups = WEAPON_TYPES.map((type) => ({
    type,
    options: visible.filter((o) => type.weapons.some((w) => weaponSlug(w) === o.key)),
  })).filter((g) => g.options.length > 0);
  const showGroups = groups.length > 1;
  return (
    <div>
      {options.length > 10 ? (
        <Input label="Find a weapon" labelHidden size="sm" mono placeholder="Find a weapon" value={query} onChange={(e) => setQuery(e.target.value)} wrapperClassName="mb-2" />
      ) : null}
      <div className="max-h-[360px] overflow-y-auto pr-1">
        {groups.map((g) => (
          <div key={g.type.key} className={cn(showGroups && "mb-2")}>
            {showGroups ? <p className="eyebrow m-0 pb-1 pt-2 text-ink-faint">{g.type.label}</p> : null}
            <OptionRows options={g.options} selected={selected} onToggle={onToggle} />
          </div>
        ))}
        {groups.length === 0 ? <p className="m-0 py-2 text-ui-sm text-ink-muted">No weapon matches “{query}”.</p> : null}
      </div>
    </div>
  );
}

const QUALITY_LABEL: Record<string, string> = { normal: "Standard", stattrak: "StatTrak™", souvenir: "Souvenir" };

export interface ProductFiltersProps {
  facets: CatalogFacets;
  selection: FilterSelection;
  onChange: (next: Partial<FilterSelection>) => void;
  className?: string;
}

export function ProductFilters({ facets, selection, onChange, className }: ProductFiltersProps) {
  const t = useTranslations("catalog");
  const priceCount = (selection.minPrice !== null ? 1 : 0) + (selection.maxPrice !== null ? 1 : 0);
  const list = (filter: ListFilter) => facets[filter].filter((o) => o.count > 0 || o.selected);
  const types = list("types");
  const weapons = list("weapons");
  const rarities = list("rarities");
  const exteriors = list("exteriors");
  const qualities = list("qualities");
  const phases = list("phases");
  const collections = list("collections");
  const toggle = (filter: ListFilter) => (key: string) => onChange({ [filter]: toggleValue(selection[filter], key) } as Partial<FilterSelection>);

  return (
    <div className={cn("border-t border-line", className)}>
      {types.length > 1 || selection.types.length > 0 ? (
        <FilterGroup title={t("groupType")} selectedCount={selection.types.length} defaultOpen>
          <OptionRows options={types} selected={selection.types} onToggle={toggle("types")} />
        </FilterGroup>
      ) : null}

      {weapons.length > 1 || selection.weapons.length > 0 ? (
        <FilterGroup title={t("groupWeapon")} selectedCount={selection.weapons.length} defaultOpen={selection.weapons.length > 0}>
          <WeaponRows options={weapons} selected={selection.weapons} onToggle={toggle("weapons")} />
        </FilterGroup>
      ) : null}

      {exteriors.length > 0 ? (
        <FilterGroup title={t("groupExterior")} selectedCount={selection.exteriors.length + (selection.floatMin !== null || selection.floatMax !== null ? 1 : 0)} defaultOpen>
          <ConditionGroup
            options={facets.exteriors}
            selected={selection.exteriors}
            floatMin={selection.floatMin}
            floatMax={selection.floatMax}
            onChange={onChange}
          />
        </FilterGroup>
      ) : null}

      {rarities.length > 0 ? (
        <FilterGroup title={t("groupRarity")} selectedCount={selection.rarities.length} defaultOpen>
          <OptionRows options={[...rarities].reverse()} selected={selection.rarities} onToggle={toggle("rarities")} rarity />
        </FilterGroup>
      ) : null}

      {facets.price ? (
        <FilterGroup title={t("groupPrice")} selectedCount={priceCount} defaultOpen>
          <PriceGroup bounds={facets.price} minPrice={selection.minPrice} maxPrice={selection.maxPrice} onChange={onChange} />
        </FilterGroup>
      ) : null}

      {qualities.length > 1 || selection.qualities.length > 0 ? (
        <FilterGroup title={t("groupQuality")} selectedCount={selection.qualities.length} defaultOpen={selection.qualities.length > 0}>
          <OptionRows
            options={qualities.map((o) => ({ ...o, label: QUALITY_LABEL[o.key] ?? o.label }))}
            selected={selection.qualities}
            onToggle={toggle("qualities")}
          />
        </FilterGroup>
      ) : null}

      {phases.length > 0 ? (
        <FilterGroup title="Phase" selectedCount={selection.phases.length} defaultOpen={selection.phases.length > 0}>
          <OptionRows options={phases} selected={selection.phases} onToggle={toggle("phases")} />
        </FilterGroup>
      ) : null}

      {collections.length > 0 ? (
        <FilterGroup title={t("groupCollection")} selectedCount={selection.collections.length} defaultOpen={selection.collections.length > 0}>
          <CollectionRows options={collections} selected={selection.collections} onToggle={toggle("collections")} />
        </FilterGroup>
      ) : null}

      {facets.narrowingInStock ? (
        <FilterGroup title={t("groupAvailability")} selectedCount={selection.inStock ? 1 : 0} defaultOpen={selection.inStock}>
          <Checkbox dense label={t("inStockOnly")} count={facets.inStockCount} checked={selection.inStock} onChange={() => onChange({ inStock: !selection.inStock })} />
        </FilterGroup>
      ) : null}
    </div>
  );
}

function CollectionRows({ options, selected, onToggle }: { options: FacetOption[]; selected: string[]; onToggle: (key: string) => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  return (
    <div>
      {options.length > 10 ? (
        <Input label="Find a collection" labelHidden size="sm" mono placeholder="Find a collection" value={query} onChange={(e) => setQuery(e.target.value)} wrapperClassName="mb-2" />
      ) : null}
      <div className="max-h-[320px] overflow-y-auto pr-1">
        <OptionRows options={visible} selected={selected} onToggle={onToggle} />
      </div>
    </div>
  );
}

export function FilterSummary({
  total,
  parts = [],
  chips = [],
  onClearAll,
  className,
}: {
  total: number;
  parts?: string[];
  chips?: { key: string; label: string; onRemove: () => void; rarity?: string }[];
  onClearAll?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <p className="m-0 font-mono text-data text-ink" aria-live="polite">
        {[`${total.toLocaleString("en-GB")} ${total === 1 ? "lot" : "lots"}`, ...parts].join(" · ")}
      </p>
      {chips.length > 0 ? (
        <FilterChipRow onClearAll={onClearAll}>
          {chips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} rarity={chip.rarity} onRemove={chip.onRemove} />
          ))}
        </FilterChipRow>
      ) : null}
    </div>
  );
}

export function ProductFiltersSheet({
  open,
  onClose,
  total,
  onClearAll,
  children,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  onClearAll: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("catalog");
  const titleId = useId();
  return (
    <Sheet open={open} onClose={onClose} side="bottom" labelledBy={titleId} className="!bg-mount">
      <div className="flex h-full flex-col">
        <div className="relative flex h-14 shrink-0 items-center justify-between pl-4 pr-2">
          <h2 id={titleId} className="font-display text-step-2 font-medium leading-none">
            {t("filtersTitle")}
          </h2>
          <button type="button" onClick={onClose} aria-label={t("closeFilters")} className="flex size-11 cursor-pointer items-center justify-center rounded-control text-ink">
            <X size={20} aria-hidden="true" />
          </button>
          <span aria-hidden="true" className="hang-rail absolute inset-x-0 bottom-0" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">{children}</div>
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line bg-mount px-4 py-3">
          <Button variant="ghost" onPress={onClearAll}>
            Clear all
          </Button>
          <Button onPress={onClose} className="flex-1">
            Show {total.toLocaleString("en-GB")} {total === 1 ? "lot" : "lots"}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
