import type { Metadata } from "next";
import { nohemi, workSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "50skills — AI-Powered HR Workflow Automation",
  description:
    "Describe your HR workflow in plain language. 50skills turns it into an automated employee process in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nohemi.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
