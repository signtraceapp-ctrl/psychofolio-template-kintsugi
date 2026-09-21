"use client";

import { PageShell, useKintsugiReveal, KIN } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

/* -- Kase ikonu - hover'da çatlağı altınlanır ----------------------------- */
function BowlIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 64 46" fill="none" aria-hidden="true">
      <path
        d="M4 8 C6 30 18 42 32 42 C46 42 58 30 60 8 Z"
        stroke={KIN.ink}
        strokeOpacity="0.55"
        strokeWidth="1.6"
        fill={KIN.paper}
      />
      <path d="M10 12 L54 12" stroke={KIN.ink} strokeOpacity="0.2" strokeWidth="1" />
      <path
        d="M24 8 L28 20 L22 30 L30 41"
        stroke={KIN.gold}
        strokeWidth="1.8"
        strokeLinecap="round"
        className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <path
        d="M44 8 L40 18 L46 26"
        stroke={KIN.gold}
        strokeWidth="1.4"
        strokeLinecap="round"
        className="opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
    </svg>
  );
}

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();

  return (
    <PageShell
      kicker="Hizmetler"
      title="Her kırık, kendi"
      accent="onarımını ister"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s) => (
              <div
                key={s.title}
                data-reveal
                className="group flex flex-col items-start border-b py-10"
                style={{ borderColor: `${KIN.ink}1f` }}
              >
                <BowlIcon />
                <h3 className="mt-5 text-2xl">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: KIN.muted }}>
                  {s.desc}
                </p>
                <div className="mt-5 flex gap-2">
                  <span
                    className="border px-3 py-1 text-[11px] tracking-wide"
                    style={{ borderColor: `${KIN.gold}55`, color: KIN.gold, borderRadius: 2 }}
                  >
                    {s.duration}
                  </span>
                  <span
                    className="border px-3 py-1 text-[11px] tracking-wide"
                    style={{ borderColor: `${KIN.ink}22`, color: KIN.muted, borderRadius: 2 }}
                  >
                    {s.method}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p
            data-reveal
            className="mx-auto mt-14 max-w-xl text-center text-sm leading-relaxed"
            style={{ color: KIN.muted }}
          >
            Hangi çalışmanın size uygun olduğundan emin değilseniz, ilk görüşmede
            birlikte karar veririz - kase raftan birlikte seçilir.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
