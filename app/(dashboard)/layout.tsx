import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">Controle de Documentos</span>
        <div className="flex gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          <a
            href="/clientes"
            className="text-muted-foreground hover:text-foreground"
          >
            Clientes
          </a>
          <a
            href="/documentos"
            className="text-muted-foreground hover:text-foreground"
          >
            Documentos
          </a>
        </div>
      </nav>
      <main className="px-6 py-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
