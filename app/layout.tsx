import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Syne, DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./globals-additions.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap"
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap"
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Orchestra",
  description:
    "Orchestra is an AI-powered company brain that ingests every doc, thread, commit, and decision your team touches — then turns it into a living source of truth you can query, slice, and trust.",
  openGraph: {
    title: "Orchestra",
    description:
      "Orchestra is an AI-powered company brain that ingests every doc, thread, commit, and decision your team touches — then turns it into a living source of truth you can query, slice, and trust.",
    type: "website"
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f5eb"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bebas.variable} ${syne.variable} ${dmMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
