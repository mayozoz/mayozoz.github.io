export type Tag = "ai production" | "game dev" | "web" | "ios" | "3d" | "systems";
export type Category = "experience" | "projects";

export interface Project {
  slug: string;
  title: string;
  oneliner: string;
  tags: Tag[];
  category: Category;
  period?: string;
  youtubeId?: string;
  thumbnail?: string;
  description: string;
  stack: string[];
  externalUrl?: string;
  links?: { label: string; href: string }[];
  highlights?: string[];
}

export const projects: Project[] = [
  {
    slug: "stillbite",
    title: "Stillbite",
    oneliner: "Full-stack iOS meal journal shipped to the App Store — photo-first logging with a custom crop modal and a RevenueCat paywall.",
    tags: ["ios"],
    category: "projects",
    description:
      "Built and shipped a full-stack iOS meal journal to the App Store from scratch. The core is a photo-first logging flow with a custom pinch-to-zoom crop modal built on react-native-gesture-handler and Reanimated shared values. Raw images are persisted in SQLite so crops are non-destructive — you can always re-frame a photo without touching the original. Subscription layer via RevenueCat and StoreKit 2 gates the premium tier: PDF export, an insights panel computing streak and fasting window statistics, and a cycle tracker with regression-based prediction. All gated through a React context provider.",
    externalUrl: "https://stillbite-app.vercel.app",
    stack: ["React Native", "Expo", "SQLite", "RevenueCat", "EAS", "Reanimated"],
    highlights: [
      "Shipped to the App Store end-to-end",
      "Custom pinch-to-zoom crop modal on Reanimated shared values",
      "Non-destructive re-cropping via raw SQLite image persistence",
      "RevenueCat + StoreKit 2 paywall with React context enforcement",
    ],
  },
  {
    slug: "bluberiBuy",
    title: "BluberiBuy",
    oneliner: "Chrome extension that tracks price history on luxury fashion items — get notified on drops and low inventory.",
    tags: ["web"],
    category: "projects",
    description:
      "Price tracker for luxury fashion sites (SSENSE, The RealReal, Fashionphile). One-click tracking from any supported product page, full price history with sparkline charts, high/low watermarks, and a buy-now-or-wait verdict. Background checks every 1–24 hours with browser notifications for price drops, inventory changes, and target prices. Email alerts via EmailJS — no backend or subscription required. Organize tracked items into folders by site or custom collection with drag-and-drop. All data stored locally; no accounts, no servers, no tracking. Built to scratch a personal itch.",
    externalUrl: "https://mayozoz.github.io/BluberiBuy/",
    stack: ["JavaScript", "Chrome APIs", "Manifest V3", "EmailJS"],
    links: [{ label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/hebofgjcejgihignpbijmoicklaopijb?utm_source=item-share-cb" }],
  },
  {
    slug: "thread-library",
    title: "Thread Library",
    oneliner: "User-level C++ thread library — spin-locks, mutexes, condition variables, and FIFO scheduling across 50+ CPUs.",
    tags: ["systems"],
    category: "projects",
    description:
      "Built a user-level thread library in C++ on Unix — the kind of thing the OS normally provides. Handles CPU booting, thread creation and management across 50+ CPUs, preemptive interrupts, and strict FIFO scheduling. Implemented the full synchronization stack from scratch: spin-locks, mutexes, and condition variables, all built on top of Unix context management with correct atomicity guarantees.",
    stack: ["C++", "Unix"],
  },
  {
    slug: "virtual-memory-pager",
    title: "Virtual Memory Pager",
    oneliner: "C++ virtual memory pager — swap-backed and file-backed pages, copy-on-write, and full process lifecycle management.",
    tags: ["systems"],
    category: "projects",
    description:
      "Designed and implemented a virtual memory pager in C++ that manages the full memory lifecycle for multiple concurrent processes. Supports both swap-backed and file-backed pages (analogous to mmap()), handles page faults, sets MMU permission bits, and manages a simulated swap disk — all while implementing copy-on-write semantics for forked processes. Covers process creation, forking, and destruction end-to-end.",
    stack: ["C++", "Unix"],
  },
  {
    slug: "perfume",
    title: "Perfume Concept Film",
    oneliner: "AI-generated concept film for a fictional fragrance — part of an ongoing series.",
    tags: ["ai production"],
    category: "projects",
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
    category: "projects",
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
    category: "projects",
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
    category: "experience",
    period: "May 2026 – Present",
    description:
      "Public-facing dashboard for the Radiological Health Engineering Lab (RHELab) at the University of Michigan. Displays real-time sensor data from the RWS-Lite network for high schoolers and the general public. Built as a modern React/Next.js frontend on top of a WordPress + Python backend, deployed to production on Pantheon.",
    stack: ["Next.js", "TypeScript", "Radix UI", "Tailwind CSS", "WordPress", "Pantheon"],
    links: [{ label: "Live site", href: "https://rws.engin.umich.edu/" }],
  },
  {
    slug: "youdao",
    title: "NetEase Youdao",
    oneliner: "AI engineering intern — built an LLM-based evaluation system for Tibetan-Chinese machine translation.",
    tags: ["ai production"],
    category: "experience",
    period: "May 2025 – Aug 2025",
    description:
      "Interned on the R&D team at NetEase Youdao working on translation quality estimation for Tibetan-Chinese — a genuinely low-resource language pair with limited existing tooling. Benchmarked a suite of automated metrics (COMET, chrF++, BERTScore, NLLB-200) across 1,000+ annotated samples to establish baselines, then built an LLM-based judge using GPT-4 and Deepseek-v3 that correlated with expert reviewers 78% of the time — cutting manual review time by 90%. Designed the statistical validation layer (Pearson, Spearman, Kendall's tau) to map exactly where automated scores diverge from human judgment, and wrote the data processing pipeline with custom Chinese tokenization that improved metric reliability by 23%.",
    stack: ["Python", "PyTorch", "Transformers", "GPT-4", "Deepseek-v3", "CUDA", "COMET", "BERTScore"],
    highlights: [
      "Tibetan-Chinese MT — a genuinely low-resource language pair",
      "LLM judge reaching 78% correlation with expert annotations",
      "90% reduction in manual review time",
      "Statistical validation with Pearson, Spearman, and Kendall's tau",
    ],
  },
  {
    slug: "shavit-lab",
    title: "Shavit Lab",
    oneliner: "Frontend research assistant — built a zebrafish thrombosis image analysis tool used across 3 collaborating institutions.",
    tags: ["web"],
    category: "experience",
    period: "Feb 2025 – Jun 2025",
    description:
      "Built a React-based image analysis tool for Dr. Jordan Shavit's zebrafish thrombosis research lab. Researchers drag-and-drop microscopy images into a customizable processing pipeline with adjustable detection parameters — it batch-processes 50+ images at once and exports results as CSV for statistical analysis. Deployed on GitHub Pages and actively used by researchers across 3 collaborating institutions.",
    stack: ["React", "JavaScript", "HTML", "CSS", "GitHub Pages"],
    highlights: [
      "Deployed research software used across 3 institutions",
      "Drag-and-drop batch processing for 50+ images",
      "CSV export pipeline for downstream statistical analysis",
    ],
  },
  {
    slug: "tencent-cloud",
    title: "Tencent Cloud",
    oneliner: "Operations intern — pricing analysis for international compute products and internal AI chatbot deployment.",
    tags: ["ai production"],
    category: "experience",
    period: "May 2024 – Jul 2024",
    description:
      "Interned on Tencent Cloud's CSIG team doing pricing and margin analysis for international compute products (CVM, Lighthouse, GPU) across 8 regions. Benchmarked 50+ instance types against AWS, Azure, and GCP to find where Tencent could undercut on price while staying profitable — the analysis fed repricing decisions that improved gross margins 12–18% on underperforming SKUs. Also deployed an internal HunYuan AI chatbot for the operations team that automated pricing calculations, saving around 15 hours of manual work per week across 6 people.",
    stack: ["Python", "SQL", "Tencent HunYuan AI"],
    highlights: [
      "Pricing benchmarked across AWS, Azure, and GCP on 50+ instance types",
      "12–18% gross margin improvement on repriced SKUs",
      "HunYuan AI chatbot saving 15 hrs/week for the ops team",
    ],
  },
  // {
  //   slug: "mifits",
  //   title: "MiFits",
  //   oneliner: "Native iOS wardrobe organizer with a drag-and-drop outfit builder.",
  //   tags: ["ios"],
  //   category: "projects",
  //   description:
  //     "Native iOS app for organizing your wardrobe and building outfits on a drag-and-drop canvas. Camera and photo library integration for adding clothing items. Pinch-to-resize, favorites, outfit gallery with mosaic thumbnails, and full SwiftData persistence — no external backend.",
  //   stack: ["Swift", "SwiftUI", "SwiftData", "Xcode"],
  // },
  // {
  //   slug: "runnynotes",
  //   title: "RunnyNotes",
  //   oneliner: "Full-stack daily notes Chrome extension with Express backend and SQLite persistence.",
  //   tags: ["web"],
  //   category: "projects",
  //   description:
  //     "Customizable daily-notes app as a Chrome extension with a Node/Express backend and SQLite database. Contenteditable editor with custom fonts, color themes, styled backgrounds (dotted/lined/grid), and 500ms debounce autosave. Daily reset with a 'keep yesterday / start fresh' modal. Built to learn full-stack TypeScript and Chrome extension architecture.",
  //   stack: ["React", "TypeScript", "Node.js", "Express", "SQLite", "Chrome APIs"],
  // },
];

export const videoProjects = projects.filter((p) => p.youtubeId);
export const staticProjects = projects.filter((p) => !p.youtubeId);
