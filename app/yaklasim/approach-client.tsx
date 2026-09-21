"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageShell, useKintsugiReveal, KIN } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultSteps = [
  {
    stage: "01 · Kırılma",
    title: "Görmek ve adlandırmak",
    desc: "İlk görüşmelerde yaşananların haritası çıkarılır. Hiçbir parça küçümsenmez, hiçbiri zorla yerinden oynatılmaz.",
  },
  {
    stage: "02 · Temizleme",
    title: "Güvenliği kurmak",
    desc: "İşleme başlamadan önce kaynaklar güçlendirilir: düzenleme becerileri, güvenli yer, beden farkındalığı.",
  },
  {
    stage: "03 · Lake",
    title: "Yeniden işlemek",
    desc: "EMDR ve travma odaklı tekniklerle anılar, sinir sisteminin taşıyabileceği bir biçimde yeniden işlenir.",
  },
  {
    stage: "04 · Altın tozu",
    title: "Anlamı yerleştirmek",
    desc: "Onarım görünür kılınır: yaşananlar, kimliğin saklanacak değil taşınacak bir parçası haline gelir.",
  },
];

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();
  const stepsRef = useRef<HTMLDivElement>(null);
  const seamRefs = useRef<(SVGPathElement | null)[]>([]);

  const steps =
    c.approach.principles.length > 0
      ? c.approach.principles.map((p, i) => ({
          stage: `0${i + 1}`,
          title: p.title,
          desc: p.desc,
        }))
      : defaultSteps;

  useEffect(() => {
    const stepsEl = stepsRef.current;
    if (!stepsEl) return;
    const lengths = seamRefs.current.map((p) => (p ? p.getTotalLength() : 0));
    seamRefs.current.forEach((p, i) => {
      if (!p) return;
      p.style.strokeDasharray = `${lengths[i]}`;
      p.style.strokeDashoffset = `${lengths[i]}`;
    });
    const st = ScrollTrigger.create({
      trigger: stepsEl,
      start: "top 70%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        seamRefs.current.forEach((path, i) => {
          if (!path) return;
          const k = Math.min(1, Math.max(0, (p - i * 0.25) / 0.25));
          path.style.strokeDashoffset = `${lengths[i] * (1 - k)}`;
        });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <PageShell
      kicker="Yaklaşım"
      title="Onarım dört"
      accent="aşamada olur"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-2">
            {/* Sol: sabit kase - çatlaklar sırayla altınlanır */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div
                className="border p-10"
                style={{ background: KIN.paper, borderColor: `${KIN.ink}14`, borderRadius: 3 }}
              >
                <svg viewBox="0 0 200 150" fill="none" className="w-full" aria-hidden="true">
                  <path
                    d="M14 26 C20 96 52 134 100 134 C148 134 180 96 186 26 Z"
                    stroke={KIN.ink}
                    strokeOpacity="0.6"
                    strokeWidth="2"
                    fill={KIN.bone}
                  />
                  <path d="M28 38 L172 38" stroke={KIN.ink} strokeOpacity="0.16" strokeWidth="1.4" />
                  {[
                    "M72 26 L80 62 L64 92 L84 128",
                    "M132 26 L122 58 L140 84 L126 116",
                    "M100 26 L104 70 L96 106 L102 133",
                    "M46 30 L58 66 L50 90",
                  ].map((d, i) => (
                    <path
                      key={i}
                      ref={(el) => {
                        seamRefs.current[i] = el;
                      }}
                      d={d}
                      stroke={KIN.gold}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <p className="mt-6 text-center text-xs tracking-[0.2em]" style={{ color: KIN.muted }}>
                  KAYDIRDIKÇA ONARIM İLERLER
                </p>
              </div>
            </div>

            {/* Sağ: aşamalar */}
            <div ref={stepsRef} className="space-y-16 lg:py-10">
              {steps.map((s) => (
                <div key={s.stage} data-reveal>
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
                    {s.stage.toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-3xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed" style={{ color: KIN.muted }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
