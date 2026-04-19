import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NavLinks } from "./_components/nav-links";
import { LogoutButton } from "./_components/logout-button";

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
        <span className="font-semibold text-sm">Controle de Documentos</span>
        <div className="flex items-center gap-4">
          <NavLinks />
          <LogoutButton />
        </div>
      </nav>
      <main className="px-6 py-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
