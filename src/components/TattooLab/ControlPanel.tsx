"use client";

import FlashMark from "./FlashMark";
import { FLASH_DESIGNS, type FlashId } from "./tattooDesigns";
import type { PlacedInk } from "./types";

type Style = { size: number; opacity: number };

type Props = {
  inks: PlacedInk[];
  selectedId: FlashId;
  yawDeg: number;
  style: Style;
  onStyleChange: (next: Partial<Style>) => void;
  onClear: () => void;
};

export default function ControlPanel({ inks, selectedId, yawDeg, style, onStyleChange, onClear }: Props) {
  const selectedDesign = FLASH_DESIGNS.find((d) => d.id === selectedId)!;
  const placedCount = inks.filter((i) => i.visible).length;

  return (
    <aside className="control-panel" aria-label="Canvas controls">
      <div>
        <div className="panel-heading">
          <span>Placement</span>
          <span>{placedCount.toString().padStart(2, "0")}</span>
        </div>
        <div className="status-block">
          <span>Active design</span>
          <div>
            <FlashMark id={selectedId} />
            <strong>{selectedDesign.name}</strong>
          </div>
        </div>

        <div className="style-sliders">
          <div className="style-slider">
            <input
              type="range"
              min={0.4}
              max={2}
              step={0.01}
              value={style.size}
              onChange={(e) => onStyleChange({ size: Number(e.target.value) })}
              aria-label="Ink size"
            />
            <span className="style-slider-label">Size</span>
            <span className="style-slider-value">{Math.round(style.size * 100)}%</span>
          </div>
          <div className="style-slider">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={style.opacity}
              onChange={(e) => onStyleChange({ opacity: Number(e.target.value) })}
              aria-label="Ink opacity"
            />
            <span className="style-slider-label">Opacity</span>
            <span className="style-slider-value">{Math.round(style.opacity * 100)}%</span>
          </div>
        </div>

        <dl className="measurements">
          <div>
            <dt>Orientation</dt>
            <dd>{Math.round(((yawDeg % 360) + 360) % 360)}°</dd>
          </div>
          <div>
            <dt>Surface</dt>
            <dd>Matte</dd>
          </div>
        </dl>
      </div>
      <div className="control-bottom">
        <p>Select a mark, then click the figure. Drag any placed ink to refine position.</p>
        <button className="clear-button" onClick={onClear} disabled={inks.length === 0}>
          <span>Clear all ink</span>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 5h12M8 5V3h4v2M6 5l1 12h6l1-12M9 8v6M11 8v6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
