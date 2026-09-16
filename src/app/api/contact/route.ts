import { NextResponse } from "next/server";
import { contact, site } from "@/content/site";

/**
 * Handles every form on the site: the general contact form, the clinic
 * registration and the investor data-room request. The `kind` field says
 * which, and sets the subject line so they can be filtered in the inbox.
 *
 * Environment variables, set in Vercel:
 *   RESEND_API_KEY   required. An API key from resend.com.
 *   CONTACT_FROM     required. A sender on a domain verified with Resend, e.g.
 *                    "BioPhotonix <info@biophotonix.co.uk>". Resend's shared
 *                    test sender only delivers to the account owner, so
 *                    enquiries would appear to vanish without this.
 *   CONTACT_TO       optional. Where enquiries land. Defaults to the site email.
 *
 * Two emails go out per enquiry: the enquiry itself, and an acknowledgement to
 * the person who sent it. The acknowledgement repeats none of their message.
 *
 * Until RESEND_API_KEY is set, submissions are refused with a message pointing
 * at the email address, rather than disappearing silently.
 */

type Kind = "general" | "clinic" | "investor";

type Payload = {
  kind?: Kind;
  firstName?: string;
  lastName?: string;
  email?: string;
  organisation?: string;
  role?: string;
  message?: string;
  /** Honeypot. People never see it. */
  company?: string;
  /** Milliseconds the form was on screen before submitting. */
  elapsed?: number;
};

const subjects: Record<Kind, string> = {
  general: "Website enquiry",
  clinic: "Clinic registration",
  investor: "Data room request",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot hit: accept it so the bot moves on, but send nothing.
  if (body.company) return NextResponse.json({ ok: true });
  // Bots submit instantly. A person cannot fill this in under two seconds.
  if (typeof body.elapsed === "number" && body.elapsed < 2000) return NextResponse.json({ ok: true });

  const kind: Kind = body.kind === "clinic" || body.kind === "investor" ? body.kind : "general";
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const organisation = body.organisation?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const role = contact.roles.find((r) => r.value === body.role)?.label ?? "Not given";

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Please fill in your name and email address." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please check your email address." }, { status: 400 });
  }
  if (message.length > 4000 || organisation.length > 200) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  if (!apiKey || !from) {
    console.warn(`[contact] ${!apiKey ? "RESEND_API_KEY" : "CONTACT_FROM"} is not set. Enquiry was NOT delivered.`);
    return NextResponse.json(
      { error: `Our contact form is not connected yet. Please email ${site.email}.` },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO ?? site.email;
  const name = `${firstName} ${lastName}`;

  const res = await sendEmail(apiKey, {
    from,
    to: [to],
    reply_to: email,
    subject: `${subjects[kind]}: ${name}${organisation ? `, ${organisation}` : ""}`,
    html: `
      <h2>${escapeHtml(subjects[kind])}</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Organisation:</strong> ${escapeHtml(organisation) || "Not given"}</p>
      <p><strong>Role:</strong> ${escapeHtml(role)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>") || "No message"}</p>
      <hr>
      <p style="color:#666">Reply directly to this email to reach ${escapeHtml(firstName)}.</p>
    `,
  });

  if (!res.ok) {
    console.error("[contact] Resend rejected the enquiry:", res.status, await res.text());
    return NextResponse.json({ error: `We could not send that. Please email ${site.email} instead.` }, { status: 502 });
  }

  // Acknowledgement to the sender. Best effort: the enquiry has already arrived.
  try {
    const ack = await sendEmail(apiKey, {
      from,
      to: [email],
      reply_to: to,
      subject: `We have received your message | ${site.name}`,
      html: `
        <p>Dear ${escapeHtml(firstName)},</p>
        <p>Thank you for getting in touch with BioPhotonix. We have received your
        message and aim to reply within two working days.</p>
        <p>Kind regards,<br>The BioPhotonix team<br>${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.city)}</p>
        <hr>
        <p style="color:#666;font-size:14px">This is an automatic acknowledgement. You can reply to it and it will reach us.</p>
      `,
    });
    if (!ack.ok) console.warn("[contact] Acknowledgement not sent:", ack.status, await ack.text());
  } catch (err) {
    console.warn("[contact] Acknowledgement failed:", err);
  }

  return NextResponse.json({ ok: true });
}
