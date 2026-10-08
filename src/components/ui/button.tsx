// Spotify's button grammar: full pills, bold labels, a 1.04 hover scale and
// no shadows. Color carries meaning:
//   primary (green) — a Sokoni platform action: post, save, reply, continue
//   white           — reserved for WhatsApp (see whatsapp-button.tsx)
//   outline         — secondary: follow, back, view
//   tinted          — low-emphasis utility on dark surfaces
// Exported as class builders so <Link>, <a> and <button> share one source.

type Variant = "primary" | "white" | "outline" | "tinted" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold " +
  "transition-[transform,background-color,border-color,color] duration-100 ease-snap " +
  "hover:scale-[1.04] active:scale-100 active:duration-0 " +
  "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hi active:bg-accent-press",
  white: "bg-fg text-black hover:bg-[#f2f2f2] active:bg-[#d9d9d9]",
  outline: "text-fg shadow-[inset_0_0_0_1px_var(--color-faint)] hover:shadow-[inset_0_0_0_1px_var(--color-fg)]",
  tinted: "bg-tint text-fg hover:bg-tint-hi",
  ghost: "text-subdued hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-12 px-8 text-base",
  lg: "h-14 px-8 text-base",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

/** Circular icon-only button (Spotify's 32px/48px circles). */
export function iconButtonStyles(size: "sm" | "md" | "lg" = "sm", className = "") {
  const dims = { sm: "size-8", md: "size-12", lg: "size-14" }[size];
  return (
    `inline-flex shrink-0 items-center justify-center rounded-full text-subdued ` +
    `transition-[transform,color,background-color] duration-100 ease-snap hover:scale-[1.04] hover:text-fg ` +
    `active:scale-100 ${dims} ${className}`
  );
}

/** Filter chip. Selected chips go white, the way Spotify's library filters do. */
export function chipStyles(selected: boolean, className = "") {
  return (
    `inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm transition-colors duration-100 ` +
    (selected ? "bg-fg font-semibold text-black hover:bg-[#f2f2f2] " : "bg-tint text-fg hover:bg-tint-hi ") +
    className
  );
}

/** Spotify sign-up style field: 4px radius, inset hairline, white on hover and focus. */
export const inputStyles =
  "block w-full rounded-[4px] bg-canvas px-4 text-base text-fg placeholder:text-hint " +
  "shadow-[inset_0_0_0_1px_var(--color-faint)] transition-shadow duration-100 " +
  "hover:shadow-[inset_0_0_0_1px_var(--color-fg)] focus:outline-none " +
  "focus-visible:shadow-[inset_0_0_0_2px_var(--color-fg)] " +
  "aria-invalid:shadow-[inset_0_0_0_1px_var(--color-negative)]";

export const fieldHeight = "h-12";

export const labelStyles = "mb-2 block text-sm font-bold text-fg";
