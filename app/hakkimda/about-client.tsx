"use client";

import { PageShell, useKintsugiReveal, KIN, SealMark } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const defaultTimeline = [
  {
    era: "Temel",
    title: "Klinik psikoloji eğitimi",
    desc: "Psikoloji lisansı ve klinik psikoloji yüksek lisansı; travma alanına yönelen ilk süpervizyonlu vakalar.",
  },
  {
    era: "Zanaat",
    title: "Travma odaklı uzmanlaşma",
    desc: "EMDR I-II düzey eğitimleri, somatik yaklaşımlar ve ACT; 9 yılda 3.200'ün üzerinde seans.",
  },
  {
    era: "İncelik",
    title: "Yas ve kayıp çalışmaları",
    desc: "Karmaşık yas protokolleri üzerine ileri eğitim; hastane ve afet sahası deneyimi.",
  },
  {
    era: "Aktarım",
    title: "Süpervizyon ve eğitmenlik",
    desc: "Genç klinisyenlere travma süpervizyonu; meslek içi eğitimlerde eğitmenlik.",
  },
];

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();

  const timeline =
    c.about.credentials.length > 0
      ? c.about.credentials.map((cred) => ({
          era: cred.year || "-",
          title: cred.title,
          desc: cred.detail,
        }))
      : defaultTimeline;

  return (
    <PageShell
      kicker="Hakkında"
      title="Onarımı öğrenmek bir"
      accent="ömür sürer"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tanıtım kartı - washi kağıdı + mühür */}
          <div
            data-reveal
            className="relative mx-auto max-w-2xl border p-10 shadow-[0_18px_50px_rgba(46,40,34,0.08)]"
            style={{ background: KIN.paper, borderColor: `${KIN.ink}14`, borderRadius: 3 }}
          >
            <div className="absolute -right-3 -top-3">
              <SealMark size={38} />
            </div>
            <h2 className="text-3xl">{c.site.name}</h2>
            <p className="mt-1 text-sm tracking-[0.12em]" style={{ color: KIN.gold }}>
              {c.site.title}
            </p>
            <p className="mt-5 leading-relaxed" style={{ color: KIN.muted }}>
              {c.about.intro}
            </p>
          </div>

          {/* Zaman çizelgesi - ortadan inen altın çatlak */}
          <div className="relative mx-auto mt-20 max-w-3xl">
            <div
              className="absolute left-4 top-0 h-full w-px md:left-1/2"
              style={{
                background: `linear-gradient(to bottom, transparent, ${KIN.gold}aa 8%, ${KIN.gold}aa 92%, transparent)`,
              }}
              aria-hidden="true"
            />
            <div className="space-y-14">
              {timeline.map((item, i) => (
                <div
                  key={item.title}
                  data-reveal
                  className={`relative flex flex-col gap-2 pl-12 md:w-[46%] md:pl-0 ${
                    i % 2 === 0 ? "md:mr-auto md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-2.5 w-2.5 rotate-45 md:top-2 ${
                      i % 2 === 0
                        ? "left-[11px] md:left-auto md:-right-[5px]"
                        : "left-[11px] md:-left-[5px]"
                    }`}
                    style={{ background: KIN.gold }}
                    aria-hidden="true"
                  />
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
                    {item.era.toUpperCase()}
                  </p>
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: KIN.muted }}>
                    {item.desc}
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
