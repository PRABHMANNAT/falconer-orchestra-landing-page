"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Mark from "./Mark";

// Footer palette (scoped — does not affect the rest of the site):
//   --footer-bg   #000000 (black)
//   --footer-text #FFFFFF (white)
//   --footer-mute #B1ADA1 (Cloudy)
//   --footer-acc  #C15F3C (Crail)

/* ────────────────────────── WebGL backdrop ──────────────────────────
 * Raw WebGL1 — fullscreen quad with a fragment shader that warps
 * fractional Brownian-motion noise around the cursor position. No
 * three.js / ogl dependency. Bundle cost: a few hundred bytes of
 * GLSL strings and a ~60-line setup block.
 */
function WebGLBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: false
    });
    if (!gl) return;

    const VERT = `
      attribute vec2 a;
      void main() { gl_Position = vec4(a, 0.0, 1.0); }
    `;

    const FRAG = `
      precision highp float;
      uniform vec2  uResolution;
      uniform vec2  uMouse;
      uniform float uTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 res = uResolution.xy;
        vec2 p = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);
        vec2 m = (uMouse * res - 0.5 * res) / min(res.x, res.y);

        float md = length(p - m);
        vec2 dir = md > 0.001 ? (p - m) / md : vec2(0.0);
        // Ripple warp around cursor + slow drift.
        vec2 q = p + 0.20 * sin(md * 5.5 - uTime * 0.7) * dir / (1.0 + md * 1.5);

        float n = fbm(q * 2.1 + vec2(uTime * 0.06, uTime * 0.04));

        // Crail #C15F3C in sRGB display values (matches the rest of the footer).
        vec3 acc = vec3(0.757, 0.373, 0.235);

        // Brighter mix: noise contributes more, so the orange reads clearly
        // instead of looking dim/olive against pure black.
        vec3 col = acc * pow(n, 1.3);
        // Soft halo around the cursor for direct feedback.
        col += acc * smoothstep(0.55, 0.0, md) * 0.7;
        // Subtle vignette into pure black at edges.
        float vig = smoothstep(1.2, 0.25, length(p));
        col *= vig;

        gl_FragColor = vec4(col, 0.85);
      }
    `;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uTime = gl.getUniformLocation(prog, "uTime");

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const parent = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseRef.current = [
        Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        Math.max(0, Math.min(1, 1.0 - (e.clientY - rect.top) / rect.height))
      ];
    };
    parent?.addEventListener("mousemove", onMove);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    // Explicit black clear so any uncovered pixels remain pure black,
    // never the page background bleeding through.
    gl.clearColor(0, 0, 0, 1);

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uTime, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      tick();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent?.removeEventListener("mousemove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-webgl" aria-hidden="true" />;
}

/* ────────────────────────── Interactive wordmark ──────────────────────────
 * Each letter listens to a shared mouseX motion value and offsets Y based
 * on a Gaussian falloff from the cursor's horizontal position. Letters
 * near the cursor lift; far letters stay put.
 */
function WordmarkLetter({
  char,
  position,
  mouseX,
  delay
}: {
  char: string;
  position: number;
  mouseX: MotionValue<number>;
  delay: number;
}) {
  const y = useTransform(mouseX, (mx) => {
    const dx = mx - position;
    return -22 * Math.exp(-dx * dx * 24);
  });
  const smoothY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.6 });

  return (
    <motion.span
      style={{ y: smoothY, display: "inline-block" }}
      initial={{ opacity: 0, y: 96 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const }}
      aria-hidden="true"
    >
      {char}
    </motion.span>
  );
}

const FOOTER_COLUMNS: Array<{
  heading: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Manifesto", href: "#" }
    ]
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Notes", href: "#" }
    ]
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "SOC 2", href: "#" }
    ]
  }
];

const CALENDLY_URL = "https://calendly.com/adidogra07/orchestra-demo";

export default function Footer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0.5);

  // Wordmark: feed shared mouseX as a 0..1 normalized stage position.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      mouseX.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    };
    const onLeave = () => mouseX.set(0.5);
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX]);

  // CTA: magnetic pull toward the cursor when within range.
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const RANGE = 160;

    const animate = () => {
      tx += (cx - tx) * 0.18;
      ty += (cy - ty) * 0.18;
      cta.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      const r = cta.getBoundingClientRect();
      const mx = r.left + r.width / 2;
      const my = r.top + r.height / 2;
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      const d = Math.hypot(dx, dy);
      if (d < RANGE) {
        const pull = (RANGE - d) / RANGE;
        cx = dx * 0.22 * pull;
        cy = dy * 0.22 * pull;
      } else {
        cx = 0;
        cy = 0;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const letters = "ORCHESTRA".split("");

  return (
    <footer className="big-footer" aria-labelledby="footer-cta">
      {/* Band 1 — interactive wordmark */}
      <div className="big-wordmark-stage" ref={stageRef}>
        <WebGLBackdrop />
        <h2 className="big-wordmark" aria-label="Orchestra">
          {letters.map((c, i) => (
            <WordmarkLetter
              key={i}
              char={c}
              position={(i + 0.5) / letters.length}
              mouseX={mouseX}
              delay={0.2 + i * 0.05}
            />
          ))}
        </h2>
        <p
          className="footer-wordmark-sub"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            margin: "16px auto 0",
            position: "relative",
            zIndex: 1
          }}
        >
          ONE SOURCE OF TRUTH. POWERED BY AI.
        </p>
      </div>

      {/* Band 2 — pre-sitemap centered CTA links */}
      <div
        style={{
          padding: "28px var(--pad)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0
        }}
      >
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#c15f3c",
            textDecoration: "none"
          }}
        >
          SEE HOW IT WORKS &rarr;
        </a>
        <a
          href="/signup"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.5)",
            textDecoration: "none",
            marginTop: 10
          }}
        >
          Sign up free &rarr;
        </a>
      </div>

      {/* Band 3 — sitemap (brand + CTA + link columns) */}
      <div className="footer-sitemap footer-sitemap--4col">
        <div className="footer-sitemap-brand">
          <Link href="/" className="footer-brand-link" aria-label="Orchestra home">
            <Mark tone="light" />
            <span>orchestra</span>
          </Link>
          <p className="footer-brand-line">
            The source of truth for teams that ship.
          </p>

          <div className="footer-cta-wrap">
            <a
              id="footer-cta"
              ref={ctaRef}
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="footer-cta-btn"
            >
              <span className="footer-cta-label">Talk to Founders</span>
              <motion.span
                className="footer-cta-shine"
                aria-hidden="true"
                initial={{ x: "-110%" }}
                animate={{ x: "110%" }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.2, ease: "easeInOut" }}
              />
            </a>
          </div>
        </div>

        <nav className="footer-sitemap-cols footer-sitemap-cols--3" aria-label="Footer navigation">
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-sitemap-col" key={col.heading}>
              <h4 className="footer-col-heading">{col.heading}</h4>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Band 4 — slim bottom bar */}
      <div className="footer-bar">
        <small className="footer-copyright">
          &copy; 2026 Orchestra
        </small>
        <div
          className="footer-bar-social"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          {/* Twitter / X */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{
              color: "rgba(255,255,255,0.45)",
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center"
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
