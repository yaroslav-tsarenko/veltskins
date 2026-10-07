# Veltskins — Concept record

Phase 1 was skipped. The owner chose the direction from a quiz preview and it is locked. This file records what was chosen and what was ruled out, so nobody re-opens the question. The implementation prompt is `.claude/briefs/DESIGN-BRIEF.md`.

---

## Chosen: "Salon Hang"

**Metaphor.** An auction house / gallery salon. Veltskins is a light, warm plaster wall. Each skin is hung on that wall as a **lot**, and under each lot sits a **museum wall label** carrying the lot number, the weapon and finish, the condition (exterior with its float range) and the printed classification (rarity). The lots are arranged in a **salon hang** — a deliberately composed asymmetric wall of different sizes, never a uniform grid. A thin **hang line** (a picture rail) runs horizontally through the sections and ties the whole page together. A warm **gallery spotlight** rakes the hung render from above-left.

**Emotional target.** The visitor should feel they are walking a well-lit viewing room where everything is catalogued and nothing is hidden, and should be able to find a skin, read its condition and classification from the label, and buy it in a few clicks.

**Carriers of colour.** The skin renders carry the colour; the wall does not. Rarity carries the second layer as the label's top stripe and its printed classification line. Claret owns actions and nothing else.

**Type.** Display: `@fontsource-variable/newsreader` (transitional antiqua — the catalogue voice). UI: `@fontsource-variable/instrument-sans` (quiet grotesque). Data: `@fontsource-variable/azeret-mono` (lot numbers, floats, prices).

**Colour.** Warm plaster `#EDE7DC` light-first (`:root`), with a designed dark counterpart "Evening Viewing" (`#1A1613`, picture lights on). Accent claret `#86203A` light / `#A82B3B` dark.

**Geometry.** 0px on everything that frames, mounts, prints or holds; 3px only on controls you touch; circles only for radio dots and timeline nodes.

**Signature motifs.** 1. the hang line · 2. the wall label (with lot number and rarity stripe) · 3. the raking spotlight.

**Signature WebGL moment.** `S1 Raking light` — the spotlight on the hero's largest hung render.

---

## Not chosen / ruled out before the quiz

These were discarded because a sibling store in the portfolio already owns the territory, or because the niche makes them dishonest:

- **Any dark "inspection" room.** Owned by Patinaskins ("Inspection Bay": graphite room, overhead lamp, rarity spine, calibrated float ruler with the amber jaw).
- **Street / sticker / concrete energy.** Owned by Drop District.
- **Drafting paper, title blocks, registration marks.** Owned by Blueprint Works.
- **Porcelain + lime pad grid.** Owned by Chipwave. **Polar-night gradient and glass.** Owned by Aurora Signal. **Ice-white tile rails.** Owned by Console Deck. **Chocolate + brass furniture.** Owned by The Dresser. Also off limits: Vault Run, Paper Theatre, Departure Board.
- **Anything that makes the auction metaphor literal.** No bidding, no countdown to a hammer price, no reserve, no "sold" red dots, no consignment, no "sell your skins". Veltskins is a store: we sell, the customer buys, nobody bids and nobody sells to us. The metaphor is a *hang and a catalogue*, never an auction mechanic. See the brief, §15.

---

## Constraints the choice had to satisfy

1. Nothing visual may be shared with Patinaskins or with any sibling direction (full audit in the brief, §1.5).
2. Typefaces must exist on `@fontsource` / `@fontsource-variable` and must not be any family a sibling uses.
3. Light **and** a designed dark theme, both WCAG AA verified with real contrast math, including all seven CS2 rarity tokens (brief, §3.2–3.4).
4. Merchandising must differ enough that the two stores never read as the same inventory in the same order (brief, §16).
5. Footer on every page carries the company credentials placeholders, the coloured Visa / Mastercard / PCI DSS logos and the Valve disclaimer.
