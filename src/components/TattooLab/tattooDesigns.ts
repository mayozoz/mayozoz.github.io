// Placeholder tattoo flash art, drawn procedurally so the lab works before real
// artwork is imported. Swap TATTOO_DESIGNS for real PNGs later — see README note
// in TattooLabCanvas.tsx for the swap point.

export type TattooDesign = {
  id: string;
  name: string;
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
};

const INK = "#141414";

function moon(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(s * 0.52, s * 0.5, s * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(s * 0.66, s * 0.44, s * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();
  ctx.arc(s * 0.27, s * 0.28, s * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s * 0.22, s * 0.4, s * 0.02, 0, Math.PI * 2);
  ctx.fill();
}

function serpent(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  ctx.lineWidth = s * 0.07;
  ctx.beginPath();
  ctx.moveTo(s * 0.25, s * 0.82);
  ctx.bezierCurveTo(s * 0.05, s * 0.6, s * 0.55, s * 0.55, s * 0.35, s * 0.35);
  ctx.bezierCurveTo(s * 0.2, s * 0.22, s * 0.45, s * 0.1, s * 0.65, s * 0.18);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(s * 0.65, s * 0.18);
  ctx.lineTo(s * 0.82, s * 0.12);
  ctx.lineTo(s * 0.74, s * 0.28);
  ctx.closePath();
  ctx.fill();
}

function dagger(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.08);
  ctx.lineTo(s * 0.58, s * 0.55);
  ctx.lineTo(s * 0.42, s * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(s * 0.3, s * 0.55, s * 0.4, s * 0.05);
  ctx.fillRect(s * 0.46, s * 0.6, s * 0.08, s * 0.22);
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.86, s * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

function bloom(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = INK;
  const cx = s * 0.5;
  const cy = s * 0.44;
  const r = s * 0.16;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, s * 0.15, s * 0.09, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = INK;
  ctx.lineWidth = s * 0.025;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.6);
  ctx.lineTo(cx - s * 0.02, s * 0.88);
  ctx.stroke();
}

function bolt(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(s * 0.55, s * 0.06);
  ctx.lineTo(s * 0.28, s * 0.52);
  ctx.lineTo(s * 0.46, s * 0.52);
  ctx.lineTo(s * 0.36, s * 0.94);
  ctx.lineTo(s * 0.74, s * 0.42);
  ctx.lineTo(s * 0.54, s * 0.42);
  ctx.lineTo(s * 0.64, s * 0.06);
  ctx.closePath();
  ctx.fill();
}

function wave(ctx: CanvasRenderingContext2D, s: number) {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(s * 0.1, s * 0.5);
  ctx.bezierCurveTo(s * 0.25, s * 0.3, s * 0.35, s * 0.3, s * 0.5, s * 0.5);
  ctx.bezierCurveTo(s * 0.65, s * 0.7, s * 0.75, s * 0.7, s * 0.9, s * 0.5);
  ctx.lineTo(s * 0.9, s * 0.6);
  ctx.bezierCurveTo(s * 0.75, s * 0.8, s * 0.65, s * 0.8, s * 0.5, s * 0.6);
  ctx.bezierCurveTo(s * 0.35, s * 0.4, s * 0.25, s * 0.4, s * 0.1, s * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s * 0.9, s * 0.5, s * 0.045, 0, Math.PI * 2);
  ctx.fill();
}

export const TATTOO_DESIGNS: TattooDesign[] = [
  { id: "moon", name: "Crescent", draw: moon },
  { id: "serpent", name: "Serpent", draw: serpent },
  { id: "dagger", name: "Dagger", draw: dagger },
  { id: "bloom", name: "Bloom", draw: bloom },
  { id: "bolt", name: "Bolt", draw: bolt },
  { id: "wave", name: "Wave", draw: wave },
];

export function renderDesignCanvas(design: TattooDesign, size = 512): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    design.draw(ctx, size);
  }
  return canvas;
}
