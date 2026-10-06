import type { Metadata } from "next";
import { TattooLabScene } from "@/components/DynamicSections";

export const metadata: Metadata = {
  title: "tattoo lab — mayozoz",
  description: "Place tattoo flash on a 3D form. An interactive lab by Mei Yi Yang.",
};

export default function TattooLabPage() {
  return <TattooLabScene />;
}
