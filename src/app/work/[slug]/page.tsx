import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — mayozoz` };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen">
      {/* nav */}
      <nav className="w-full max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-[#1a3326]/40 hover:text-[#1a3326] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← mayozoz
        </Link>
        <span
          className="text-xs tracking-[0.2em] uppercase text-[#1a3326]/30"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          work
        </span>
      </nav>

      <article className="w-full max-w-4xl mx-auto px-6 pb-24">
        {/* header */}
        <div className="pt-12 pb-10 border-b border-[#1a3326]/8">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#e8b4c0]/30 text-[#1a3326]/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t}
              </span>
            ))}
          </div>
          <h1
            className="text-5xl md:text-6xl font-light text-[#1a3326] leading-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h1>
          <p
            className="text-sm leading-relaxed text-[#1a3326]/55 max-w-xl"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.oneliner}
          </p>
        </div>

        {/* video */}
        {project.youtubeId && (
          <div className="mt-10">
            <div className="relative w-full overflow-hidden rounded-xl glass" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0&modestbranding=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-xl"
              />
            </div>
          </div>
        )}

        {/* main content */}
        <div className="mt-12 grid md:grid-cols-[1fr_220px] gap-12">
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase text-[#7a9e8a] mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              overview
            </p>
            <p
              className="text-sm leading-loose text-[#1a3326]/70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {project.description}
            </p>

            {project.highlights && (
              <div className="mt-10">
                <p
                  className="text-xs tracking-[0.2em] uppercase text-[#7a9e8a] mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  highlights
                </p>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-sm text-[#1a3326]/65 flex gap-3 leading-relaxed"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <span className="text-[#8bc4aa] shrink-0 mt-0.5">—</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* sidebar */}
          <div className="space-y-8">
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase text-[#7a9e8a] mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="glass-dark text-[10px] px-2 py-1 rounded-md text-[#1a3326]/60"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {project.links && project.links.length > 0 && (
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase text-[#7a9e8a] mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  links
                </p>
                <div className="space-y-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs tracking-[0.1em] text-[#7a9e8a] hover:text-[#1a3326] transition-colors"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
