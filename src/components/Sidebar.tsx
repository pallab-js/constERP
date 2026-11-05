"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/clients", label: "Clients" },
  { href: "/vendors", label: "Vendors" },
  { href: "/estimates", label: "Estimates" },
  { href: "/materials", label: "Materials" },
  { href: "/purchase-orders", label: "Purchase Orders" },
  { href: "/invoices", label: "Invoices" },
  { href: "/expenses", label: "Expenses" },
  { href: "/workers", label: "Workers" },
  { href: "/attendance", label: "Attendance" },
  { href: "/equipment", label: "Equipment" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 bg-surface-indigo border-r border-hairline p-4 flex flex-col gap-1">
      <div className="px-2 py-3 text-lg font-bold text-blurple">ConstERP</div>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-2 rounded-md text-sm ${
              active ? "bg-blurple text-ink" : "text-ink-300 hover:bg-canvas"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </aside>
  );
}
