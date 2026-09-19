// Shared look for every form control. Borders are soft by default and firm up on
// hover and focus; an invalid field swaps to the danger colour. The error state is
// chosen in React (see formKit.tsx) rather than with an aria-* variant, so it never
// depends on Tailwind picking up an attribute selector.
const control =
  "w-full border bg-surface font-body text-[15px] text-ink placeholder:text-ink/40 transition-colors focus:border-ink";

export const fieldBorder = (invalid: boolean) =>
  invalid ? "border-danger" : "border-ink/20 hover:border-ink/45";

export const inputClass = `${control} rounded-full px-5 py-3.5`;
export const textareaClass = `${control} rounded-3xl px-5 py-4 leading-relaxed`;

export const labelClass = "block font-body text-sm font-medium text-ink";
export const hintClass = "mt-1.5 font-body text-xs text-ink/60";
export const errorClass = "mt-1.5 flex items-center gap-1.5 font-body text-xs font-medium text-danger";
