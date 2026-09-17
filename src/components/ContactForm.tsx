"use client";

import { useRef, useState } from "react";
import { contact, site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";
export type Kind = "general" | "clinic" | "investor";

const field =
  "w-full rounded-xl border border-line-strong bg-ink-950/60 px-4 py-3.5 text-base text-fog placeholder:text-fog transition-colors duration-200 focus:border-teal-400 focus:outline-none";

const copy: Record<Kind, { submit: string; sent: string; messageLabel: string; defaultRole?: string }> = {
  general: { submit: "Send message", sent: "Your message has been sent.", messageLabel: "Message" },
  clinic: { submit: "Register interest", sent: "Thank you. We will be in touch about Revolux for your practice.", messageLabel: "Tell us about your practice", defaultRole: "optometrist" },
  investor: { submit: "Request access", sent: "Thank you. We will follow up directly about the data room.", messageLabel: "Anything you would like us to know", defaultRole: "investor" },
};

export default function ContactForm({ kind = "general" }: { kind?: Kind }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const shownAt = useRef(Date.now());
  const c = copy[kind];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), kind, elapsed: Date.now() - shownAt.current };
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
      shownAt.current = Date.now();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-teal-400/40 bg-teal-900/20 p-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-fog">Thank you</h3>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-fog">
          {c.sent} {contact.responseNote}
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-base text-fog underline underline-offset-4 hover:text-fog">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-firstName`} className="mb-1.5 block text-sm text-fog">
            First name <span aria-hidden="true">*</span>
          </label>
          <input id={`${kind}-firstName`} name="firstName" required autoComplete="given-name" className={field} />
        </div>
        <div>
          <label htmlFor={`${kind}-lastName`} className="mb-1.5 block text-sm text-fog">
            Last name <span aria-hidden="true">*</span>
          </label>
          <input id={`${kind}-lastName`} name="lastName" required autoComplete="family-name" className={field} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${kind}-email`} className="mb-1.5 block text-sm text-fog">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id={`${kind}-email`} name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor={`${kind}-organisation`} className="mb-1.5 block text-sm text-fog">
            {kind === "investor" ? "Fund or organisation" : "Organisation"} <span className="text-fog">(optional)</span>
          </label>
          <input id={`${kind}-organisation`} name="organisation" autoComplete="organization" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor={`${kind}-role`} className="mb-1.5 block text-sm text-fog">
          I am
        </label>
        <select id={`${kind}-role`} name="role" defaultValue={c.defaultRole ?? ""} className={`${field} appearance-none`}>
          <option value="" disabled>
            Choose one
          </option>
          {contact.roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${kind}-message`} className="mb-1.5 block text-sm text-fog">
          {c.messageLabel}
        </label>
        <textarea id={`${kind}-message`} name="message" rows={5} className={`${field} resize-y`} />
      </div>

      {/* Honeypot: bots fill this in, people never see it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-company`}>Company</label>
        <input id={`${kind}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-xs leading-relaxed text-fog">
        Please do not include patient-identifiable information. By sending this form you agree to our{" "}
        <a href="/privacy-policy" className="underline underline-offset-2 hover:text-fog">
          privacy policy
        </a>
        .
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm text-ember-text">
          {message} You can also email <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-full bg-teal-400 px-8 py-4 font-medium text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-300 hover:shadow-[0_0_32px_rgba(27,195,205,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : c.submit}
      </button>
    </form>
  );
}
