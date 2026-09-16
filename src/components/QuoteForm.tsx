import { useState, type FormEvent } from "react";
import { inputClass, textareaClass, labelClass, selectClass } from "./formStyles";

type Status = "idle" | "submitting" | "success" | "error";

const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

const SERVICE_OPTIONS = [
  "Residential Cleaning",
  "Commercial Cleaning",
  "Commercial / Construction Cleanup",
  "Airbnb & Vacation Rental Cleaning",
  "Move-In / Move-Out Cleaning",
  "Deep Cleaning",
];

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "serviceType", "propertyDetails"];

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6" aria-describedby="quote-form-status">
      <fieldset>
        <legend className={labelClass}>Name</legend>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-firstName" className="mb-1 block text-xs text-black/60">
              First Name (required)
            </label>
            <input id="q-firstName" name="firstName" type="text" autoComplete="given-name" className={inputClass} aria-invalid={Boolean(errors.firstName)} />
          </div>
          <div>
            <label htmlFor="q-lastName" className="mb-1 block text-xs text-black/60">
              Last Name (required)
            </label>
            <input id="q-lastName" name="lastName" type="text" autoComplete="family-name" className={inputClass} aria-invalid={Boolean(errors.lastName)} />
          </div>
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="q-email" className={labelClass}>
            Email (required)
          </label>
          <input id="q-email" name="email" type="email" autoComplete="email" className={`${inputClass} mt-2`} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="mt-1 text-xs text-black/70">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="q-phone" className={labelClass}>
            Phone (optional)
          </label>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" className={`${inputClass} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="q-serviceType" className={labelClass}>
          Service needed (required)
        </label>
        <select id="q-serviceType" name="serviceType" defaultValue="" className={`${selectClass} mt-2`} aria-invalid={Boolean(errors.serviceType)}>
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="q-propertyType" className={labelClass}>
            Property / business type
          </label>
          <input
            id="q-propertyType"
            name="propertyType"
            type="text"
            placeholder="e.g. 2-bed home, office, job site, Airbnb"
            className={`${inputClass} mt-2`}
          />
        </div>
        <div>
          <label htmlFor="q-preferredDate" className={labelClass}>
            Preferred date
          </label>
          <input id="q-preferredDate" name="preferredDate" type="date" className={`${inputClass} mt-2`} />
        </div>
      </div>

      <div>
        <label htmlFor="q-propertyDetails" className={labelClass}>
          Tell us about the space (required)
        </label>
        <textarea
          id="q-propertyDetails"
          name="propertyDetails"
          rows={5}
          placeholder="Square footage, rooms, current condition, access details, anything else that helps us quote accurately."
          className={`${textareaClass} mt-2`}
          aria-invalid={Boolean(errors.propertyDetails)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start rounded-full bg-black px-8 py-3 font-body text-sm text-white disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request My Quote"}
      </button>

      <div id="quote-form-status" role="status" aria-live="polite" className="font-body text-sm">
        {status === "success" && <p>Thanks — your quote request has been sent. We'll follow up shortly.</p>}
        {status === "error" && !FORM_ENDPOINT && (
          <p className="text-black/70">
            Form submission isn't connected to an email service yet (no PUBLIC_FORM_ENDPOINT configured). See README.
          </p>
        )}
        {status === "error" && FORM_ENDPOINT && <p>Something went wrong sending your request. Please try again.</p>}
        {Object.keys(errors).length > 0 && status === "idle" && <p>Please fill in all required fields.</p>}
      </div>
    </form>
  );
}
