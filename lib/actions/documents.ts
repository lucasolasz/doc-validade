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
    .order("data_validade", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);
  return data;
}

function sanitizeDocumentPayload(
  payload: DocumentInsert | DocumentUpdate,
): DocumentInsert | DocumentUpdate {
  const sanitized = { ...payload } as DocumentInsert | DocumentUpdate;
  if (sanitized.data_validade === "") {
    sanitized.data_validade = null;
  }
  if (sanitized.data_emissao === "") {
    sanitized.data_emissao = null;
  }
  return sanitized;
}

export async function createDocument(payload: DocumentInsert) {
  const supabase = await createClient();
  const sanitized = sanitizeDocumentPayload(payload);

  const { error } = await supabase.from("documents").insert(sanitized);

  if (error) throw new Error(error.message);
  revalidatePath(`/clientes/${payload.client_id}`);
}

export async function updateDocument(
  id: string,
  clientId: string,
  payload: DocumentUpdate,
) {
  const supabase = await createClient();
  const sanitized = sanitizeDocumentPayload(payload);

  const { error } = await supabase
    .from("documents")
    .update(sanitized)
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
  const sanitized = docs.map(sanitizeDocumentPayload);

  const { error } = await supabase.from("documents").upsert(sanitized);

  if (error) throw new Error(error.message);
  if (sanitized[0]?.client_id) revalidatePath(`/clientes/${sanitized[0].client_id}`);
}
