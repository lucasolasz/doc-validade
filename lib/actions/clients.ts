"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ClientInsert, ClientUpdate } from "@/types/database.types";
import { createClientFolder } from "./upload";

export async function getClients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getClientById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createClient_(payload: ClientInsert) {
  const supabase = await createClient();

  // Cria a pasta no Drive com o nome do cliente
  let drive_folder_id: string | null = null;
  try {
    drive_folder_id = await createClientFolder(payload.nome);
  } catch {
    // Se falhar no Drive não bloqueia o cadastro
    console.error("Erro ao criar pasta no Drive");
  }

  const { error } = await supabase
    .from("clients")
    .insert({ ...payload, drive_folder_id });

  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}

export async function updateClient(id: string, payload: ClientUpdate) {
  const supabase = await createClient();

  const { error } = await supabase.from("clients").update(payload).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}

export async function deleteClient(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}
