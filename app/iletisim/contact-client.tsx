"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { PageShell, useKintsugiReveal, KIN, SealMark } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useKintsugiReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const sealRef = useRef<HTMLDivElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    requestAnimationFrame(() => {
      if (sealRef.current) {
        gsap.fromTo(
          sealRef.current,
          { scale: 2.4, rotate: -14, opacity: 0 },
          { scale: 1, rotate: -6, opacity: 1, duration: 0.55, ease: "power3.out" },
        );
      }
    });
  };

  const inputStyle: React.CSSProperties = {
    background: KIN.bone,
    border: `1px solid ${KIN.ink}22`,
    borderRadius: 2,
    color: KIN.ink,
  };

  return (
    <PageShell
      kicker="Iletisim"
      title="Ilk adimi"
      accent="birlikte atalim"
      scopeRef={scopeRef}
      siteName={c.site.name.toUpperCase()}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Form - kagit */}
            <div
              data-reveal
              className="relative border p-8 shadow-[0_18px_50px_rgba(46,40,34,0.08)] sm:p-10"
              style={{ background: KIN.paper, borderColor: `${KIN.ink}14`, borderRadius: 3 }}
            >
              {!sent ? (
                <form onSubmit={submit} className="space-y-5">
                  <p className="text-sm leading-relaxed" style={{ color: KIN.muted }}>
                    {c.contact.intro}
                  </p>
                  <div>
                    <label htmlFor="kin-name" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: KIN.muted }}>
                      {c.contact.formName.toUpperCase()}
                    </label>
                    <input
                      id="kin-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(176,138,46,0.35)]"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="kin-email" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: KIN.muted }}>
                      {c.contact.formEmail.toUpperCase()}
                    </label>
                    <input
                      id="kin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(176,138,46,0.35)]"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="kin-note" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: KIN.muted }}>
                      {c.contact.formMessage.toUpperCase()} (ISTEGE BAGLI)
                    </label>
                    <textarea
                      id="kin-note"
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full resize-none px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(176,138,46,0.35)]"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm tracking-[0.2em] text-white transition-opacity hover:opacity-90"
                    style={{ background: KIN.vermilion, borderRadius: 2 }}
                  >
                    {c.contact.formSubmit.toUpperCase()}
                  </button>
                </form>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div ref={sealRef}>
                    <SealMark size={64} />
                  </div>
                  <h3 className="mt-6 text-3xl">
                    Tesekkurler{name ? `, ${name.split(" ")[0]}` : ""}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: KIN.muted }}>
                    Mesajiniz muhurlendi. En gec bir is gunu icinde{" "}
                    {email ? <span style={{ color: KIN.gold }}>{email}</span> : "e-postaniza"}{" "}
                    adresinden donus yapilir.
                  </p>
                </div>
              )}
            </div>

            {/* Bilgiler */}
            <div data-reveal className="space-y-8 lg:pt-4">
              {[
                { k: "E-POSTA", v: c.site.email },
                { k: "KONUM", v: c.site.address },
              ].map((row) => (
                <div key={row.k} className="border-b pb-5" style={{ borderColor: `${KIN.ink}14` }}>
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: KIN.gold }}>
                    {row.k}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed" style={{ color: KIN.muted }}>
                Acil bir durumdaysaniz lutfen 112&apos;yi arayin ya da en yakin acil
                servise basvurun; bu form acil destek kanali degildir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
