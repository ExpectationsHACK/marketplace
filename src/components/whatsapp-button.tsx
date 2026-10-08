import { buttonStyles } from "@/components/ui/button";

// WhatsApp is how Sokoni sellers actually close sales (wa.me deep links,
// no Business API). It always renders white or outlined with the real
// WhatsApp glyph, never in Sokoni green: a buyer must be able to tell at a
// glance that this path leaves Sokoni for WhatsApp.

export function toWaLink(number: string, message: string) {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppGlyph({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
      <path
        fill="var(--color-whatsapp)"
        d="M12 2C6.5 2 2 6.4 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.4 10-10S17.5 2 12 2z"
      />
      <path
        fill="#fff"
        d="M17.2 14.3c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3z"
      />
    </svg>
  );
}

export function WhatsAppButton({
  number,
  message,
  label = "Chat on WhatsApp",
  variant = "white",
  size = "md",
  className = "",
}: {
  number: string;
  message: string;
  label?: string;
  variant?: "white" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <a
      href={toWaLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles(variant, size, className)}
    >
      <WhatsAppGlyph className={size === "sm" ? "size-4" : "size-5"} />
      {label}
      <span className="sr-only">(opens WhatsApp)</span>
    </a>
  );
}
