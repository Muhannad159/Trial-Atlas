import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ComparisonProvider } from "@/features/comparison/provider";
import { siteUrl } from "@/lib/seo";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-editorial",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrialAtlas — Clinical Trial Finder",
    template: "%s | TrialAtlas",
  },
  description:
    "Find, understand, and compare clinical research. Explore public study records, study locations, and related evidence with TrialAtlas.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${serif.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ComparisonProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ComparisonProvider>
      </body>
    </html>
  );
}
