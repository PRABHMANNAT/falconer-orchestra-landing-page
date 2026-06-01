"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Mark from "../_components/Mark";

// Dynamic imports — all GSAP code runs client-side only
const Act1Convergence      = dynamic(() => import("../_components/features/Act1Convergence"),      { ssr: false });
const Act2Growth           = dynamic(() => import("../_components/features/Act2Growth"),           { ssr: false });
const ProgressIndicator    = dynamic(() => import("../_components/features/ProgressIndicator"),    { ssr: false });
const SkipControls         = dynamic(() => import("../_components/features/SkipControls"),         { ssr: false });
const ReducedMotionFallback = dynamic(() => import("../_components/features/ReducedMotionFallback"), { ssr: false });

function FeaturesNav({ cinematic }: { cinematic: boolean }) {
  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 clamp(20px, 5vw, 60px)",
      background: cinematic ? "transparent" : "rgba(248,245,235,0.92)",
      borderBottom: cinematic ? "none" : "1px solid var(--color-line)",
      backdropFilter: cinematic ? "none" : "blur(14px)",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      <Link
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 9,
          color: cinematic ? "var(--color-ink)" : "var(--color-ink)",
          fontFamily: "var(--font-nav)", fontSize: 22, fontWeight: 700,
          textDecoration: "none", letterSpacing: "0.01em",
        }}
      >
        <Mark tone="dark" />
        Orchestra
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/" style={{
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--color-muted)", textDecoration: "none",
        }}>
          ← Home
        </Link>
        <a href="#" style={{
          padding: "10px 22px", borderRadius: 999,
          background: "var(--color-accent)", color: "#fff",
          fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em",
          textTransform: "uppercase", textDecoration: "none",
        }}>
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}

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
      <FeaturesNav cinematic={inCinematic && showCinematic} />

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
