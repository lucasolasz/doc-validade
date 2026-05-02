"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const baseLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/categorias", label: "Categorias" },
  { href: "/tipodocumento", label: "Tipos de Documentos" },
];

export function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const [isDeveloper, setIsDeveloper] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("perfil")
          .eq("id", user.id)
          .single();

        if (profile?.perfil === "desenvolvedor") {
          setIsDeveloper(true);
        }
      }
    }
    checkUserRole();
  }, []);

  async function handleClick(href: string) {
    if (pathname === href) return;
    setLoadingHref(href);
    router.push(href);
    // limpa depois de um tempo para cobrir a transição
    setTimeout(() => setLoadingHref(null), 2000);
  }

  // Monta a lista de links final baseada no perfil
  const visibleLinks = [...baseLinks];
  if (isDeveloper) {
    visibleLinks.push({ href: "/usuarios", label: "Usuários" });
  }

  return (
    <div className="flex gap-1">
      {visibleLinks.map((link) => {
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
