# Veltskins — Design Brief: "Salon Hang"

This is the implementation prompt for the store engineer and the source of truth for the motion engineer. Read it top to bottom before touching code. `.claude/knowledge/DESIGN-MASTER.md`, `.claude/knowledge/CHECKLIST-QC.md` and `/home/claude/devtools/velt-common.md` still apply. Where this brief is more specific, follow this brief.

**The previous brief is retired.** This file replaces Patinaskins' "Inspection Bay" brief. Nothing from that visual language survives: no graphite room, no overhead lamp, no light pool on a stage, no 4px tray, no rarity spine, no calibrated float ruler, no amber jaw, no amber indicator, no Sofia Sans Condensed / Source Sans 3 / Martian Mono, no `ShoppingCart`, no `P`-monogram with an amber square. If you find yourself reusing an Inspection Bay shape because it already exists in the codebase, stop: the whole point of this project is that the two stores cannot be mistaken for each other.

**Scope.** Storefront only: `src/app/(store)/**`, `src/components/**` except `admin`, `src/styles/variables.css`, `src/styles/globals.css`, `src/styles/animations.css`, `src/app/layout.tsx`, `src/app/fonts.css`, `src/app/icon.svg`, `src/components/layout/ThemeScript`, `public/` brand assets, `scripts/gen-favicons.mjs`, `src/lib/email.ts`, `src/lib/invoice.ts`, `src/lib/brand.ts`, `src/lib/consent.ts` (key rename), `src/config/catalog.ts` and `src/lib/sih/sync.ts` (merchandising, §16). Admin (`src/app/admin/**`, `src/components/admin/**`, `src/styles/admin.css`) is isolated on `--admin-*` variables and keeps its own look; after the token swap, open every admin page once in both themes and fix only what became illegible.

**House rules for the code.** No comments anywhere. Reuse the existing utilities and components and restyle them rather than writing parallel ones (`Button`, `Field`, `Select`, `Choice`, `Plate`, `Chip`, `Tabs`, `Accordion`, `Dialog`, `Stepper`, `Pagination`, `Alert`, `ReadoutLoader`, `PriceDisplay`, `QuantitySelector`, `Breadcrumbs`, `EmptyState`, `ConfirmDialog`, `PaymentLogos`, `CartProvider`, `CurrencyProvider`, `ThemeProvider`, `src/lib/motion/*`, `src/components/skin/*`, `src/components/catalog/*`). Reuse the CS2 helpers in `src/lib/skins/cs2.ts` (`WEAPON_TYPES`, `RARITIES`, `raritySlug`, `EXTERIORS`, `exteriorDef`, `floatRangeLabel`, `skinTitle`, `isStarType`) instead of re-deriving any of it. Tokens only — no hex or `rgba()` in storefront components.

**One naming note before you start.** The components are currently named for the old concept (`SkinTray`, `SkinStage`, `FloatRuler`, `WeaponBays`, `WearWalk`, `RarityLadder`, `Spotlight`, `HomeHero`). Rename them as §13 specifies. A file called `FloatRuler.tsx` containing a condition grid will cause the next person to rebuild Inspection Bay by accident.

---

## 1. Direction

### 1.1 Concept statement

Veltskins is a salon hang. The store is a light, warm plaster viewing room, and every skin in it is a **lot** hung on that wall. A single thin **hang line** — a picture rail — runs horizontally across the page at a constant height, section after section, and the lots hang from it on hairline wires at different sizes, composed asymmetrically the way a nineteenth-century salon filled a wall: a large piece anchoring the group, smaller ones stepped around it, never a uniform grid. Under each lot sits its **wall label**: a small bone plate carrying the lot number, the weapon and finish, the condition, and the printed classification. A warm **spotlight** rakes the largest hung render from above-left. The UI around all this is a quiet catalogue: an antiqua serif for the voice, a plain grotesque for the controls, a mono for everything that is a number, hairlines instead of boxes, and one claret that marks only what you can act on.

The visitor should feel they are walking a well-lit viewing room where everything is catalogued, measured and labelled — and should be able to find a skin, read its condition and classification off the label, and buy it in a few clicks.

**The name.** A *velt* reading of the wall: the lots are hung, numbered and labelled before anyone looks at them. The catalogue is the product.

### 1.2 What carries colour, what stays quiet

- **The renders carry the colour.** CS2 finishes are loud; the wall is a warm neutral and stays out of their way. This is why the primary theme is light: a plaster wall makes a transparent PNG of a weapon read as an object hung on it, not as a cut-out floating in a void.
- **Rarity carries the second layer**, always in two places and nowhere else: the **2px stripe across the top edge of a wall label**, and the **printed classification line** in mono caps. Never a fill behind text, never a wash, never a glow, never a border around a whole object, never a tint on a render.
- **Claret is the accent and it is scarce.** Primary button fills, the focus ring, the active-nav rule, the selected state, the cart count, the hang line's hook marks when a section is active. Nothing else. Count the claret elements in any viewport: more than four non-button clarets means remove some.
- **The spotlight is warm white light, never a colour.** It exists on the home hero and the lot page only. It is never behind text.
- Everything else is plaster, ink and hairlines.

### 1.3 Signature motifs (repeat with discipline, §10)

1. **The hang line.** A 1px rule at `--color-rail`, running the full bleed width of a section at a fixed height within that section, with two small 2×7px **hook ticks** sitting on top of it wherever a lot hangs. Lots hang from it on 1px **wires**. It appears in the header's underline, in every home section, at the top of the footer, in the logo, and in the email and invoice headers. It is the one line that ties the whole site together, and it must land at the same optical height within every section that uses it.
2. **The wall label.** A bone plate (`--color-mount`), 0px radius, 1px hairline on all four sides except the top, where a **2px rarity stripe** sits flush. Inside, left-aligned and ruled: the lot number in mono micro-caps, the weapon line in mono micro-caps, the finish name in Newsreader, the condition line, and the classification line. The label is always *under* its lot, never over it, never beside it, and never contains a button. The Add control lives outside the label, below it.
3. **The raking spotlight.** An elliptical warm light that falls on a hung render from the upper **left** at about 25° off vertical, with a soft cast shadow thrown down and to the right. It is deliberately off-axis: a gallery picture light is mounted to one side, not directly overhead. It exists only on the home hero's anchor lot and on the lot page's hung render.

### 1.4 Moods per theme

- **Day Hang (light, primary, `:root`).** The viewing room during opening hours. Warm plaster wall, bone labels, ink text, claret marks, a daylight-warm spotlight on the anchor lot, soft long shadows cast down-right. Header is a lighter plaster fascia; footer is a deeper plaster skirting.
- **Evening Viewing (dark, designed counterpart).** The same room after hours with only the picture lights on. The wall goes to a warm near-black umber (`#1A1613`, a brown-black, never a blue-black and never graphite); labels become dark card stock; the spotlight is tighter, warmer and brighter relative to the wall, and the shadows are short and deep. The claret lifts to `#A82B3B` so it still reads as a wine red rather than going brown. This is a designed mood, not an inversion: the shadow lengths, the spotlight radius and the label stock all change.

### 1.5 Divergence audit (must hold on every page)

| Axis | Veltskins "Salon Hang" | Patinaskins "Inspection Bay" | Other siblings |
|---|---|---|---|
| Base | warm plaster `#EDE7DC`, **light-first** (`:root` is light) | graphite `#121315`, dark-first | Dresser chalk+chocolate; Drop District light concrete; Blueprint drafting paper; Chipwave porcelain; Aurora polar night; Console Deck ice white |
| Dark counterpart | warm umber-black `#1A1613` (brown-black) | grey studio `#E4E5E6` as the *light* counterpart | — |
| Accent | claret `#86203A` / `#A82B3B` | amber `#F39A2E` | chocolate+brass; orange-red; blueprint blue; lime; emerald-violet; signal blue |
| Display face | **Newsreader** (transitional antiqua) | Sofia Sans Condensed | Gloock; Anton; Space Grotesk; Archivo; Bricolage |
| UI face | **Instrument Sans** | Source Sans 3 | Commissioner; Inter; Karla |
| Data face | **Azeret Mono** | Martian Mono | JetBrains Mono; Red Hat Mono; Sometype Mono |
| Type scale | ratio **1.2**, base **16px** | ratio 1.25, base 17px | — |
| Geometry | 0px on everything printed, mounted or framed; **3px** only on controls | 0px planes / 2px controls / 4px trays / the jaw pentagon | 45° bevels; 2–6px with offset shadows; 10–12px; glass |
| Product object | **unboxed hung render + separate paper label below**, asymmetric salon composition, sizes vary within one view | boxed 4px tray with an enclosed stage and a data strip, uniform grid | shelf tiles; sticker cards; blueprint plates |
| Rarity device | **horizontal 2px stripe on the label's top edge** + printed classification line | 3px vertical spine on the tray's left edge | — |
| Exterior device | **condition grid** — five named cells FN/MW/FT/WW/BS in hairline boxes, the lot's cell inked | calibrated 0.00–1.00 tick ruler with a lit band and an amber jaw | tinted wear-gauge zones |
| StatTrak / Souvenir | **typographic**: a ruled `ST` box and an italic `Souvenir` annotation, both in ink — no mark colours exist in this system | coloured text marks (`#e98b4a`, `#e4c46a`) | — |
| Light | one **off-axis raking spotlight** from upper-left, on two surfaces only | a centred overhead lamp line + pool on *every* stage | — |
| Shadow | long soft cast shadow down-**right** (light is to the left) | short shadow straight below (light is overhead) | hard offset shadows |
| Cart | `ClipboardList`, word "Cart" | `ShoppingCart`, word "Cart" | `Handbag`, word "Bag" |
| Save | `Square` / `SquareCheck`, word "Mark" | `Bookmark`, word "Save" | `Heart` |
| Header | plaster fascia, lockup left, type nav centre, hang line as the bottom rule | dark rig + loadout board mega-menu | utility line + chocolate cornice |
| Footer | plaster skirting opened by a hang line, four columns, **unruled colophon** | bay floor opened by a ruler band, four columns, ruled credentials grid | brass plaque plinth |
| Home order | hang → today's lots strip → rooms → classification table → condition grid → marks → price bands → delivery → questions | hero → weapon bays → price bands → rarity ladder → wear walk → marks → delivery → questions |

**Banned here because a sibling owns them, or because the concept forbids them:** rarity spines, tick rulers of any kind, jaws or pentagon thumbs, light pools on product cards, boxed product tiles with enclosed stages, amber, graphite, sticker badges, rotated tags, tape rules, tickers, oversized index numerals as section openers, title blocks, stamps, registration/crop marks, millimetre grids, callout leader lines, glass panels, backdrop blur, decorative gradients, hard offset shadows, pills, neon, and any gradient other than the two named spotlight gradients in §3.1.

---

## 2. Token plumbing

### 2.1 Where tokens live

- `src/styles/variables.css` holds the CSS custom properties: the single source of colour, radius, shadow, font stacks, layout constants and motion timings.
- `src/styles/globals.css` holds the Tailwind v4 `@theme inline` block that turns those variables into utilities. Tailwind compiles from this block only.
- `tailwind.config.ts` mirrors the aliases. `globals.css` has no `@config`, so Tailwind does not read it; update it anyway so tools that read it stay in sync.
- `ThemeScript` sets `data-theme="light|dark"` and the `dark` class on `<html>` before paint; `@custom-variant dark ([data-theme="dark"] &)` stays.

### 2.2 Structural change: `:root` is **light**

Inspection Bay put the dark values on `:root`. Veltskins inverts that, and the reason is the concept, not novelty: the primary mood of this store is *the lit gallery*. A plaster wall is what makes an unboxed, transparent-background render read as an object hung in a room; on a dark ground an unboxed render reads as a cut-out and the whole product anatomy collapses. The light theme is therefore the designed primary, and a visitor without JavaScript must get it.

Concretely, in `src/components/layout/ThemeScript/*`:

```
var t=localStorage.getItem("veltskins-theme");if(t!=="light"&&t!=="dark"){t="light"}
```

The stored key moves from `theme` to **`veltskins-theme`** (all storage keys are renamed in §2.4). The toggle persists the choice as today. `color-scheme: light` on `:root`, `color-scheme: dark` under `[data-theme="dark"]`.

### 2.3 Keep every existing alias name, change what it points to

The storefront already compiles against the Inspection Bay variable names. Keep the names so day one still builds; change the values and the meanings, then rename in the sweep (§2.4). Current usage is heavy on `--color-text` / `--color-text-secondary` / `--color-border` / `--color-raised`, so those keep their names permanently.

| Existing variable | Utility alias | New meaning |
|---|---|---|
| `--color-bg` | `bg-surface` | **wall** — the page canvas |
| `--color-bg-secondary` | `bg-surface-1` | **band** — alternating full-bleed sections, disabled fills |
| `--color-bg-tertiary` | `bg-surface-2` | **inset** — wells, skeletons, the search field's recess |
| `--color-bg-warm` | `bg-surface-warm` | **note** — the claret-washed note box |
| `--color-raised` | `bg-raised` | → `--color-mount`: **label stock** — wall labels, panels, inputs, popovers, dialogs |
| `--color-stage` | `bg-stage` | retired. Renders are unboxed and sit on the wall. Alias it to `--color-bg` on day one, then delete it and every `bg-stage` call site. |
| `--color-on-stage` | `text-on-stage` | retired with it |
| `--color-rig` | `bg-fascia` | header |
| `--color-floor` | `bg-skirting` | footer |
| `--color-text` | `text-ink` | ink |
| `--color-text-secondary` | `text-ink-muted` | muted ink |
| `--color-text-tertiary` | `text-ink-faint` | faint ink (still ≥4.5:1 on every surface, §3.2) |
| `--color-accent` | `bg-brand`, `border-brand` | claret |
| `--color-accent-hover` | `bg-brand-hover` | claret hover/press |
| `--color-accent-light` | `bg-brand-wash` | claret wash for selected/hover fills |
| `--color-on-accent` | `text-on-brand` | text on claret |
| `--color-accent-ink` | `text-accent-ink` | claret as text (links on hover, active counts) |
| `--color-accent-2` | — | retired (was the lamp white). Delete. |
| `--color-accent-3` | `text-sale`, `bg-sale` | `= var(--color-accent-ink)`. No sale styling exists in this store (§15). |
| `--color-rule` | `border-rule`, `bg-rule` | strong 1px rule: table heads, active tabs, the totals rule |
| `--color-border` | `border-line` | hairline |
| `--color-border-hover` | `border-line-hover` | stronger hairline |
| `--color-border-control` | `border-control` | control borders (≥3:1) |
| `--color-focus` | `outline-focus` | focus ring |
| `--radius-*` | `rounded-*` | 0 / 3px, §5.3 |
| `--shadow-card`, `--shadow-card-hover` | `shadow-card*` | label at rest / lifted |
| `--shadow-contact` | `.cast-shadow` | the lot's cast shadow on the wall, thrown down-right |

### 2.4 New names to add

| Variable | Utility | Job |
|---|---|---|
| `--color-mount` | `bg-mount` | label stock / panel paper (`--color-raised` aliases to it) |
| `--color-fascia` | `bg-fascia` | header |
| `--color-skirting` | `bg-skirting` | footer |
| `--color-rail` | `border-rail`, `bg-rail` | the hang line and its hook ticks (non-text, ≥3:1 everywhere) |
| `--color-wire` | `bg-wire` | the 1px wire a lot hangs on (= `--color-border-hover`) |
| `--spot-rgb`, `--color-spot`, `--spot-alpha`, `--spot-rake`, `--spot-reach` | `bg-spot-rake` | the raking spotlight gradient and its two tuning scalars |
| `--rarity-consumer` … `--rarity-gold`, `--rarity` | `text-rarity-*`, `bg-rarity-*`, `border-rarity-*` | the seven CS2 rarity slugs |
| `--stripe` | — | the label's rarity stripe thickness (2px) |
| `--rail-inset` | — | how far the hang line is inset from a section's bleed edge (0 on full-bleed bands, `--gutter` inside contained sections) |
| `--color-success-wash` … `--color-info-wash`, `--color-on-danger` | `bg-*-wash`, `text-on-danger` | status tags and alerts |
| `--color-scrim` | `bg-scrim` | dialog and drawer backdrop |

`--mark-stattrak` and `--mark-souvenir` are **deleted**. StatTrak™ and Souvenir are typographic in this system (§7.6, §7.10), not coloured. Delete the variables and every call site.

Rarity is wired by attribute, never by per-component colour logic:

```css
[data-rarity="consumer"] { --rarity: var(--rarity-consumer); }
[data-rarity="industrial"] { --rarity: var(--rarity-industrial); }
[data-rarity="milspec"] { --rarity: var(--rarity-milspec); }
[data-rarity="restricted"] { --rarity: var(--rarity-restricted); }
[data-rarity="classified"] { --rarity: var(--rarity-classified); }
[data-rarity="covert"] { --rarity: var(--rarity-covert); }
[data-rarity="gold"] { --rarity: var(--rarity-gold); }
```

`--rarity` defaults to `var(--color-border-hover)` on `:root` (unknown rarity: a neutral stripe and no classification line). Components read `var(--rarity)` only. The slug comes from `raritySlug()` in `src/lib/skins/cs2.ts`, which already folds Extraordinary and Contraband into `gold`; the printed word comes from `rarityDef().label`, so Extraordinary and Contraband still print their own names even though they share a colour. Never render `rarityColor` from the database directly — it only picks the slug.

### 2.5 Mandatory sweeps

1. **Stage out.** `--color-stage`, `--color-on-stage`, `bg-stage`, `text-on-stage` and every component that wraps a render in a filled box are removed. A render sits on the wall with its cast shadow; the only "stage" left is the lot page's hung-render area, which is still wall-coloured and is defined by its light and its shadow, not by a fill or a border.
2. **Lamp out.** `--lamp-rgb`, `--color-lamp`, `--lamp-line`, `--lamp-pool-alpha`, `--stage-lamp`, `--lamp-catch`, `--lamp-inset`, `--lamp-level`, `.lamp-line`, `.stage-lamp`, the `lamp-on` keyframe, `LAMP_POSE` and `lamp-gl.ts`'s lamp-specific uniforms. The spotlight (§3.1) replaces them with different geometry, a different name and a different number of surfaces.
3. **Spine out.** `--spine`, every `data-spine`, `RarityLadder`'s spine scaling, the tray spine. Rarity becomes the label stripe.
4. **Ruler out.** `src/components/skin/FloatRuler.tsx` is replaced by `ConditionGrid.tsx` (§7.9). Delete the tick generation, the jaw SVG, the dual-jaw slider and `MOTION_LIMITS` entries that reference them.
5. **Marks out.** `--mark-stattrak`, `--mark-souvenir` and the coloured tag variants; replaced per §7.6.
6. **Text on claret.** Every `text-white` or `#fff` on `bg-brand` becomes `text-on-brand`; on `bg-danger` it becomes `text-on-danger`.
7. **Hex hunt.** No hex or `rgba()` in storefront components, including `BrandMark.tsx`, the home components, auth and account.
8. **Storage keys.** `theme` → `veltskins-theme`; `patinaskins-consent` → `veltskins-consent` (`src/lib/consent.ts`, including the `patina:consent-change` event name → `velt:consent-change`); cart, currency and marked-lots keys all take the `veltskins-` prefix. Update the Cookie Policy table to list the new keys.
9. **Brand strings.** `src/lib/brand.ts` → name `Veltskins`, domain `veltskins.com`, tagline "Counter-Strike 2 skins, catalogued and delivered by Steam trade offer". Then grep the whole repo for `Patinaskins`, `patinaskins`, `patina`, `Inspection Bay`, `Brasmora` and `Dresser` and remove every hit outside this brief.
10. **Old home tree.** `HomeHero`, `WeaponBays`, `WearWalk`, `RarityLadder`, `Spotlight`, `PriceBands`, `MarksSplit`, `ProductRail`, `HomeDelivery`, `HomeQuestions`, `SectionHead` are rebuilt to §13.1; the motion scenes `bay-hero`, `bays`, `rarity-ladder`, `marks` are replaced by the scene names in §12.2.

---

## 3. Colour tokens

### 3.1 `src/styles/variables.css` — replace the colour, shadow, radius, font and motion parts with this

```css
:root {
  --color-primary: #221e1a;
  --color-secondary: #f8f5ef;

  --color-bg: #ede7dc;
  --color-bg-secondary: #e4dcce;
  --color-bg-tertiary: #dcd3c3;
  --color-bg-warm: #f2e1e3;
  --color-mount: #f8f5ef;
  --color-raised: var(--color-mount);
  --color-fascia: #f4efe7;
  --color-skirting: #e2d9ca;

  --color-text: #221e1a;
  --color-text-secondary: #58504a;
  --color-text-tertiary: #5f5750;

  --color-accent: #86203a;
  --color-accent-hover: #6a152c;
  --color-accent-light: #f2e1e3;
  --color-on-accent: #fbf6f0;
  --color-accent-ink: #86203a;
  --color-accent-3: var(--color-accent-ink);

  --color-rule: #b8ac99;
  --color-rail: #7c7265;
  --color-wire: #b8ac99;
  --color-border: #d3c9b9;
  --color-border-hover: #b8ac99;
  --color-border-control: #85796a;
  --color-focus: #74182f;

  --color-success: #1e6b43;
  --color-success-wash: #dce8de;
  --color-warning: #8a5207;
  --color-warning-wash: #efe4ce;
  --color-danger: #a8231c;
  --color-danger-wash: #f2dfda;
  --color-on-danger: #fbf6f0;
  --color-info: #2f4f6b;
  --color-info-wash: #dde3e8;

  --rarity-consumer: #4e5a62;
  --rarity-industrial: #1e5578;
  --rarity-milspec: #2c3c96;
  --rarity-restricted: #5c2e9c;
  --rarity-classified: #8c1c76;
  --rarity-covert: #ae3318;
  --rarity-gold: #6e5407;
  --rarity: var(--color-border-hover);

  --spot-rgb: 255 246 228;
  --color-spot: rgb(var(--spot-rgb));
  --spot-alpha: 0.55;
  --spot-reach: 76%;
  --spot-rake: radial-gradient(
    ellipse var(--spot-reach) 64% at var(--sx, 32%) var(--sy, 8%),
    rgb(var(--spot-rgb) / calc(var(--spot-alpha) * var(--spot-level, 1))),
    rgb(var(--spot-rgb) / 0) 70%
  );

  --color-scrim: rgb(34 30 26 / 0.46);

  --shadow-sm: none;
  --shadow-md: none;
  --shadow-card: none;
  --shadow-card-hover: 0 14px 26px -16px rgb(34 30 26 / 0.3);
  --shadow-lg: 0 0 0 1px #d3c9b9, 0 18px 34px -20px rgb(34 30 26 / 0.3);
  --shadow-xl: 0 0 0 1px #d3c9b9, 0 34px 64px -28px rgb(34 30 26 / 0.36);
  --shadow-accent: 0 0 0 2px #74182f;
  --shadow-panel: -1px 0 0 #d3c9b9, -34px 0 64px -34px rgb(34 30 26 / 0.3);
  --shadow-panel-left: 1px 0 0 #d3c9b9, 34px 0 64px -34px rgb(34 30 26 / 0.3);
  --shadow-contact: rgb(34 30 26 / 0.24);
  --cast-skew: 14deg;
  --cast-reach: 1.18;

  --radius-control: 3px;
  --radius-sm: 3px;
  --radius-md: 3px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  --radius-2xl: 0px;
  --radius-pill: 3px;

  --stripe: 2px;
  --rail-inset: 0px;
  --rail-hook: 7px;

  --max-width: 1440px;
  --header-height: 72px;
  --header-height-compact: 60px;
  --header-height-mobile: 60px;
  --gutter: 16px;

  --z-base: 0;
  --z-lot: 1;
  --z-sticky: 40;
  --z-dropdown: 50;
  --z-drawer: 60;
  --z-modal: 70;
  --z-toast: 80;
  --z-cookie: 90;

  --font-sans: var(--font-instrument), "Instrument Sans Variable", "Instrument Fallback", "Segoe UI", sans-serif;
  --font-display: var(--font-newsreader), "Newsreader Variable", "Newsreader Fallback", Georgia, "Times New Roman", serif;
  --font-mono: var(--font-azeret), "Azeret Mono Variable", "Azeret Fallback", ui-monospace, Menlo, Consolas, monospace;

  --ease-hang: cubic-bezier(0.22, 0.61, 0.21, 1);
  --ease-settle: cubic-bezier(0.33, 1.02, 0.4, 1);
  --ease-std: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-micro: 120ms;
  --dur-ui: 220ms;
  --dur-panel: 300ms;
  --dur-panel-close: 240ms;
  --dur-reveal: 760ms;
  --dur-reduced: 120ms;

  --selection-bg: #86203a;
  --selection-fg: #fbf6f0;

  color-scheme: light;
}

@media (min-width: 640px) {
  :root { --gutter: 24px; }
}

@media (min-width: 1024px) {
  :root { --gutter: 40px; }
}

[data-theme="dark"] {
  --color-primary: #efe8dd;
  --color-secondary: #231e1a;

  --color-bg: #1a1613;
  --color-bg-secondary: #15110f;
  --color-bg-tertiary: #110e0c;
  --color-bg-warm: #2c1a1c;
  --color-mount: #231e1a;
  --color-fascia: #211c19;
  --color-skirting: #120f0d;

  --color-text: #efe8dd;
  --color-text-secondary: #b3a99c;
  --color-text-tertiary: #978d80;

  --color-accent: #a82b3b;
  --color-accent-hover: #c2404f;
  --color-accent-light: #2c1a1c;
  --color-on-accent: #fff4ef;
  --color-accent-ink: #de9ba4;

  --color-rule: #4a413a;
  --color-rail: #7a6f63;
  --color-wire: #4a413a;
  --color-border: #332c27;
  --color-border-hover: #4a413a;
  --color-border-control: #7e7367;
  --color-focus: #de9ba4;

  --color-success: #6fbf8e;
  --color-success-wash: #17241c;
  --color-warning: #dfa860;
  --color-warning-wash: #271d12;
  --color-danger: #f08177;
  --color-danger-wash: #2b1715;
  --color-on-danger: #1a1613;
  --color-info: #a3b8ca;
  --color-info-wash: #1a2027;

  --rarity-consumer: #c6ccd0;
  --rarity-industrial: #77b4de;
  --rarity-milspec: #909ef0;
  --rarity-restricted: #be98ee;
  --rarity-classified: #e87fd4;
  --rarity-covert: #f4796a;
  --rarity-gold: #e3be55;

  --spot-rgb: 255 230 196;
  --spot-alpha: 0.14;
  --spot-reach: 62%;

  --color-scrim: rgb(10 8 7 / 0.7);

  --shadow-card: none;
  --shadow-card-hover: 0 14px 28px -16px rgb(0 0 0 / 0.8);
  --shadow-lg: 0 0 0 1px #332c27, 0 18px 34px -20px rgb(0 0 0 / 0.72);
  --shadow-xl: 0 0 0 1px #332c27, 0 34px 64px -28px rgb(0 0 0 / 0.82);
  --shadow-accent: 0 0 0 2px #de9ba4;
  --shadow-panel: -1px 0 0 #332c27, -34px 0 64px -34px rgb(0 0 0 / 0.78);
  --shadow-panel-left: 1px 0 0 #332c27, 34px 0 64px -34px rgb(0 0 0 / 0.78);
  --shadow-contact: rgb(0 0 0 / 0.6);
  --cast-skew: 10deg;
  --cast-reach: 0.86;

  --selection-bg: #a82b3b;
  --selection-fg: #fff4ef;

  color-scheme: dark;
}

::selection { background: var(--selection-bg); color: var(--selection-fg); }
```

Two notes on the shadow block. `--shadow-card` is `none` in **both** themes: a wall label is printed card lying flat on the wall, it does not float. The only shadow a lot gets is `.cast-shadow`, which is skewed by `--cast-skew` and stretched by `--cast-reach` so the light reads as coming from the upper left — long and soft in Day Hang, short and deep in Evening Viewing.

### 3.2 Measured contrast — text, controls, semantics

WCAG 2.x relative-luminance ratios, computed for these exact hex pairs. Text needs 4.5:1; non-text (control borders, focus rings, the hang line, the rarity stripe) needs 3:1. **Everything below passes.**

| Pair | Day Hang (light) | Evening Viewing (dark) |
|---|---|---|
| ink / wall | 13.45 | 14.77 |
| ink / band | 12.16 | 15.42 |
| ink / mount (label) | 15.21 | 13.57 |
| ink / inset | 11.15 | 15.80 |
| ink / fascia | 14.46 | 13.86 |
| ink / skirting | 11.83 | 15.69 |
| muted / wall | 6.41 | 7.77 |
| muted / band | 5.80 | 8.11 |
| muted / mount | 7.25 | 7.13 |
| muted / inset | 5.32 | 8.31 |
| muted / fascia | 6.89 | 7.29 |
| muted / skirting | 5.64 | 8.25 |
| faint / wall | 5.75 | 5.51 |
| faint / band | 5.20 | 5.75 |
| faint / mount | 6.51 | 5.06 |
| faint / inset | 4.77 | 5.90 |
| faint / fascia | 6.19 | 5.17 |
| faint / skirting | 5.06 | 5.85 |
| on-claret / claret (primary button) | 8.57 | 6.32 |
| on-claret / claret-hover | 11.13 | 4.70 |
| claret-ink (claret as text) / wall | 7.48 | 7.99 |
| claret-ink / band | 6.76 | 8.34 |
| claret-ink / mount | 8.46 | 7.33 |
| claret-ink / fascia | 8.04 | 7.50 |
| claret-ink / skirting | 6.58 | 8.48 |
| claret-ink / claret wash | 7.30 | 7.34 |
| ink / claret wash | 13.13 | 13.57 |
| muted / claret wash | 6.26 | 7.13 |
| focus ring / wall `[3:1]` | 8.91 | 7.99 |
| focus ring / band `[3:1]` | 8.06 | 8.34 |
| focus ring / mount `[3:1]` | 10.08 | 7.33 |
| focus ring / fascia `[3:1]` | 9.58 | 7.50 |
| focus ring / skirting `[3:1]` | 7.84 | 8.48 |
| control border / wall `[3:1]` | 3.45 | 3.88 |
| control border / band `[3:1]` | 3.12 | 4.05 |
| control border / mount `[3:1]` | 3.91 | 3.57 |
| hang line / wall `[3:1]` | 3.83 | 3.67 |
| hang line / band `[3:1]` | 3.47 | 3.83 |
| hang line / mount `[3:1]` | 4.33 | 3.37 |
| hang line / skirting `[3:1]` | 3.37 | 3.89 |
| success / wall | 5.27 | 8.15 |
| success / mount | 5.96 | 7.48 |
| success / success wash | 5.14 | 7.29 |
| warning / wall | 5.19 | 8.48 |
| warning / mount | 5.86 | 7.79 |
| warning / warning wash | 5.06 | 7.80 |
| danger / wall | 5.84 | 6.94 |
| danger / mount | 6.60 | 6.38 |
| danger / danger wash | 5.59 | 6.56 |
| info / wall | 6.96 | 8.79 |
| info / mount | 7.87 | 8.07 |
| info / info wash | 6.62 | 8.02 |
| on-danger / danger | 6.69 | 6.94 |

**Light-pool checks.** In Day Hang the spotlight blends the wall 55% toward `#FFF6E4` → `#F7EFE0`; ink reads 14.49, muted 6.91, faint 6.20 there, so any tier of text is safe inside the pool. In Evening Viewing the spotlight blends the wall 14% toward `#FFE6C4` → `#3A332C`; ink reads 10.21 and muted 5.37, but **faint drops to 3.81**. Rule: in the dark theme, no faint-tier text may sit inside the spotlight. The only text near the spotlight is the lot page's heading and price, both of which are ink.

**Adjustments made to reach these numbers** (recorded so nobody "tidies" them back): the faint tier was darkened from `#6E655D` to `#5F5750` to clear 4.5:1 on the band, inset and skirting; the hang line was darkened from `#8C8375` to `#7C7265` in light and lightened from `#6E6459` to `#7A6F63` in dark to clear 3:1 on the band and the label stock respectively.

### 3.3 Measured contrast — the seven rarity tokens

Every rarity token is used both as a 2px stripe (non-text, 3:1) and as the printed classification word and the rarity filter row label (text, 4.5:1), so all of them are tuned to clear **4.5:1 on every surface a label can sit on**.

| Tier (slug) | Day Hang hex | wall | band | label | skirting | Evening hex | wall | band | label | skirting |
|---|---|---|---|---|---|---|---|---|---|---|
| Consumer Grade (`consumer`) | `#4E5A62` | 5.76 | 5.21 | 6.51 | 5.07 | `#C6CCD0` | 11.09 | 11.57 | 10.18 | 11.77 |
| Industrial Grade (`industrial`) | `#1E5578` | 6.50 | 5.88 | 7.35 | 5.72 | `#77B4DE` | 8.02 | 8.37 | 7.36 | 8.52 |
| Mil-Spec Grade (`milspec`) | `#2C3C96` | 7.78 | 7.03 | 8.80 | 6.84 | `#909EF0` | 7.14 | 7.45 | 6.55 | 7.58 |
| Restricted (`restricted`) | `#5C2E9C` | 7.34 | 6.63 | 8.30 | 6.45 | `#BE98EE` | 7.63 | 7.97 | 7.01 | 8.11 |
| Classified (`classified`) | `#8C1C76` | 6.71 | 6.07 | 7.59 | 5.90 | `#E87FD4` | 7.21 | 7.52 | 6.62 | 7.65 |
| Covert (`covert`) | `#AE3318` | 5.19 | 4.69 | 5.87 | 4.57 | `#F4796A` | 6.67 | 6.96 | 6.12 | 7.08 |
| Extraordinary · Contraband · ★ (`gold`) | `#6E5407` | 5.82 | 5.26 | 6.58 | 5.12 | `#E3BE55` | 10.07 | 10.51 | 9.25 | 10.69 |

**Why not Steam's raw hex.** On the plaster wall, Steam's Consumer `#B0C3D9` measures 1.49 and Contraband `#E4AE39` 1.82 — both unreadable; Mil-Spec `#4B69FF` is 4.25 and fails as text. Each token above keeps the tier's hue identity and moves only lightness and chroma, so players still recognise the ladder at a glance.

**Covert was adjusted.** It started at `#BB3A1C` and failed on the band (4.13) and the skirting (4.02); it is now `#AE3318`, which clears both. Covert is also the one tier that sits in the same family as the accent, so it is deliberately pushed toward scarlet-orange (hue ≈ 10°) while the claret stays a wine (hue ≈ 347°), and the two never appear in the same role — see §3.4.

### 3.4 Colour rules

- **Rarity appears in exactly two places:** the 2px stripe flush along the top edge of a wall label, and the printed classification line in mono caps on that label (and in the rarity filter rows, the lot page spec table, cart rows and purchase rows). Never as a fill, a wash, a glow, an outline around a whole object, or a tint on a render.
- **Claret appears only on interactive things:** button fills, the focus ring, the 2px active-nav rule, the selected segment's underline, the cart count, the hook ticks of a section's hang line when that section is the active one. Claret is **never** a rarity, never a stripe on a label, never a classification colour, never on a label at all.
- Because claret and Covert are both reds, keep them apart by role **and** by shape: claret is a fill or a horizontal 2px rule under an interactive element; Covert is a 2px stripe on the top edge of a printed label plus a word. They never touch, and no viewport ever shows claret inside a label.
- **Semantic colours** (success, warning, danger, info) appear only in status contexts — form errors, alerts, the purchase timeline, toasts — always with an icon and a word. They never appear on a lot or its label, so danger red and Covert never meet.
- `--color-border` hairlines are decorative and never the only boundary of a control. Controls use `--color-border-control`.
- **The spotlight** (`--spot-rake`) is the only gradient in the system, and it exists on exactly two surfaces: the home hero's anchor lot and the lot page's hung render. Nowhere else, never behind text in the dark theme at faint weight, never coloured, never pulsing.

---

## 4. Typography

### 4.1 Packages, why these, and what was rejected

All three verified present on npm at **5.3.0** (`npm view @fontsource-variable/<name> version`). None is used by any sibling store.

| Role | Package | Axes (checked in the package's `metadata.json`) | Why this face |
|---|---|---|---|
| Display | **`@fontsource-variable/newsreader`** | `wght 200–800`, `opsz 6–72`, italic | A transitional antiqua with real optical-size range. It is the catalogue voice: moderate stroke contrast, sturdy bracketed serifs, a slightly narrow lowercase, and at `opsz 36+` the serifs sharpen into something that looks set rather than typed. It can carry a 96px frontispiece headline *and* a 20px finish name on a wall label, which is exactly what a hang needs — one voice at two scales. Subsets: latin, latin-ext, vietnamese. |
| UI | **`@fontsource-variable/instrument-sans`** | `wght 400–700`, `wdth 75–100`, italic | A quiet modern grotesque with slightly compressed proportions and low-contrast, almost invisible personality. It does the opposite job to the serif: it should be read without being noticed. The `wdth` axis lets dense UI (filter rows, the weapon index, mobile nav) run at 88% without a second family. |
| Data | **`@fontsource-variable/azeret-mono`** | `wght 100–900`, italic | A grotesque-skeleton mono with tight apertures and flat terminals. It reads as a typed accession record rather than a code editor, which is what the lot number, the float range and the prices should feel like. `tnum`, `frac`, `numr`/`dnom` are all present. |

**Rejected, and why.** *Source Serif 4* — a very good transitional, but it shares the Source family name with Patinaskins' body face and the two would be filed as relatives. *Literata* — slabbier and screen-reading-neutral; it has no catalogue formality. *Petrona* — close to Newsreader but weaker at display sizes. *Bodoni Moda* — a didone would be the obvious "auction house" cliché, it is unreadable below 18px, and the owner asked for an antiqua/transitional, not a didone. *Crimson Pro* and *EB Garamond* — old-style, too bookish and too soft for a store with a lot of numbers. *Public Sans* — correct but dull, with no width axis. *Schibsted Grotesk* — good, but its editorial warmth competes with the serif instead of receding. *Geist* / *Geist Mono* — excluded on principle, we do not borrow Vercel's voice. *Spline Sans Mono* — clean but characterless next to Azeret.

### 4.2 Loading

`src/app/layout.tsx`:

```ts
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/instrument-sans/wdth.css";
import "@fontsource-variable/azeret-mono/wght.css";
import "./fonts.css";
```

The Newsreader `opsz.css` build carries **both** `wght` and `opsz`, so one file gives the whole display range; the Instrument Sans `wdth.css` build carries `wght` and `wdth`. Latin and latin-ext only — do not pull the Vietnamese subset. Uninstall `@fontsource-variable/sofia-sans-condensed`, `@fontsource-variable/source-sans-3`, `@fontsource-variable/martian-mono` and delete their files from `public/fonts/` and any preload.

`src/app/fonts.css`:

```css
:root {
  --font-newsreader: "Newsreader Variable";
  --font-instrument: "Instrument Sans Variable";
  --font-azeret: "Azeret Mono Variable";
}

@font-face {
  font-family: "Newsreader Fallback";
  src: local("Georgia"), local("Times New Roman"), local("Liberation Serif");
  size-adjust: 88%;
  ascent-override: 83.5%;
  descent-override: 30%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Instrument Fallback";
  src: local("Arial"), local("Helvetica"), local("Liberation Sans");
  size-adjust: 98%;
  ascent-override: 99%;
  descent-override: 25.5%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Azeret Fallback";
  src: local("Menlo"), local("DejaVu Sans Mono"), local("Consolas");
  size-adjust: 101%;
  ascent-override: 92.8%;
  descent-override: 22.8%;
  line-gap-override: 0%;
}
```

Those overrides are derived from the real metrics (Newsreader 2000 upm, asc 1470 / desc 530, x-height 0.426, cap 0.670; Instrument Sans 1000 upm, asc 970 / desc 250, x-height 0.510, cap 0.720; Azeret Mono 1000 upm, asc 937 / desc 230, x-height 0.544, cap 0.698). Tune them in Playwright against the real fonts until swapping shifts the hero H1, a body paragraph and a price by less than 2px. Preload the one latin Newsreader woff2 the hero H1 uses (resolve the hashed path from the package at build time, or copy that single file into `public/fonts/` and preload it).

`font-synthesis: none` globally.

### 4.3 Weights and numerals

- **Newsreader** 400 (leads, pull sentences), **500** (every heading, the wordmark, finish names), 600 (the home H1 only, and the lot page price), italic 400 (the `Souvenir` annotation and nothing else). Set `font-variation-settings: "opsz" <px>` to match the rendered size wherever it is above 32px; below that leave `opsz` at its default.
- **Instrument Sans** 400 (body, UI), 500 (form labels, filter values), 600 (nav, buttons, table heads). `font-stretch: 88%` for dense rows (`.compact`); 100% everywhere else.
- **Azeret Mono** 400 (readouts, lot numbers, counts, IDs), 500 (micro-caps labels, tags), 600 (prices).

All three fonts carry `tnum`; Azeret is monospaced by construction. **Prices, floats, counts, order IDs and lot numbers are always Azeret.** Instrument Sans may set numbers inside a sentence but never a column of them. Newsreader sets a number only in the lot page price.

**Glyph coverage, checked in the subsets.** None of the three has `★` (U+2605) or `→` (U+2192). The star is our own inline SVG (`StarMark`, §7.10); arrows are Lucide `ArrowRight` / `ArrowUpRight`, never a text arrow. `™`, `·`, `–`, `—`, `£`, `€`, `×`, `−`, `…`, `§` are present in all three — write `StatTrak™` with the real glyph.

### 4.4 Modular scale — ratio 1.2 (minor third), base 16px

Instrument Sans has a 0.510 x-height, so 16px body here is optically the same size as Patinaskins' 17px Source Sans. The smaller ratio is deliberate: a catalogue builds hierarchy from typeface, case and position, not from size jumps, and 1.2 keeps eight steps inside a usable range while leaving room for one very large display step at the top.

```css
@theme inline {
  --text-step--2: 0.6875rem;
  --text-step--1: 0.8125rem;
  --text-step-0: 1rem;
  --text-step-1: clamp(1.125rem, 1.08rem + 0.22vw, 1.2rem);
  --text-step-2: clamp(1.3125rem, 1.22rem + 0.46vw, 1.44rem);
  --text-step-3: clamp(1.5rem, 1.34rem + 0.8vw, 1.728rem);
  --text-step-4: clamp(1.75rem, 1.47rem + 1.38vw, 2.0736rem);
  --text-step-5: clamp(2rem, 1.56rem + 2.2vw, 2.4883rem);
  --text-step-6: clamp(2.375rem, 1.72rem + 3.28vw, 2.986rem);
  --text-display-xl: clamp(3rem, 1.1rem + 8.2vw, 6.25rem);
  --text-ui-md: 0.9375rem;
  --text-ui-sm: 0.875rem;
  --text-ui-xs: 0.8125rem;
  --text-data: 0.8125rem;
  --text-data-sm: 0.6875rem;
}
```

| Role | Face | Size token | Leading | Tracking | Case |
|---|---|---|---|---|---|
| Home H1 (frontispiece) | Newsreader 600, `opsz 72` | display-xl | 0.94 | -0.02em | sentence |
| Landing H1 (about, how delivery works) | Newsreader 500, `opsz 56` | step-6 | 1.0 | -0.015em | sentence |
| Store H1 (catalogue, type, finish name, account) | Newsreader 500, `opsz 44` | step-5 | 1.06 | -0.01em | sentence |
| H2 section | Newsreader 500, `opsz 36` | step-4 | 1.12 | -0.005em | sentence |
| H3 / panel title | Newsreader 500 | step-2 | 1.2 | 0 | sentence |
| Finish name on a wall label | Newsreader 500 | step-1 | 1.24 | 0 | as named |
| Lot number | Azeret 500 | data-sm (11px) | 1.2 | 0.1em | uppercase |
| Weapon line, eyebrow, column head, micro-label | Azeret 500 | data-sm (11px) | 1.2 | 0.1em | uppercase |
| Classification line | Azeret 500 | data-sm (11px) | 1.2 | 0.1em | uppercase, in `var(--rarity)` |
| Condition line | Instrument 400 | ui-sm (14px) | 1.4 | 0 | sentence, float range in Azeret 400 |
| Lead paragraph | Newsreader 400 | step-1 | 1.56 | 0 | sentence |
| Body | Instrument 400 | step-0 (16px) | 1.62 | 0 | sentence |
| UI label, form label | Instrument 500 | ui-md (15px) | 1.3 | 0 | sentence |
| Meta, captions, breadcrumbs | Instrument 400 | ui-sm (14px) | 1.45 | 0.004em | sentence |
| Nav links, buttons | Instrument 600 | ui-sm / 15px / 16px | 1 | 0.06em | uppercase |
| Price on a wall label | Azeret 600 | 0.9375rem | 1.1 | 0 | — |
| Price on the lot page | Newsreader 600, `opsz 40` | step-4 | 1.0 | -0.01em | — |
| Order total | Azeret 600 | step-2 | 1.05 | 0 | — |
| Readouts (floats, counts, IDs, timers) | Azeret 400 | data (13px) | 1.4 | 0 | — |

**Rules.** Mono is for data and micro-labels only, never for a sentence. Uppercase is for Azeret micro-labels, Instrument nav and Instrument buttons only — headings are always sentence case. Reading blocks (about, policies, FAQ answers, how delivery works) are capped at **66ch**. Body never below 16px, meta never below 14px, micro-labels never below 11px. Italic exists in exactly one place: the `Souvenir` annotation.

**The deliberate contrast of the pairing** is serif-display against grotesque-UI against mono-data — three different skeletons. Never set a heading in Instrument Sans and never set a control label in Newsreader; the one exception is the Add button on a lot, which stays Instrument 600 like every other button.

### 4.5 Global base rules in `globals.css`

- `body`: `var(--font-sans)`, 1rem, line-height 1.62, `var(--color-bg)`, `var(--color-text)`.
- `h1–h6`: `var(--font-display)`, weight from the role table, `font-synthesis: none`, `text-wrap: balance`.
- `p`: `text-wrap: pretty`.
- `@utility eyebrow` becomes the Azeret micro-label: 11px, 500, uppercase, 0.1em tracking, `--color-text-secondary`.
- New `@utility data` (Azeret 400, 13px) and `@utility compact` (`font-stretch: 88%`, Instrument only).
- `@utility tabular` stays, for the rare Instrument number inside a sentence.
- Scrollbar: thumb `--color-border-hover`, track `--color-bg-tertiary`, 0px radius.

---

## 5. Space, layout, geometry, borders, elevation

### 5.1 Spacing

A 1.3-ish ladder, deliberately different from the sibling's doubling scale, so section rhythms cannot coincide:

`4 · 8 · 12 · 18 · 24 · 32 · 44 · 56 · 72 · 96 · 120 · 152 · 192`

Section rhythm is uneven on purpose — §13.1 gives each home section its own top and bottom padding. The catalogue is dense (24px column gap, 44px row gap, because the rows must leave air under each label) and the landing set-pieces are generous.

### 5.2 Layout

| Token | Value | Use |
|---|---|---|
| `--container-container` | 1440px | default content width |
| `--container-wide` | 1600px | home set-pieces, footer inner |
| `--container-narrow` | 1100px | checkout, account, purchases |
| `--container-read` | 640px | policies, FAQ answers, about text (≈66ch at 16px) |
| gutters | 16px (<640), 24px (640–1023), 40px (≥1024) | |
| grid | 12 columns / 28px gap (≥1024); 6 / 18px (640–1023); 4 / 12px (<640) | |

Breakpoints: 390 (the mobile design base), 640, 1024, 1280, 1536.

**The hang line's height within a section is a layout constant, not a per-section decision.** In any section that uses the rail, the rail sits at `72px` from the section's content top on desktop and `48px` on mobile, and the lots hang below it. Sections that do not use the rail (checkout, policies, forms) do not fake one.

### 5.3 Geometry language — "cut and mounted, not machined"

Inspection Bay deburred its corners at 2px and gave its tray 4px. Salon Hang does the opposite: **anything printed, mounted or framed is cut square, and only the hardware you physically touch is eased.**

- **0px — everything printed, mounted, framed or structural.** Wall labels, panels, dialogs, drawers, the cart summary, images, tables, bands, the header, the footer, the cookie panel, toasts, the search panel, skeletons. A mount is cut with a blade; a blade does not round corners. This is the dominant geometry and it must be visibly dominant: most of the page has no radius at all.
- **3px — only controls you touch.** Buttons, text inputs, selects, checkboxes, segmented cells, chips, pagination cells, the quantity stepper. Not 2px (that is the sibling's value and reads as a machining chamfer) and not 6px (that reads as a generic web button). At 3px on a 48px control, the corner is a deliberate ease you can see without the control looking soft.
- **Circles** only for the radio dot and the purchase-timeline nodes. No pills anywhere; `--radius-pill` is 3px.
- **No shape is non-rectangular.** There is no jaw, no pentagon, no chevron tab, no notch. The one diagonal in the whole system is the pair of 1px wires in the logo and in the hero's hang.
- Third-party payment logos keep their own rounded white cards untouched.

### 5.4 Borders and rules

- **Hairline:** 1px `--color-border` — section dividers, table rows, label edges, panel edges.
- **Rule:** 1px `--color-rule` — table head underlines, the totals rule, an active tab, the rule above a footer column group.
- **Hang line:** 1px `--color-rail`, full bleed or inset by `--rail-inset`, with `--rail-hook` (7px) tall × 2px wide hook ticks sitting **on top of** it at each hanging point. The ticks are `--color-rail` normally and `--color-accent` on the active section only.
- **Wire:** 1px `--color-wire`, from a hook tick down to the top edge of a lot's render box. Length is part of the composition: a salon hang uses *different* wire lengths to step the lots, 18–64px.
- **Rarity stripe:** `--stripe` (2px), `var(--rarity)`, flush along the **top** edge of a wall label, full label width.
- **Control:** 1px `--color-border-control`; hover `--color-text-secondary`; focus adds the ring; error 2px `--color-danger`.

### 5.5 Elevation — light from the upper left

| Level | Token | Use |
|---|---|---|
| e0 | none | the wall, bands, labels, tables, text, lots at rest |
| e1 | `--shadow-card-hover` | a lifted label on hover, the sticky buy bar when stuck |
| e2 | `--shadow-lg` | popovers, the catalogue index panel, the search panel, toasts |
| e3 | `--shadow-xl`, `--shadow-panel` | dialogs, the cart drawer, the mobile menu |

**Wall labels have no resting shadow in either theme.** The only shadow a lot has is `.cast-shadow`:

```css
.cast-shadow {
  width: 62%;
  height: 12px;
  background: radial-gradient(closest-side, var(--shadow-contact), transparent);
  transform: translateX(calc(var(--cast-reach) * 6%)) skewX(var(--cast-skew)) scaleX(var(--cast-reach));
  transform-origin: left center;
}
```

It sits directly under the render, offset to the right because the light is to the left. No coloured shadows, no glows, no inner highlights.

### 5.6 Z-index

`base 0 · lot 1 · sticky 40 · dropdown 50 · drawer 60 · modal 70 · toast 80 · cookie 90`.

---

## 6. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 120ms | hover, press, focus, chip swaps |
| `--dur-ui` | 220ms | accordions, tabs, filter groups, segmented controls |
| `--dur-panel` | 300ms | cart drawer, catalogue index, dialogs, mobile menu |
| `--dur-panel-close` | 240ms | closing panels |
| `--dur-reveal` | 760ms | landing section entrances only |
| `--dur-reduced` | 120ms | the only transition under reduced motion (opacity) |
| `--ease-hang` | `cubic-bezier(0.22, 0.61, 0.21, 1)` | anything that descends into place: a touch of gravity in, a long damped tail |
| `--ease-settle` | `cubic-bezier(0.33, 1.02, 0.4, 1)` | the final settle of a hung lot; overshoot capped at 2% |
| `--ease-std` | `cubic-bezier(0.4, 0, 0.2, 1)` | colour and opacity |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | pinned scenes and camera moves |
| spotlight follow (JS) | damped lerp 0.08 per frame at 60fps | slower than a lamp: a picture light is heavy and the beam is wide |
| lot sway (JS) | spring stiffness 180, damping 26 | the 1.2° pendulum a hovered lot makes about its wire |

Update `src/lib/motion/tokens.ts`: `MOTION_DURATION` (micro 120, ui 220, panel 300, panelClose 240, reveal 760, reduced 120, cartFlight 460, spotSweep 1800), `MOTION_EASE` (`hang`, `settle`, `std`, `inOut`, `outExpo`), `MOTION_SPRING` 180/26, `MOTION_DEPTH` from §12.1, `MOTION_STAGGER` (hooks 70, lots 90, rows 40, words 36), and `MOTION_LIMITS` (`swayCatalog` 1.2°, `swayHero` 2.4°, `inspectYaw` 22°, `inspectPitch` 9°, `spotLerp` 0.08, `liftLabel` 2, `dprCap` 1.5). Remove every `lamp*`, `tilt*`, `tray*` and `jaw*` entry.

**Philosophy: a hand hanging things on a wall.** Objects *descend* and settle — they never slide sideways, never spin, never scale from zero, never bounce visibly. Light moves slowly and continuously; objects move briefly and stop. The characteristic Veltskins movement is a 10–18px downward travel on `--ease-hang` with a sub-2% settle, in a stagger down the wall. Transform and opacity only; the spotlight moves by updating `--sx` / `--sy`, which repaints only its own layer.

With `prefers-reduced-motion: reduce`: every transition becomes an instant state change or a ≤120ms opacity fade, the spotlight stays at its rest position (`--sx: 32%`, `--sy: 8%`), nothing sways, nothing pins, no WebGL initialises, and every scene renders its designed end state. Remove `scroll-behavior: smooth`.

`src/styles/animations.css`: delete the Inspection Bay keyframes (`tray-in`, `lamp-on`, and anything with no consumer). Add `hang-in` (translateY −14px → 0 with opacity, on `--ease-hang`), `label-in` (opacity + 4px up, 40ms behind its lot), `count-roll` (translateY 100% → 0 for the incoming digit) and `rail-draw` (`scaleX` 0 → 1 from the left, 520ms). Durations and easings come from the tokens, never inline.

---

## 7. Components (all states)

Every interactive component has: default · hover (`hover-device` only) · active/pressed · focus-visible (2px `--color-focus` outline at 2px offset, 3px offset on a lot) · disabled (`--color-text-tertiary` text, `--color-bg-secondary` fill, no hover, `cursor: not-allowed`, `aria-disabled` or `disabled`) · loading (`aria-busy="true"`, width locked). Minimum touch target 44×44px on touch devices.

### 7.1 Button (`src/components/ui/Button.tsx` + `button-classes.ts` — keep the API, restyle)

Existing variants map as: `primary` → **Claret**; `secondary` / `outline` / `bordered` → **Ruled**; `tertiary` / `ghost` / `light` / `flat` → **Text**; `danger` → **Danger**; `danger-soft` → Text in danger; `steam` → **Account**.

| | Claret | Ruled | Text | Danger | Account |
|---|---|---|---|---|---|
| Shape | 3px radius, fill `--color-accent` | 3px radius, 1px `--color-border-control`, transparent | no box; 1px underline at 5px offset appears on hover | 3px radius, fill `--color-danger` | 3px radius, fill `--color-text` |
| Label | Instrument 600 uppercase 0.06em, `--color-on-accent` | `--color-text` | Instrument 500 sentence case, `--color-text` | `--color-on-danger` | `--color-bg` |
| Hover | fill `--color-accent-hover` | border `--color-text`, fill `--color-bg-secondary` | underline appears (120ms) | `filter: brightness(1.06)` | fill `--color-text-secondary` |
| Active | translateY 1px | translateY 1px, fill `--color-accent-light` | underline turns `--color-accent-ink` | translateY 1px | translateY 1px |
| Focus | claret ring, offset 2px | same | same | same | same |
| Disabled | fill `--color-bg-secondary`, faint text | border `--color-border`, faint text | faint, no underline | as Claret disabled | as Claret disabled |
| Loading | label kept for width (`visibility: hidden`), the drawn-line loader (§7.20) centred over it, `aria-busy` | same | same | same | same |

Sizes: sm 36px high / 14px label / 14px padding; md 46px / 15px / 22px; lg 54px / 16px / 30px. Icon-only buttons are 40px square (44 on touch), transparent, hover fill `--color-bg-secondary`, 3px radius, required `aria-label`. `startContent` / `endContent` icons at 18px with an 8px gap. The Account variant's label is "Sign in through Steam" (Valve's own wording); add a 16px monochrome Steam glyph only if the lead supplies `public/brands/steam.svg`, otherwise the label stands alone.

Note: in Day Hang the claret fill is dark on a light wall, so unlike the sibling's amber it needs **no** edge border. Do not add one.

### 7.2 Text inputs, textarea (`Field`)

- 48px high, 3px radius, fill `--color-mount`, 1px `--color-border-control`, 14px horizontal padding, Instrument 400 at 16px.
- Label above: Instrument 500 15px, 6px gap. Required: a trailing " *" in muted plus `aria-required`.
- Hint below: 14px muted. Placeholder: faint.
- Hover: border `--color-text-secondary`. Focus: claret ring at 2px offset, border unchanged.
- Error: 2px `--color-danger` border, message below in danger with a 16px `TriangleAlert`, linked by `aria-describedby`, `aria-invalid="true"`.
- Disabled: fill `--color-bg-secondary`, faint text. Read-only: no border, fill `--color-bg-secondary`.
- Password: inline 40px icon button `Eye` / `EyeOff`, `aria-pressed`.
- **Data inputs** (price min/max, float min/max, trade URL, in-list search) use Azeret 400 at 13px for the value; their labels stay Instrument.
- Textarea min 140px, vertical resize only.

### 7.3 Trade URL field (`src/components/skin/TradeUrlField.tsx` — restyle)

- A full-width data input with the label "Steam trade URL" and the placeholder `https://steamcommunity.com/tradeoffer/new/?partner=…&token=…`.
- Right of the label row: a Text link "Find it in Steam" with `ArrowUpRight` 14px, opening `https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url` in a new tab (`rel="noopener noreferrer"`).
- Live parse below the field once it has a value, as a two-row readout in Azeret 13px on hairline rules: `partner 123456789` and `token ••••••a1B2` (last four visible). Each row ends with a status word — "matches your Steam account" (success, `Check`) or "belongs to a different Steam account" (danger, `TriangleAlert`) when the partner ID is not the signed-in SteamID32.
- States: empty · typing (no validation until blur or paste) · valid · format error ("This isn't a Steam trade URL. It starts with https://steamcommunity.com/tradeoffer/new/") · mismatch (saving blocked) · saving (button loading) · saved (toast "Trade URL saved"; the account status tag turns to "Ready").
- The full token is never shown again after saving.

### 7.4 Select (`Select`)

Native `<select>` styled like an input: 48px (36px in the sort, currency and toolbar spots), `appearance: none`, Lucide `ChevronDown` 16px, 14px from the right. Country uses the single restricted-countries config. A custom listbox only where search is needed (collection, country) and then strictly the WAI-ARIA combobox pattern.

### 7.5 Checkbox, radio, switch, segmented control (`Choice`)

- **Checkbox:** 18px square, **0px radius** (it is a printed tick box, not a control chamfer — this is the one deliberate exception to §5.3 and it is what makes the filter column read as a condition report), 1.5px `--color-border-control`. Checked: fill `--color-accent`, 12px `Check` in `--color-on-accent`. Indeterminate: an 8×2 bar. Label 10px to the right; the whole row is the hit area (44px in filter lists).
- **Radio:** 18px circle, 1.5px border, checked shows an 8px claret dot.
- **Switch** (cookie preferences only): 40×22 track at 3px radius, 1px control border, a 16px square knob with 1px radius sliding 18px. On: claret track, `--color-on-accent` knob. The locked "Necessary" row is on and disabled with the text "Always on". `role="switch"`, `aria-checked`.
- **Segmented control** (price band picker, theme in the mobile menu, view tabs): one 3px-radius frame with a 1px control border, 36px segments, Instrument 500 14px. The selected segment gets `--color-accent-light` fill and a 2px claret rule inside its bottom edge. `role="radiogroup"` with arrow-key movement.

### 7.6 Tags (`Plate` — the storefront's replacement for HeroUI `Chip`)

All tags are 22px high, **0px radius** (printed annotations), 0 8px padding, Azeret 500 at 11px, uppercase, 0.1em tracking, never clickable.

| Variant | Look | Use |
|---|---|---|
| `classification` | transparent, 1px `--color-border`, text `var(--rarity)` | the tier name ("Covert", "Mil-Spec Grade", "Contraband") where the label stripe is not available (cart rows, purchase rows, the lot page spec table) |
| `stattrak` | transparent, **1px `--color-text` box**, text `--color-text`, content `ST` | StatTrak™. The box is the annotation; the full word "StatTrak™" is spelled out in the adjacent text, never inside the box |
| `souvenir` | no box at all: Newsreader **italic** 400 13px in `--color-text-secondary`, content `Souvenir` | Souvenir |
| `star` | transparent, 1px `--color-border`, the `StarMark` SVG + text in `--rarity-gold` | "★ Knife", "★ Gloves" |
| `phase` | transparent, 1px `--color-border`, ink | Doppler phases from data ("Phase 2", "Ruby") |
| `neutral` | fill `--color-bg-secondary`, ink | counts, "Out of stock", "Not painted" |
| `success` / `warning` / `danger` / `info` | wash fill, semantic text, a 6px square dot before the word | order and trade-URL statuses |
| `count` | fill `--color-accent`, `--color-on-accent`, Azeret 600 | the cart count only |

**Why StatTrak™ and Souvenir lost their colours.** The sibling colour-codes them in orange and yellow, which crowds an already busy warm range (claret, Covert, gold, warning, danger). A museum label does not colour-code; it annotates. The ruled `ST` box and the italic `Souvenir` are unmistakable, survive greyscale, and free the warm range entirely for the accent and the rarity ladder. Delete `--mark-stattrak` and `--mark-souvenir`.

Limits: at most **two** annotations on a wall label (`ST` or `Souvenir`, then `★` or phase). The classification is carried by the stripe and the classification line, so the `classification` tag never appears on a catalogue label.

### 7.7 Chips (active filters) (`Chip`)

32px high, 3px radius, fill `--color-mount`, 1px `--color-border-control`, Instrument 500 14px. Content is the human value ("Field-Tested", "Covert", "AK-47", "£25–£120", "StatTrak™"); a rarity chip carries a 2px **top** stripe in its tier colour (same device as a label, scaled down). A 14px `X` inside the hit area, `aria-label="Remove filter: Field-Tested"`. Hover: border ink. The row ends with a Text "Clear all".

### 7.8 **The lot** — the product card (`SkinTray.tsx` → `Lot.tsx`)

This is the store's central object and it is **not a card**. It is a render hanging on the wall with a printed label under it. There is no box, no fill, no outline, no enclosed stage.

One `<article data-rarity="covert" data-lot>`. Anatomy, top to bottom:

1. **Wire** (optional, composition-driven): a 1px `--color-wire` vertical line from the section's hang line down to the top of the render box, with a 2×7px hook tick sitting on the rail. Present wherever the lot is composed under a rail — the home hero, the Today's Lots strip and the first row of the catalogue grid. In deeper catalogue rows, lots have no wire (the rail is above the grid, not threaded through every row) and the composition is carried by the sizes.
2. **Render box:** a transparent area on the wall with a fixed aspect of **5:4** (wider and shallower than the sibling's 4:3), no background, no border, no radius. The render is `object-contain`, centred, inset 8% left / 8% right / 10% top / 18% bottom (the bottom inset leaves room for the cast shadow). Never cropped, never rotated, never tinted. Under it, `.cast-shadow` (§5.5).
3. **Annotations:** at the render box's top-left, 0px in from the content edge — the `ST` box, the `Souvenir` italic, `★` or the phase tag. Maximum two.
4. **Mark control:** at the top-right, a 36px icon button (`Square` → `SquareCheck` when marked, `aria-pressed`, label "Mark AK-47 | Redline" / "Marked"). On hover devices it appears on hover/focus-within; on touch it is always visible at 44px.
5. **The wall label**, directly under the render box with a 14px gap, **not full width** — it is 84% of the lot's width, left-aligned to the lot (a wall label is narrower than the work it describes, and that offset is a big part of the look):
   - a 2px `var(--rarity)` stripe flush along the top edge, full label width;
   - 1px `--color-border` on the left, right and bottom; `--color-mount` fill; 12px 14px 14px padding;
   - **row 1** — the lot number, Azeret 500 11px uppercase in `--color-text-tertiary`: `LOT VS-26674E9B21`;
   - **row 2** — the weapon line, Azeret 500 11px uppercase muted: `AK-47`, `★ KARAMBIT`, `SPORT GLOVES`;
   - **row 3** — the finish name, Newsreader 500 step-1, max 2 lines with the 2-line height reserved. This is the lot's link to `/product/[slug]`, stretched over the render box with a pseudo-element so the whole lot is clickable while Mark and Add stay separate controls;
   - **row 4** — the condition line: `Field-Tested` in Instrument 400 14px plus the float range in Azeret 400 13px muted (`0.15–0.38`); for vanilla knives, `Not painted`;
   - **row 5** — the classification line, Azeret 500 11px uppercase in `var(--rarity)`: `CLASSIFICATION · COVERT`.
6. **The price row**, *outside* the label, 12px below it, aligned to the lot's full width: the price left in Azeret 600 via `PriceDisplay`; the **Add** control right — a Ruled sm button "Add" with a 16px `Plus`, always visible, becoming Claret on lot hover/focus-within.
7. **Availability** only when real and useful: with `count` 1–3, a muted Azeret line "2 available" under the price. Never urgency wording.

**States.**
- *Hover / focus-within (fine pointer):* the lot sways 1.2° about the top of its wire (`transform-origin: top center`) on the §6 spring, the label lifts 2px and takes `--shadow-card-hover`, the cast shadow lengthens 6%, the classification line goes from `var(--rarity)` to ink 600. 120ms on `--ease-hang`. The focus ring surrounds the whole lot (outline offset 3px), never the render alone.
- *In cart:* Add becomes Text "In cart" with a 16px `Check`, linking to the cart drawer.
- *Adding:* Add shows the loading state, then M5 (§12.2).
- *Price being re-confirmed (`stale`):* the price is replaced by muted Azeret "Checking price" with the drawn-line loader; Add is disabled with `aria-describedby` pointing at that text.
- *Out of stock* (only reachable on marked lots and purchases, never in catalogue results): render at 55% opacity, cast shadow removed, a `neutral` "Out of stock" tag in the annotation slot, Add removed, the price shown muted as "Last price £12.40".
- *No render:* the render box shows a 1px `--color-border` outline (the only time a render box has a border — an empty mount), a centred 24px `ImageOff` in muted and "No render" in micro-caps.
- *Skeleton:* the render box filled `--color-bg-tertiary`, no cast shadow, the label drawn with its stripe in `--color-border` and three bars (64px, 70%, 56px) in `--color-bg-secondary`. No shimmer. Fades to content in 120ms.

**Variants.**
- **Compact row** (cart, search results, purchases, the catalogue index preview): a 96×77 render area on the wall with its cast shadow, text to the right — lot number, weapon line, finish name on one line, exterior short code, classification tag, price. Rows separated by hairlines, never boxed.
- **Anchor lot** (home hero, and the "room" panels): spans a large area, render box 16:11, finish name in Newsreader step-3, the full label with a float range, the spotlight allowed (§12), sway up to 2.4°.

**Grid.** The catalogue is a **salon grid, not a uniform grid**: 4 columns ≥1280, 3 at 1024–1279, 2 below 1024; column gap 24px, row gap 44px. Within each page of results, the lots at positions 1 and 8 (0-indexed 0 and 7) render at the **anchor** size spanning 2 columns and 2 rows; everything else is standard. That one rule, applied by index and not by data, is what makes the wall asymmetric without inventing importance that the data does not support — and it is why the row gap is large (the labels need air under them). On 2-column layouts only position 1 is an anchor, spanning the full width.

### 7.9 Condition grid (`FloatRuler.tsx` → `ConditionGrid.tsx`) — the exterior device

A conservation-report row, not a scale. Five equal cells in a row, in source order from `EXTERIORS`:

| | FN | MW | FT | WW | BS |
|---|---|---|---|---|---|

- Each cell is a 0px-radius box with a 1px `--color-border`, 28px high (22px in the compact form), containing its two-letter code in Azeret 500 11px.
- The lot's exterior cell is **inked**: fill `--color-text`, code in `--color-bg`. Every other cell stays empty. There is no scale, no tick, no proportional width and no cursor — the cells are equal because they are categories, and the numbers that *are* a scale are printed next to them as text.
- To the right (or below, under 640px): the readout, `Field-Tested · float 0.15–0.38`, with the name in Instrument 400 14px and the range in Azeret 400 13px muted. Boundaries come from `EXTERIORS`; never hard-code them.
- `role="img"` with `aria-label="Condition Field-Tested, float range 0.15 to 0.38"`. In the compact form the grid is `aria-hidden` and the text carries the meaning.
- **Filter form:** the same five cells become toggle buttons (`aria-pressed`, label "Field-Tested, 0.15 to 0.38, 412 lots"), each with its real count in Azeret 11px under the code, and a selected cell is inked. Multiple selection is allowed and non-contiguous selection is normal — there is no range handle anywhere in this store, which is the whole point of replacing the sibling's ruler.
- **Float range** (the `floatMin` / `floatMax` URL params the catalogue already supports) is a separate, collapsed "Exact float range" row beneath the grid with two Azeret data inputs, `from` and `to`, 0.00–1.00. Collapsed by default because the current SIH sync carries per-exterior ranges rather than per-item floats; when both are empty the params are not written.
- **Never** invent, estimate, randomise or default a float. The store shows the exterior's range, and says so in those words.

### 7.10 Marks

- **StatTrak™** — the `stattrak` tag (a ruled `ST` box). On the lot page the spec table adds the row "StatTrak™ · Counts kills made with this weapon" (true in-game behaviour).
- **Souvenir** — the `souvenir` italic annotation. The lot page adds "Dropped from a souvenir package at a CS2 Major; may carry tournament stickers" only when the item name shows the event; otherwise the annotation stands alone.
- **★** — `StarMark` inline SVG, a solid five-point star, 10px in tags and 12px in readouts, fill `--rarity-gold`, `aria-hidden`, with visually hidden text "Star item". Used in the `star` tag and before the weapon line on knives and gloves (`isStarType`). Never decorative anywhere else.

### 7.11 Price display (`PriceDisplay` — keep, restyle)

Azeret 600, the currency symbol from the existing provider at the same size, minor units at the same size (no superscript cents). The store shows no "was" price, no Steam comparison and no discount percentage (§15). Loading: a 56×16 block in `--color-bg-secondary`. A price that changed on re-confirmation shows the old value struck through in muted beside the new one **only** inside the checkout alert (§13.8), never in the catalogue.

### 7.12 Quantity (`QuantitySelector`)

Skins are listed by exact market name and several identical copies can exist (`count`). The stepper appears only in the cart and only when `count > 1`: three joined segments in one 3px-radius frame (`Minus` 40×40 | Azeret value 44px | `Plus` 40×40), max = the real `count`, with the hint "3 available" at the maximum. Otherwise the cart row shows "1" in Azeret with no stepper. Labels "Decrease quantity" / "Increase quantity"; clamp on blur with an `aria-live="polite"` announcement.

### 7.13 Filters — "the catalogue sheet"

The filter column is typography on hairlines, not a stack of panels. Desktop: a 272px left column, sticky under the header, on `--color-bg` with no box, groups separated by 1px hairlines.

- **Group header:** a 46px row — the group name as an Azeret micro-label, the selected count in ink Azeret on the right, and a `ChevronDown` that rotates 180°. A button with `aria-expanded`; panels open via `grid-template-rows: 0fr → 1fr` over 220ms.
- Only groups and values that exist in the current result set appear, each with its real count in Azeret 11px, right-aligned.
- **Open by default:** Weapon type, Condition, Classification, Price.
- The filter state lives in the URL (existing `catalog-url.ts` logic); back/forward restores it. The group order and controls map one-to-one onto the facets that already exist — do not invent a facet the API cannot serve, and do not drop one it can.

| # | Group | URL facet | Control |
|---|---|---|---|
| 1 | Weapon type | `types` | checkbox rows from `WEAPON_TYPES` (Rifles, Sniper rifles, Pistols, SMGs, Shotguns, Machine guns, Knives, Gloves). Hidden on type and weapon pages. |
| 2 | Weapon | `weapons` | checkbox rows grouped under their type in faint micro-labels; an in-list search input (Azeret 13px, 40px) appears above 10 entries. Hidden on weapon pages. |
| 3 | Condition | `exteriors` | the condition grid as five toggle cells (§7.9) with counts, plus a `Not painted` checkbox (the `np` key) when such lots exist, plus the collapsed "Exact float range" row writing `floatMin` / `floatMax`. |
| 4 | Classification | `rarities` | checkbox rows in `RARITIES` order (Consumer → Contraband), each with a 2px **top** stripe in the tier colour over the row and the tier name in that colour in Azeret 11px caps, counts right. All eight keys are offered even though two share the `gold` colour — the words differ, so the rows differ. |
| 5 | Price | `minPrice` / `maxPrice` | two Azeret data inputs (Min / Max in the active currency) plus a dual-handle slider on a plain 1px `--color-rule` track with **8×14px square** handles at 3px radius. Bound to the active currency. No ticks, no zones. |
| 6 | Quality | `qualities` | checkbox rows: Standard · StatTrak™ · Souvenir (the three `QUALITY_KEYS`). This is one multi-select group, not two tri-state toggles — it is what the data model holds. |
| 7 | Phase | `phases` | checkbox rows, only when phase data exists in the result set. |
| 8 | Collection | `collections` | checkbox rows with in-list search, only when the catalogue carries collection data. The current sync derives none, so the group stays hidden until it does. Never scrape or invent it. |
| 9 | Availability | `inStock` | a single checkbox "In stock only", shown only when `narrowingInStock` is true. |

`onSale` and `brand` are not surfaced: this store has no sale pricing (§15) and the supplier must stay invisible (§15). Leave the params parsed but unlinked.

Above the grid: a sentence-form result line in Azeret 13px ("1,284 lots · Rifles · Field-Tested") plus the active chips.

**Mobile:** a sticky toolbar under the header (a Ruled "Filter" button with the count in Azeret, and the sort select). Filter opens a full-height sheet from the bottom — `--color-mount`, 0px radius, a cut plane like every other panel — with the same groups and a sticky footer holding a Claret "Show 1,284 lots" and a Text "Clear all".

### 7.14 Sort (`ProductSort`)

Native select, 36px, with an inline "Sort" micro-label. Offer only the keys `SORT_KEYS` supports, in this order, and **default to Classification**:

Classification, highest first (`rarity-desc`, the default) · Price, low to high · Price, high to low · Price, high to low within classification — *not a key, omit* · Name A–Z (`name-asc`) · Recently catalogued (`newest`) · Most bought (`popular`, only when real order data exists) · Condition, best first (`float-asc`).

`relevance` appears only on `/search` and is the default there.

### 7.15 Pagination

- Numbers in 40px squares, Azeret 13px, 3px radius. Hover: fill `--color-bg-secondary`. Current page: ink text with a 2px claret rule along the bottom of the square, `aria-current="page"` — never a filled box.
- "Previous" / "Next" are Text buttons with `ChevronLeft` / `ChevronRight`. Ellipses after `1 …`.
- Mobile: "Page 2 of 27" in Azeret, with Previous / Next.
- If the catalogue uses Load more: "Showing 36 of 1,284" in muted Azeret, then a centred Ruled md "Load 36 more".

### 7.16 Breadcrumbs

Instrument 400 14px muted links, separator `ChevronRight` 12px faint (`aria-hidden`), current page ink with `aria-current="page"`, inside `nav aria-label="Breadcrumb"`. Mobile shows only the parent as a back link with `ChevronLeft`. Emit `BreadcrumbList` JSON-LD through the existing `JsonLd`.

### 7.17 Tabs and accordion

- **Tabs** (lot page "Details / Delivery / Price notes", account): Instrument 600 uppercase 15px, 46px high, a tablist on a 1px hairline; the active tab is ink with a 2px claret rule along its full width at the bottom (the sibling uses a short bar at the left start — ours spans the tab). Inactive muted, hover ink. WAI-ARIA tabs. On mobile, tabs become accordions.
- **Accordion** (FAQ, mobile filter groups, mobile footer columns): 56px header rows, Instrument 500 step-1, a `ChevronDown` that rotates 180° on open. The open panel sits on `--color-bg` with 20px padding; rows are separated by hairlines; the open row's header carries a 2px claret rule along its bottom edge. Multiple panels may be open.

### 7.18 Toasts

- Desktop bottom-left, 24px in (the sibling uses bottom-right); mobile top under the header, full width minus 32px.
- `--color-mount`, 0px radius, `--shadow-lg`, max-width 380px, with a **2px top rule** in the semantic colour (claret for cart) — top, not left, matching the label stripe.
- Cart toast: a compact lot row + "Added to cart" + Text "View cart" + Claret sm "Checkout".
- Status toasts: a 16px `CircleCheck` / `TriangleAlert` / `Info` in the semantic colour plus the text.
- Auto-dismiss 5s, pause on hover/focus, close `X`. `role="status"` (`role="alert"` for errors). Entrance: translateY 8px → 0 with opacity over 220ms; reduced motion: opacity only.

### 7.19 Dialog (`Dialog`, `ConfirmDialog`, the preference centre, the render zoom)

Centred, **0px radius**, `--color-mount`, `--shadow-xl`, max-width 560px, 32px padding. Title in Newsreader 500 step-2. Close `X` top-right. Scrim `--color-scrim`, **no blur**. Focus trap, Esc, focus return, `role="dialog"`, `aria-modal`, `aria-labelledby`. Entrance: descend 10px with a fade over 300ms on `--ease-hang`. Destructive dialogs put Danger on the right and a Ruled "Cancel" on the left.

### 7.20 Loaders (`ReadoutLoader`)

- **The drawn line.** A 72×1px `--color-border` track with a `--color-accent` segment that grows from the left to full width and resets, 900ms per cycle, `--ease-in-out` — the hang line being strung. `role="status"` with a hidden "Loading". Reduced motion: the static text "Loading…".
- Page-level loading uses skeletons, never a spinner. Delete the old three-square loader.

### 7.21 Cookie banner and preference centre

- **Banner** (first visit, nothing stored): a docked panel bottom-left, 440px wide on desktop and full width minus 32px on mobile, `--color-mount`, 0px radius, `--shadow-lg`, 20px padding, with a 1px hang line across its top edge. It never covers the mobile sticky buy or checkout bar; when one exists it docks above it.
- Copy: "We use necessary cookies to run the store. Analytics and marketing cookies load only if you allow them." plus a "Cookie policy" link.
- Three **visually identical** Ruled sm buttons in one row: "Accept all", "Reject all", "Customise".
- `role="region"`, `aria-label="Cookie consent"`, not modal. Analytics and marketing load only after consent.
- **Preference centre:** a "Cookie settings" dialog with three rows (Necessary locked on "Always on", Analytics, Marketing), each with a one-sentence purpose and a "Show cookies" disclosure listing name, provider, purpose and expiry — the same table as the Cookie Policy. Footer: Claret "Save choices", Ruled "Accept all", Ruled "Reject all". Opened from the banner and from the footer's "Cookie settings".
- The storage key is **`veltskins-consent`** (with version and timestamp); update the Cookie Policy table, which must also list `veltskins-theme`, `veltskins-cart`, `veltskins-currency` and `veltskins-marked`.

### 7.22 Checkout steps (`Stepper` — restyle)

A vertical `<ol>` of four steps (§13.8). Each step:

- a 64px header row: the step number in Azeret 600 step-1 inside a 32px **square with 0px radius** (ink on `--color-bg-secondary`; current: `--color-on-accent` on claret; complete: a `Check` on `--color-bg-secondary`), the title in Newsreader 500 step-2, the status on the right;
- **current:** the panel open on `--color-bg` with a 1px `--color-rule` running down from the number's centre line through the panel — the steps hang from one vertical line, the same way a lot hangs from a wire. `aria-current="step"`;
- **complete:** closed, with a one-line summary in Instrument 400 14px muted ("Signed in as fennec_77 · SteamID …4821") and a Text "Change";
- **upcoming:** closed, title faint, not focusable;
- Continue (Claret lg) at the panel's bottom-right; Back (Text) bottom-left except on step 1;
- errors: field messages plus a summary at the top of the panel ("Check 2 fields") that links to the fields and receives focus;
- moving on: the next panel opens over 220ms, focus moves to its heading, and a hidden live region announces "Step 3 of 4, Receipt and billing".
- Mobile: the same stack with 56px headers; summaries may wrap to two lines.

### 7.23 Cart drawer (`CartSheet`)

- A right panel 420px wide (100% on mobile), `--color-mount`, `--shadow-panel`, scrim behind. Slides `translateX(100%) → 0` over 300ms on `--ease-hang`; closes in 240ms. Reduced motion: a 120ms fade.
- Header: "Cart" in Newsreader 500 step-2, the count in Azeret, close `X`, and a 1px hang line under the header row.
- Rows: compact lot rows (§7.8) with the lot number, condition, classification tag, annotations, price in Azeret, the stepper only when `count > 1`, and a Text "Remove" with a 16px `Trash2`. Removing collapses the row over 220ms and is announced.
- Sticky footer: Subtotal in Azeret; the line "Prices are re-confirmed when you pay. If one changes, you'll see it before paying." at 14px muted; the total labelled "Total", or "Total incl. VAT" only when `COMPANY.vatRegistered`; a full-width Claret lg "Checkout"; a Text "View cart"; the payment logos at 24px.
- Empty: the empty-state mount (§7.27), "Your cart is empty", Text links to Knives, Rifles and Pistols, and a Ruled "Browse the catalogue".
- Focus trap, Esc, focus return, `role="dialog"`, `aria-label="Cart"`.

### 7.24 Search panel (`SearchDialog`)

- Opens from the header field or the `/` key. A full-width panel dropping from under the header — `--color-mount`, `--shadow-lg`, max-height 80vh, 0px radius — descending 10px with a fade over 220ms.
- One input at step-2 in Instrument 400 with a leading 20px `Search`, the placeholder "Search the catalogue: AK-47 Redline, Karambit Fade…", a Text "Close" and an Esc hint in Azeret 11px.
- Live results, debounced 200ms: **Lots** as compact rows (max 6); **Weapons** as text links with counts ("AK-47 · 214"); a Text "See all 318 results".
- Combobox pattern: arrows move, Enter opens, Esc closes.
- No results: "Nothing in the catalogue matches “xyz”." plus the eight weapon types as text links.

### 7.25 Purchase status timeline (`PurchaseTimeline` — restyle)

Driven by the SIH status labels and `inFlight`. Happy path: **Payment confirmed → Preparing → Trade offer sent → Delivered**. "Awaiting payment" precedes them only while it is true.

- **Desktop:** a horizontal track on a 1px `--color-rule` baseline with 10px circular nodes — the one place circles are allowed. Done nodes are filled ink; the current node is filled claret with a 2px claret rule drawn under its label; upcoming nodes are hollow `--color-border-hover` with faint labels. Real timestamps only, in Azeret 11px muted under each done node.
- **Mobile:** the same as a vertical track with nodes on the left rule.
- **Trade offer sent** adds an action row: Claret sm "Open trade offer" with `ArrowUpRight` to the real offer URL and, when `senderTimeout` exists, "Accept before 14:32, 8 Oct" in Azeret — a real expiry, never a countdown animation.
- **Branches** (Failed, Rolled back, Refund pending, Refunded) replace the remaining track with a single danger or neutral end node and one honest sentence from §15. The track never shows a future the order can no longer reach.
- While `inFlight` the page polls (existing logic) and the change animates (M6, §12.2), with `aria-live="polite"` announcing the new status.

### 7.26 Steam account block (`SteamAccountBlock` — restyle)

A row, not a card: a 40px square avatar at 0px radius (the Steam avatar from data, falling back to initials on `--color-bg-secondary`), the persona name in Instrument 500, "SteamID …4821" in Azeret 11px muted under it (last four only), and on the right a status tag — "Trade URL ready" (success) or "Trade URL missing" (warning) with a Text "Add trade URL". Unlinked state: one sentence ("Link your Steam account so we can send lots to it.") and the Account button "Sign in through Steam".

### 7.27 Empty state (`EmptyState` — restyle)

An **empty mount**: a 168×134 area outlined with a 1px `--color-border` on the wall, hanging from a short wire with its hook tick — a label-less, picture-less hanging frame. Under it: an H2 in Newsreader 500 step-2, one muted sentence, one primary action and at most one Text link. Copy per context: cart "Your cart is empty"; marked "Nothing marked yet"; purchases "No purchases yet"; search "Nothing in the catalogue matches “…”"; filters "No lots match these filters"; a weapon with no stock "No AK-47 lots in the catalogue right now". No people, no emoji, no illustration.

### 7.28 Alert

0px radius, wash fill, a **2px top rule** in the semantic colour (no left bar), a 16px semantic icon, Instrument 15px. The page fetch error reads "Something went wrong loading this page." with a Ruled "Try again".

---

## 8. Icons — Lucide

`lucide-react` is installed. One system: `strokeWidth={1.5}`, sizes 12 / 14 / 16 / 18 / 20 / 24, `aria-hidden` unless the icon is the only content (then the parent carries `aria-label`). Never an icon inside a circle or a tinted square; icons sit in the text colour. On desktop, header actions pair an icon with a word. No weapon, crosshair, skull, bullet or knife glyphs anywhere — they would be decoration.

| Job | Glyph | Job | Glyph |
|---|---|---|---|
| **Cart** | **`ClipboardList`** (never `ShoppingCart`, `ShoppingBag`, `ShoppingBasket` or `Handbag`) | Search | `Search` |
| **Mark / marked** | **`Square` / `SquareCheck`** | Account | `User` |
| Menu | `Menu` | Close | `X` |
| Add to cart | `Plus` | Remove | `Trash2` |
| External link | `ArrowUpRight` | Inline link arrow | `ArrowRight` |
| Back / breadcrumb | `ChevronLeft` / `ChevronRight` | Disclosure, accordion, select | `ChevronDown` (rotates) |
| **Filters** | **`ListFilter`** | Sort | none (a labelled select) |
| Rotate the render | `RotateCw` | Reset view | `RotateCcw` |
| Zoom | `ZoomIn` / `ZoomOut` | **Theme** | **`Lightbulb` / `LightbulbOff`** |
| **Trade offer** | **`ArrowLeftRight`** | **Trade URL** | **`Link`** |
| Payment | `CreditCard` | Secure checkout | `LockKeyhole` |
| Success | `CircleCheck` | Error / warning | `TriangleAlert` |
| Info | `Info` | Check | `Check` |
| Currency | none (the Azeret code "GBP") | Sign out | `LogOut` |
| Copy order ID | `Copy` | No render | `ImageOff` |
| Help | `CircleHelp` | Mail | `Mail` |
| Offer expiry | `Clock` | Password | `Eye` / `EyeOff` |

Not used anywhere: `ShoppingCart`, `ShoppingBag`, `Handbag`, `Bookmark`, `Heart`, `Star` (★ is our own SVG), `Lamp`, `SlidersHorizontal`, `Repeat2`, `Link2`, `Sun`, `Moon`, `AlignRight`, `CircleUser`, `Sparkles`, `Flame`, `Zap`, `Crown`, `Gem`, `Package`, `Truck` (no physical delivery). Phosphor is not used in the storefront.

The theme toggle's accessible labels are "Switch to evening viewing" and "Switch to daylight hours"; its visible tooltip text matches.

---

## 9. Logo and favicon

The mark is already drawn and committed. Do not redraw it; wire it up.

### 9.1 The mark — "the hung lot"

A claret plate carrying three bone elements: a **hang line** across the top with two **hook ticks** sitting on it, two **wires** descending and converging into a **V**, and at the V's point a **wall label** — a wide plate with a second, shorter **classification line** printed under it.

It is the brand's whole grammar in one glyph: the rail, the hang, the label. The V is the brand initial, but it is first a pair of taut wires — read it as hardware and the letter arrives second, which is why it never looks like a letterform logo. It shares nothing with Patinaskins' mark (a graphite square holding a serif **P** with an amber square tittle and a five-segment zone strip along the bottom): different ground colour, different construction (strokes and plates, not a letter), different silhouette.

**Files already created:**

| Path | Contents |
|---|---|
| `src/app/icon.svg` | the 32px drawing, `width="32" height="32" viewBox="0 0 256 256"` |
| `public/favicon.svg` | the same 32px drawing |
| `public/brand/veltskins-mark.svg` | the full 512 drawing |
| `public/brand/veltskins-mark-mono.svg` | the full drawing with no plate, every element `currentColor` |
| `public/brand/veltskins-wordmark.svg` | the wordmark outlines with the claret hang line above |
| `public/brand/veltskins-wordmark-dark.svg` | the same in bone with a rose hang line |
| `public/brand/veltskins-lockup.svg` | mark plate + ink wordmark, `viewBox="0 0 562 120"` |
| `public/brand/veltskins-lockup-dark.svg` | mark plate + bone wordmark |
| `public/logo.svg`, `public/logo-dark.svg` | copies of the two lockups, kept so existing references keep working; remove them once every call site points at `public/brand/` |

**Full drawing (512 grid).** Plate `#86203A` full bleed, marks `#FBF6F0`:

```
<rect width="512" height="512" fill="#86203A"/>
<path fill="#FBF6F0" d="M138 115h14v26h-14zM360 115h14v26h-14zM48 141h416v14H48zM150 335h212v32H150zM186 381h140v16H186z"/>
<path fill="none" stroke="#FBF6F0" stroke-width="14" stroke-linejoin="miter" d="M145 155 256 335 367 155"/>
```

Reading of the five rects, in order: left hook tick, right hook tick, hang line, wall label, classification line. The polyline is the pair of wires. Optical balance: the drawing occupies y 115–397 and x 48–464, centred on 256/256.

**32px drawing (256 grid).** The classification line and the hook ticks are dropped and the remaining weights are raised so nothing falls below 1.5 device pixels:

```
<rect width="256" height="256" fill="#86203A"/>
<path fill="#FBF6F0" d="M18 66h220v14H18zM70 170h116v20H70z"/>
<path fill="none" stroke="#FBF6F0" stroke-width="14" stroke-linejoin="miter" d="M60 80 128 170 196 80"/>
```

**16px drawing (256 grid).** Below about 20px the V's counter closes up and the mark turns to mush, so the 16px drawing drops the wires and keeps the three bars — hang line, a single central drop, label plate. It is still unmistakably the same device:

```
<rect width="256" height="256" fill="#86203A"/>
<path fill="#FBF6F0" d="M12 58h232v26H12zM114 84h28v68h-28zM48 152h160v38H48z"/>
```

The plate is claret in every size, so the icon holds on both light and dark browser chrome and needs no edge stroke and no `prefers-color-scheme` swap. Never place the mark on a claret ground; on claret, use the mono variant in bone with no plate.

### 9.2 Wordmark

**"Veltskins" in Newsreader 500 at `opsz 40`, sentence case, tracking −0.005em.** The ownable detail is not a letterform trick — it is the brand's own motif: a **claret hang line runs above the wordmark**, 1.5px at a 24-unit offset above the ascender line (at cap-height 100 units), extending 52 units past the word on each side. The wordmark hangs from it, exactly like a lot. Nothing else is added; no coloured tittle, no ligature, no swash.

Metrics at cap height = 100 units: total advance **598.13**, ink bounding box x −2.37 → 592.49, y −108.02 → 1.64 (the `l`, `t` and `k` ascenders reach 108; there are no descenders in the word). The rail in `veltskins-wordmark.svg` is `x=-52 y=-136 width=696 height=5`, and the file's viewBox is `-56 -148 708 164`.

The outline path data is in `public/brand/veltskins-wordmark.svg` and embedded in both lockups. It is reproducible byte-for-byte: instantiate `@fontsource-variable/newsreader@5.3.0`'s `files/newsreader-latin-opsz-normal.woff2` at `wght=500, opsz=40`, scale by `100 / OS/2.sCapHeight` (= `100 / 1340`) with a y-flip, lay the glyphs out on their `hmtx` advances, and emit with fontTools' `SVGPathPen` at one decimal place. Regenerate it only if the weight or optical size changes; do not hand-edit it.

**In the running UI the wordmark is live text**, not the SVG: `font-family: var(--font-display)`, weight 500, `font-variation-settings: "opsz" 40`, with the hang line drawn as a 1px `::before` in `--color-accent`. The SVG files exist for the OG image, the email header, the PDF invoice and anywhere a font cannot be relied on.

**Clear space:** the cap height of the V on all sides, and the hang line must never be clipped. **Minimum widths:** lockup 148px, wordmark alone 104px, below which use the mark alone. The wordmark is never set in any other family, never tracked out into letterspaced caps, never italic, never on a claret ground except as the bone variant, and never carries an effect.

### 9.3 `BrandMark.tsx`, metadata and the favicon script

- `src/components/layout/BrandMark.tsx` renders the mark inline (so it inherits the theme) plus the live-text wordmark. The mark's plate uses `var(--color-accent)` and its elements `var(--color-on-accent)`; the wordmark uses `currentColor` with the hang line in `var(--color-accent)`. No hex in this file. Props: `variant="lockup" | "mark" | "wordmark"` and a `size` in cap pixels (header 20, footer 18, checkout 18, email/OG from the SVG files).
- `scripts/gen-favicons.mjs`: replace its three inline SVG strings with the three drawings above — `full` = the 512 drawing, `small` = the 32px drawing, `tiny` = the 16px drawing — and keep its existing target list and ICO assembly untouched. It must output `favicon-16x16.png` (from `tiny`), `favicon-32x32.png` (from `small`), `apple-touch-icon.png` 180, `android-chrome-192x192.png`, `android-chrome-512x512.png` (all from `full`), and `favicon.ico` containing 16 (from `tiny`), 32 and 48 (from `small`). Run it once and commit the output.
- `public/manifest.json`: `name` and `short_name` "Veltskins", `theme_color` `#86203A`, `background_color` `#EDE7DC`.
- `layout.tsx` `viewport.themeColor`: light `#F4EFE7`, dark `#211C19`.
- Root metadata: title template `"%s · Veltskins"`; description "A catalogue of Counter-Strike 2 skins with the condition, classification and price printed on every lot. Pay by card; we send the skin to your Steam account as a trade offer."
- **OG image** (`src/lib/og`): the plaster wall, the hang line across the upper third with two hook ticks, one real render hanging under it with its cast shadow, the wall label beneath, and the lockup bottom-left. Claret only in the mark. Never a stock photo, never a collage.

---

## 10. Motif usage rules

### 10.1 The hang line

- **Is:** a 1px `--color-rail` horizontal rule with 2×7px hook ticks sitting on it, at a fixed height within its section (§5.2).
- **Used on:** the header's bottom edge, every home section that holds lots, the top edge of the footer, the cart drawer header, the cookie panel, the empty-state mount, the email header, the invoice header, and the logo.
- **Never:** vertical, dashed, doubled, animated as a loop, used as a divider between unrelated content, used inside a form, or used more than once per section. A section has one rail or none.

### 10.2 The wall label

- **Is:** `--color-mount` stock at 0px radius, a 2px `var(--rarity)` stripe flush along the **top**, hairline on the other three sides, 84% of its lot's width, left-aligned to the lot, holding five ruled rows (§7.8).
- **Used on:** every representation of a lot that has room for it — the catalogue, the home hero, the room panels, the lot page.
- **Never:** above or beside its lot, full width of its lot, containing a button or a price, carrying claret, carrying more than two annotations, or floating with a shadow at rest.

### 10.3 The raking spotlight

- **Is:** `--spot-rake`, an ellipse originating up and to the **left** (`--sx` default 32%, `--sy` default 8%), with the matching cast shadow thrown down-right.
- **Used on:** exactly two surfaces — the home hero's anchor lot and the lot page's hung render. That is the whole list.
- **Never:** on catalogue lots, in the header or footer, behind text in the dark theme at faint weight, coloured, pulsing, looping, or used as a page background.

### 10.4 Material rules

Everything printed, mounted or framed is cut square; only controls are eased at 3px (§5.3). Renders sit directly on the wall — there is no stage, no plinth and no filled box behind a skin, ever. No textures: no plaster noise, no paper grain, no canvas weave, no grid. Depth comes from the wire, the cast shadow and the label's offset, never from stacked outlines or shadows on flat elements.

---

## 11. Header, catalogue index, mobile menu, footer

### 11.1 Header — the fascia (≥1024px)

One tier, 72px, `--color-fascia`, full bleed with a `max-w-container` inner row, and **the hang line as its bottom edge** (1px `--color-rail` full bleed, with a hook tick above the active nav item in claret). No utility line, no announcement bar.

- **Left:** the lockup at 20px cap height, linking to `/`.
- **Centre:** weapon types as Instrument 600 uppercase 15px links at 0.06em tracking, then the trigger "CATALOGUE" with `ChevronDown` opening the index panel. Active: a 2px claret rule under the full label width. Hover: ink from muted over 120ms.
- **Right:** a search field (220px, 36px, `--color-bg-tertiary` recess, 1px control border, 16px `Search`, placeholder "Search the catalogue", Azeret "/" hint) that opens the search panel; the currency select (Azeret "GBP", 36px); the theme toggle; the account control (a 24px square Steam avatar + the persona truncated at 12 characters, or `User` + "Sign in"); the cart (`ClipboardList` + "Cart" + the `count` tag when > 0).
- **Sticky:** always sticky, compacting to 60px after 80px of scroll. It never hides on scroll. The header height is reserved so there is no layout shift.

**Measured width budget.** Instrument Sans 600 at 15px uppercase with 0.06em tracking averages ≈ 9.3px per character. The centre set is chosen per breakpoint so the three blocks always clear a 32px minimum gap:

| Viewport | Container | Left | Centre | Right | Total + 2×32 gap | Slack |
|---|---|---|---|---|---|---|
| 1920 | 1440 | 168 | KNIVES · GLOVES · RIFLES · PISTOLS · SNIPERS · CATALOGUE▾ = 556 | 596 | 1384 | 56 |
| 1536 | 1440 | 168 | same 556 | 596 | 1384 | 56 |
| 1280 | 1200 | 168 | KNIVES · RIFLES · PISTOLS · CATALOGUE▾ = 358 | 596 | 1186 | 14 |
| 1152 | 1072 | 168 | KNIVES · RIFLES · CATALOGUE▾ = 298 | 516 (search 180, account icon-only) | 1046 | 26 |
| 1024 | 944 | 168 | CATALOGUE▾ = 130 | 456 (search 160, account icon-only, cart icon + count, no word) | 818 | 126 |

Right-block composition at full size: search 220 + 12 + currency 76 + 12 + theme 40 + 8 + account 128 + 8 + cart 92 = 596. Below 1280 the account collapses to a 40px icon button; below 1152 the cart loses its word. **Never let the centre set wrap** — drop an item instead, in the order Snipers → Pistols → Gloves → Rifles → Knives. Verify at 1024, 1152, 1280, 1440, 1536 and 1920 with the longest real persona name in the account slot.

### 11.2 Catalogue index panel (the header's only overlay menu)

A full-width panel under the fascia: `--color-mount`, `--shadow-lg`, 32px padding, max-height 72vh, a 1px hang line along its top edge. It is a **printed index**, not a mega-menu of cards.

- Left 9 columns: the eight weapon types in a four-column text index. Each type is a head — Instrument 600 uppercase 15px plus its real count in Azeret — and under it every weapon of that type that has stock, in Instrument 400 15px with its count in Azeret 11px faint, right-aligned. Hover: ink plus a 2px claret rule under the label. Knives and gloves list their real model names from data.
- Right 3 columns: a single **preview lot** — the dearest in-stock lot with a render for the hovered weapon, rendered as a compact anchor (render on the wall, wall label under it), then "All AK-47 lots · 214" with `ArrowRight`. Real data only; if nothing in the hovered group has a render, the preview column is omitted entirely rather than filled with a placeholder.
- Opens on click and on 150ms hover-intent; closes on leave (250ms grace), Esc, or focus leaving. The trigger carries `aria-expanded` and `aria-controls`; arrow keys move within and across columns. Entrance: descend 10px with a fade over 220ms.

### 11.3 Mobile header (<1024px)

60px fascia with the hang line as its bottom edge: the lockup left at 16px cap height (the mark alone below 360px); right, a `Search` icon button, the cart with its Azeret count, and a `Menu` icon button — all 44px.

The menu is a full-height sheet sliding in **from the left** (the sibling's slides from the right), `--color-fascia`: the eight weapon types as large Newsreader 500 step-3 rows with Azeret counts and `ChevronRight`, each opening that type's weapon list behind a "Back" row; then Account rows (My purchases, Trade URL, Marked lots, Profile, or Sign in through Steam), Help rows (How delivery works, FAQ, Contact), the currency select, and a theme segmented control ("Daylight" / "Evening"). Focus trap, Esc, focus return.

### 11.4 Footer — the skirting

Inside `max-w-wide`, on `--color-skirting`, ink text. **It appears on every page without exception**, including checkout (in its compact form) and the 503 payment stub.

1. **The hang line** as the footer's top edge: full bleed, 1px `--color-rail`, with four hook ticks spaced at the four column starts. 48px of space under it.
2. **Four columns** (desktop, separated by hairlines):
   - **Catalogue** — Knives, Gloves, Rifles, Sniper rifles, Pistols, SMGs, Shotguns, Machine guns, All lots.
   - **Orders** — How delivery works, My purchases, Trade URL, Cart.
   - **Help** — FAQ, Contact us, Refunds, Payment.
   - **Legal** — Terms & conditions, Privacy policy, Cookie policy, All policies, and the "Cookie settings" button.
   - Heads in Azeret micro-caps muted; links in Instrument 400 15px ink, underlined on hover.
3. **Colophon** (not a ruled grid — the sibling uses one): a two-column block with **no row rules**, separated by leading alone, one credential per line, the label in Azeret micro-caps followed by the value on the same line in Instrument 15px (identifiers in Azeret 13px). Every value comes from `src/lib/company.ts`: Company `COMPANY.name` · Company number `COMPANY.companyNumber` · VAT number (rendered **only** when `COMPANY.vatRegistered`) · Registered office `COMPANY.registeredOffice` · Email `COMPANY.email` as a mailto · Phone (only when `COMPANY.phone` is not null) · Support hours `COMPANY.supportHours`. Above the block, one line: "Veltskins is a trading name of {COMPANY.name}." These are placeholders today (`COMPANY NAME`, `[REG_NUMBER]`, `[COMPANY ADDRESS]`) and must render exactly as stored — never invent a company name, number or address.
4. **Disclaimer**, Instrument 14px muted, reworded from the sibling's (do not copy it verbatim): "Veltskins is an independent store and is not affiliated with, sponsored by or endorsed by Valve Corporation. Counter-Strike, CS2, Steam and the Steam logo are trademarks of Valve Corporation and are used here only to describe the items we sell."
5. **Bottom row** (1px top hairline, 24px padding): left, "© {year} Veltskins" at 14px muted; right, `/payments/visa.svg`, `/payments/mastercard.svg` and `/payments/pci-dss.svg` through `next/image` at 28px high with `width: auto`, in colour exactly as supplied (each SVG carries its own white card — do not recolour, invert or monochrome them), alt text "Visa", "Mastercard", "PCI DSS compliant", 8px gap. Social text links only if the env URLs are set.
6. **Mobile:** the hang line keeps two hook ticks; the four columns become accordions; the colophon is one column; the payment logos are centred at 24px; the copyright is last.

**Checkout's compact footer** carries the policy links, the colophon as a single line, the Valve disclaimer and the payment logos — never less.

---

## 12. Motion hooks for the motion engineer

Use the existing data-attribute engine (`src/lib/motion/engine.ts`, and `WEBGL-3D-KNOWLEDGE.md` §4.2 and §4.4 for the native-first ladder). The store engineer leaves the markup hooks and the **static end state**; the motion engineer adds behaviour. No library code is specified here, and none should be added without checking the decision tree in `WEBGL-3D-KNOWLEDGE.md` §1 — the existing ticker plus raw WebGL covers everything below. Remove the scenes `bay-hero`, `bays`, `rarity-ladder` and `marks` from `SCENES` and register the new ones.

### 12.1 Depth layers

Pointer offsets are maxima at the viewport edge, fine pointers only.

| Layer | Content | Pointer offset | Scroll speed |
|---|---|---|---|
| D0 | the wall itself, the floor line | 0 | 0 |
| D1 | the hang line and its hook ticks | 2px | ±0.03 |
| D2 | wires | 3px | ±0.05 |
| D3 | hung renders | 10px + sway | ±0.1 |
| D4 | wall labels (they move **less** than their lot — a label is fixed to the wall, the lot swings on its wire) | 4px | ±0.05 |
| SPOT | the raking light (not a layer: it follows the pointer or the scene) | — | scene-driven |
| L0 | headings, body, CTAs, prices, filters, the condition grid | 0 | 0 |

**The label moving less than the render is the signature of the whole motion system.** It is what makes the lot read as hanging and the label as printed on the wall. Never give a label the same offset as its lot.

Readable text and CTAs never move with parallax. On the catalogue, lot, cart, checkout, account and policy pages there is no scroll parallax at all — only the hover sway on a single lot at a time.

### 12.2 Named signature moments

| ID | Name | Where | What it communicates | Static / reduced-motion state |
|---|---|---|---|---|
| M1 | **Strike the hang** | home hero | the wall has just been hung for you | lots in their final positions, rail drawn, spotlight at rest on the anchor lot |
| M2 | Walk the wall | home "Today's lots" | the wall continues past the edge | a horizontal snap scroller, rail drawn through it |
| M3 | Open the room | home "Rooms" | each room holds one kind | panels static, renders in place |
| M4 | Pull the drawer | home "Classification" | the ladder is a register you can open | the table shown with all counts |
| M5 | Into the cart | add to cart, anywhere | it went onto your list | count updated, toast shown |
| M6 | Next node | purchase timeline | your order moved on | the new state shown |
| M7 | Inspect | lot page render | turn it in your hands | flat render, spotlight at rest, controls visible |
| M8 | Read the condition | home "Condition" band | wear is five named bands | all five cells shown with their example lots |
| M9 | Sway | every lot, fine pointers | it is hanging, not printed | lot at rest |
| M10 | Hang in | every section entrance | the wall fills top-down | everything in place |

**M1 Strike the hang (home hero).** Section `data-scene="hang"`. On load: the rail draws left→right (`rail-draw`, 520ms), then the hook ticks appear in sequence (70ms stagger), then each lot descends into place from −14px with its wire extending (`hang-in`, 90ms stagger, `--ease-hang`, settle ≤2%), its label fading in 40ms behind it (`label-in`). As the last lot settles, the spotlight sweeps once from `--sx: 8%` to `--sx: 32%` over `spotSweep` 1800ms on `--ease-in-out` and stays. Pointer: the spotlight follows at lerp 0.08 within the anchor lot only; lots sway up to 2.4° (anchor) or 1.2° (others). Scroll on desktop, **no pin**: the rail and the hooks take D1/D2 speeds and the lots D3, so the wall gently decouples as you leave. Mobile: no WebGL, no pointer tracking — the CSS spotlight sits at rest and the hang-in stagger still plays once. LCP is the H1 text; the anchor render is `priority`; the WebGL layer boots after LCP via `requestIdleCallback`.

**`S1 Raking light` — the one WebGL moment in the store.** A single `<canvas data-spot="webgl">` over the hero's anchor render, nowhere else on the site except M7's shared code path. Extend the existing `lamp-gl.ts` into `spot-gl.ts`: use the PNG's alpha as the body mask, derive normals from the luma gradient as it already does, and light it with **one off-axis warm key** (direction from `--sx`/`--sy`, colour from `--spot-rgb`) plus a dim ambient so the unlit side never goes black. The scaffold rules in `WEBGL-3D-KNOWLEDGE.md` §8.1 are non-negotiable: one `u_time` clock, damped `u_mouse`, DPR capped at 1.5, poster-first (the CSS `--spot-rake` layer *is* the poster and must look complete on its own), boot deferred to idle, pause on `IntersectionObserver` exit and `document.hidden`, handle `webglcontextlost`, detect software renderers and keep the poster, dispose on unmount. Not created on coarse pointers, under `navigator.deviceMemory < 4`, under `saveData`, or under reduced motion.

**M2 Walk the wall.** `data-scene="strip"`. A horizontal snap scroller with the hang line running through it at the fixed section height; the rail scrolls with the content at D1 so it reads as one continuous wall. Lots enter with `hang-in` at a 90ms stagger as they cross 85% of the viewport. Wheel is never hijacked; the scroller is keyboard-operable and has visible overflow affordances.

**M3 Open the room.** `data-scene="rooms"`. The large room panel's render rises 12px into place (D3) on entry; the index rows beneath reveal with a 40ms stagger. Hover/focus on an index row: that row's ink goes to 600 and a 2px claret rule draws under it left→right in 120ms. Hovering a row with a render available swaps the large panel's render with a 220ms crossfade — never a slide, never a zoom. Each row is a link; motion never blocks navigation.

**M4 Pull the drawer.** `data-scene="register"`. The eight classification rows reveal top-down with a 40ms stagger, each row's 2px top stripe drawing from the left (`scaleX`). Hover/focus a tier: a strip of three real lots of that tier slides in from the right over the table's right third (translateX, 220ms) and the row's stripe thickens 2px → 4px. Each tier is a link to the catalogue filtered by that rarity.

**M5 Into the cart.** On add: the lot's cast shadow shortens 20% (120ms) as if it has been lifted off the wall, a FLIP ghost of the render (opacity 0.9, scaled to 40px) travels to the header cart over `cartFlight` 460ms on `--ease-hang`, the cart count rolls (`count-roll`), the shadow returns, then the toast. Reuse `cart-flight.ts`; rename its hooks to `data-cart-target`. If the header is off-screen, skip the ghost and keep the count roll.

**M6 Next node.** When polling returns a new status, the track draws from the previous node to the new one (`scaleX`, 460ms), the new node fills claret and the previous fills ink. Once per transition, never on first render.

**M7 Inspect (lot page).** The render area is `data-scene="inspect"` with the shared `spot-gl.ts` layer. Controls in a row under it, as Text buttons with icons: "Rotate" (`RotateCw`, toggles drag-to-rotate, yaw ±22°, pitch ±9°, the view holds where released until "Reset view"), "Reset view" (`RotateCcw`), "Zoom" (`ZoomIn`/`ZoomOut`, 1× / 2× with drag-to-pan at 2×). Keyboard, when the render area has focus: arrows rotate by 5°, `+`/`−` zoom, `0` resets; the keys are documented in a visually hidden description. **The wheel never zooms.** The pointer moves the spotlight at all times on fine pointers. Mobile: no WebGL; tapping opens the zoom dialog with pinch; the spotlight stays at rest.

**M8 Read the condition.** `data-scene="condition"`. The five cells reveal left→right at a 90ms stagger; each cell's example lot descends with `hang-in` 40ms behind its cell. No pin, no scrub, no travelling cursor — this store has no scale to travel along.

**M9 Sway.** Fine pointers only. The lot under the pointer rotates up to 1.2° about `transform-origin: top center` on the §6 spring, following the pointer's horizontal offset from the lot's centre; leaving returns it over 300ms. One lot at a time, rAF-throttled. No WebGL in grids. Touch: nothing.

**M10 Hang in.** The generic section entrance: on crossing 80% of the viewport, a section's rail draws, then its content blocks descend 14px with opacity at a 40ms stagger. Used by every section that is not M1–M4 or M8. Headings use `data-anim="words"` with a 36ms stagger and a server-side split carrying `aria-label` on the parent.

### 12.3 Budgets and rules

- **WebGL exists in exactly two places**, M1 and M7, sharing one module and one context per page. Every rule in §12.2's `S1` paragraph applies to both.
- Home motion JS, excluding the Next runtime, ≤ **70 KB gzip** including the shader. No new 3D library: raw WebGL as in the existing `lamp-gl.ts`. Adding GSAP or Lenis requires a written justification against `WEBGL-3D-KNOWLEDGE.md` §1; prefer the existing ticker.
- **No pinning and no scroll-jacking anywhere in this store.** The sibling pins two home sections; Veltskins pins none. A salon hang is something you walk past, and taking the scroll away from the user to do it would be the single most template-looking decision available.
- CLS 0; every scene reverts on route change; store surfaces (catalogue, lot, cart, checkout, account, policies) get functional motion only — filters, tabs, toasts, the cart drawer, M5, M6, M7, M9 and skeleton fades.

---

## 13. Pages — layout specs

Global skeleton: fascia header → breadcrumbs (every page except home, checkout and auth) → `main` → skirting footer. The page H1 is the first heading in `main`. Every page has a unique title and description. Routes are the ones that exist today — `/catalog`, `/catalog/[category]`, `/product/[slug]`, `/search`, `/cart`, `/checkout`, `/order/confirmed`, `/account/**`, `/auth/**`, `/how-it-works`, `/about`, `/faq`, `/contact`, `/policies/**`, `/pages/[slug]`.

### 13.1 Home — nine sections, in this order

No hero → three cards → testimonials → CTA. No stats, no testimonials, no partner logos, no invented numbers. Every count, minimum price and ranking is computed from real data; a section with no data is omitted entirely; no lot appears twice on the page (keep the existing claimed-set logic in `src/components/home/data.ts`).

**1. The hang** (M1, `HomeHero.tsx` → `TheHang.tsx`). Height `100svh` minus the header, on `--color-bg`, `max-w-wide`. The composition is the whole point: one rail, five lots at three sizes, asymmetric.

- Desktop, 12 columns. The **hang line** runs full bleed at 72px from the section's content top, above *everything including the headline* — the text hangs from the same rail as the lots.
- Columns 1–5 (L0), starting 96px below the rail: an Azeret eyebrow "CS2 CATALOGUE"; the H1 at `display-xl` in Newsreader 600 — **"Every skin hung, labelled and priced."**; a lead in Newsreader 400 step-1 — "Counter-Strike 2 skins, catalogued one lot at a time, with the condition, the classification and the price printed on every label. Pay by card and we send the skin to your Steam account as a trade offer."; then the primary action, **search**: a 56px field in Instrument 400 16px with a 20px `Search` and the placeholder "Search {liveCount} lots" (the real count) plus a Claret lg "Search"; under it, Text links to Knives, Rifles and Pistols.
- Columns 6–12: the hang itself — the **anchor lot** (render box 16:11, ≈ 520px wide, wire 24px) with the spotlight and the full wall label, and **four smaller lots** stepped around it on wires of 18, 40, 56 and 64px, two above-right, two below-left, at ≈ 58% and ≈ 44% of the anchor's width. Never align their tops; never equalise their sizes; never let a label overlap a render.
- A 1px `--color-rule` floor line (D0) runs across the room at 84% height, behind the lots.
- Mobile (390): the rail at 48px, the H1 at step-6, lead, the search field, then the anchor lot full width with its label, then the four smaller lots as a 2×2 block at half width. No sway, no WebGL; the hang-in stagger plays once.
- Padding: 0 top, 0 bottom — it hands straight over to section 2.

**2. Today's lots** (M2, new `TodayStrip.tsx`). A horizontal snap scroller on `--color-bg`, with the hang line running through it. H2 left, "Today's lots", with a one-line lead stating plainly what the selection is ("The eight most recently catalogued lots between £25 and £120." — the sentence must match the real rule in §16, and change with it). Eight standard lots in one row, the rail threaded above them, `scroll-snap-type: x mandatory`, keyboard-operable, with a Text "See the whole catalogue" and `ArrowRight` at the end of the track. Mobile: the same scroller at 72% viewport width per lot. Padding **72 / 96**.

**3. Rooms** (M3, `WeaponBays.tsx` → `Rooms.tsx`). On `--color-bg-secondary`, full bleed. Not six equal bays — an **asymmetric plan**: columns 1–5 hold one large **room panel** for Knives (a tall render on the wall with its cast shadow, the type name in Newsreader 500 step-3 bottom-left, the real count and "from £112.40" in Azeret); columns 6–12 hold the other seven types as a **ruled index** — one 56px row each, hairline-separated, with the type name in Instrument 500 step-1, its real count in Azeret, its real minimum price in Azeret, and `ChevronRight`. Hovering a row swaps the large panel's render to that type's dearest in-stock lot. A type with no stock is dropped from the list entirely, not greyed. Tablet: the panel goes full width above the index. Mobile: the panel, then the index rows. Padding **96 / 72**.

**4. Classification, tier by tier** (M4, `RarityLadder.tsx` → `Register.tsx`). On `--color-bg`. Left columns 1–3: the H2 "Classification" and two sentences stating plainly that rarity is the drop tier the game assigns, not a measure of quality or condition. Right columns 4–12: a **ruled register** — eight rows, one per entry in `RARITIES`, each row carrying a 2px top stripe in its tier colour, the tier name in Instrument 500 step-1, the real count in Azeret, the real minimum price in Azeret, and `ChevronRight`. Rows with no stock show faint with "none in the catalogue" and are not links. Hover pulls a three-lot strip in from the right (M4). Padding **120 / 96**.

**5. Condition** (M8, `WearWalk.tsx` → `ConditionBand.tsx`). Full-bleed `--color-bg-tertiary`. Eyebrow "CONDITION", H2 "Five bands on the float scale", one paragraph: every copy of a skin carries a float between 0.00 and 1.00 fixed when it drops; the exterior name tells you which band that float falls in; a lower band means less visible wear. Then five equal cells across the band — each the condition grid's cell at a large size, inked for itself, with its real float range printed under it in Azeret, one real in-stock lot of that exterior hanging beneath, and the real count. Each cell links to the catalogue filtered to that exterior. Mobile: a 2-column grid with Battle-Scarred full width last. Padding **96 / 96**.

**6. Marks and provenance** (`MarksSplit.tsx`). An asymmetric split on `--color-bg`, **mirrored against the sibling's**: left 5 columns, offset 72px down — Souvenir: an H3, one true sentence ("Dropped from a souvenir package at a CS2 Major"), the real count in Azeret, a Text link, and two compact lots. Right 7 columns — StatTrak™: an H3, one true sentence ("Carries a counter that tracks kills made with that weapon"), the real count, a Text link, and three compact lots. A 1px vertical hairline between them. Either half is omitted when it has no stock. Padding **72 / 72**.

**7. By price** (`PriceBands.tsx`). On `--color-bg-secondary`, full bleed. H2 "By price" and a **ruled band index** rather than a segmented control: four rows — Under £25 · £25–£120 · £120–£600 · £600 and above (bands in the active currency, converted from the one config, §16) — each with its real count and a `ChevronRight`. Selecting a row (it is a radio group) reveals four standard lots beneath it from that band, cheapest first. A band holding fewer than three lots is dropped from the index. Padding **72 / 96**. Dense.

**8. How delivery works** (`HomeDelivery.tsx`). On `--color-bg`. The purchase timeline in its large static form as four steps — Sign in through Steam → Add your trade URL → Pay by card → Accept the trade offer in Steam — each with one sentence of honest copy from §15. A Text "Read how delivery works" with `ArrowRight`. Padding **96 / 72**.

**9. Questions** (`HomeQuestions.tsx`). Two columns, and **not an accordion stack**: left columns 1–4, the H2 "Questions", a vertical index of four question titles as buttons (the active one ink with a 2px claret rule under it), and a Ruled "All questions"; right columns 5–12, the selected answer in a reading panel at 66ch, in Instrument 400 step-0. The four questions are pulled from the FAQ page and must match it word for word (delivery, trade URL, Steam trade holds, refunds). `role="tablist"` with arrow-key movement; on mobile it degrades to an accordion. Padding **72 / 120**.

### 13.2 Catalogue (`/catalog`)

- **Opener:** the hang line full bleed under the breadcrumbs, then H1 "The catalogue" in Newsreader 500 step-5 with the real count beside it in Azeret, one factual sentence on what is in it, and on the right (desktop) the eight weapon types as a text index with counts (Instrument 600 uppercase 15px, a 2px claret rule on hover).
- **Body:** the filter column 272px left (§7.13), results right. Toolbar: the result sentence plus the active chips left, sort right. Then the **salon grid** (§7.8) — 36 per page, with positions 1 and 8 at anchor size. Pagination or Load more.
- **Empty results:** the empty-state mount, "No lots match these filters", the active chips with "Clear all", and the three nearest broadening suggestions computed from real counts ("Remove £25–£120 to see 214 more").
- **Mobile:** sticky toolbar (Filter, Sort), a 2-up salon grid with position 1 spanning full width, 12px column gap and 32px row gap, Add always visible.

### 13.3 Weapon-type page (`/catalog/[category]`, e.g. Rifles)

- Opener: breadcrumb "Catalogue / Rifles"; the hang line; H1 "Rifles" with its count; under it the **weapon index** — every weapon of that type that has stock as a wrapping row of text links, "AK-47 214 · M4A4 167 · AWP 158 · …", the name in Instrument 500 15px and the count in Azeret 11px, sorted by count. Mobile: a horizontal scroller.
- Knives and gloves use the same index with their real model names, and their lots carry the ★ mark.
- Then the standard filter + salon grid, with the Weapon type group hidden.

### 13.4 Weapon page (`/catalog/[category]`, e.g. AK-47)

- Opener: H1 "AK-47" with its count; one factual line from data — "214 lots in the catalogue, from £1.20 to £1,840.00", prices in Azeret; then a **classification distribution**: eight rows, each a 2px stripe in its tier colour whose **length is the real proportion** of lots in that tier for this weapon, with the tier name and count beside it. This is data, so proportional length is honest; each row is a filter link.
- Then the filter + salon grid, with Weapon type and Weapon hidden.

### 13.5 Lot page (`/product/[slug]`)

The page is a single lot hung on a wall with its label beside it rather than beneath it — the one place the label moves, because at this scale the label becomes the spec sheet.

**Desktop, 12 columns:**

- **The hung render (columns 1–7).** The hang line across the top of the column with one hook tick and a 32px wire; the render large on the wall (min 520px tall at 1440), `object-contain`, with its cast shadow and the raking spotlight (M7). No box, no fill, no border. Under the render: the M7 control row as Text buttons with icons — Rotate · Reset view · Zoom. Under that, the **condition grid** at full column width with its readout.
- **The label column (columns 8–12, sticky).** Breadcrumbs ("Rifles / AK-47"); the lot number in Azeret micro-caps; the annotation row (`ST` box, `Souvenir` italic, ★, phase); the weapon line in Azeret micro-caps; the H1 = the finish name in Newsreader 500 step-5 (for vanilla knives, the knife model); then a **ruled spec table** — 1px hairlines, 44px rows, the label in Azeret micro-caps and the value in Instrument 15px:

  | Lot | `VS-26674E9B21` (Azeret) |
  |---|---|
  | Condition | Field-Tested · float 0.15–0.38 |
  | Classification | the `classification` tag in `var(--rarity)` |
  | Weapon | AK-47 |
  | Type | Rifles |
  | Phase | only when present |
  | Collection | only when present |
  | StatTrak™ | "Counts kills made with this weapon" — only when true |
  | Souvenir | "Dropped from a souvenir package at a CS2 Major" — only when true |

  then the price in Newsreader 600 step-4 with availability in muted Azeret ("2 available", or nothing); then the action; then three ruled info rows with 18px icons — `ArrowLeftRight` "Delivered as a Steam trade offer to your trade URL", `LockKeyhole` "Card payment" with Visa and Mastercard at 20px, `CircleHelp` "How delivery works" as a link.

- **Action states.** Ready → Claret lg "Add to cart" (plus a Ruled lg "Buy now" straight to checkout, only if the lead keeps single-item buying). Signed out → the Account button "Sign in through Steam to buy". No trade URL → Claret lg "Add your trade URL", going to the trade-URL step and returning here. Price re-confirming → disabled "Checking price" with the drawn-line loader. Out of stock → disabled "Out of stock" plus "This exact lot isn't in the catalogue right now." and a link to the weapon's page. Mark (`Square`/`SquareCheck`) as a Text button.

**Below the fold:**

- **Other conditions and variants:** the same weapon and finish in other exteriors and with or without StatTrak™, as compact rows each carrying its own five-cell condition grid inked to its band, price right. Real listings only; omit the block if there are none.
- **Tabs:** *Details* (the item's real attributes, plus one honest paragraph: "The image is Steam's standard render for this skin. The wear and pattern on your copy may differ."), *Delivery* (the steps and any timing that is actually configured), *Price notes* ("Prices are re-confirmed when you pay.").
- **More AK-47 lots:** one row of four standard lots, all distinct from anything above.
- JSON-LD `Product` with an `Offer` in the active currency.

**Mobile:** the render full width with the rail above it (no WebGL; tapping opens the zoom dialog), the condition grid under it, then the label column's content in order; a sticky bottom bar (64px, `--color-mount`, 1px top hairline) with the price in Azeret and the action, appearing once the main action scrolls out of view.

### 13.6 Search (`/search`)

- H1 is the query: Newsreader 500 step-5 set as `“redline”` with the real count in Azeret. A large prefilled search input above it.
- Then the weapon matches as text links with counts ("AK-47 · 6", "M4A1-S · 2"), then the standard filter + salon grid. Sort defaults to `relevance` here and only here.
- No results: "Nothing in the catalogue matches “xyz”." plus three suggestions — check the spelling, search by weapon name, browse the eight types as links.

### 13.7 Cart (`/cart`)

- H1 "Cart" with the count in Azeret, and the hang line under the breadcrumbs.
- Desktop: rows in columns 1–8 — a 160×128 render on the wall with its cast shadow, the lot number, weapon line, finish name, the compact condition grid, the classification tag, annotations, price, the quantity rule from §7.12, and Remove. Hairlines between rows, never boxes.
- **Summary**, columns 9–12, sticky, `--color-mount`, 0px radius, 24px padding, with a 2px claret top rule: Subtotal, the total (labelled per the VAT rule) in Azeret step-2, the re-confirmation note, a Claret lg "Checkout", a Text "Continue shopping", the payment logos at 24px, and the merchant line (legal name and support email) at 14px.
- Mobile: stacked rows, the summary at the end, and a sticky bar "Checkout · £84.00".
- Empty: the drawer's empty state at page scale.

### 13.8 Checkout (`/checkout`) — four steps

- **Frame:** a minimal fascia (the lockup, "Secure checkout" with a 16px `LockKeyhole`, a Text "Back to cart") and the compact footer. `max-w-narrow`. No hang line here — checkout is a form, not a wall (§10.1).
- **Desktop:** the steps in columns 1–7; the **summary** in columns 8–12, sticky — compact rows, subtotal, total, and the policy links (Terms, Refunds, Privacy) at 14px.
- **Step 1 — Steam account.** Signed in through Steam: the Steam account block with a Text "Not you? Switch account". Signed in by email without Steam: one sentence ("We deliver skins as Steam trade offers, so your Steam account must be linked.") and the Account button, returning to this step.
- **Step 2 — Trade URL.** The trade URL field (§7.3), prefilled from the account. A mismatch with the linked account blocks Continue. Note under it: "We save it to your account for future orders. You can change it any time in Account → Trade URL."
- **Step 3 — Receipt and billing.** Email (prefilled), full name, country (restricted countries excluded by the config), and any billing field the payment provider requires.
- **Step 4 — Review and pay.**
  - a read-only summary of steps 1–3 with "Change" links;
  - the items as compact rows;
  - **price re-confirmation:** if the live check changed a price, an alert above the items — "The price of AK-47 | Redline (Field-Tested) changed from £12.40 to £12.95." — with a Claret sm "Accept new price" and a Text "Remove it"; Pay stays disabled until every issue is resolved; an item that went out of stock shows "No longer in the catalogue" and must be removed;
  - a required checkbox: "I have read and agree to the Terms and Conditions" (linked);
  - a required checkbox, the **digital-delivery consent**: "I ask you to start delivery straight after payment and I understand I lose my right to cancel once the trade offer is sent." (linking to the Refunds policy). This wording must match the Terms and the Refunds policy **exactly**, and the word "withdraw" appears nowhere in UI copy (§15);
  - a Claret lg "Pay £84.00", enabled only when both boxes are ticked and no price issue is open;
  - under it, Visa / Mastercard / PCI DSS at 28px and "Card payments are processed securely by {provider placeholder}. We never see or store your full card number." — matching the Privacy Policy.
- **Mobile:** the summary collapses to a top row "Show summary · £84.00"; steps follow; Pay is full width.
- **Payment failed on return:** an alert above step 4 — "Your payment didn't go through. You haven't been charged." plus "Try again".

**The payment stub stays.** With `PAYMENT_PROVIDER=none` the provider throws `PaymentUnavailableError` and the route answers **503**. That 503 is a designed page, not a stack trace: the full fascia and skirting, `max-w-read`, the empty-state mount, H1 in Newsreader 500 step-5 **"Card payment isn't switched on yet"**, one paragraph — "We can't take card payments on this store right now. Your cart is saved, and nothing has been charged." — a Ruled "Back to cart", a Text "Contact us", and the real HTTP status 503 with `Retry-After` left to the server. No countdown, no "coming soon", no email capture. `PAYMENT_PROVIDER=mock` keeps the existing `/checkout/mock-pay` page, restyled to these tokens and clearly headed "Test payment" so it can never be mistaken for a real card form.

### 13.9 Order confirmed (`/order/confirmed`)

A narrow column. H1 in Newsreader 500 step-5 "Payment received" (or "Payment confirmed" once the server says so — never claim delivery here). The order ID in Azeret with a `Copy` icon button. The purchase timeline live, polling, with M6. "We've sent a receipt to {email}." Then the items as compact rows, the totals, and the trade URL used with its token masked. Buttons: Claret "View my purchases", Ruled "Continue shopping".

### 13.10 Auth (`/auth/**`)

- **Sign in (`/auth/login`):** desktop two columns inside 960px. Left: H1 "Sign in"; the Account button "Sign in through Steam" first and full width (Steam is required to receive skins); a hairline captioned "or use email" in Azeret micro-caps; email, password with show/hide, a Text "Forgot your password?", a Claret lg "Sign in"; the error summary "Email or password is incorrect." Right, behind a 1px vertical hairline: H2 "New to Veltskins?" in Newsreader 500 step-3 and three true points as a plain list — Steam sign-in links your account so we can deliver; your purchases and their status in one place; mark lots to come back to — then a Ruled "Create an account". Mobile: the form first.
- **Register (`/auth/register`):** the step pattern (§7.22) in a 560px column, keeping the existing required fields and the T&C gate — 1 "About you" (first name, last name, date of birth with the 18+ rule from config and an error that names the rule), 2 "Contact" (email, phone with country prefix), 3 "Address" (street, city, country, postcode; restricted countries excluded), 4 "Password" (strength hint "At least 8 characters, one number", confirm, the Terms checkbox, a Claret lg "Create account" disabled until it is ticked). After creation, a prompt to link Steam with the Account button and a Text "Later".
- **Forgot / reset password:** a single 480px column, restyled.

### 13.11 Account (`/account/**`)

- **Layout:** desktop, a 240px left nav of text rows — Overview, My purchases, Trade URL, Marked lots, Profile, then a hairline and Sign out. The active row is ink with a 2px claret rule under it; the others muted. Mobile: a horizontal scroller of the same rows under the H1.
- **Overview (`/account`):** H1 "Hello, {persona or first name}"; the Steam account block; the most recent purchase as a compact row with its status tag and a "View" link; Text links to Trade URL and Profile. **No stat tiles.**
- **Trade URL (`/account/steam`):** H1 "Trade URL"; one paragraph — "We send every lot you buy as a trade offer to this URL. It must belong to the Steam account linked here."; the Steam account block; the trade URL field with a Claret "Save trade URL"; a short "Where to find it" ordered list (Steam → Inventory → Trade Offers → Who can send me trade offers? → Trade URL) with the external link; a status tag "Ready" / "Missing". Not one sentence about anybody else sending us offers.
- **My purchases (`/account/orders`):** H1 **"My purchases"** — keep this wording exactly; it is the functional, legal name of the page and the auction metaphor does not get to touch it. A ruled list, not cards: each purchase is a block holding a compact lot row (render, lot number, finish name, condition, classification tag, the price paid in Azeret, the date in muted Azeret, the order ID) with the compact timeline beneath it. In-flight purchases first, then by date. Polls while any is in flight. Empty: "No purchases yet" plus a Claret "Browse the catalogue". Signed out: "Sign in to see your purchases" plus the Account button.
- **Purchase detail (`/account/orders/[id]`):** H1 "Purchase {short ID}" with a status tag; the large timeline; the item as a feature row with its render on the wall; the amount paid and its currency; the trade URL used with its token masked; "Open trade offer" when one has been sent; "Need help with this purchase?" linking to contact with the ID prefilled.
- **Marked lots (`/account/wishlist`):** H1 **"Marked lots"**, with the lead "Lots you've marked to come back to. Marking doesn't reserve a lot or hold its price." A salon grid 3-up (2-up mobile). Out-of-stock entries use the lot's out-of-stock state.
- **Profile (`/account/profile`), Addresses (`/account/addresses`):** two groups (Personal details, Password) as accordion rows with their own Save buttons and success toasts. Keep the address page only if checkout still needs a billing address; otherwise delete the page and its nav row.

### 13.12 How delivery works (`/how-it-works`)

1. Hero: H1 in Newsreader 500 step-6 "How delivery works", with the hang line above it and one empty mount hanging beside it (decorative, `aria-hidden`); lead: "You pay by card, we send the skin to your Steam account as a trade offer, and you accept it in Steam."
2. The timeline in its large form as five steps, each its own section with an H2 in Newsreader 500 step-3 and two or three sentences: Sign in through Steam · Add your trade URL · Pay by card · We send a trade offer · Accept it in Steam. Timings only where one is genuinely configured; otherwise make no time claim at all.
3. "What your Steam account needs": a ruled list — Steam Guard and trade eligibility, inventory and trade offers allowed, a trade URL from the same account.
4. "If something goes wrong": ruled rows for each branch — offer expired, delivery failed, trade reversed by Steam, refund timing from the Refunds policy.
5. "Steam's own rules": one honest paragraph that Valve may apply trade holds or trade protection to items, and that those are Valve's rules and not ours.
6. A Claret "Browse the catalogue".

Reading blocks at 66ch. No invented guarantees — no "buyer protection", no "verified sellers", no "instant".

### 13.13 About (`/about`)

1. Hero: H1 in Newsreader 500 step-6 "A catalogue of CS2 skins, nothing else", a step-1 lead, and the hang line with one empty mount on the right.
2. "What we sell": CS2 skins listed with their real attributes; we are a store, and the price on the label is the price you pay after re-confirmation.
3. "How an order works": three ruled rows linking to How delivery works.
4. The colophon (the same component as the footer).
5. A Claret "Browse the catalogue".

No founder story, no pull quotes, no number that is not data.

### 13.14 FAQ (`/faq`)

H1 "Questions". Desktop: a left sticky group index (Ordering, Delivery & trade offers, Trade URL & Steam, Payment, Refunds, Account) with a 2px claret rule under the active group; right, accordion groups with H2s in Newsreader 500 step-3. Every number in an answer matches the policies word for word. Ends with "Still need help?" and a Ruled "Contact us". `FAQPage` JSON-LD.

### 13.15 Contact (`/contact`)

Desktop: left columns 1–5 — H1 "Contact us", one line with the real support hours and reply time from config, the colophon stacked, and "Have your order ID ready" with links to How delivery works and Refunds. Right columns 7–12 — the form: name, email, order ID (optional, Azeret), a subject select (Purchase, Delivery / trade offer, Refund, Account, Other), message, and a Claret "Send message". Success replaces the form. No map unless a real public address exists.

### 13.16 Policies (`/policies`, `/policies/*`, `/pages/[slug]`) — `PolicyLayout`

- **Index:** H1 "Policies"; a ruled list, each row with the title in Newsreader 500 step-2, a one-line scope, and "Last updated {date}" in muted Azeret.
- **Policy page:** desktop, a 240px sticky left index (the active row with a 2px claret rule) plus "On this page" built from the H2s; the main column at 66ch — H1 in Newsreader 500 step-5, a neutral "Last updated" tag, H2s in Newsreader 500 step-3 numbered "1.", "2.", body at 16px / 1.7, and ruled tables. The Cookie table lists `veltskins-consent`, `veltskins-theme`, `veltskins-cart`, `veltskins-currency` and `veltskins-marked`. Mobile: a "Jump to policy" select plus an "On this page" accordion.
- The shipping policy becomes delivery-by-trade-offer wording throughout — no carriers, no tracking numbers, no delivery addresses.
- Print styles: header and footer hidden, black on white, no claret.

### 13.17 404 (`src/app/(store)/[...missing]/page.tsx`)

The hang line with **one empty hook and a cut wire** — a hook tick on the rail, a 24px wire hanging from it, and nothing on the end — above an empty mount. H1 in Newsreader 500 step-5 **"This lot isn't on the wall"**, one line ("This page doesn't exist, or the lot is no longer in the catalogue."), the search field, the eight weapon types as links, and a Text "Back to home". A real 404 status.

### 13.18 Error states

Inline form errors per §7.2. Page fetch errors use the Alert. A failed live price check shows the lot's "Checking price" state and then, if it still fails, "Price unavailable right now" with Add disabled and an explanatory `aria-describedby`.

---

## 14. Imagery rules for Steam skin renders

1. Renders are Steam economy images: transparent PNGs of mixed aspect — rifles wide, knives diagonal, gloves nearly square. **Every render sits directly on the wall**, with its cast shadow and nothing behind it. There is no stage, no plinth, no filled box, ever. This is the single most visible difference from the sibling store, and it is the first thing to check in any review.
2. Render-box aspect is fixed per context: **5:4** for catalogue lots, cart rows and purchase rows; **16:11** for anchor lots and the home hero; **3:4** for the Rooms panel; the lot page uses a free-height area with a 520px minimum.
3. Fit with `object-contain`, centred, insets 8% left / 8% right / 10% top / 18% bottom. Never crop, never `object-cover`, never rotate, never mirror, never flip for composition.
4. **No CSS filters, blend modes, tints, duotones or classification washes on a render.** Opacity is allowed only for transitions and the out-of-stock state. The spotlight highlight is drawn on a separate layer — the CSS gradient or the WebGL canvas — never by filtering the image.
5. The cast shadow is `.cast-shadow` (§5.5), identical for every shape; no per-image shadow detection, no drop-shadow filters.
6. Request the size that matches the render box through `next/image` with correct `sizes` (catalogue ≈ 360px, anchor ≈ 720px, lot page ≈ 1024px). Use the Steam CDN remote pattern the reference project uses, or our own storage if the lead mirrors the images. **Never show a supplier name, watermark or URL** in the UI, in alt text or in metadata.
7. Alt text is the full market name: "StatTrak™ AK-47 | Redline (Field-Tested)".
8. No stock photography, no player models, no AI-generated scenes, no game screenshots, no weapon silhouettes, no decorative textures. The wall, the rail, the label, the typography and the renders are the entire visual world.
9. The home hero, the Rooms panel and the index preview pick their renders by the data rules in §13.1 and §16, recomputed on revalidate — never a hand-picked file that can go out of stock.

---

## 15. Copy voice and glossary

### 15.1 The hard line: we are a store, not an auction and not a marketplace

Veltskins **sells** skins it owns the right to deliver. Customers **buy** them. Nobody bids, nobody sells to us, nobody lists anything, and no money is ever held on anyone's behalf. The salon metaphor is about *how a catalogue looks and reads*, not about how a sale works, and it must never imply otherwise.

**Therefore, nowhere in the product — not in marketing copy, not in a section title, not in a tooltip, not in an email subject line — do these words appear:** bid, bidding, auction, hammer, reserve, reserve price, lot closes, closing, going once, consign, consignment, vendor, seller, sell your skins, trade in, payout, withdraw, withdrawal, deposit, balance, wallet, marketplace, escrow, P2P, list your item, instant sell, cash out, buyer's premium, estimate, valuation, appraisal, "worth", "investment", "price will rise".

The legal cancellation wording uses **"right to cancel"** and never "withdraw".

### 15.2 Where the metaphor is allowed

| Surface | Metaphor allowed? | Rule |
|---|---|---|
| Home section titles and leads | yes | "Today's lots", "Rooms", "Classification", "Condition", "By price". Each must be followed by a plain sentence that says what it actually is. |
| The wall label | yes, as **vocabulary only** | "LOT VS-…" is a product reference number and nothing more. It never says "estimate", "reserve" or "closes". |
| Marked lots page | yes | "Marked lots", with the lead that marking reserves nothing and holds no price. |
| About, how delivery works | lightly | A catalogue voice is fine; the facts are plain. |
| Email subject lines and headings | lightly | "Your lot is on its way" is fine. "Your winning bid" is not. |
| **Catalogue filters and navigation** | **no** | Always CS2's own names: Knives, Rifles, Field-Tested, Covert, StatTrak™, Souvenir. |
| **Cart, checkout, payment** | **no** | Cart, Checkout, Subtotal, Total, Pay £84.00, Card payment. |
| **Policies, refunds, terms, delivery, privacy, cookies** | **no** | Plain legal and functional English only. A policy never uses the word "lot" where it means "product" or "item". |
| **My purchases, purchase detail, order confirmation** | **no** | "Purchase", "order", "item". Never "winnings", "acquisition", "your collection". |
| **Error and status messages** | **no** | Plain. |

### 15.3 Glossary — the words this store uses

| Say | Not | Where |
|---|---|---|
| lot | listing, drop, piece, item (marketing surfaces only) | home, catalogue, labels, marked lots |
| item / product | lot | policies, checkout, emails about refunds |
| the catalogue | the shop, the store page, the marketplace | navigation, home, search |
| condition | wear, quality, grade | everywhere — the exterior line |
| classification | rarity grade, tier quality | everywhere — the rarity line |
| float range | float, wear value | always "the float range for this condition", never a single invented number |
| mark / marked | save, wishlist, favourite | the Mark control, the Marked lots page |
| Cart | Bag, Basket, Docket, List | everywhere, unchanged |
| trade offer | delivery, shipment, dispatch | everywhere |
| trade URL | trade link, trade address | everywhere |
| right to cancel | withdrawal, cooling off | checkout consent, refunds policy, terms |

### 15.4 Honesty rules (unchanged in substance from the house rules, restated because they are easy to erode)

- **The supplier is invisible.** No SIH, no sih.market, no "Steam market price", no "vs Steam", no cross-market comparison, no supplier logo, no supplier-derived discount. Our prices are our prices.
- **Delivery wording.** "We send your skin as a Steam trade offer once your payment is confirmed. Accept the offer in Steam to receive it." No "instant", "within seconds", "guaranteed", "no trade hold", "buyer protection" or "verified" unless a configured policy says exactly that, and timings only from config.
- **Item wording.** No invented floats, pattern seeds, "low float", "clean", "rare pattern" or market commentary. The render disclaimer (§13.5) stays.
- **No pressure.** "2 available" is fine when `count` is real. "Only 2 left!", countdowns, "trending", "hot" and "best seller" are not — unless ranked from real order data and labelled as exactly that.
- **No sale styling.** This store shows one price. No strike-throughs, no "was", no percentage badges, no `comparePrice` in the UI (§7.11).
- Buttons are verbs: Add to cart · Checkout · Continue · Pay £84.00 · Sign in through Steam · Save trade URL · Open trade offer · Search · Send message · Save choices · Mark.
- Banned filler, in any language: elevate, seamless, effortless, premium, curated, unleash, level up, drip, GG, "everything you need", "built for".

### 15.5 Status copy

Tighten the labels in `src/lib/sih/status-labels.ts` to these exact sentences, and reuse them verbatim in the timeline, the emails and the FAQ:

- Awaiting payment — "Waiting for your payment to be confirmed."
- Payment confirmed — "Payment received. We're preparing your trade offer."
- Processing — "We're preparing your trade offer."
- Trade offer sent — "Your trade offer is in Steam. Accept it before it expires."
- Delivered — "Delivered to your Steam inventory."
- Failed — "Delivery didn't go through. Your refund is being processed."
- Rolled back — "The trade was reversed in Steam. Your refund is being processed."
- Refund pending — "Your refund is being processed."
- Refunded — "Refunded to your card."

---

## 16. Merchandising — how the two catalogues stop looking alike

Veltskins and Patinaskins pull from the same supplier and the Veltskins database is a copy of Patinaskins' 3,838 products. **Nothing about the design will save us if the two stores show the same items in the same order at the same prices.** Every item below is a required change. Re-order and re-merchandise the existing rows in place — do not recreate tables and do not re-import.

### 16.1 Default sort — the single biggest lever

| | Patinaskins | Veltskins |
|---|---|---|
| `parseCatalogParams` default | `newest` | **`rarity-desc`** |
| Secondary order within a tier | — | price, high to low |
| `/search` default | `relevance` | `relevance` (unchanged — relevance is correct there) |

A salon hangs its best pieces first, so the catalogue opens on Classification, highest first. Change the `defaultSort` argument where `parseCatalogParams` is called for `/catalog` and `/catalog/[category]`, and make `rarity-desc` the first option in the sort select.

### 16.2 Page size and grid shape

`CATALOG_PAGE_SIZE` 24 → **36**. With the salon grid's two anchor positions per page (§7.8), no page of Veltskins results can line up with a page of the sibling's.

### 16.3 Price bands

`catalogConfig.pricing.bands` `[2, 10, 50, 200, 800]` → **`[5, 25, 120, 600]`**. The home band index (§13.1 §7) therefore reads Under £25 · £25–£120 · £120–£600 · £600 and above, against the sibling's Under £10 · £10–£50 · £50–£250 · £250+. Different boundaries mean different groupings of the same inventory. Bands are converted from this one config into the active currency; never hard-code them in a component.

### 16.4 Price floor, ceiling and margin

| `catalogConfig.pricing` | Patinaskins | Veltskins |
|---|---|---|
| `margin` | 0.07 | **0.085** |
| `minMarginAbs` | 0.10 | **0.15** |
| `priceTolerance` | 0.03 | **0.04** |
| `minPrice` | 0.50 | **1.00** |
| `maxPrice` | 3000 | **2400** |
| `maxCostOverReference` | 2.5 | **2.2** |

The margin change means **no item in the two stores ever carries the same price**, which is what a side-by-side comparison would look at first. The floor and ceiling trim both tails of the assortment, so the cheapest and dearest pages differ outright.

### 16.5 SKU prefix and the lot number

`skuFor()` in `src/lib/sih/sync.ts` builds `PS-${stableHash(marketHashName).slice(0,10)}`. Change the prefix to **`VS-`**, keeping the same stable hash so a given market name keeps a stable reference. Then rewrite the existing rows once:

```sql
UPDATE "Product" SET sku = 'VS-' || substring(sku from 4) WHERE sku LIKE 'PS-%';
```

The **lot number printed on every wall label is this SKU**, set in Azeret micro-caps as `LOT VS-26674E9B21`. It is a product reference and is searchable in support; it is never described as an auction lot number and never implies ordering, scarcity or a sale event.

### 16.6 Weapon-type quotas — different assortment at the next sync

`catalogConfig.quotas` currently caps rifles highest. Veltskins leads with knives and pushes the affordable, high-volume types, which also matches the Rooms composition in §13.1:

| Type | Patinaskins cap | Veltskins cap |
|---|---|---|
| knives | 640 | **700** |
| pistols | 820 | **900** |
| smgs | 560 | **700** |
| rifles | 900 | **620** |
| sniper-rifles | 420 | **360** |
| shotguns | 320 | **260** |
| machine-guns | 120 | **100** |
| gloves | 260 | **300** |

Total 3,940, inside the 3,000–5,000 target. Also `selection.maxVariantsPerSkin` 10 → **6**, so Veltskins carries fewer near-duplicate conditions of the same finish and the catalogue reads less repetitive. These take effect at the next sync; until then the divergence comes from §16.1–16.5.

### 16.7 Featured and home selection rules

Patinaskins picks "the dearest in-stock ★ or Covert item with a render" for its hero and fills its sections from the top of the price list. Veltskins must not. Implement these as the rules in `src/components/home/data.ts`, and keep the existing claimed-set logic so no lot appears twice:

- **The hang (hero).** Five lots: the **anchor** is one in-stock lot with a render drawn from the Classified tier or above, selected by a deterministic daily rotation (`dayOfYear % candidates.length` over a stable ordering), **not** by price. The other four come one each from four different weapon types, each inside the £25–£600 range, chosen by the same rotation. The wall changes daily, is stable within a day, is reproducible on the server, and cannot coincide with a "dearest item" pick.
- **Today's lots.** The eight most recently catalogued in-stock lots with a render **priced between £25 and £120** — explicitly a mid band, and explicitly different from the hero's selection. The home lead sentence states this rule in plain words and must be updated if the rule changes.
- **Rooms.** The large panel always shows Knives. The index lists the other seven types by real count. The panel's render is that type's dearest in-stock lot with a render.
- **Classification register.** All eight tiers, real counts and real minimums. Hover strips take the three lots nearest each tier's median price, not its top.
- **Condition band.** One real in-stock lot per exterior, chosen by the same daily rotation.
- **Marks.** Souvenir on the left and StatTrak™ on the right — the mirror of the sibling's arrangement — each filled from its own real stock.
- **By price.** Four lots per band, cheapest first within the band.

### 16.8 Category emphasis in navigation

The header's centre set leads **KNIVES · GLOVES · RIFLES · PISTOLS · SNIPERS**; the footer's Catalogue column lists all eight starting with Knives and Gloves; the mobile menu uses the same order. The sibling leads with Knives, Gloves, Rifles, Pistols, SMGs, Heavy and collapses eight real types into six. Veltskins shows all eight real `WEAPON_TYPES` with their real labels, including Shotguns and Machine guns as first-class types rather than a merged "Heavy" bucket — a different taxonomy on every page that lists one.

---

## 17. Email and PDF invoice

### 17.1 Transactional email (`src/lib/email.ts`)

**Read this first:** the `C` palette in `email.ts` is still the *Brasmora* one — warm brown `#2a1a15`, paint `#3b2620`, brass `#c9a04e`, canvas `#f1f3f2` — with `Gloock` and `Commissioner` in the font stacks. It was never updated for Inspection Bay. Replace it wholesale; do not "adjust" it.

```ts
const C = {
  canvas: "#ede7dc",
  panel: "#f8f5ef",
  wall: "#ede7dc",
  ink: "#221e1a",
  muted: "#58504a",
  subtle: "#5f5750",
  claret: "#86203a",
  onClaret: "#fbf6f0",
  wash: "#f2e1e3",
  rail: "#7c7265",
  line: "#d3c9b9",
  rule: "#b8ac99",
  success: "#1e6b43",
  danger: "#a8231c",
} as const;

const SERIF = "Newsreader, Georgia, 'Times New Roman', serif";
const SANS = "'Instrument Sans', 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Azeret Mono', 'SFMono-Regular', Menlo, Consolas, monospace";
```

Webfonts do not load reliably in email clients, and that is fine: the fallbacks are chosen so the serif/sans/mono *roles* survive even when the real faces do not. Do not embed webfonts in email.

**Structural changes** (so the two stores' emails do not read as one template):

- **Header.** The sibling sets a dark `paint` band with the wordmark in it. Veltskins uses the wall colour with the **hang line** across the full 600px width at `C.rail`, 1px, and the bone-on-claret mark plate at 36px hanging beneath it on the left with the wordmark beside it in `C.ink` — i.e. the brand hangs from the rail, exactly as on the site. Use `public/brand/veltskins-lockup.svg` rendered to PNG at 2× for clients that refuse SVG.
- **H1** in `SERIF`, weight 500, 26px, `C.ink`.
- **Eyebrow** in `MONO`, 11px, uppercase, 0.1em tracking, `C.subtle`.
- **The claret chip** replaces the brass chip: `background: C.claret`, `color: C.onClaret`, `MONO` 12px — used for the order number only.
- **Button:** `background: C.claret`, `color: C.onClaret`, `SANS` 600 15px, 14px 28px padding, **0px radius**. One primary button per email.
- **Item rows** carry the **lot number** in `MONO` under the finish name, plus the condition line and the classification word — the email is a printed version of the wall label, so it carries the same five rows in the same order.
- **Rules.** Table heads get a 1px `C.rule` underline (the sibling uses a 2px dark rule). The totals row gets a 1px `C.claret` rule above it — the only claret line in the body.
- **Footer.** The colophon from `COMPANY`, the Valve disclaimer in the §11.4 wording, and the payment logos. No claret.

### 17.2 PDF invoice (`src/lib/invoice.ts`)

Invoices are always light. Replace the colour constants and the font files:

```ts
const INK = hex("#221E1A");
const MUTED = hex("#58504A");
const SUBTLE = hex("#5F5750");
const RULE = hex("#B8AC99");
const LINE = hex("#D3C9B9");
const ACCENT = hex("#86203A");

const FONT_FILES = {
  display: "newsreader-latin-500-normal.woff",
  body: "instrument-sans-latin-400-normal.woff",
  strong: "instrument-sans-latin-600-normal.woff",
  mono: "azeret-mono-latin-500-normal.woff",
} as const;
```

All four files exist in the static packages `@fontsource/newsreader@5.3.0`, `@fontsource/instrument-sans@5.3.0` and `@fontsource/azeret-mono@5.3.0` under `files/`; copy them into `public/fonts/` and delete the Sofia / Source Sans / Martian files.

**Structural changes:**

- **Delete the dotless-i wordmark code path entirely** (`ı`, the `FALLBACK_LETTERS` entries that support it, and the three-part `drawText` that inserts the amber tittle). That hack existed to put an amber square on Patinaskins' "i" and has no equivalent here.
- The invoice header is **the hang line**: a 1px `ACCENT` rule across the full content width at the top margin, with the wordmark in `fonts.display` at 22px hanging 16pt beneath it on the left, and "Invoice" plus the invoice number in `fonts.mono` right-aligned on the same baseline.
- Column heads in `fonts.strong` at 7pt, uppercase, 0.9 tracking, `SUBTLE`, over a 1px `RULE` underline.
- Line items carry the **lot number** in `fonts.mono` at 7pt under the product name — matching the wall label and the email.
- The totals block sits under a 1px `ACCENT` rule; the grand total is `fonts.display` at 13pt in `INK`.
- The footer carries the `COMPANY` colophon and the VAT line **only when `COMPANY.vatRegistered`**.
- Keep the existing `printable()` / `wrap()` / `FALLBACK_LETTERS` machinery for everything else: Newsreader, Instrument Sans and Azeret Mono are all latin-subset here, so unmapped characters still need the fallback.

Check one rendered invoice with `scripts/render-sample-invoice.ts` before calling this done.

---

## 18. Mobile compositions

Mobile is designed, not stacked. The base is 390px. These are the compositions that must exist as their own designs:

| Surface | Mobile composition |
|---|---|
| Home hero | rail at 48px → H1 step-6 → lead → **search field first** → anchor lot full width with its label → the four small lots as a 2×2 block at half width. The hero's primary action is above the fold. |
| Today's lots | a snap scroller at 72% viewport width per lot, rail threaded through, no edge fade |
| Rooms | the Knives panel full width, then the seven index rows at 56px each |
| Classification | the register as full-width rows; the hover strip becomes a tap that navigates, not a reveal |
| Condition | a 2-column cell grid with Battle-Scarred full width last |
| Catalogue | sticky Filter/Sort toolbar under the header; a 2-up salon grid where **position 1 spans full width**; 12px column gap, 32px row gap; Add always visible at 44px |
| Filters | a bottom sheet, full height, 0px radius, with a sticky "Show 1,284 lots" footer |
| Lot page | render full width under the rail, condition grid, then the label content; a 64px sticky bottom bar with the price and the action once the main action scrolls away |
| Cart | stacked rows, summary last, sticky "Checkout · £84.00" bar |
| Checkout | the summary collapses to a "Show summary · £84.00" row at the top; Pay is full width |
| Menu | a full-height sheet **from the left**, types first, then account, then help, then currency and theme |
| Footer | two hook ticks on the rail, columns as accordions, one-column colophon, logos centred at 24px |

Touch targets are 44px minimum everywhere, including the Mark control, filter rows, condition cells and pagination. Nothing depends on hover: the Mark and Add controls are permanently visible on touch, the Rooms panel swaps on tap-through rather than hover, and the classification strip is replaced by navigation.

---

## 19. Reduced motion — the static design

`prefers-reduced-motion: reduce` must produce a design that looks finished, not a design with the animation removed. Specifically:

- Every section renders its **designed end state**: rails drawn, hooks placed, lots hung at their final offsets, labels in place, the spotlight at `--sx: 32% / --sy: 8%` on the anchor lot and the lot page render.
- No `hang-in`, no `rail-draw`, no stagger, no sway, no count roll, no cart ghost, no crossfade on the Rooms panel (it swaps instantly), no timeline draw (the new node is simply filled).
- **No WebGL initialises at all.** The CSS `--spot-rake` layer is the whole design and must look complete alone — check this by disabling the canvas in both themes.
- Transitions collapse to an instant state change or a ≤120ms opacity fade (`--dur-reduced`). Panels, drawers and dialogs open and close with opacity only.
- `scroll-behavior: smooth` is removed; the snap scrollers keep their snap (snap is layout, not motion) but lose their reveal stagger.
- The drawn-line loader becomes the static text "Loading…".
- Every one of M1–M10's "static / reduced-motion state" column in §12.2 is the contract. If a section looks unfinished with motion off, the section is wrong, not the motion.











---

## 20. Accessibility and quality floor

- **WCAG 2.2 AA** in both themes, with the ratios in §3.2–3.3 as the contract. Every control has a visible focus ring (2px `--color-focus`, 2px offset, 3px on a lot); touch targets ≥44px.
- **Landmarks:** `header`, `nav` (main, breadcrumb, footer, account), `main`, `footer`. One `h1` per page, then `h2`/`h3` in order. The hang line, hook ticks, wires and cast shadows are all `aria-hidden` — they are decoration and carry no information that is not also printed.
- **ARIA patterns:** disclosure (filter groups, the catalogue index), tabs (lot page, home Questions), combobox (search, and collection/country if custom), dialog (cart, menu, preference centre, zoom), slider (price only — there is no exterior slider in this store), radiogroup (segmented controls, the price band index), switch (cookies), live regions (cart, checkout steps, purchase status, quantity clamp, trade-URL validation).
- **Rarity is never conveyed by colour alone.** The tier name is always present as text — on the label's classification line, in the filter row, in the spec table, and in the lot's accessible description (`aria-describedby`, "Covert, Field-Tested"). The label stripe is decoration on top of that text, never instead of it.
- **Condition is never conveyed by the inked cell alone.** The exterior name and float range are printed beside the grid, and the grid itself is `role="img"` with a full label, or `aria-hidden` in the compact form where the text carries it.
- **Keyboard:** everything reachable and operable; the lot page render area is focusable with documented keys (arrows rotate, `+`/`−` zoom, `0` resets) exposed through a visually hidden description; Esc closes every overlay and returns focus; the horizontal scrollers are keyboard-scrollable.
- **Performance:** LCP ≤ 2.5s on mid-tier 4G with the hero H1 as the LCP element; CLS 0; INP ≤ 200ms; renders lazy below the fold; fonts latin + latin-ext only with one preloaded file; **no WebGL on catalogue pages**; home motion JS ≤ 70 KB gzip (§12.3).
- **Theme parity:** every screen checked in Day Hang and Evening Viewing, including the dark-theme spotlight rule (no faint text inside the pool, §3.2).
- **SEO:** unique titles and descriptions; `Product`, `BreadcrumbList`, `FAQPage` and `Organization` JSON-LD; the OG image per §9.3.
- **QC items that touch design** (from `CHECKLIST-QC.md`): payment logos in the footer and at checkout; `COMPANY` credentials in the footer on every page; the Valve disclaimer; the "Cookie settings" link; multi-step registration with required fields and the T&C gate; the digital-delivery consent checkbox at payment; no language switcher; no fake stock, ratings or claims.

---

## 21. Implementation order

1. **Tokens.** `variables.css` (light on `:root`, Evening Viewing under `[data-theme="dark"]`), the `@theme inline` additions (rarity, rail, wire, mount, fascia, skirting, spotlight, the type scale, the `data` / `compact` utilities), the `tailwind.config.ts` mirror, the `ThemeScript` light fallback and key rename, the fonts and `fonts.css`, the global base rules, `.cast-shadow`, the hang-line and label utilities, the animations clean-up, `tokens.ts`.
2. **Sweeps** (§2.5) — stage, lamp, spine, ruler, marks, hexes, storage keys, brand strings, the old home tree.
3. **Primitives.** Button, Field, Select, Choice, Plate→tags, Chip, Tabs, Accordion, Dialog, toasts, the drawn-line loader, EmptyState, Alert, Breadcrumbs, Pagination, QuantitySelector, PriceDisplay.
4. **Lot primitives.** The rarity mapping helper, `StarMark`, `ConditionGrid`, `WallLabel`, `Lot` (standard, compact, anchor), `HangLine`, `PurchaseTimeline`, `SteamAccountBlock`, `TradeUrlField`.
5. **Chrome.** Header fascia, catalogue index panel, mobile menu, search panel, footer skirting, cookie banner and preference centre.
6. **Merchandising** (§16) — the sort default, page size, bands, pricing config, the `VS-` prefix and the one-off SQL, the quotas, the home selection rules. Do this *before* the pages, so every page is built against the real ordering.
7. **Pages,** in this order: catalogue → weapon type → weapon → lot → search → cart drawer and page → checkout (including the designed 503) → order confirmed → my purchases and detail → trade URL → auth → the rest of account → how delivery works, about, FAQ, contact, policies, 404 → home last, with the static end states of M1–M4 and M8 in place.
8. **Brand wiring.** `BrandMark.tsx`, `gen-favicons.mjs`, the manifest, the metadata, the OG image, the email palette and structure, the invoice palette, fonts and structure.
9. **Hand over to the motion engineer** with the §12 hooks in place and every static end state correct.
10. `npm run build`; then walk every page at 390 / 768 / 1280 / 1536, in both themes, and once more with reduced motion on.

---

## 22. Slop self-audit — the result must pass every line

### Visual

- [ ] Radii are only **0** (everything printed, mounted or framed) and **3px** (controls), plus the 0px checkbox; circles only for radio dots and timeline nodes; no pills anywhere.
- [ ] **No skin sits in a box.** Every render is on the open wall with its cast shadow. There is no stage, no tray, no tile, no filled media panel.
- [ ] The only gradient on the site is `--spot-rake`, and it appears on exactly two surfaces. No glow, glass, blur, blob, mesh, neon, gradient text or coloured shadow.
- [ ] Rarity appears only as the label's 2px top stripe and the printed classification word. Never a fill, wash, glow, outline or tinted render.
- [ ] Claret appears only on interactive things. Count the claret elements in any viewport: more than four non-button clarets means remove some. **No claret inside a wall label.**
- [ ] Not everything is a card: the filters, header, footer, account nav, purchases, FAQ, policies, spec tables, Rooms index and classification register are typography on hairlines. The boxed objects on the whole site are wall labels, dialogs, drawers, the cart summary and the cookie panel.
- [ ] Importance varies: the salon grid has two anchor positions per page, the hero has three lot sizes, Rooms has one panel against seven rows. No grid of N identical components where importance differs.
- [ ] Newsreader, Instrument Sans and Azeret Mono are the only families. No Sofia Sans Condensed, Source Sans 3, Martian Mono, Gloock, Commissioner, Inter, Roboto, Anton, Space Grotesk, Archivo, JetBrains Mono or system-ui as identity. Mono never sets a sentence; the serif never sets a control.
- [ ] Type scale tokens everywhere, no stray font sizes. Uppercase only on Azeret micro-labels, Instrument nav and Instrument buttons. Italic only on the `Souvenir` annotation.
- [ ] Section padding differs per section, as §13.1 specifies.
- [ ] One hang line per section, at the same height within every section that has one; never vertical, never dashed, never doubled.
- [ ] The label moves less than its lot in every motion hook (§12.1).
- [ ] Icons are Lucide at stroke 1.5, never in circles, never decorative; no weapon or crosshair glyphs; the cart is `ClipboardList`, Mark is `Square`/`SquareCheck`, filters are `ListFilter`, theme is `Lightbulb`/`LightbulbOff`.
- [ ] Renders are uncropped, unrotated, unfiltered, with the identical cast shadow.

### Content and honesty

- [ ] No invented floats, pattern seeds, counts, ratings, testimonials, partner logos, scarcity or "best seller".
- [ ] No supplier mention or Steam price comparison anywhere, including alt text and metadata.
- [ ] **No auction vocabulary** — no bid, reserve, hammer, consign, closes, estimate, valuation, buyer's premium (§15.1) — and no marketplace vocabulary — no sell, payout, withdraw, deposit, balance, escrow, marketplace.
- [ ] The word "lot" never appears in a policy, in checkout, in a refund message or on the purchases pages (§15.2).
- [ ] "Marked lots" says explicitly that marking reserves nothing and holds no price.
- [ ] Delivery, refund and payment statements match the policies; the VAT label follows `COMPANY.vatRegistered`; the digital-delivery consent wording matches the Terms exactly; "right to cancel", never "withdraw".
- [ ] Footer on **every** page, including checkout and the 503: `COMPANY` credentials, the trading-name line, the Valve disclaimer in the new wording, coloured Visa / Mastercard / PCI DSS from `/payments/*.svg`, and "Cookie settings".
- [ ] No Patinaskins, Brasmora, Inspection Bay or Dresser leftovers in copy, metadata, storage keys, component names or assets.

### Function and accessibility

- [ ] Both themes designed and verified; `:root` is light; no `text-white` on claret.
- [ ] Focus rings visible on every control, including condition cells and whole lots.
- [ ] Filters, the price slider, segmented controls, tabs, dialogs, the lot render area and the timeline follow their ARIA patterns and work by keyboard.
- [ ] Reduced motion shows a complete static design in both themes, with no canvas at all.
- [ ] Mobile is composed per §18, not desktop stacked.
- [ ] Every home section draws a distinct assortment; empty sections are omitted; the collection filter stays hidden until collection data exists.
- [ ] No pinning and no scroll-jacking anywhere.

### Distinctness

- [ ] Side by side with **Patinaskins**: plaster wall vs graphite room; unboxed hung renders vs boxed trays with lit stages; a paper label under the lot vs a data strip inside it; a horizontal rarity stripe vs a vertical spine; a five-cell condition grid vs a tick ruler with a jaw; claret vs amber; serif catalogue voice vs condensed grotesque; light-first vs dark-first; `ClipboardList` vs `ShoppingCart`; nine home sections in a different order with different shapes; a different default sort, page size, price bands, margin and SKU prefix.
- [ ] Nothing reads as **The Dresser** (no bevels, shelves, brass, cornice, plinth), **Drop District** (no concrete, Anton, orange-red, stickers, tape, ticker, index numerals, offset shadows), **Blueprint Works** (no drafting paper, blueprint blue, title blocks, stamps, registration marks, leader lines, mm grid), **Chipwave** (no porcelain and lime, no pad grid), **Aurora Signal** (no gradient, glass, starfield), **Console Deck** (no ice white, glass, tile rails), **Vault Run**, **Paper Theatre** or **Departure Board**.
- [ ] Could a stranger mistake this for a generic "premium editorial" template — a big serif headline, a centred hero, three equal cards, a quiet beige background? If yes, find the section and bring it back to the rail, the hang, the label and the raking light.
- [ ] Could a stranger mistake this for an auction site and expect to bid? If yes, the copy has drifted past §15 and must come back.
