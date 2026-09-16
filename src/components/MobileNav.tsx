import { useState } from "react";

type NavItem = { label: string; href: string };

export default function MobileNav({
  items,
  ctaLabel,
  ctaHref,
}: {
  items: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-0.5 w-6 bg-black transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-6 bg-black transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-6 bg-black transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--color-bg)]"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col items-center gap-6 text-2xl font-body">
              {items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="rounded-full bg-black px-8 py-3 font-body text-white"
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
