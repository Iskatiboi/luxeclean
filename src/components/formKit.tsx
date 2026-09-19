import { useState, type FormEvent, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type Ref } from "react";
import { site } from "../site.config";
import { inputClass, textareaClass, labelClass, hintClass, errorClass, fieldBorder } from "./formStyles";

// No form backend has been chosen yet. When PUBLIC_FORM_ENDPOINT is set (Formspree,
// Netlify Forms, a serverless function...) submissions POST there. Until then the
// form opens the visitor's email app with everything they typed already filled in,
// addressed to the business, so a message is never lost and no visitor ever sees a
// configuration error. See README.
const FORM_ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

export type Status = "idle" | "submitting" | "success" | "mailto" | "error";
type Errors = Record<string, string>;

type Rule = { name: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Options {
  required: Rule[];
  // Subject line and ordered "Label: value" lines for the email fallback.
  mailSubject: (data: FormData) => string;
  mailLines: (data: FormData) => [string, string][];
}

export function useFormSubmit({ required, mailSubject, mailLines }: Options) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [mailHref, setMailHref] = useState("");

  const clearError = (name: string) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never see or fill this field, so a value means a bot.
    // Report success and drop the submission quietly.
    if (String(data.get("_gotcha") ?? "")) {
      setStatus("success");
      return;
    }

    const next: Errors = {};
    for (const rule of required) {
      if (!String(data.get(rule.name) ?? "").trim()) next[rule.name] = rule.message;
    }
    const email = String(data.get("email") ?? "").trim();
    if (email && !EMAIL.test(email)) next.email = "That email address doesn't look right. Check for a typo.";
    setErrors(next);

    // Take the visitor straight to the first problem instead of making them hunt.
    const first = required.map((r) => r.name).concat("email").find((n) => next[n]);
    if (first) {
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    if (!FORM_ENDPOINT) {
      const body = mailLines(data)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const href = `mailto:${site.email}?subject=${encodeURIComponent(mailSubject(data))}&body=${encodeURIComponent(body)}`;
      setMailHref(href);
      setStatus("mailto");
      window.location.href = href;
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return { status, setStatus, errors, clearError, onSubmit, mailHref };
}

// Hidden from people and assistive tech; bots that fill every field trip it.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.8v3.6M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface FieldShellProps {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ id, label, optional, hint, error, children, className = "" }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink/50">(optional)</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className={errorClass}>
          <ErrorIcon />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className={hintClass}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  // React 19 passes `ref` as an ordinary prop; it reaches the <input> via ...rest.
  ref?: Ref<HTMLInputElement>;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  onEdit?: () => void;
  wrapperClassName?: string;
};

export function TextField({ id, label, optional, hint, error, onEdit, wrapperClassName, ...rest }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error} className={wrapperClassName}>
      <input
        id={id}
        className={`${inputClass} ${fieldBorder(Boolean(error))}`}
        aria-invalid={error ? true : undefined}
        aria-required={optional ? undefined : true}
        aria-describedby={describedBy(id, error, hint)}
        onInput={onEdit}
        {...rest}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  onEdit?: () => void;
};

export function TextArea({ id, label, optional, hint, error, onEdit, ...rest }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        id={id}
        className={`${textareaClass} ${fieldBorder(Boolean(error))}`}
        aria-invalid={error ? true : undefined}
        aria-required={optional ? undefined : true}
        aria-describedby={describedBy(id, error, hint)}
        onInput={onEdit}
        {...rest}
      />
    </FieldShell>
  );
}

interface ChoiceGroupProps {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  error?: string;
}

// Radio buttons dressed as pills: every option is visible at a glance and one tap
// selects it, which beats opening a dropdown on a phone. Still a native radio
// group, so arrow keys and screen readers work as expected.
export function ChoiceGroup({ name, legend, options, value, onChange, optional, error }: ChoiceGroupProps) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined}>
      <legend className={labelClass}>
        {legend}
        {optional && <span className="ml-1.5 font-normal text-ink/50">(optional)</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              aria-required={optional ? undefined : true}
              className="peer sr-only"
            />
            <span
              className={`inline-flex items-center rounded-full border px-4 py-2.5 font-body text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-surface peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
                error ? "border-danger text-ink" : "border-ink/20 text-ink/80 hover:border-ink/45 hover:text-ink"
              }`}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className={errorClass}>
          <ErrorIcon />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 font-body text-sm font-medium text-surface transition-[opacity,transform] hover:opacity-90 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 @sm:w-auto"
    >
      {busy ? "Sending…" : children}
      {!busy && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          <path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

interface OutcomeProps {
  status: Status;
  mailHref: string;
  successTitle: string;
  successBody: string;
  onReset: () => void;
}

// What the visitor sees once they have pressed send, in place of the form.
export function Outcome({ status, mailHref, successTitle, successBody, onReset }: OutcomeProps) {
  const isMail = status === "mailto";
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-start gap-5 py-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-surface" aria-hidden="true">
        {isMail ? (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 4h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="m1.9 5.2 6.1 4 6.1-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div>
        <h2 className="font-heading text-2xl leading-tight md:text-3xl">{isMail ? "One last step: press send" : successTitle}</h2>
        <p className="mt-3 max-w-md font-body leading-relaxed text-ink/75">
          {isMail ? (
            <>
              Your email app should have opened with everything filled in, addressed to us. Just press send. If
              nothing opened, email us directly at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-ink underline">
                {site.email}
              </a>
              .
            </>
          ) : (
            successBody
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {isMail && (
          <a href={mailHref} className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 font-body text-sm text-surface transition-opacity hover:opacity-90">
            Open email again
          </a>
        )}
        <button type="button" onClick={onReset} className="font-body text-sm text-ink underline underline-offset-4 hover:no-underline">
          {isMail ? "Back to the form" : "Send another"}
        </button>
      </div>
    </div>
  );
}

export function SubmitError() {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-2xl bg-danger/10 px-4 py-3 font-body text-sm text-danger">
      <ErrorIcon />
      <span>
        Something went wrong sending that. Please try again, or email us at{" "}
        <a href={`mailto:${site.email}`} className="font-medium underline">
          {site.email}
        </a>
        .
      </span>
    </p>
  );
}
