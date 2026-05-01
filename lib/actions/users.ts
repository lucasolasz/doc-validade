"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { UserFormData } from "../validations/user";

// Usamos o Service Role Key para ignorar o Auth normal e RLS
// Assim, conseguimos criar usuários sem sobrescrever a sessão do Admin logado.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function createUserAdmin(data: UserFormData) {
  // 1. Cria o usuário no auth.users do Supabase
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Insere os dados complementares na nossa tabela profiles
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: authData.user.id,
    nome: data.nome,
    perfil: data.perfil,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/usuarios");
}

export async function updateUserAdmin(id: string, data: UserFormData) {
  // 1. Prepara a atualização da autenticação (apenas atualiza a senha se ela for preenchida)
  const authUpdates: { email?: string; password?: string } = {
    email: data.email,
  };

  if (data.password && data.password.trim() !== "") {
    authUpdates.password = data.password;
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    id,
    authUpdates,
  );

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Atualiza os dados complementares na tabela profiles
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      nome: data.nome,
      perfil: data.perfil,
    })
    .eq("id", id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/usuarios");
}

export async function deleteUserAdmin(id: string) {
  // Remove o perfil (caso não haja ON DELETE CASCADE configurado no banco)
  await supabaseAdmin.from("profiles").delete().eq("id", id);

  // Remove o usuário do auth do Supabase
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (authError) {
    throw new Error(authError.message);
  }

  revalidatePath("/usuarios");
}
