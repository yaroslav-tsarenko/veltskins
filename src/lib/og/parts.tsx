import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import { OG_PALETTE as P, OG_SIZE, ogFonts } from "./assets";

export async function ogResponse(element: ReactElement, cacheSeconds = 86400) {
  const fonts = await ogFonts();
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts,
    headers: { "Cache-Control": `public, max-age=${Math.min(cacheSeconds, 3600)}, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}` },
  });
}

export function Mark({ size }: { size: number }) {
  const u = size / 512;
  return (
    <div style={{ display: "flex", position: "relative", width: size, height: size, background: P.accent }}>
      <div style={{ position: "absolute", left: 48 * u, top: 141 * u, width: 416 * u, height: 14 * u, background: P.onAccent }} />
      <div style={{ position: "absolute", left: 138 * u, top: 115 * u, width: 14 * u, height: 26 * u, background: P.onAccent }} />
      <div style={{ position: "absolute", left: 360 * u, top: 115 * u, width: 14 * u, height: 26 * u, background: P.onAccent }} />
      <div style={{ position: "absolute", left: 150 * u, top: 335 * u, width: 212 * u, height: 32 * u, background: P.onAccent }} />
      <div style={{ position: "absolute", left: 186 * u, top: 381 * u, width: 140 * u, height: 16 * u, background: P.onAccent }} />
      <div
        style={{
          position: "absolute",
          left: 145 * u,
          top: 155 * u,
          width: 14 * u,
          height: 215 * u,
          background: P.onAccent,
          transform: `rotate(-31.6deg)`,
          transformOrigin: "top left",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 367 * u,
          top: 155 * u,
          width: 14 * u,
          height: 215 * u,
          background: P.onAccent,
          transform: `rotate(31.6deg)`,
          transformOrigin: "top right",
        }}
      />
    </div>
  );
}

export function Wordmark({ size, color = P.ink }: { size: number; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ display: "flex", width: size * 6.4, height: Math.max(1, size * 0.02), background: P.accent, marginBottom: size * 0.26 }} />
      <div style={{ display: "flex", fontFamily: "Newsreader", fontWeight: 500, fontSize: size * 1.5, lineHeight: 1, letterSpacing: -size * 0.0075, color }}>Veltskins</div>
    </div>
  );
}

export function Lockup({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.6 }}>
      <Mark size={size * 2.4} />
      <Wordmark size={size} />
    </div>
  );
}

export function Rail({ width, hooks = 2 }: { width: number; hooks?: number }) {
  return (
    <div style={{ display: "flex", position: "relative", width, height: 8 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: P.rail }} />
      {Array.from({ length: hooks }, (_, i) => ((i + 0.5) / hooks) * width).map((left) => (
        <div key={left} style={{ position: "absolute", left, bottom: 0, width: 2, height: 7, background: P.rail }} />
      ))}
    </div>
  );
}

export function HungLot({
  src,
  width,
  height,
  label,
  spot = true,
}: {
  src: string | null;
  width: number;
  height: number;
  label?: { lot?: string | null; weapon?: string | null; name?: string | null; condition?: string | null; classification?: string | null; rarity?: string };
  spot?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width }}>
      <Rail width={width} hooks={1} />
      <div style={{ display: "flex", width: 1, height: 26, background: P.rule, marginLeft: width * 0.5 - 0.5 }} />
      <div style={{ display: "flex", position: "relative", width, height }}>
        {spot ? (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(ellipse 76% 64% at 32% 8%, ${P.spot}, transparent 70%)` }} />
        ) : null}
        <div style={{ position: "absolute", left: "12%", bottom: "4%", width: "62%", height: 14, borderRadius: "50%", background: P.contact, filter: "blur(7px)" }} />
        {src ? <img src={src} alt="" style={{ position: "absolute", left: "8%", top: "10%", width: "84%", height: "72%", objectFit: "contain" }} /> : null}
      </div>
      {label ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: width * 0.84,
            marginTop: 16,
            background: P.mount,
            borderLeft: `1px solid ${P.line}`,
            borderRight: `1px solid ${P.line}`,
            borderBottom: `1px solid ${P.line}`,
            borderTop: `2px solid ${label.rarity ?? P.rule}`,
            padding: "14px 16px 16px",
          }}
        >
          {label.lot ? (
            <div style={{ display: "flex", fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", color: P.inkFaint }}>{label.lot}</div>
          ) : null}
          {label.weapon ? (
            <div style={{ display: "flex", marginTop: 10, fontFamily: "Azeret Mono", fontWeight: 500, fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", color: P.inkMuted }}>
              {label.weapon}
            </div>
          ) : null}
          {label.name ? (
            <div style={{ display: "block", marginTop: 8, fontFamily: "Newsreader", fontWeight: 500, fontSize: 28, lineHeight: 1.2, color: P.ink, lineClamp: 2, overflow: "hidden" }}>
              {label.name}
            </div>
          ) : null}
          {label.condition ? (
            <div style={{ display: "flex", marginTop: 10, fontFamily: "Instrument Sans", fontSize: 18, color: P.ink }}>{label.condition}</div>
          ) : null}
          {label.classification ? (
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontFamily: "Azeret Mono",
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: 1.3,
                textTransform: "uppercase",
                color: label.rarity ?? P.inkMuted,
              }}
            >
              {label.classification}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function titleSize(text: string, sizes: [number, number][]): number {
  for (const [max, size] of sizes) if (text.length <= max) return size;
  return sizes[sizes.length - 1][1];
}
