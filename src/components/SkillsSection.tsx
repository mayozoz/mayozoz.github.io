const skillGroups = [
  {
    label: "Languages",
    skills: ["C++", "Python", "JavaScript", "TypeScript", "Swift", "C", "Java", "SQL", "HTML/CSS"],
  },
  {
    label: "Mobile",
    skills: ["React Native", "Expo", "SwiftUI", "SwiftData", "Reanimated", "RevenueCat", "EAS"],
  },
  {
    label: "Web",
    skills: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "WordPress", "PHP"],
  },
  {
    label: "AI / ML",
    skills: ["PyTorch", "Transformers", "GPT-4", "CUDA", "COMET", "BERTScore", "Pandas", "NumPy"],
  },
  {
    label: "Game Dev",
    skills: ["Unity", "C#", "SDL2", "Lua", "Box2D", "Blender"],
  },
  {
    label: "Tools",
    skills: ["Git", "Docker", "Linux", "GDB", "DDEV", "Pantheon", "SQLite", "AWS S3"],
  },
];

export default function SkillsSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#7a9e8a] mb-8"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        [ skills ]
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group) => (
          <div key={group.label} className="glass rounded-xl p-5 flex flex-col gap-3">
            <p
              className="text-[9px] tracking-[0.25em] uppercase text-[#1a3326]/40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-[#1a3326]/5 text-[#1a3326]/60"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
