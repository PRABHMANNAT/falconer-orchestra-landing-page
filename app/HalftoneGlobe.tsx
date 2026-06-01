"use client";

import { useEffect, useRef } from "react";

/**
 * Generative halftone particle globe — canvas only, no dependencies.
 *
 * A dot-matrix Earth: thousands of tiny dots + tilted teardrop marks mapped onto
 * a sphere that rotates slowly on its vertical axis. Landmasses (a procedural
 * continent mask sampled in 3D, so there's no equirectangular seam) are denser
 * and darker; oceans are sparser and lighter. Dots dim toward the far side and
 * fade out at the silhouette for a soft glowing rim. ~5% of land dots are coral
 * accents. On load the particles coalesce inward from a scattered state, then
 * settle into the rotation. Respects prefers-reduced-motion (static, no spin).
 */
export default function HalftoneGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const INK: [number, number, number] = [26, 46, 26]; // dark forest green
    const ACCENT: [number, number, number] = [232, 130, 90]; // coral

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let dpr = 1;

    // Deterministic RNG so the planet looks identical every render.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    // Continent mask = sum of sines along fixed random 3D directions, thresholded.
    const dirs: number[][] = [];
    for (let i = 0; i < 14; i++) {
      let x = rand() * 2 - 1;
      let y = rand() * 2 - 1;
      let z = rand() * 2 - 1;
      const l = Math.hypot(x, y, z) || 1;
      dirs.push([x / l, y / l, z / l, 1.4 + rand() * 2.2, rand() * Math.PI * 2]);
    }
    const landValue = (x: number, y: number, z: number) => {
      let v = 0;
      for (const d of dirs) v += Math.sin((x * d[0] + y * d[1] + z * d[2]) * d[3] + d[4]);
      return v / dirs.length;
    };

    type P = {
      x: number;
      y: number;
      z: number;
      land: boolean;
      accent: boolean;
      teardrop: boolean;
      ang: number;
      phase: number;
      scatter: number;
    };
    let pts: P[] = [];

    const pickCount = (px: number) => (px < 360 ? 1100 : px < 560 ? 1900 : 2800);

    const build = (count: number) => {
      pts = [];
      seed = 9001; // stable per-point attributes across resizes (dirs stay fixed)
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const yy = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - yy * yy));
        const theta = golden * i;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const land = landValue(x, yy, z) > 0.12;
        if (!land && rand() > 0.45) continue; // thin out oceans
        pts.push({
          x,
          y: yy,
          z,
          land,
          accent: land && rand() < 0.05,
          teardrop: rand() < 0.16,
          ang: Math.atan2(z, x),
          phase: rand() * Math.PI * 2,
          scatter: 1.15 + rand() * 1.4
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.42;
      build(pickCount(Math.min(W, H)));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let start = performance.now();
    const ASSEMBLE = reduce ? 0 : 1800; // ms to coalesce (ported from 4c3e799)
    let raf = 0;

    const frame = (now: number) => {
      const elapsed = now - start;
      const a = ASSEMBLE === 0 ? 1 : Math.min(1, elapsed / ASSEMBLE);
      const ease = 1 - Math.pow(1 - a, 3);
      // Rotation speed + reduce angle ported from 4c3e799 — slower, calmer spin.
      const rot = reduce ? 0.5 : elapsed * 0.000115;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const sizeScale = Math.min(W, H) / 560;

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const rx = p.x * cosR + p.z * sinR;
        const rz = -p.x * sinR + p.z * cosR;
        const ry = p.y;

        const rad = ease + (1 - ease) * p.scatter; // coalesce inward
        const px = cx + rx * R * rad;
        const py = cy - ry * R * rad;

        const depth = (rz + 1) / 2; // 0 far → 1 near
        const rr = Math.hypot(rx, ry); // → 1 at silhouette
        const rim = rr > 0.82 ? Math.max(0, 1 - (rr - 0.82) / 0.18) : 1;

        let alpha = (0.25 + 0.75 * depth) * rim * a;
        if (!p.land) alpha *= 0.6;
        if (!reduce) alpha *= 0.82 + 0.18 * Math.sin(now * 0.002 + p.phase);
        if (alpha <= 0.02) continue;

        const baseS = p.land ? 1.5 : 1.1;
        const s = baseS * (0.55 + 0.75 * depth) * (sizeScale * 0.9 + 0.4);
        const col = p.accent ? ACCENT : INK;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;

        if (p.teardrop) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(p.ang + rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, s * 1.5, s * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      start = performance.now() - ASSEMBLE;
      frame(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="globe-canvas" aria-hidden="true" />;
}
