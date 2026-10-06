"use client";

import * as THREE from "three";
import type { TattooDesign } from "./tattooDesigns";

type Props = {
  designs: TattooDesign[];
  textures: Map<string, THREE.CanvasTexture>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasPlacement: boolean;
  onClear: () => void;
};

export default function DesignSidebar({ designs, textures, selectedId, onSelect, hasPlacement, onClear }: Props) {
  return (
    <aside className="w-full md:w-56 shrink-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: "var(--font-mono)" }}>
          flash
        </p>
        <button
          onClick={onClear}
          disabled={!hasPlacement}
          className="text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          clear
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-[220px] md:max-h-none md:flex-1">
        {designs.map((design) => {
          const canvas = textures.get(design.id)?.image as HTMLCanvasElement | undefined;
          const isActive = selectedId === design.id;
          return (
            <button
              key={design.id}
              onClick={() => onSelect(design.id)}
              className={`group relative aspect-square rounded-lg border overflow-hidden bg-[#55565b] transition-colors ${
                isActive ? "border-white/80" : "border-white/10 hover:border-white/40"
              }`}
            >
              {canvas && (
                // eslint-disable-next-line @next/next/no-img-element -- canvas-generated data URL, not an optimizable asset
                <img
                  src={canvas.toDataURL()}
                  alt={design.name}
                  className="w-full h-full object-contain p-2"
                  draggable={false}
                />
              )}
              <span
                className="absolute bottom-1 left-0 right-0 text-center text-[9px] tracking-[0.1em] uppercase text-white/70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {design.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] leading-relaxed text-white/30" style={{ fontFamily: "var(--font-mono)" }}>
        select a design, then click the body to place it.
      </p>
    </aside>
  );
}
