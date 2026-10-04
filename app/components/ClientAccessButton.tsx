"use client";

import { CalendarCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientAccessButton() {
  const pathname = usePathname();

  // The tracking page already contains the full client-access interface.
  if (pathname === "/consultation/status" || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href="/consultation/status"
      className="client-access-fab"
      aria-label="Track an existing consultation"
    >
      <span className="client-access-fab__icon" aria-hidden="true">
        <CalendarCheck size={18} strokeWidth={1.8} />
      </span>
      <span className="client-access-fab__copy">
        <small>Already booked?</small>
        <strong>Track consultation</strong>
      </span>
      <ChevronRight className="client-access-fab__arrow" size={16} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}
