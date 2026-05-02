"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type TipoDocumentoFormData } from "@/lib/validations/tipo-documento";

export async function createTipoDocumento(data: TipoDocumentoFormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("tipos_documentos").insert([
    {
      descricao: data.descricao,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath("/tipos-documentos");
}

export async function updateTipoDocumento(
  id: string,
  data: TipoDocumentoFormData,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tipos_documentos")
    .update({ descricao: data.descricao })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/tipos-documentos");
}

export async function deleteTipoDocumento(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tipos_documentos")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/tipos-documentos");
}
