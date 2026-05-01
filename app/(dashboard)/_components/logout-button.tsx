"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("nome")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar o perfil do usuário:", error.message);
        }

        if (profile?.nome) {
          // Pega apenas o primeiro nome do usuário para não ocupar muito espaço
          setUserName(profile.nome.split(" ")[0]);
        }
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      {userName && (
        <span className="text-sm text-muted-foreground">
          Olá,{" "}
          <strong className="text-foreground font-medium">{userName}</strong>
        </span>
      )}
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-1" />
        Sair
      </Button>
    </div>
  );
}
