"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ClientInsert, ClientUpdate } from "@/types/database.types";

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

  const { error } = await supabase.from("clients").insert(payload);

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
