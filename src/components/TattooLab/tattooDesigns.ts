// Flash design data — a single source of truth shared by the 2D sidebar SVG
// icons (FlashMark.tsx) and the 3D decal textures (renderFlashTexture below).
// Every shape is plain line art (stroke only) except where `fill: true` is
// set, matching the reference design's ink style. viewBox is 0..64 for all.

export type FlashId = "thorn" | "moth" | "eye" | "serpent" | "sun" | "dagger";

export type FlashPrimitive =
  | { kind: "path"; d: string; fill?: boolean }
  | { kind: "circle"; cx: number; cy: number; r: number; fill?: boolean };

export type FlashDesign = {
  id: FlashId;
  name: string;
  code: string;
  primitives: FlashPrimitive[];
};

export const FLASH_DESIGNS: FlashDesign[] = [
  {
    id: "thorn",
    name: "Thorn",
    code: "01",
    primitives: [
      { kind: "path", d: "M33 56c-1-17 8-27 1-49M31 49c-7-2-12-6-14-12 7 0 11 2 15 7M34 36c8-2 13-6 15-13-7 1-12 4-15 8M35 23c-6-2-9-6-10-11 5 1 8 3 10 7" },
      { kind: "path", d: "m22 40 3 1-1 3M43 28l-3 1 1 3M29 16l3 1-1 3" },
    ],
  },
  {
    id: "moth",
    name: "Luna",
    code: "02",
    primitives: [
      { kind: "path", d: "M32 18c-3-8-8-10-13-9 1 6 4 10 10 13M32 18c3-8 8-10 13-9-1 6-4 10-10 13M28 25C17 14 8 17 6 24c5 0 9 2 13 6-8-1-12 3-12 8 7 0 13 2 20 8M36 25c11-11 20-8 22-1-5 0-9 2-13 6 8-1 12 3 12 8-7 0-13 2-20 8" },
      { kind: "path", d: "M28 20c1 4 1 8-1 13l5 22 5-22c-2-5-2-9-1-13-2-2-6-2-8 0ZM27 33h10M29 42h6" },
    ],
  },
  {
    id: "eye",
    name: "Witness",
    code: "03",
    primitives: [
      { kind: "path", d: "M7 32c8-10 16-15 25-15s17 5 25 15c-8 10-16 15-25 15S15 42 7 32Z" },
      { kind: "circle", cx: 32, cy: 32, r: 9 },
      { kind: "circle", cx: 32, cy: 32, r: 3, fill: true },
      { kind: "path", d: "M32 10V4M18 13l-3-6M46 13l3-6M32 54v6M18 51l-3 6M46 51l3 6" },
    ],
  },
  {
    id: "serpent",
    name: "Coil",
    code: "04",
    primitives: [
      { kind: "path", d: "M22 54c19-3 22-18 7-20-16-2-15-17-1-22 8-3 16 0 17 6 1 5-4 8-10 6-4-1-5-4-3-6" },
      { kind: "path", d: "m22 54-8-5 1 9 7-4ZM38 13l5-6M40 14l8-2M19 39c3 3 7 4 12 3M25 28c4-2 8-2 12 0" },
      { kind: "circle", cx: 43, cy: 17, r: 1, fill: true },
    ],
  },
  {
    id: "sun",
    name: "Sol",
    code: "05",
    primitives: [
      { kind: "circle", cx: 32, cy: 32, r: 12 },
      { kind: "circle", cx: 32, cy: 32, r: 5 },
      { kind: "path", d: "M32 3v12M32 49v12M3 32h12M49 32h12M12 12l9 9M43 43l9 9M52 12l-9 9M21 43l-9 9" },
      { kind: "path", d: "m24 8 2 8M40 8l-2 8M56 24l-8 2M56 40l-8-2M40 56l-2-8M24 56l2-8M8 40l8-2M8 24l8 2" },
    ],
  },
  {
    id: "dagger",
    name: "Mercy",
    code: "06",
    primitives: [
      { kind: "path", d: "m32 5 6 32-6 9-6-9 6-32Z" },
      { kind: "path", d: "M19 37h26M23 34v6M41 34v6M32 46v13M27 54h10M29 59h6M28 21h8" },
      { kind: "path", d: "m28 37 4 4 4-4M32 9v28" },
    ],
  },
];

const VIEWBOX = 64;
const INK = "#141414";
const STROKE_WIDTH = 1.55;

// Rasterizes a design to a canvas, used as the 3D decal's texture map. Reuses
// the exact same path data as the SVG (FlashMark.tsx) via Path2D, so the
// projected decal matches the sidebar icon exactly rather than approximating it.
export function renderFlashTexture(design: FlashDesign, size = 512): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, size, size);
  const scale = size / VIEWBOX;
  ctx.scale(scale, scale);
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const prim of design.primitives) {
    if (prim.kind === "path") {
      const path = new Path2D(prim.d);
      if (prim.fill) ctx.fill(path);
      else ctx.stroke(path);
    } else {
      ctx.beginPath();
      ctx.arc(prim.cx, prim.cy, prim.r, 0, Math.PI * 2);
      if (prim.fill) ctx.fill();
      else ctx.stroke();
    }
  }

  return canvas;
}
