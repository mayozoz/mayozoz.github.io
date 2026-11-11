"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";

const REPORT_INTERVAL_SEC = 0.1; // 10/sec — plenty for a text readout, far cheaper than 60/sec

type Props = {
  groupRef: RefObject<THREE.Group | null>;
  zoomRef: MutableRefObject<number>;
  onChange: (yawDeg: number, pitchDeg: number, zoom: number) => void;
};

// The body's actual rotation/zoom live on the Three.js objects (mutated
// every frame by RotationRig/CameraRig, not React state, since that runs at
// 60fps). This polls them at a much lower rate and reports back to React
// state purely for the surrounding DOM readouts (viewer label, control
// panel, footer, recenter button) — rendering itself never depends on this.
export default function RotationReadout({ groupRef, zoomRef, onChange }: Props) {
  const accumulator = useRef(0);
  const last = useRef({ yaw: NaN, pitch: NaN, zoom: NaN });

  useFrame((_, delta) => {
    accumulator.current += delta;
    if (accumulator.current < REPORT_INTERVAL_SEC) return;
    accumulator.current = 0;

    const group = groupRef.current;
    if (!group) return;
    const yaw = THREE.MathUtils.radToDeg(group.rotation.y);
    const pitch = THREE.MathUtils.radToDeg(group.rotation.x);
    const zoom = zoomRef.current;
    if (
      Math.abs(yaw - last.current.yaw) < 0.1 &&
      Math.abs(pitch - last.current.pitch) < 0.1 &&
      Math.abs(zoom - last.current.zoom) < 0.002
    ) {
      return;
    }
    last.current = { yaw, pitch, zoom };
    onChange(yaw, pitch, zoom);
  });

  return null;
}
