import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import { UserDialog } from "./_components/user-dialog";
import { UserActions } from "./_components/user-actions";
import { redirect } from "next/navigation";

export default async function UsuariosPage() {
  const supabase = await createClient();

  // Obtém o usuário logado atualmente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca o perfil do usuário logado para verificar a permissão
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("perfil")
    .eq("id", user.id)
    .single();

  if (currentUserProfile?.perfil !== "desenvolvedor") {
    redirect("/"); // Redireciona caso não tenha o perfil de desenvolvedor
  }

  // Cria o client com poderes de Admin para acessar a lista de usuários da Auth
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Busca todos os perfis e relaciona de maneira customizada caso necessário
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar usuários:", error);
  }

  // Busca todos os usuários cadastrados na autenticação do Supabase
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000, // Previne que falte usuários caso tenha mais de 50 cadastrados
    });

  if (authError) {
    console.error("Erro ao buscar emails da auth:", authError);
  }

  // Mescla as informações de 'profiles' com o 'email' correspondente encontrado no 'auth.users'
  const profilesWithEmail = profiles?.map((profile) => {
    const authUser = authData?.users.find((u) => u.id === profile.id);
    return {
      ...profile,
      email: authUser?.email || "",
    };
  });

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Usuários do Sistema
        </h1>
        <UserDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          }
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profilesWithEmail?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="font-medium">{profile.nome}</TableCell>
                <TableCell className="capitalize">{profile.perfil}</TableCell>
                <TableCell className="text-right">
                  <UserActions user={profile} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
