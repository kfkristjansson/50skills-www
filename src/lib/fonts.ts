import localFont from "next/font/local";
import { Work_Sans } from "next/font/google";

export const nohemi = localFont({
  src: [
    { path: "../fonts/Nohemi-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Nohemi-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Nohemi-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
