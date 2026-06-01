import { readFileSync } from "fs";

const buf = readFileSync("public/glb_models/lotus_flower.glb");
const json = (() => {
  const magic = buf.readUInt32LE(0);
  if (magic !== 0x46546c67) throw new Error("Not a GLB");
  const jsonLen = buf.readUInt32LE(12);
  return JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));
})();

// find max keyframe time for each animation
const accessors = json.accessors;
const bufferViews = json.bufferViews;
const binOffset = 20 + buf.readUInt32LE(12);

for (const anim of json.animations ?? []) {
  let maxTime = 0;
  for (const sampler of anim.samplers ?? []) {
    const acc = accessors[sampler.input];
    const bv = bufferViews[acc.bufferView];
    const start = binOffset + 8 + (bv.byteOffset ?? 0) + (acc.byteOffset ?? 0);
    for (let i = 0; i < acc.count; i++) {
      const t = buf.readFloatLE(start + i * 4);
      if (t > maxTime) maxTime = t;
    }
  }
  console.log(`Animation "${anim.name}": duration=${maxTime.toFixed(4)}s, channels=${anim.channels.length}`);
}
