import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import { getContent } from "@/lib/content";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-sans" });
const cormorant = Cormorant({ subsets: ["latin", "latin-ext"], display: "swap", variable: "--font-display", weight: ["300", "400", "500", "600", "700"] });

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: { default: `${c.site.name} - ${c.site.title}`, template: `%s | ${c.site.name}` },
    description: c.home.description,
    robots: { index: false, follow: false },
  };
}

const navLinks = [
  { href: "/hakkimda", label: "Hakk\u0131mda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/yaklasim", label: "Yakla\u015f\u0131m" },
  { href: "/yazilar", label: "Yaz\u0131lar" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "\u0130leti\u015fim" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = getContent();
  return (
    <html lang="tr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-fg antialiased">
        <div className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          {"\u00D6"}rnek i{"\u00E7"}erik - bu bir {"\u015F"}ablon {"\u00F6"}nizlemesidir
        </div>

        <header className="sticky top-8 z-50 border-b border-border/50 bg-bg/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Link href="/" className="font-display text-xl text-fg hover:text-primary transition-colors">
              {c.site.name}
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-fg-muted hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border/50 bg-bg-secondary/50 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-fg-muted sm:px-6 lg:px-8">
            <p className="font-display text-base text-fg">{c.site.name}</p>
            <p className="mt-1">{c.site.title}</p>
            <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} - {c.site.copyright}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
