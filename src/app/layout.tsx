import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/shell/top-bar";
import { LibrarySidebar } from "@/components/shell/library-sidebar";
import { MobileHeader, MobileNav } from "@/components/shell/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatBar } from "@/components/shell/chat-bar";
import { ChatPanel } from "@/components/shell/chat-panel";

// Figtree: the closest free relative of Spotify's Circular/Spotify Mix —
// geometric, friendly, and it carries a real 900 weight for entity titles.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sokoni — Buy, sell, and run your shop with people you can trust",
    template: "%s · Sokoni",
  },
  description:
    "Sokoni is a marketplace for classifieds and branded WhatsApp storefronts, with verified sellers and trust scores built in for African sellers and buyers.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const DIRECTION_CONTRACT = `<!--
THESIS: Sokoni is an app you live in, not a classifieds page you visit. Spotify's web-player shell (library rail, live search, color-matched entity pages, card shelves) replaces the category default of a marketing hero over a flat listing grid.
OWN-WORLD: #000 frame holding 8px #121212 panes; Figtree 900 titles, 400-700 UI; borderless cards lifting to white/7% on hover; pills only; Spotify green for Sokoni actions and live state; a white pill with the WhatsApp glyph belongs to WhatsApp alone; each cover's seeded color paints its entity header.
STORY: Buyers browse shelves, save and follow into Your Library, and see trust (ring, verified rosette) beside every buying decision. Sellers post and run their shop from the same identity.
FIRST VIEWPORT: Home. Filter chips over a color wash that follows the hovered quick tile; 4x2 quick tiles; first shelf below. Primary action: Post, top bar right. The chat you're negotiating sits in the bottom bar; its detail view docks right on wide screens.
FORM: Spotify desktop app (library rail, main view, now-playing view, now-playing bar), user-pinned over roll db622dee.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

// Runs before paint so the library rail and the chat panel never flash
// open or shut. The panel defaults open on wide screens, like Spotify desktop.
const SHELL_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem("sokoni:sidebar")==="collapsed")d.dataset.sidebar="collapsed";var p=localStorage.getItem("sokoni:panel");d.dataset.panel=p||(innerWidth>=1440?"open":"closed")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SHELL_SCRIPT }} />
      </head>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-fg px-4 py-2 font-bold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="lg:grid lg:h-dvh lg:grid-rows-[4rem_minmax(0,1fr)_4.5rem] lg:gap-y-2 lg:px-2">
          <TopBar />
          <div className="shell-cols lg:min-h-0 lg:gap-2">
            <LibrarySidebar />
            <main
              id="main"
              className="@container/main pane-scroll relative min-h-dvh overflow-x-clip bg-canvas pb-24 lg:min-h-0 lg:overflow-y-auto lg:rounded-pane lg:pb-0"
            >
              <MobileHeader />
              {children}
              <SiteFooter />
            </main>
            <ChatPanel />
          </div>
          <ChatBar />
        </div>
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
