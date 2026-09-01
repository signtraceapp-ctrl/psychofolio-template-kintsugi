"use client";

import { useState } from "react";
import { PageShell, useKintsugiReveal, KIN } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      kicker="SSS"
      title="Sormaktan"
      accent="cekinmeyin"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-4">
            {c.faq.map((f, i) => (
              <div
                key={f.q}
                data-reveal
                className="border shadow-[0_10px_30px_rgba(46,40,34,0.05)]"
                style={{
                  background: KIN.paper,
                  borderColor: open === i ? `${KIN.gold}66` : `${KIN.ink}14`,
                  borderRadius: 3,
                }}
              >
                <button
                  className="flex w-full items-baseline gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="w-6 shrink-0 text-xs tracking-widest" style={{ color: KIN.gold }}>
                    {ROMAN[i] || String(i + 1)}
                  </span>
                  <span className="flex-1 text-lg leading-snug" style={{ fontFamily: "var(--font-display), serif" }}>
                    {f.q}
                  </span>
                  <span
                    className={`text-xl transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                    style={{ color: KIN.gold }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="mx-6 mb-5 border-t pt-4 pl-10 text-sm leading-relaxed"
                      style={{ borderColor: `${KIN.gold}44`, color: KIN.muted }}
                    >
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
