import { NextResponse } from "next/server";

/** A quick way to confirm a deployment has its email variables. */
export function GET() {
  const email = process.env.RESEND_API_KEY && process.env.CONTACT_FROM ? "ok" : "not configured";
  return NextResponse.json({ ok: true, email });
}
