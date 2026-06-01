"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import dynamic from "next/dynamic";
import Mark from "./Mark";

const DarkModeToggle = dynamic(() => import("./DarkModeToggle"), { ssr: false });

const navItems: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`logo ${tone}`} style={{ gap: 9 }}>
      <Mark tone={tone} />
      Orchestra
    </span>
  );
}

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSolid(latest > 24);
  });

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`site-header ${solid ? "solid" : ""}`}>
      <div className="nav-left">
        <Link className="brand" href="/" aria-label="Orchestra home">
          <Logo />
        </Link>
      </div>

      <nav className="nav-center nav-pill-group" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`nav-pill-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  className="nav-pill-bg"
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 45 }}
                />
              )}
              <span className="nav-pill-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="nav-right">
        <a className="nav-signin" href="#" style={{ display: "none" as const }} aria-label="Sign in" />
        <DarkModeToggle />
        <a className="btn btn-accent" href="#">
          Join Waitlist
        </a>
        <a className="btn btn-dark" href="#">
          View Demo
        </a>
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`mobile-nav-link${active ? " active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a href="#" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </a>
            </nav>
            <a className="btn btn-accent" href="#" onClick={() => setMenuOpen(false)}>
              Join Waitlist
            </a>
            <a className="btn btn-dark" href="#" onClick={() => setMenuOpen(false)}>
              View Demo
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
