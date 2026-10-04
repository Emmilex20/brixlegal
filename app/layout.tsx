import "./globals.css";
import "./consultation-success.css";
import "./client-access.css";

import type { Metadata } from "next";
import ClientAccessButton from "./components/ClientAccessButton";

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
      <body>
        {children}
        <ClientAccessButton />
      </body>
    </html>
  );
}
