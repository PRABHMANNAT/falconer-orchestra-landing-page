"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HalftoneGlobe from "../HalftoneGlobe";
import Mark from "../_components/Mark";
import "./waitlist.css";

// ── Types & globals ────────────────────────────────────────────────

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (err: { type?: string; message?: string }) => void;
          }) => { requestAccessToken: (overrides?: Record<string, unknown>) => void };
        };
      };
    };
  }
}

type GoogleTokenClient = {
  requestAccessToken: (overrides?: Record<string, unknown>) => void;
};

// ── Validation ─────────────────────────────────────────────────────

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com",
  "temp-mail.org", "throwawaymail.com", "yopmail.com", "trashmail.com",
  "getnada.com", "fakeinbox.com", "sharklasers.com", "dispostable.com",
  "maildrop.cc", "mintemail.com", "mohmal.com", "spambox.us",
  "tempinbox.com", "tempr.email", "throwaway.email",
]);

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;

function validateEmail(raw: string): { ok: boolean; reason?: string } {
  const email = raw.trim().toLowerCase();
  if (!email) return { ok: false, reason: "Please enter your email address." };
  if (email.length > 254) return { ok: false, reason: "Email is too long." };
  if (!EMAIL_REGEX.test(email))
    return { ok: false, reason: "Please enter a valid email address." };
  const domain = email.split("@")[1];
  if (!domain || domain.includes("..") || domain.startsWith("-") || domain.endsWith("-"))
    return { ok: false, reason: "Please enter a valid email address." };
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain))
    return { ok: false, reason: "Disposable email addresses aren't allowed." };
  return { ok: true };
}

// ── Static content ─────────────────────────────────────────────────

type Chip = {
  label: string;
  cls: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

const CHIPS: Chip[] = [
  { label: "Maya shipped retries",      cls: "wl-chip-mint",     top: "8%",     left: "0%"  },
  { label: "Socrates flagged a risk",   cls: "wl-chip-amber",    top: "14%",    right: "-4%" },
  { label: "Devraj closed NW-218",      cls: "wl-chip-lavender", bottom: "20%", right: "-2%" },
  { label: "Renewal review on Jun 3",   cls: "wl-chip-yellow",   bottom: "6%",  left: "2%"  },
];

const INTEGRATIONS = [
  { name: "Slack",       domain: "slack.com" },
  { name: "GitHub",      domain: "github.com" },
  { name: "Notion",      domain: "notion.so" },
  { name: "Gmail",       domain: "gmail.com" },
  { name: "Linear",      domain: "linear.app" },
  { name: "Granola",     domain: "granola.ai" },
  { name: "Google Docs", domain: "docs.google.com" },
  { name: "Fireflies",   domain: "fireflies.ai" },
  { name: "Teams",       domain: "teams.microsoft.com" },
  { name: "VS Code",     domain: "code.visualstudio.com" },
  { name: "Calendly",    domain: "calendly.com" },
  { name: "Zoom",        domain: "zoom.us" },
];

// ── Icons ──────────────────────────────────────────────────────────

const GoogleIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

const EmailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3.5 6.5L12 13L20.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CheckIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── UI building blocks ────────────────────────────────────────────

function ProviderButton({
  children,
  icon,
  onClick,
  type = "button",
  disabled,
  variant = "default",
}: {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "default" | "primary";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`wl-btn${variant === "primary" ? " wl-btn-primary" : ""}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

function FloatingChips() {
  return (
    <>
      {CHIPS.map((c, i) => (
        <motion.span
          key={c.label}
          className={`wl-chip ${c.cls}`}
          style={{ top: c.top, bottom: c.bottom, left: c.left, right: c.right }}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {c.label}
          <span className="wl-chip-x" aria-hidden="true">×</span>
        </motion.span>
      ))}
    </>
  );
}

function IntegrationsMarquee() {
  const loop = [...INTEGRATIONS, ...INTEGRATIONS];
  return (
    <div className="wl-integrations">
      <div className="wl-integrations-label">Connects with the tools you already use</div>
      <div className="wl-marquee">
        <div className="wl-marquee-track">
          {loop.map((it, i) => (
            <div className="wl-int-item" key={`${it.domain}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${it.domain}&sz=64`}
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <span>{it.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Waitlist auth panel ───────────────────────────────────────────

function WaitlistPanel() {
  const [view, setView] = useState<"choices" | "email">("choices");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const googleClientRef = useRef<GoogleTokenClient | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const submitWaitlist = useCallback(
    async (
      payload:
        | { type: "email"; email: string }
        | { type: "google"; access_token: string }
    ) => {
      setError(null);
      setStatus("submitting");
      try {
        // Best-effort POST to /api/waitlist if the route exists.
        // If it doesn't, we still register the email locally and show success
        // so the user gets a confirmation. Replace with your real backend.
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => null);

        let confirmed: string | null = null;
        if (res && res.ok) {
          const data = (await res.json().catch(() => ({}))) as { email?: string };
          confirmed = data.email || (payload.type === "email" ? payload.email : null);
        } else {
          // Fall back to local persistence so the demo still feels real.
          confirmed = payload.type === "email" ? payload.email : null;
          if (typeof window !== "undefined" && confirmed) {
            const prior = JSON.parse(localStorage.getItem("orchestra-waitlist") || "[]");
            if (!prior.includes(confirmed)) prior.push(confirmed);
            localStorage.setItem("orchestra-waitlist", JSON.stringify(prior));
          }
        }
        setConfirmedEmail(confirmed);
        setStatus("success");
      } catch {
        setError("Network error. Please try again.");
        setStatus("idle");
      }
    },
    []
  );

  useEffect(() => {
    if (!googleClientId || typeof window === "undefined") return;

    const initialize = () => {
      if (!window.google?.accounts?.oauth2) return;
      googleClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: (response) => {
          if (response.error || !response.access_token) {
            setStatus("idle");
            if (response.error && response.error !== "popup_closed_by_user") {
              setError(response.error_description || "Google sign-in failed.");
            }
            return;
          }
          submitWaitlist({ type: "google", access_token: response.access_token });
        },
        error_callback: (err) => {
          setStatus("idle");
          if (err?.type && err.type !== "popup_closed") {
            setError(err.message || "Google sign-in failed.");
          }
        },
      });
      setGoogleReady(true);
    };

    const existing = document.getElementById("google-identity-services");
    if (existing) {
      initialize();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-identity-services";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initialize;
    document.head.appendChild(script);
  }, [googleClientId, submitWaitlist]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    const result = validateEmail(email);
    if (!result.ok) {
      setError(result.reason ?? "Please enter a valid email address.");
      return;
    }
    submitWaitlist({ type: "email", email: email.trim().toLowerCase() });
  };

  const handleGoogleClick = () => {
    if (status === "submitting") return;
    if (!googleClientId) {
      setError(
        "Google sign-in isn't wired up yet — use email to join the waitlist."
      );
      return;
    }
    if (!googleClientRef.current) {
      setError("Google sign-in is still loading. Try again in a moment.");
      return;
    }
    setError(null);
    googleClientRef.current.requestAccessToken();
  };

  if (status === "success") {
    return (
      <motion.div
        className="wl-success"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="wl-success-check" aria-hidden="true">{CheckIcon}</div>
        <h3>You&apos;re on the list</h3>
        <p>
          We&apos;ll email{" "}
          <b>{confirmedEmail || "your address"}</b>{" "}
          as soon as your spot opens.
        </p>
        <button
          type="button"
          className="wl-link-btn"
          style={{ marginTop: 18 }}
          onClick={() => {
            setEmail("");
            setConfirmedEmail(null);
            setStatus("idle");
            setView("choices");
          }}
        >
          Add another email
        </button>
      </motion.div>
    );
  }

  return (
    <div className="wl-auth-panel">
      {view === "choices" && (
        <>
          <ProviderButton
            icon={GoogleIcon}
            onClick={handleGoogleClick}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Joining…" : "Continue with Google"}
          </ProviderButton>
          <ProviderButton
            icon={EmailIcon}
            onClick={() => setView("email")}
            disabled={status === "submitting"}
          >
            Continue with Email
          </ProviderButton>
          {error && <p className="wl-error">{error}</p>}
          {googleClientId && !googleReady && (
            <p className="wl-hint">Loading Google sign-in…</p>
          )}
        </>
      )}

      {view === "email" && (
        <form onSubmit={handleEmailSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label htmlFor="wl-email" className="wl-input-label">Work email</label>
          <input
            id="wl-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@company.com"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "wl-email-error" : undefined}
            className={`wl-input${error ? " has-error" : ""}`}
          />
          {error && <p id="wl-email-error" className="wl-error">{error}</p>}
          <ProviderButton type="submit" variant="primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Joining…" : "Join waiting list"}
          </ProviderButton>
          <button
            type="button"
            className="wl-link-btn"
            onClick={() => {
              setView("choices");
              setError(null);
            }}
          >
            ← Back
          </button>
        </form>
      )}

      <p className="wl-terms">
        By proceeding, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link>
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WaitlistPage() {
  return (
    <main className="wl-page">
      <Link href="/" aria-label="Go back to home" className="wl-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="wl-back-label">Go back</span>
      </Link>

      <motion.div
        className="wl-grid"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* LEFT — welcome */}
        <motion.section
          className="wl-card wl-card-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <div className="wl-left-head">
            <h1>Welcome to Orchestra</h1>
            <p>Your company&apos;s brain. Always up to date. Always cited.</p>
          </div>

          <div className="wl-globe-wrap">
            <div className="wl-globe">
              <span className="wl-globe-halo" aria-hidden="true" />
              <HalftoneGlobe />
              <FloatingChips />
            </div>
          </div>

          <IntegrationsMarquee />
        </motion.section>

        {/* RIGHT — auth */}
        <motion.section
          className="wl-card wl-card-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
        >
          <div className="wl-brand">
            <Link href="/" aria-label="Orchestra home">
              <Mark />
              Orchestra
            </Link>
          </div>

          <div className="wl-auth-body">
            <div className="wl-auth-head">
              <h2>Join the waiting list</h2>
            </div>
            <WaitlistPanel />
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
