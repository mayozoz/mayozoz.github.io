import Link from "next/link";

export const metadata = { title: "3D Gallery — mayozoz" };

export default function GalleryPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <nav className="w-full max-w-4xl mx-auto px-6 py-6 flex justify-between items-center absolute top-0">
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-[#1a3326]/40 hover:text-[#1a3326] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← mayozoz
        </Link>
      </nav>
      <div className="text-center px-6">
        <p
          className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [ 3d gallery ]
        </p>
        <h1
          className="text-5xl font-light text-[#1a3326] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          coming soon
        </h1>
        <p
          className="text-xs text-[#1a3326]/40 max-w-xs mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          full gallery in progress — preview the models on the home page
        </p>
      </div>
    </main>
  );
}
