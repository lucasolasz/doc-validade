"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
];

export function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  async function handleClick(href: string) {
    if (pathname === href) return;
    setLoadingHref(href);
    router.push(href);
    // limpa depois de um tempo para cobrir a transição
    setTimeout(() => setLoadingHref(null), 2000);
  }

  return (
    <div className="flex gap-1">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const isLoading = loadingHref === link.href;

        return (
          <button
            key={link.href}
            onClick={() => handleClick(link.href)}
            className={cn(
              "text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 cursor-pointer",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {isLoading && <Spinner className="size-3" />}
            {link.label}
          </button>
        );
      })}
    </div>
  );
}
