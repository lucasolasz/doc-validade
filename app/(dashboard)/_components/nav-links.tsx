"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm px-3 py-1.5 rounded-md transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
