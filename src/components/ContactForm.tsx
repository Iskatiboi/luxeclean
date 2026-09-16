import { useState, type FormEvent } from "react";
import { inputClass, textareaClass, labelClass } from "./formStyles";

type Status = "idle" | "submitting" | "success" | "error";

// No form backend was specified in the project brief. If PUBLIC_FORM_ENDPOINT
// is set (e.g. a Formspree/Netlify Forms/serverless endpoint), submissions
// POST there; otherwise this clearly reports that no endpoint is configured
// instead of silently pretending to succeed.
const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors: Record<string, string> = {};
    for (const field of ["firstName", "lastName", "email", "subject", "message"]) {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = "Required";
    }
    const email = String(data.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!FORM_ENDPOINT) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6" aria-describedby="contact-form-status">
      <fieldset>
        <legend className={labelClass}>Name</legend>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-xs text-black/60">
              First Name (required)
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className={inputClass}
              aria-invalid={Boolean(errors.firstName)}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-xs text-black/60">
              Last Name (required)
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className={inputClass}
              aria-invalid={Boolean(errors.lastName)}
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email (required)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`${inputClass} mt-2`}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="mt-1 text-xs text-black/70">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject (required)
        </label>
        <input id="subject" name="subject" type="text" className={`${inputClass} mt-2`} aria-invalid={Boolean(errors.subject)} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message (required)
        </label>
        <textarea id="message" name="message" rows={5} className={`${textareaClass} mt-2`} aria-invalid={Boolean(errors.message)} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-full bg-black px-8 py-3 font-body text-sm text-white disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>

      <div id="contact-form-status" role="status" aria-live="polite" className="font-body text-sm">
        {status === "success" && <p>Thanks — your message has been sent. We'll be in touch shortly.</p>}
        {status === "error" && !FORM_ENDPOINT && (
          <p className="text-black/70">
            Form submission isn't connected to an email service yet (no PUBLIC_FORM_ENDPOINT configured). See README.
          </p>
        )}
        {status === "error" && FORM_ENDPOINT && <p>Something went wrong sending your message. Please try again.</p>}
        {Object.keys(errors).length > 0 && status === "idle" && <p>Please fill in all required fields.</p>}
      </div>
    </form>
  );
}
