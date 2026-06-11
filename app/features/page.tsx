"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Mark from "../_components/Mark";
import SiteHeader from "../_components/SiteHeader";

// Dynamic imports - all GSAP code runs client-side only
const Act1Convergence      = dynamic(() => import("../_components/features/Act1Convergence"),      { ssr: false });
const Act2Growth           = dynamic(() => import("../_components/features/Act2Growth"),           { ssr: false });
const ProgressIndicator    = dynamic(() => import("../_components/features/ProgressIndicator"),    { ssr: false });
const SkipControls         = dynamic(() => import("../_components/features/SkipControls"),         { ssr: false });
const ReducedMotionFallback = dynamic(() => import("../_components/features/ReducedMotionFallback"), { ssr: false });

export default function FeaturesPage() {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(-1);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Act1: section -1=intro, 0-7=sources, 8=outro
  // Act2: section 8-12=panels
  const inCinematic = currentSection >= -1 && currentSection <= 12;
  const showCinematic = mounted && !reduceMotion && !isMobile;

  const handleSectionChange = (idx: number) => {
    setCurrentSection(idx);
  };

  const handleJump = (idx: number) => {
    // idx 0-7 = Act1 sections, idx 8-11 = Act2 panels
    if (idx < 8) {
      // Jump into Act1: each section is 100vh (intro is 0, sources start at 1)
      const target = document.getElementById("act1-wrapper");
      if (!target) return;
      const top = target.offsetTop + (idx + 1.5) * window.innerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      const target = document.getElementById("act2-wrapper");
      if (!target) return;
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <>
      <SiteHeader />

      {/* Floating UI controls (only during cinematic) */}
      {showCinematic && (
        <>
          <ProgressIndicator
            currentIndex={currentSection + 1} // shift so -1=intro maps to 0
            visible={inCinematic}
          />
          <SkipControls
            onJump={handleJump}
            onSkip={() => window.open("/#pricing", "_self")}
          />
        </>
      )}

      <main style={{ paddingTop: 72 }}>
        {!mounted ? (
          // SSR placeholder
          <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A8A29A",
              fontSize: 96,
              opacity: 0.3,
            }}>
              <Mark tone="dark" />
            </div>
          </div>
        ) : showCinematic ? (
          <>
            {/* ACT 1 */}
            <div id="act1-wrapper">
              <Act1Convergence onSectionChange={handleSectionChange} />
            </div>

            {/* ACT 2 */}
            <div id="act2-wrapper">
              <Act2Growth onSectionChange={handleSectionChange} />
            </div>
          </>
        ) : (
          // Reduced motion / mobile fallback
          <ReducedMotionFallback />
        )}
      </main>
    </>
  );
}
