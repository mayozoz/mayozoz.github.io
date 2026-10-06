"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import * as THREE from "three";

const REPORT_INTERVAL_SEC = 0.1; // 10/sec — plenty for a text readout, far cheaper than 60/sec

type Props = {
  groupRef: RefObject<THREE.Group | null>;
  onChange: (yawDeg: number, pitchDeg: number) => void;
};

// The body's actual rotation lives on the Three.js object (mutated every
// frame by RotationRig/PointerController, not React state, since that runs
// at 60fps). This polls it at a much lower rate and reports back to React
// state purely for the surrounding DOM readouts (viewer label, control
// panel, footer) — rendering itself never depends on this.
export default function RotationReadout({ groupRef, onChange }: Props) {
  const accumulator = useRef(0);
  const last = useRef({ yaw: NaN, pitch: NaN });

  useFrame((_, delta) => {
    accumulator.current += delta;
    if (accumulator.current < REPORT_INTERVAL_SEC) return;
    accumulator.current = 0;

    const group = groupRef.current;
    if (!group) return;
    const yaw = THREE.MathUtils.radToDeg(group.rotation.y);
    const pitch = THREE.MathUtils.radToDeg(group.rotation.x);
    if (Math.abs(yaw - last.current.yaw) < 0.1 && Math.abs(pitch - last.current.pitch) < 0.1) return;
    last.current = { yaw, pitch };
    onChange(yaw, pitch);
  });

  return null;
}
