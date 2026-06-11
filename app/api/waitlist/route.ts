import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload =
  | { type: "email"; email: string }
  | { type: "google"; access_token: string };

async function resolveEmail(payload: Payload): Promise<string | null> {
  if (payload.type === "email") {
    return EMAIL_RE.test(payload.email) ? payload.email.trim().toLowerCase() : null;
  }
  if (payload.type === "google") {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${payload.access_token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { email?: string; email_verified?: boolean };
    if (!data.email || !EMAIL_RE.test(data.email)) return null;
    return data.email.trim().toLowerCase();
  }
  return null;
}

async function notify(email: string, method: "email" | "google", req: NextRequest) {
  const to = process.env.WAITLIST_NOTIFY_TO;
  const from = process.env.WAITLIST_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !from || !apiKey) {
    console.warn("[waitlist] missing email config; skipping notification");
    return;
  }

  const resend = new Resend(apiKey);
  const userAgent = req.headers.get("user-agent") || "unknown";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const timestamp = new Date().toISOString();

  const subject = "New Orchestra waitlist signup";
  const text = [
    `Email: ${email}`,
    `Method: ${method}`,
    `Time:   ${timestamp}`,
    `IP:     ${ip}`,
    `UA:     ${userAgent}`,
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">New Orchestra waitlist signup</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Method:</strong> ${method}</p>
      <p><strong>Time:</strong> ${timestamp}</p>
      <p><strong>IP:</strong> ${ip}</p>
      <p><strong>User agent:</strong> ${userAgent}</p>
    </div>
  `;

  const { error } = await resend.emails.send({ from, to, subject, text, html, replyTo: email });
  if (error) console.error("[waitlist] resend error", error);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || (body.type !== "email" && body.type !== "google")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = await resolveEmail(body);
  if (!email) {
    return NextResponse.json({ error: "Could not verify email" }, { status: 400 });
  }

  await notify(email, body.type, req).catch((err) => {
    console.error("[waitlist] notify failed", err);
  });

  return NextResponse.json({ ok: true, email });
}
