import { FLASH_DESIGNS, type FlashId } from "./tattooDesigns";

const STROKE_WIDTH = 1.55;

// Renders a flash design as an SVG icon — used by the sidebar grid, the
// control panel's "active design" readout, and nowhere near the 3D scene
// (that uses renderFlashTexture from tattooDesigns.ts instead, built from
// the same primitive data so the two stay visually identical).
export default function FlashMark({ id, className = "" }: { id: FlashId; className?: string }) {
  const design = FLASH_DESIGNS.find((d) => d.id === id);
  if (!design) return null;

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {design.primitives.map((prim, i) =>
        prim.kind === "path" ? (
          <path
            key={i}
            d={prim.d}
            fill={prim.fill ? "currentColor" : "none"}
            stroke={prim.fill ? "none" : "currentColor"}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <circle
            key={i}
            cx={prim.cx}
            cy={prim.cy}
            r={prim.r}
            fill={prim.fill ? "currentColor" : "none"}
            stroke={prim.fill ? "none" : "currentColor"}
            strokeWidth={STROKE_WIDTH}
          />
        )
      )}
    </svg>
  );
}
