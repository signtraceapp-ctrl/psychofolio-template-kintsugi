"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const KintsugiScene = dynamic(
  () => import("./kintsugi-scene").then((mod) => mod.KintsugiScene),
  { ssr: false },
);

interface LazyKintsugiSceneProps {
  progressRef: React.MutableRefObject<number>;
}

export function LazyKintsugiScene({ progressRef }: LazyKintsugiSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(199,154,53,0.16), transparent 62%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return <KintsugiScene progressRef={progressRef} />;
}
