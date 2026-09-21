"use client";

/**
 * KINTSUGI - Ana sayfa: kırık kasenin onarım yolculuğu.
 * Pinned 3D sahne: parçalar birleşir, altın damarlar dolar.
 * Ardından: onarım ritüeli (etkileşimli), felsefe, hizmet özeti, CTA.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyKintsugiScene } from "@/components/three/lazy-kintsugi-scene";
import { KintsugiHeader, KIN, SealMark } from "@/components/kintsugi-header";
import { GoldVein, CrackDivider, useKintsugiReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const journeyPhases = [
  {
    title: "Kırılma bir",
    accent: "son değildir",
    body: "Her hikâye bir bütünle başlar; bazen hayat onu parçalara ayırır.",
  },
  {
    title: "Hiçbir parça",
    accent: "kaybolmaz",
    body: "Yaşadıklarınız yok olmaz. Terapide her parça özenle görülür, adlandırılır.",
  },
  {
    title: "Onarım özenle,",
    accent: "altınla yapılır",
    body: "EMDR ve travma odaklı çalışma, parçaları taşınabilir bir bütüne dönüştürür.",
  },
  {
    title: "İzleriniz",
    accent: "değeriniz olur",
    body: "Amaç izleri silmek değil; onları hayatınızın anlatılabilir bir parçası kılmak.",
  },
  {
    title: "Onarıma birlikte",
    accent: "başlayalım",
    body: "",
  },
] as const;

const PHASE_THRESHOLDS = [0.2, 0.45, 0.65, 0.87];

function phaseFor(p: number) {
  for (let i = 0; i < PHASE_THRESHOLDS.length; i++) {
    if (p < PHASE_THRESHOLDS[i]) return i;
  }
  return journeyPhases.length - 1;
}

/* -- Onarım ritüeli - çatlak altınla dolar -------------------------------- */
function RepairRitual() {
  const [word, setWord] = useState("");
  const [repaired, setRepaired] = useState(false);
  const crackRef = useRef<SVGPathElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const path = crackRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  }, []);

  const repair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || repaired) return;
    setRepaired(true);
    const path = crackRef.current;
    if (path) {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
      });
    }
    if (wordRef.current) {
      gsap.to(wordRef.current, {
        color: KIN.gold,
        letterSpacing: "0.2em",
        duration: 2.2,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <section className="relative z-[1] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
            KÜÇÜK BİR RİTÜEL
          </p>
          <h2 data-reveal className="mt-4 text-4xl sm:text-5xl md:text-6xl leading-[0.95]">
            Kırık hissettiren şeye{" "}
            <span className="italic" style={{ color: KIN.gold }}>
              bir ad verin
            </span>
          </h2>
          <div
            data-reveal
            className="mt-10 border p-8 shadow-[0_18px_50px_rgba(46,40,34,0.08)] sm:p-12"
            style={{ background: KIN.paper, borderColor: `${KIN.ink}14`, borderRadius: 3 }}
          >
            <div className="relative mx-auto max-w-md">
              <svg viewBox="0 0 400 60" fill="none" className="w-full" aria-hidden="true">
                <path
                  d="M0 32 L60 28 L105 36 L150 24 L200 34 L250 22 L295 35 L345 27 L400 30"
                  stroke={`${KIN.ink}26`}
                  strokeWidth="1.4"
                />
                <path
                  ref={crackRef}
                  d="M0 32 L60 28 L105 36 L150 24 L200 34 L250 22 L295 35 L345 27 L400 30"
                  stroke={KIN.gold}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
              <span
                ref={wordRef}
                className="pointer-events-none absolute inset-x-0 -top-8 text-xl italic"
                style={{ fontFamily: "var(--font-display), serif", color: KIN.ink }}
              >
                {word}
              </span>
            </div>

            {!repaired ? (
              <form onSubmit={repair} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <label htmlFor="kin-ritual" className="sr-only">
                  Kırık hissettiren şey
                </label>
                <input
                  id="kin-ritual"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  maxLength={30}
                  placeholder="tek kelime yeter\u2026"
                  className="w-full max-w-xs px-4 py-3 text-center text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(176,138,46,0.35)]"
                  style={{
                    background: KIN.bone,
                    border: `1px solid ${KIN.ink}22`,
                    borderRadius: 2,
                    color: KIN.ink,
                  }}
                />
                <button
                  type="submit"
                  className="whitespace-nowrap px-6 py-3 text-xs tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                  style={{ background: KIN.vermilion, borderRadius: 2 }}
                >
                  ALTINLA DOLDUR
                </button>
              </form>
            ) : (
              <div className="mt-8">
                <p className="text-sm leading-relaxed" style={{ color: KIN.muted }}>
                  Çatlak hâlâ orada - ama artık ışığı tutuyor. Terapide yaptığımız
                  tam olarak bu.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-5 inline-block border-b pb-0.5 text-xs tracking-[0.2em]"
                  style={{ color: KIN.gold, borderColor: `${KIN.gold}66` }}
                >
                  İLK GÖRÜŞMEYİ PLANLAYIN
                </Link>
              </div>
            )}
            <p className="mt-6 text-[11px]" style={{ color: `${KIN.muted}cc` }}>
              Yazdıklarınız hiçbir yere gönderilmez, kaydedilmez.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Main Component ------------------------------------------------------- */
export function HomeClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phaseIdxRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    if (!wrapper || !pin) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const next = phaseFor(self.progress);
        if (next !== phaseIdxRef.current) {
          phaseIdxRef.current = next;
          setPhaseIdx(next);
        }
      },
    });
    return () => st.kill();
  }, []);

  const roman = ["I", "II", "III", "IV", "V"];

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
      <KintsugiHeader siteName={c.site.name.toUpperCase()} />

      {/* -- Pinned onarım yolculuğu ----------------------------------------- */}
      <section ref={wrapperRef} className="relative" style={{ height: "420vh" }} aria-label="Onarım yolculuğu">
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <LazyKintsugiScene progressRef={progressRef} />

          {/* Marka çipi */}
          <div className="pointer-events-none absolute left-6 top-24 z-10 lg:left-10">
            <p
              className="border px-4 py-2 text-[11px] tracking-[0.24em]"
              style={{
                background: `${KIN.paper}cc`,
                borderColor: `${KIN.ink}14`,
                borderRadius: 2,
                color: KIN.muted,
                backdropFilter: "blur(6px)",
              }}
            >
              {c.home.badge} · ONARIM SANATI
            </p>
          </div>

          {/* Faz metinleri */}
          {journeyPhases.map((ph, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 bottom-16 z-10 transition-[opacity,transform] duration-300 sm:bottom-20 ${
                phaseIdx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
              }`}
              aria-hidden={phaseIdx !== i}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                  className="max-w-xl border p-7 sm:p-9"
                  style={{
                    background: `${KIN.paper}d9`,
                    borderColor: `${KIN.ink}12`,
                    borderRadius: 3,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h2 className="text-3xl leading-[1.05] sm:text-5xl md:text-6xl">
                    {ph.title}{" "}
                    <span className="italic" style={{ color: KIN.gold }}>
                      {ph.accent}
                    </span>
                  </h2>
                  {ph.body && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: KIN.muted }}>
                      {ph.body}
                    </p>
                  )}
                  {i === journeyPhases.length - 1 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/iletisim"
                        className="px-6 py-3 text-xs tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                        style={{ background: KIN.vermilion, borderRadius: 2 }}
                      >
                        RANDEVU AL
                      </Link>
                      <Link
                        href="/yaklasim"
                        className="border px-6 py-3 text-xs tracking-[0.2em] transition-colors hover:border-current"
                        style={{ borderColor: `${KIN.gold}66`, color: KIN.gold, borderRadius: 2 }}
                      >
                        YAKLAŞIMI TANIYIN
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Faz göstergesi - roma rakamları */}
          <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-14 lg:flex">
            {roman.map((r, i) => (
              <span
                key={r}
                className="text-[11px] tracking-widest transition-[color,transform] duration-300"
                style={{
                  color: phaseIdx === i ? KIN.gold : `${KIN.ink}38`,
                  transform: phaseIdx === i ? "scale(1.35)" : "scale(1)",
                }}
              >
                {r}
              </span>
            ))}
          </div>

          {/* Kaydır ipucu */}
          <div
            className={`absolute bottom-5 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-700 ${
              phaseIdx === 0 ? "opacity-70" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-[0.24em]" style={{ color: KIN.gold }}>
                KAYDIR
              </span>
              <span
                className="h-6 w-px animate-pulse"
                style={{ background: `linear-gradient(to bottom, ${KIN.gold}, transparent)` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* -- Onarım ritüeli -------------------------------------------------- */}
      <RepairRitual />

      {/* -- Felsefe - üç ilke ----------------------------------------------- */}
      <section className="relative z-[1] py-24" style={{ background: `${KIN.paper}99` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
              FELSEFE
            </p>
            <h2 data-reveal className="mt-4 text-4xl sm:text-5xl md:text-6xl leading-[0.95]">
              Wabi-sabi: kusurda{" "}
              <span className="italic" style={{ color: KIN.gold }}>
                güzellik
              </span>
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              {
                t: "Kabul",
                d: "Kırılma inkâr edilmez. Olan, olduğu gibi görülür - yargısız ve acele etmeden.",
              },
              {
                t: "Onarım",
                d: "Parçalar özenle, bilimsel yöntemle birleştirilir. Altın, emeğin kendisidir.",
              },
              {
                t: "Değer",
                d: "İzler gizlenmez. Onarılmış bir hayat, hiç kırılmamış görünen bir hayattan daha sahicidir.",
              },
            ].map((p, i) => (
              <div key={p.t} data-reveal className="text-center">
                <p className="text-xs tracking-widest" style={{ color: KIN.gold }}>
                  {["I", "II", "III"][i]}
                </p>
                <h3 className="mt-3 text-2xl">{p.t}</h3>
                <div className="mt-3">
                  <CrackDivider w={90} />
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: KIN.muted }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Hizmet özeti ---------------------------------------------------- */}
      <section className="relative z-[1] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p data-reveal className="text-center text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
              ÇALIŞMA ALANLARI
            </p>
            <h2 data-reveal className="mt-4 text-center text-4xl sm:text-5xl">
              Atölyede neler{" "}
              <span className="italic" style={{ color: KIN.gold }}>
                yapılır
              </span>
            </h2>
            <div className="mt-12">
              {c.services.map((s) => (
                <Link
                  key={s.title}
                  href="/hizmetler"
                  data-reveal
                  className="group flex items-baseline justify-between gap-4 border-b py-6 transition-colors"
                  style={{ borderColor: `${KIN.ink}1f` }}
                >
                  <span
                    className="text-2xl transition-colors group-hover:italic sm:text-3xl"
                    style={{ fontFamily: "var(--font-display), serif" }}
                  >
                    {s.title}
                  </span>
                  <span className="hidden text-sm sm:block" style={{ color: KIN.muted }}>
                    {s.desc.length > 50 ? s.desc.substring(0, 47) + "..." : s.desc}
                  </span>
                  <span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: KIN.gold }} aria-hidden="true">
                    {"\u2192"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- Alıntı ---------------------------------------------------------- */}
      <section className="relative z-[1] py-24" style={{ background: `${KIN.paper}99` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <blockquote data-reveal className="mx-auto max-w-2xl text-center">
            <p className="text-3xl italic leading-snug sm:text-4xl" style={{ fontFamily: "var(--font-display), serif" }}>
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <footer className="mt-5 text-xs tracking-[0.3em]" style={{ color: KIN.muted }}>
              {c.home.quoteAuthor.toUpperCase()}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* -- Kapanış CTA ----------------------------------------------------- */}
      <section className="relative z-[1] py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-reveal
            className="relative mx-auto max-w-2xl border p-10 text-center shadow-[0_18px_50px_rgba(46,40,34,0.08)] sm:p-14"
            style={{ background: KIN.paper, borderColor: `${KIN.ink}14`, borderRadius: 3 }}
          >
            <div className="absolute -right-3 -top-3">
              <SealMark size={40} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-[0.95]">
              İlk görüşme, ilk{" "}
              <span className="italic" style={{ color: KIN.gold }}>
                altın damar
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: KIN.muted }}>
              Tanışma görüşmesinde yalnızca dinlerim: neyin kırıldığını, neyin
              korunduğunu ve nereden başlayacağımızı birlikte görürüz.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/iletisim"
                className="px-7 py-3.5 text-xs tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                style={{ background: KIN.vermilion, borderRadius: 2 }}
              >
                RANDEVU AL
              </Link>
              <Link
                href="/sss"
                className="border px-7 py-3.5 text-xs tracking-[0.2em] transition-colors"
                style={{ borderColor: `${KIN.gold}66`, color: KIN.gold, borderRadius: 2 }}
              >
                SORULARINIZ MI VAR?
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-[1] border-t py-10 text-center" style={{ borderColor: `${KIN.ink}14` }}>
        <p className="text-xs tracking-[0.14em]" style={{ color: KIN.muted }}>
          KINTSUGI · kırıklar saklanmaz, altınla anlatılır
        </p>
      </footer>
    </div>
  );
}
