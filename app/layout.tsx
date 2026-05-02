import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { structuredData } from "@/lib/structured-data";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  weight: ["400", "500", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  weight: ["400", "500"],
});

const SITE_URL = "https://jubs.studio";
const SITE_TITLE = "Julia Hoffmann · Design Engineering · jubs.studio";
const SITE_DESCRIPTION =
  "Julia Hoffmann Buratto — Design Engineer building AI tooling, design systems, and onchain UX. Cofounder at Notus. Built CypherCN and Get Shit Pretty.";
const OG_IMAGE = "/images/projects/heimdall/cover.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "jubs.studio",
    title: "Julia Hoffmann · Design Engineering",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "jubs.studio — Julia Hoffmann, Design Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hoffz_eth",
    creator: "@hoffz_eth",
    title: "Julia Hoffmann · Design Engineering",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
