"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DocumentInsert, DocumentUpdate } from "@/types/database.types";

export async function getDocumentsByClient(clientId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", clientId)
    .order("data_validade", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createDocument(payload: DocumentInsert) {
  const supabase = await createClient();

  const { error } = await supabase.from("documents").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath(`/clientes/${payload.client_id}`);
}

export async function updateDocument(
  id: string,
  clientId: string,
  payload: DocumentUpdate,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("documents")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/clientes/${clientId}`);
}

export async function deleteDocument(id: string, clientId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/clientes/${clientId}`);
}

export async function upsertDocuments(docs: DocumentInsert[]) {
  const supabase = await createClient();

  const { error } = await supabase.from("documents").upsert(docs);

  if (error) throw new Error(error.message);
  if (docs[0]?.client_id) revalidatePath(`/clientes/${docs[0].client_id}`);
}
