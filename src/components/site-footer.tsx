import Link from "next/link";

const columns = [
  {
    title: "Marketplace",
    links: [
      { href: "/listings/FOR_SALE", label: "For Sale" },
      { href: "/listings/HOUSING", label: "Housing" },
      { href: "/listings/JOBS", label: "Jobs" },
      { href: "/listings/SERVICES", label: "Services" },
      { href: "/search", label: "Browse all" },
    ],
  },
  {
    title: "Sell",
    links: [
      { href: "/post", label: "Post a listing" },
      { href: "/onboarding", label: "Open a shop" },
      { href: "/dashboard", label: "Seller hub" },
    ],
  },
  {
    title: "Trust & safety",
    links: [
      { href: "/verify", label: "Get verified" },
    ],
  },
];

/** Spotify keeps its footer inside the main pane, below the content. */
export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 pt-12 sm:px-6 @4xl/main:px-8">
      <div className="h-px bg-line" aria-hidden />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 @3xl/main:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-bold text-fg">{col.title}</h2>
            <ul className="mt-2 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-subdued transition-colors hover:text-fg hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-2 @3xl/main:col-span-1">
          <h2 className="font-bold text-fg">How Sokoni works</h2>
          <p className="mt-2 max-w-[34ch] text-subdued">
            One seller identity for one-off listings and an always-on shop. Every seller carries a trust score; you chat on
            WhatsApp or in Sokoni and meet to buy.
          </p>
        </div>
      </div>
      <div className="mt-12 h-px bg-line" aria-hidden />
      <div className="mt-8 flex flex-col gap-2 text-sm text-subdued sm:flex-row sm:justify-between">
        <p>© 2026 Sokoni</p>
        <p>Demo build: every person, shop, listing and chat shown is fictional sample data.</p>
      </div>
    </footer>
  );
}
