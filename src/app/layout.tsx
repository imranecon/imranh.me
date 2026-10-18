import type { Metadata } from "next";
import { otJubilee, ppNikkei } from "./fonts";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://imranh.me"),
  title: "Imran Hossain",
  description:
    "Imran Hossain — Research Associate at BRAC Institute of Governance and Development (BIGD), BRAC University. Studying development economics, applied microeconomics, political economy, and poverty in Bangladesh.",
  authors: [{ name: "Imran Hossain" }],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Imran Hossain",
    description:
      "Research Associate at BIGD, BRAC University. Studying development economics, applied microeconomics, political economy, poverty, inequality and education in Bangladesh.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Imran Hossain" }],
    type: "website",
    siteName: "Imran Hossain",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imran Hossain",
    description:
      "Research Associate at BIGD, BRAC University. Studying development economics, applied microeconomics, and political economy.",
    images: ["/og-image.jpg"],
    creator: "@ImranH_47",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${otJubilee.variable} ${ppNikkei.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white transition-colors duration-200">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
