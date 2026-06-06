export type Tag = "ai production" | "game dev" | "web" | "ios" | "3d";

export interface Project {
  slug: string;
  title: string;
  oneliner: string;
  tags: Tag[];
  youtubeId?: string;
  thumbnail?: string;
  description: string;
  stack: string[];
  links?: { label: string; href: string }[];
  highlights?: string[];
}

export const projects: Project[] = [
  {
    slug: "bluberiBuy",
    title: "BluberiBuy",
    oneliner: "Chrome extension that tracks price history on luxury fashion items.",
    tags: ["web"],
    description:
      "Desktop price tracker for luxury fashion sites (SSENSE, The RealReal). Monitors price history, sends desktop notifications on drops, and sets target price alerts. Features price sparkline charts, badge counts, inventory status tracking, per-site configuration, and automatic background checks. Built to scratch a personal itch.",
    stack: ["JavaScript", "Chrome APIs", "Manifest V3"],
    links: [{ label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/hebofgjcejgihignpbijmoicklaopijb?utm_source=item-share-cb" }],
  },
  {
    slug: "perfume",
    title: "Perfume Concept Film",
    oneliner: "AI-generated concept film for a fictional fragrance — part of an ongoing series.",
    tags: ["ai production"],
    youtubeId: "h0L87jKw6r4",
    description:
      "First in a series of AI-produced short films for fictional fragrance concepts. Directed the visual language, wrote structured scene prompts, and orchestrated the image-to-video pipeline from reference frames through final edit. Looking to build this into a recurring format.",
    stack: ["Kling 3.0 Omni", "ElevenLabs", "DaVinci Resolve"],
  },
  {
    slug: "game-engine",
    title: "2D Game Engine",
    oneliner: "Custom-built 2D game engine in C++ with Lua scripting, Box2D physics, and offline simulation.",
    tags: ["game dev"],
    youtubeId: "4JFVmsvJ1To",
    description:
      "Built a small 2D game engine in C++ over a semester using SDL for rendering, input, and audio; Lua and LuaBridge for gameplay scripting; RapidJSON for scene and data loading; Box2D for physics; and GLM for math. The engine supports scene files, actor templates, component-based behaviors, image and text rendering, audio playback, input handling, events, and physics-backed gameplay objects. Used it to ship small playable games with multiple scenes, reusable scripted components, custom assets, and platform-ready packaged builds. The custom feature I designed and implemented was Persistent World Timers and Offline Simulation — a persistence layer in C++ that lets Lua scripts save and load structured game state as JSON, combined with a real-world time API exposing Unix timestamps to gameplay code. That makes it possible for timed systems to continue progressing even while the game is closed. To demo it, I built a Lua-coded bakery mini-game called \"one blueberry bagel please\" where a blueberry bagel proofs, bakes through multiple visual stages, and can burn if left too long — and closing and reopening the game during the oven phase still advances the bagel correctly based on real elapsed time. The video demonstrates this custom feature only, not the full engine.",
    stack: ["C++", "SDL2", "Lua", "LuaBridge", "Box2D", "RapidJSON", "GLM"],
    highlights: [
      "3,400+ lines across 10 engine systems",
      "Lua scripting layer — game logic fully decoupled from engine code",
      "Persistent World Timers: game state progresses in real time even while closed",
      "Demo: bakery mini-game with timestamp-driven bake stages across 6 scenes",
    ],
  },
  {
    slug: "the-boot",
    title: "The Boot",
    oneliner: "3D cozy adventure game built from the ground up in Unity — climb out of a boot.",
    tags: ["game dev", "3d"],
    youtubeId: "2BTbvSv4cQk",
    description:
      "Designed and built a complete 3D adventure game in Unity with a custom character controller, state-machine animation system, inventory mechanics, and branching narrative. Features 10+ minutes of gameplay, 2 playable characters (a dew drop with a notoriously jiggly butt and a rolling pebble with a leaf on his head), and fully modeled environments. The goal is to climb out of a red boot by feeding light objects to a vine in a pot. The vine has a custom physics system with z-axis locking on certain sections and skill-based climbing on others. Max inventory of 3 lights. Two interactable NPCs — one kills you on contact, the other releases fog. Calm, cozy vibes throughout.",
    stack: ["Unity", "C#", "Blender"],
    links: [{ label: "Play on itch.io", href: "https://runnyeggpie.itch.io/the-boot" }],
    highlights: [
      "2 playable characters with distinct movement feel",
      "Custom vine physics with z-axis locking and skill-based sections",
      "State-machine animation system",
      "Fully modeled environments and interactive NPCs",
    ],
  },
  {
    slug: "rws",
    title: "Radiation Weather Station",
    oneliner: "Live radiation and weather monitoring dashboard for U of M's engineering lab.",
    tags: ["web"],
    description:
      "Public-facing dashboard for the Radiological Health Engineering Lab (RHELab) at the University of Michigan. Displays real-time sensor data from the RWS-Lite network for high schoolers and the general public. Built as a modern React/Next.js frontend on top of a WordPress + Python backend, deployed to production on Pantheon.",
    stack: ["Next.js", "TypeScript", "Radix UI", "Tailwind CSS", "WordPress", "Pantheon"],
    links: [{ label: "Live site", href: "https://rws.engin.umich.edu/" }],
  },
  {
    slug: "mifits",
    title: "MiFits",
    oneliner: "Native iOS wardrobe organizer with a drag-and-drop outfit builder.",
    tags: ["ios"],
    description:
      "Native iOS app for organizing your wardrobe and building outfits on a drag-and-drop canvas. Camera and photo library integration for adding clothing items. Pinch-to-resize, favorites, outfit gallery with mosaic thumbnails, and full SwiftData persistence — no external backend.",
    stack: ["Swift", "SwiftUI", "SwiftData", "Xcode"],
  },
  {
    slug: "runnynotes",
    title: "RunnyNotes",
    oneliner: "Full-stack daily notes Chrome extension with Express backend and SQLite persistence.",
    tags: ["web"],
    description:
      "Customizable daily-notes app as a Chrome extension with a Node/Express backend and SQLite database. Contenteditable editor with custom fonts, color themes, styled backgrounds (dotted/lined/grid), and 500ms debounce autosave. Daily reset with a 'keep yesterday / start fresh' modal. Built to learn full-stack TypeScript and Chrome extension architecture.",
    stack: ["React", "TypeScript", "Node.js", "Express", "SQLite", "Chrome APIs"],
  },
];

export const videoProjects = projects.filter((p) => p.youtubeId);
export const staticProjects = projects.filter((p) => !p.youtubeId);
