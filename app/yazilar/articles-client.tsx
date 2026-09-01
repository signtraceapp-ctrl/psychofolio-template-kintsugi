"use client";

import { useState } from "react";
import { PageShell, useKintsugiReveal, KIN } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function ArticlesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();

  // Derive categories from content
  const allCategories = Array.from(new Set(c.articles.map((a) => a.category)));
  const categories = ["Tumu", ...allCategories] as const;

  const [cat, setCat] = useState("Tumu");
  const filtered = c.articles.filter((a) => cat === "Tumu" || a.category === cat);

  // Slight tilt for washi card effect
  const tilts = ["-0.6deg", "0.5deg", "-0.4deg", "0.6deg", "0.4deg", "-0.5deg"];

  return (
    <PageShell
      kicker="Yazilar"
      title="Murekkeple tutulmus"
      accent="notlar"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCat(category)}
                className="border px-4 py-1.5 text-xs tracking-[0.14em] transition-[border-color,background-color,color] duration-300"
                style={{
                  borderRadius: 2,
                  borderColor: cat === category ? KIN.gold : `${KIN.ink}22`,
                  background: cat === category ? `${KIN.gold}14` : "transparent",
                  color: cat === category ? KIN.gold : KIN.muted,
                }}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <article
                key={a.title}
                data-reveal
                className="group relative flex flex-col border p-7 shadow-[0_14px_40px_rgba(46,40,34,0.07)] transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-0"
                style={{
                  background: KIN.paper,
                  borderColor: `${KIN.ink}14`,
                  borderRadius: 3,
                  rotate: tilts[i % tilts.length],
                }}
              >
                {/* altin kose kivrimi */}
                <span
                  className="absolute right-0 top-0 h-0 w-0 border-l-[22px] border-t-[22px] border-l-transparent"
                  style={{ borderTopColor: `${KIN.gold}59` }}
                  aria-hidden="true"
                />
                <p className="text-[10px] tracking-[0.3em]" style={{ color: KIN.gold }}>
                  {a.category.toUpperCase()} - {a.readTime}
                </p>
                <h3 className="mt-3 text-2xl leading-snug">{a.title}</h3>
                <span
                  className="mt-5 inline-block border-b pb-0.5 text-xs tracking-[0.16em] transition-colors group-hover:opacity-80"
                  style={{ color: KIN.ink, borderColor: `${KIN.gold}88` }}
                >
                  OKU
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
