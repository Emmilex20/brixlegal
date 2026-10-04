import "./globals.css";
import "./consultation-success.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brix Legal Practice & Consultancy — For Seamless Legal Practice",
  description:
    "A multidisciplinary law firm delivering detail-driven corporate, commercial and compliance counsel to local and international clients.",
  icons: {
    icon: "/brix-legal-emblem.webp",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
