import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIITech - AI-Native Automation & PSA Platform",
  description: "Converting mid-market service firms into pilot customers through vertical-specific automation solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
