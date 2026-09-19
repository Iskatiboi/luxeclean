import { useEffect, useRef, useState, type ReactNode } from "react";
import { services } from "../site.config";
import { useFormSubmit, TextField, TextArea, ChoiceGroup, SubmitButton, SubmitError, Outcome, Honeypot } from "./formKit";

const NOT_SURE = "Not sure yet";

// Values are the readable titles, so a submission reads well in an inbox; the
// slug is only used to preselect from a /request-a-quote?service=<slug> link.
const SERVICE_OPTIONS = [...services.map((s) => ({ value: s.title, label: s.title })), { value: NOT_SURE, label: NOT_SURE }];

const FREQUENCY_OPTIONS = ["One-time", "Weekly", "Every 2 weeks", "Monthly"].map((f) => ({ value: f, label: f }));

const REQUIRED = [
  { name: "firstName", message: "Please enter your first name." },
  { name: "lastName", message: "Please enter your last name." },
  { name: "email", message: "We need an email address to send your quote to." },
  { name: "serviceType", message: "Pick the service closest to what you need, or “Not sure yet”." },
  { name: "propertyDetails", message: "A few details about the space help us quote accurately." },
];

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-ink/10 pt-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-3 font-heading text-xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/25 font-body text-xs font-semibold" aria-hidden="true">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function QuoteForm() {
  const [service, setService] = useState("");
  const [frequency, setFrequency] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);

  const { status, setStatus, errors, clearError, onSubmit, mailHref } = useFormSubmit({
    required: REQUIRED,
    mailSubject: (d) => `Quote request: ${d.get("serviceType") ?? ""}`,
    mailLines: (d) => [
      ["Name", `${d.get("firstName") ?? ""} ${d.get("lastName") ?? ""}`.trim()],
      ["Email", String(d.get("email") ?? "")],
      ["Phone", String(d.get("phone") ?? "")],
      ["Service", String(d.get("serviceType") ?? "")],
      ["How often", String(d.get("frequency") ?? "")],
      ["Property type", String(d.get("propertyType") ?? "")],
      ["City or area", String(d.get("location") ?? "")],
      ["Preferred date", String(d.get("preferredDate") ?? "")],
      ["About the space", `\n${d.get("propertyDetails") ?? ""}`],
    ],
  });

  // Client-only on purpose: reading the URL or today's date during render would
  // differ from the server-built HTML and break hydration.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = services.find((s) => s.slug === slug);
    if (match) setService(match.title);
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, []);

  const done = status === "success" || status === "mailto";

  return (
    <>
      {done && (
        <Outcome
          status={status}
          mailHref={mailHref}
          successTitle="Request received. Thank you."
          successBody="We'll review the details and send your free quote to the email address you gave us. If anything is unclear we'll reach out first."
          onReset={() => setStatus("idle")}
        />
      )}

      <form onSubmit={onSubmit} noValidate hidden={done} className="relative flex flex-col gap-8">
        <Step n={1} title="Your details">
          <div className="grid gap-6 @sm:grid-cols-2">
            <TextField id="q-firstName" name="firstName" label="First name" autoComplete="given-name" error={errors.firstName} onEdit={() => clearError("firstName")} />
            <TextField id="q-lastName" name="lastName" label="Last name" autoComplete="family-name" error={errors.lastName} onEdit={() => clearError("lastName")} />
          </div>
          <div className="grid gap-6 @sm:grid-cols-2">
            <TextField id="q-email" name="email" type="email" label="Email" autoComplete="email" inputMode="email" error={errors.email} onEdit={() => clearError("email")} />
            <TextField id="q-phone" name="phone" type="tel" label="Phone" optional autoComplete="tel" inputMode="tel" />
          </div>
        </Step>

        <Step n={2} title="The job">
          <ChoiceGroup
            name="serviceType"
            legend="Which service do you need?"
            options={SERVICE_OPTIONS}
            value={service}
            onChange={(v) => {
              setService(v);
              clearError("serviceType");
            }}
            error={errors.serviceType}
          />
          <ChoiceGroup name="frequency" legend="How often?" optional options={FREQUENCY_OPTIONS} value={frequency} onChange={setFrequency} />
          <div className="grid gap-6 @sm:grid-cols-2">
            <TextField id="q-location" name="location" label="City or area" optional autoComplete="address-level2" placeholder="e.g. Winter Park" />
            <TextField id="q-preferredDate" name="preferredDate" type="date" label="Preferred start date" optional ref={dateRef} />
          </div>
        </Step>

        <Step n={3} title="The space">
          <TextField id="q-propertyType" name="propertyType" label="Property or business type" optional placeholder="e.g. 3-bed home, dental office, new build" />
          <TextArea
            id="q-propertyDetails"
            name="propertyDetails"
            label="Tell us about the space"
            rows={5}
            placeholder="Rough square footage, number of rooms, current condition, and anything we should know about access."
            hint="The more you tell us, the more accurate your quote."
            error={errors.propertyDetails}
            onEdit={() => clearError("propertyDetails")}
          />
        </Step>

        {status === "error" && <SubmitError />}

        <div className="flex flex-col gap-4 border-t border-ink/10 pt-8 @sm:flex-row @sm:items-center @sm:justify-between">
          <SubmitButton busy={status === "submitting"}>Request my free quote</SubmitButton>
          <p className="font-body text-xs text-ink/60">Free and no obligation.</p>
        </div>
        <Honeypot />
      </form>
    </>
  );
}
