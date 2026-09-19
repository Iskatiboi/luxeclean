import { useFormSubmit, TextField, TextArea, SubmitButton, SubmitError, Outcome, Honeypot } from "./formKit";

const REQUIRED = [
  { name: "firstName", message: "Please enter your first name." },
  { name: "lastName", message: "Please enter your last name." },
  { name: "email", message: "We need an email address to reply to." },
  { name: "message", message: "Let us know what you'd like to ask." },
];

export default function ContactForm() {
  const { status, setStatus, errors, clearError, onSubmit, mailHref } = useFormSubmit({
    required: REQUIRED,
    mailSubject: (d) => String(d.get("subject") || "").trim() || "Website enquiry",
    mailLines: (d) => [
      ["Name", `${d.get("firstName") ?? ""} ${d.get("lastName") ?? ""}`.trim()],
      ["Email", String(d.get("email") ?? "")],
      ["Phone", String(d.get("phone") ?? "")],
      ["", ""],
      ["Message", `\n${d.get("message") ?? ""}`],
    ],
  });

  const done = status === "success" || status === "mailto";

  return (
    <>
      {done && (
        <Outcome
          status={status}
          mailHref={mailHref}
          successTitle="Message sent. Thank you."
          successBody="We've got your message and will reply to the email address you gave us."
          onReset={() => setStatus("idle")}
        />
      )}

      {/* Kept mounted while the outcome shows, so "Back to the form" returns
          to exactly what the visitor typed. */}
      <form onSubmit={onSubmit} noValidate hidden={done} className="relative flex flex-col gap-6">
        <div className="grid gap-6 @sm:grid-cols-2">
          <TextField id="firstName" name="firstName" label="First name" autoComplete="given-name" error={errors.firstName} onEdit={() => clearError("firstName")} />
          <TextField id="lastName" name="lastName" label="Last name" autoComplete="family-name" error={errors.lastName} onEdit={() => clearError("lastName")} />
        </div>

        <div className="grid gap-6 @sm:grid-cols-2">
          <TextField id="email" name="email" type="email" label="Email" autoComplete="email" inputMode="email" error={errors.email} onEdit={() => clearError("email")} />
          <TextField id="phone" name="phone" type="tel" label="Phone" optional autoComplete="tel" inputMode="tel" />
        </div>

        <TextField id="subject" name="subject" label="Subject" optional placeholder="e.g. Question about deep cleaning" />

        <TextArea
          id="message"
          name="message"
          label="Message"
          rows={5}
          placeholder="How can we help?"
          error={errors.message}
          onEdit={() => clearError("message")}
        />

        {status === "error" && <SubmitError />}

        <div className="flex flex-col gap-4 @sm:flex-row @sm:items-center @sm:justify-between">
          <SubmitButton busy={status === "submitting"}>Send message</SubmitButton>
          <p className="font-body text-xs text-ink/60">We only use your details to reply to you.</p>
        </div>
        <Honeypot />
      </form>
    </>
  );
}
