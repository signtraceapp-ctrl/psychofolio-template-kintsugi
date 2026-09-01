"use client";

/**
 * KINTSUGI - Shared page scaffold for sub-pages.
 * Porcelain background, gold vein, header, hero, footer.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KintsugiHeader, KIN } from "./kintsugi-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -- Reveal hook ---------------------------------------------------------- */
export function useKintsugiReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

/* -- Altin catlak ayirici (yatay) ----------------------------------------- */
export function CrackDivider({ w = 220 }: { w?: number }) {
  return (
    <svg
      width={w}
      height="14"
      viewBox="0 0 220 14"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      <path
        d="M2 8 L38 6 L61 10 L84 4 L110 8 L138 3 L162 9 L189 6 L218 7"
        stroke="url(#kinGoldGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="110" cy="8" r="2.4" fill={KIN.gold} />
      <defs>
        <linearGradient id="kinGoldGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor={KIN.goldLight} stopOpacity="0.25" />
          <stop offset="0.5" stopColor={KIN.gold} />
          <stop offset="1" stopColor={KIN.goldLight} stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* -- Sag kenar altin damari ----------------------------------------------- */
export function GoldVein() {
  return (
    <svg
      className="pointer-events-none fixed inset-y-0 right-7 z-[5] hidden h-full lg:block"
      width="18"
      viewBox="0 0 18 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M9 0 L8 90 L12 160 L6 260 L11 370 L7 470 L12 580 L8 690 L10 800"
        stroke={KIN.gold}
        strokeOpacity="0.5"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="12" cy="160" r="2" fill={KIN.gold} fillOpacity="0.7" />
      <circle cx="7" cy="470" r="2" fill={KIN.gold} fillOpacity="0.7" />
    </svg>
  );
}

/* -- Vermilyon muhur (re-export from header) ------------------------------ */
export { SealMark, KIN } from "./kintsugi-header";

/* -- Shared page scaffold ------------------------------------------------- */
export function PageShell({
  kicker,
  title,
  accent,
  children,
  scopeRef,
  siteName,
}: {
  kicker: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="kintsugi-root min-h-screen font-sans"
      style={{
        colorScheme: "light",
        color: KIN.ink,
        background:
          `radial-gradient(1000px 520px at 88% 0%, ${KIN.gold}0f, transparent 55%), ` +
          `radial-gradient(800px 480px at 4% 100%, ${KIN.vermilion}08, transparent 50%), ${KIN.bone}`,
      }}
    >
      <style>{`
        .kintsugi-root :is(h1,h2,h3){font-family:var(--font-display),var(--font-sans),serif;font-weight:500;letter-spacing:0.005em}
        .kintsugi-root ::selection{background:${KIN.gold}40}
      `}</style>
      <GoldVein />
      <KintsugiHeader siteName={siteName} />

      <header className="relative z-[1] pb-12 pt-36 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Subtle gold radiance behind hero title */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div
              className="h-64 w-64 rounded-full blur-[80px] sm:h-80 sm:w-80"
              style={{ background: `radial-gradient(circle, ${KIN.gold}18 0%, transparent 70%)` }}
            />
          </div>

          <p
            data-reveal
            className="mx-auto flex items-center justify-center gap-3 text-[11px] tracking-[0.3em]"
            style={{ color: KIN.muted }}
          >
            <span className="h-px w-8" style={{ background: `${KIN.gold}88` }} aria-hidden="true" />
            {kicker.toUpperCase()}
            <span className="h-px w-8" style={{ background: `${KIN.gold}88` }} aria-hidden="true" />
          </p>
          <h1
            data-reveal
            className="relative mx-auto mt-6 max-w-3xl text-6xl leading-[0.95] sm:text-7xl md:text-8xl"
          >
            {title}{" "}
            {accent && (
              <span className="italic" style={{ color: KIN.gold }}>
                {accent}
              </span>
            )}
          </h1>
          <div data-reveal className="mt-8">
            <CrackDivider />
          </div>
        </div>
      </header>

      {children}

      <footer
        className="relative z-[1] border-t py-10 text-center"
        style={{ borderColor: `${KIN.ink}14` }}
      >
        <p className="text-xs tracking-[0.14em]" style={{ color: KIN.muted }}>
          KINTSUGI - kiriklar saklanmaz, altinla anlatilir
        </p>
      </footer>
    </div>
  );
}
