"use client";

import FlashMark from "./FlashMark";
import { FLASH_DESIGNS, type FlashId } from "./tattooDesigns";
import type { PlacedInk } from "./types";

type Props = {
  inks: PlacedInk[];
  selectedId: FlashId;
  onCardClick: (id: FlashId) => void;
};

export default function DesignSidebar({ inks, selectedId, onCardClick }: Props) {
  const selectedDesign = FLASH_DESIGNS.find((d) => d.id === selectedId)!;

  return (
    <aside className="flash-panel" aria-label="Tattoo flash designs">
      <div className="panel-heading">
        <span>Flash archive</span>
        <span>{FLASH_DESIGNS.length.toString().padStart(2, "0")}</span>
      </div>
      <div className="flash-grid">
        {FLASH_DESIGNS.map((design) => {
          const ink = inks.find((i) => i.design === design.id);
          const isSelected = selectedId === design.id;
          const isOn = ink ? ink.visible : isSelected;
          return (
            <button
              key={design.id}
              className={`flash-card ${isOn ? "is-selected" : ""}`}
              onClick={() => onCardClick(design.id)}
              aria-pressed={isOn}
            >
              <span className="flash-code">{design.code}</span>
              <FlashMark id={design.id} />
              <span className="flash-name">{design.name}</span>
              {isOn && <span className="selected-corner" />}
            </button>
          );
        })}
      </div>
      <div className="selection-readout">
        <span>Selected needle</span>
        <strong>
          {selectedDesign.code} / {selectedDesign.name}
        </strong>
      </div>
    </aside>
  );
}
