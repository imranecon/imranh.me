import localFont from "next/font/local";

export const otJubilee = localFont({
  src: [
    {
      path: "./fonts/OTJubilee-DiamondMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OTJubilee-DiamondMediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const ppNikkei = localFont({
  src: [
    {
      path: "./fonts/PPNikkeiJournal-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/PPNikkeiJournal-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});
