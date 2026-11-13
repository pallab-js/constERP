"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-hairline bg-surface-indigo/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline bg-canvas text-ink"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="text-base font-bold text-blurple">ConstERP</div>
        <div className="h-10 w-10" aria-hidden="true" />
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r border-hairline bg-surface-indigo p-4 transition-transform duration-200 md:static md:translate-x-0 md:flex md:min-h-screen md:flex-col md:gap-1 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-2 flex items-center justify-between px-2 py-2 md:mb-1 md:py-3">
          <div className="text-lg font-bold text-blurple">ConstERP</div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-canvas text-ink md:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-blurple text-ink" : "text-ink-300 hover:bg-canvas hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
