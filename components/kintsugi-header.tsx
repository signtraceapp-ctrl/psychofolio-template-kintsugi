"use client";

/**
 * KINTSUGI Header - vermilyon muhur + tam ekran washi menu.
 * Navigasyon cubugu YOK; sag ustte muhur, tiklaninca tam ekran menu acilir.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KIN = {
  bone: "#f6f1e7",
  paper: "#fcf9f2",
  ink: "#2e2822",
  muted: "#7d735f",
  gold: "#b08a2e",
  goldLight: "#d9b45a",
  vermilion: "#a8402c",
} as const;

const navLinks = [
  { num: "I", label: "Hakkında", path: "/hakkimda" },
  { num: "II", label: "Hizmetler", path: "/hizmetler" },
  { num: "III", label: "Yaklaşım", path: "/yaklasim" },
  { num: "IV", label: "Yazılar", path: "/yazilar" },
  { num: "V", label: "SSS", path: "/sss" },
  { num: "VI", label: "İletişim", path: "/iletisim" },
] as const;

/* -- Vermilyon muhur ------------------------------------------------------ */
function SealMark({ size = 44 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-[3px] shadow-[0_2px_10px_rgba(168,64,44,0.35)]"
      style={{
        width: size,
        height: size,
        background: KIN.vermilion,
        fontFamily: "var(--font-display), serif",
      }}
      aria-hidden="true"
    >
      <span className="select-none text-white" style={{ fontSize: size * 0.52 }}>
        {"\u03A8"}
      </span>
    </span>
  );
}

interface KintsugiHeaderProps {
  siteName?: string;
}

export function KintsugiHeader({ siteName = "KINTSUGI" }: KintsugiHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="flex items-start justify-between px-6 pt-6 lg:px-10">
          <Link
            href="/"
            className="text-sm tracking-[0.42em]"
            style={{ fontFamily: "var(--font-display), serif", color: KIN.ink }}
          >
            {siteName}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/iletisim"
              className="hidden border-b pb-0.5 text-xs tracking-[0.18em] transition-colors sm:block"
              style={{ color: KIN.gold, borderColor: `${KIN.gold}66` }}
            >
              RANDEVU
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              className="transition-transform duration-300 hover:scale-105"
            >
              <SealMark />
            </button>
          </div>
        </div>
      </header>

      {/* Tam ekran washi menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          background:
            `radial-gradient(900px 500px at 85% 10%, ${KIN.gold}14, transparent 60%), ` +
            `radial-gradient(700px 500px at 10% 90%, ${KIN.vermilion}0d, transparent 55%), ${KIN.bone}`,
        }}
        aria-hidden={!menuOpen}
      >
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Menüyü kapat"
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-[3px] border transition-colors lg:right-10"
          style={{ borderColor: `${KIN.ink}33`, color: KIN.ink }}
        >
          <span className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>

        <nav
          className="flex h-full flex-col items-center justify-center gap-1"
          aria-label="Site menüsü"
        >
          {[{ num: "\u25CB", label: "Ana Sayfa", path: "/" }, ...navLinks].map((l, i) => (
            <Link
              key={l.path}
              href={l.path}
              onClick={() => setMenuOpen(false)}
              className={`group flex items-baseline gap-4 py-2 transition-[transform,opacity] duration-300 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${80 + i * 55}ms` : "0ms" }}
            >
              <span
                className="w-8 text-right text-xs tracking-widest"
                style={{ color: KIN.gold }}
              >
                {l.num}
              </span>
              <span
                className={`text-3xl transition-colors sm:text-4xl ${
                  isActive(l.path) ? "italic" : ""
                }`}
                style={{
                  fontFamily: "var(--font-display), serif",
                  color: isActive(l.path) ? KIN.gold : KIN.ink,
                }}
              >
                {l.label}
              </span>
              <span
                className="h-px w-0 self-center transition-[width] duration-300 group-hover:w-10"
                style={{ background: KIN.gold }}
                aria-hidden="true"
              />
            </Link>
          ))}
          <Link
            href="/iletisim"
            onClick={() => setMenuOpen(false)}
            className={`mt-8 px-7 py-3 text-sm tracking-[0.2em] text-white transition-[transform,opacity] duration-300 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{
              background: KIN.vermilion,
              borderRadius: 3,
              transitionDelay: menuOpen ? "500ms" : "0ms",
            }}
          >
            RANDEVU AL
          </Link>
        </nav>
      </div>
    </>
  );
}

export { SealMark, KIN };
