"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdavdgza";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    startTransition(async () => {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
      }
    });
  }

  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* nav */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm tracking-[0.2em] uppercase text-[#1a3326]/50 hover:text-[#1a3326] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          mayozoz
        </Link>
      </nav>

      <section className="w-full max-w-md mx-auto px-6 pt-12 pb-24 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1
            className="text-4xl font-light text-[#1a3326]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Say hello.
          </h1>
          <p
            className="text-xs leading-relaxed text-[#1a3326]/45"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            I'll get back to you at mei.yang0508@gmail.com.
          </p>
        </div>

        {status === "success" ? (
          <div className="glass rounded-xl p-6 flex flex-col gap-3">
            <p
              className="text-xs tracking-[0.15em] uppercase text-[#7a9e8a]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              message sent ✓
            </p>
            <p className="text-sm text-[#1a3326]/60" style={{ fontFamily: "var(--font-mono)" }}>
              Thanks — I'll be in touch.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-[11px] tracking-[0.15em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors text-left mt-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              send another →
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-[9px] tracking-[0.25em] uppercase text-[#1a3326]/40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="glass rounded-lg px-4 py-3 text-sm text-[#1a3326] placeholder:text-[#1a3326]/25 outline-none focus:ring-1 focus:ring-[#7a9e8a]/50 bg-transparent"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="your name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[9px] tracking-[0.25em] uppercase text-[#1a3326]/40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="glass rounded-lg px-4 py-3 text-sm text-[#1a3326] placeholder:text-[#1a3326]/25 outline-none focus:ring-1 focus:ring-[#7a9e8a]/50 bg-transparent"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="message"
                className="text-[9px] tracking-[0.25em] uppercase text-[#1a3326]/40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="glass rounded-lg px-4 py-3 text-sm text-[#1a3326] placeholder:text-[#1a3326]/25 outline-none focus:ring-1 focus:ring-[#7a9e8a]/50 bg-transparent resize-none"
                style={{ fontFamily: "var(--font-mono)" }}
                placeholder="what's on your mind"
              />
            </div>

            {status === "error" && (
              <p className="text-[11px] text-red-400" style={{ fontFamily: "var(--font-mono)" }}>
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="self-start text-[11px] tracking-[0.2em] uppercase text-[#7a9e8a] hover:text-[#1a3326] transition-colors disabled:opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isPending ? "sending..." : "send →"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
