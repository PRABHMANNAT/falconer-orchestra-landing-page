"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Mail } from "lucide-react";
import HalftoneGlobe from "../HalftoneGlobe";
import Mark from "../_components/Mark";
import "./waitlist.css";

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

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "mintemail.com",
  "mohmal.com",
  "spambox.us",
  "tempinbox.com",
  "tempr.email",
  "throwaway.email",
]);

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;

function validateEmail(raw: string): { ok: boolean; reason?: string } {
  const email = raw.trim().toLowerCase();
  if (!email) return { ok: false, reason: "Please enter your email address." };
  if (email.length > 254) return { ok: false, reason: "Email is too long." };
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, reason: "Please enter a valid email address." };
  }

  const domain = email.split("@")[1];
  if (!domain || domain.includes("..") || domain.startsWith("-") || domain.endsWith("-")) {
    return { ok: false, reason: "Please enter a valid email address." };
  }
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, reason: "Disposable email addresses are not allowed." };
  }
  return { ok: true };
}

type Chip = {
  label: string;
  tone: "mint" | "amber" | "violet" | "yellow";
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

const CHIPS: Chip[] = [
  { label: "Maya matched a decision", tone: "mint", top: "7%", left: "3%" },
  { label: "Arun flagged the blocker", tone: "amber", top: "15%", right: "-2%" },
  { label: "Devraj found the source", tone: "violet", bottom: "18%", right: "4%" },
  { label: "Renewal notes are cited", tone: "yellow", bottom: "5%", left: "4%" },
] as const;

const INTEGRATIONS = [
  { name: "Slack", src: "/teaser-logos/slack.png" },
  { name: "GitHub", src: "/teaser-logos/github.png" },
  { name: "Notion", src: "/teaser-logos/notion.png" },
  { name: "Gmail", src: "/teaser-logos/gmail.png" },
  { name: "Linear", src: "/teaser-logos/linear.png" },
  { name: "Docs", src: "/teaser-logos/google-docs.png" },
  { name: "Fireflies", src: "/teaser-logos/fireflies.png" },
  { name: "Teams", src: "/teaser-logos/teams.png" },
];

const GoogleIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
);

function WaitlistButton({
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
      className={`wl-button ${variant === "primary" ? "wl-button-primary" : ""}`}
    >
      {icon ? <span className="wl-button-icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

function FloatingChips() {
  return (
    <div className="wl-chips" aria-hidden="true">
      {CHIPS.map((chip, index) => (
        <span
          key={chip.label}
          className={`wl-chip wl-chip-${chip.tone}`}
          style={{
            top: chip.top,
            bottom: chip.bottom,
            left: chip.left,
            right: chip.right,
            animationDelay: `${0.22 + index * 0.08}s`,
          }}
        >
          {chip.label}
          <span>x</span>
        </span>
      ))}
    </div>
  );
}

function IntegrationRail() {
  const loop = [...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <div className="wl-integrations" aria-label="Supported integrations">
      <p>Connects with the tools you already use</p>
      <div className="wl-integration-window">
        <div className="wl-integration-track">
          {loop.map((integration, index) => (
            <div className="wl-integration" key={`${integration.name}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={integration.src} alt="" loading="lazy" />
              <span>{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    async (payload: { type: "email"; email: string } | { type: "google"; access_token: string }) => {
      setError(null);
      setStatus("submitting");

      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => null);

        let confirmed: string | null = null;
        if (res?.ok) {
          const data = (await res.json().catch(() => ({}))) as { email?: string };
          confirmed = data.email || (payload.type === "email" ? payload.email : null);
        } else {
          confirmed = payload.type === "email" ? payload.email : null;
          if (typeof window !== "undefined" && confirmed) {
            const prior = JSON.parse(localStorage.getItem("orchestra-waitlist") || "[]") as string[];
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

  const handleEmailSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
      setError("Google sign-in is not wired up yet. Use email to join the waitlist.");
      return;
    }
    if (!googleClientRef.current) {
      setError("Google sign-in is still loading. Try again in a moment.");
      return;
    }
    setError(null);
    googleClientRef.current.requestAccessToken();
  };

  return (
    <>
      {status === "success" ? (
        <div className="wl-success">
          <span className="wl-success-icon" aria-hidden="true">
            <Check size={24} strokeWidth={2} />
          </span>
          <h3>You are on the list</h3>
          <p>
            We will email <b>{confirmedEmail || "your address"}</b> as soon as your spot opens.
          </p>
          <button
            type="button"
            className="wl-text-button"
            onClick={() => {
              setEmail("");
              setConfirmedEmail(null);
              setStatus("idle");
              setView("choices");
            }}
          >
            Add another email
          </button>
        </div>
      ) : (
        <div className="wl-auth-panel">
          {view === "choices" ? (
            <>
              <WaitlistButton
                icon={GoogleIcon}
                onClick={handleGoogleClick}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Joining..." : "Continue with Google"}
              </WaitlistButton>
              <WaitlistButton
                icon={<Mail size={18} strokeWidth={1.8} />}
                onClick={() => {
                  setView("email");
                  setError(null);
                }}
                disabled={status === "submitting"}
              >
                Continue with Email
              </WaitlistButton>
              {error ? <p className="wl-error">{error}</p> : null}
              {googleClientId && !googleReady ? <p className="wl-hint">Loading Google sign-in...</p> : null}
            </>
          ) : (
            <form className="wl-email-form" onSubmit={handleEmailSubmit} noValidate>
              <label htmlFor="wl-email">Work email</label>
              <input
                id="wl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@company.com"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "wl-email-error" : undefined}
              />
              {error ? (
                <p id="wl-email-error" className="wl-error">
                  {error}
                </p>
              ) : null}
              <WaitlistButton type="submit" variant="primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Joining..." : "Join waiting list"}
              </WaitlistButton>
              <button
                type="button"
                className="wl-text-button"
                onClick={() => {
                  setView("choices");
                  setError(null);
                }}
              >
                Back
              </button>
            </form>
          )}

          <p className="wl-terms">
            By proceeding, you agree to our <Link href="/terms">Terms of Service</Link>.
          </p>
        </div>
      )}
    </>
  );
}

export default function WaitlistPage() {
  return (
    <main className="wl-page">
      <Link href="/" aria-label="Go back to home" className="wl-back">
        <ChevronLeft size={18} strokeWidth={2.2} />
        <span>Back</span>
      </Link>

      <div className="wl-shell">
        <section className="wl-panel wl-story">
          <div className="wl-story-copy">
            <h1>Welcome to Orchestra</h1>
            <p>One source of truth across every tool your team uses. Decisions, docs, and discussions unified so the answer is always one search away.</p>
          </div>

          <div className="wl-globe-area">
            <div className="wl-globe">
              <span className="wl-globe-halo" aria-hidden="true" />
              <span className="wl-static-globe" aria-hidden="true" />
              <HalftoneGlobe ink={[236, 242, 232]} accent={[217, 119, 87]} speed={3.2} />
            </div>
          </div>

          <IntegrationRail />
        </section>

        <section className="wl-panel wl-auth">
          <Link href="/" className="wl-brand" aria-label="Orchestra home">
            <Mark />
            <span>Orchestra</span>
          </Link>

          <div className="wl-auth-center">
            <div className="wl-auth-copy">
              <h2>Join the waiting list</h2>
              <p>Get early access when the next team cohort opens.</p>
            </div>
            <WaitlistPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
