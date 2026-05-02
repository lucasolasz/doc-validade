"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type CategoriaFormData } from "@/lib/validations/categoria";

export async function createCategoria(data: CategoriaFormData) {
  const supabase = await createClient();

  const { data: catData, error } = await supabase
    .from("categorias")
    .insert([
      {
        descricao: data.descricao,
      },
    ])
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Insere as associações na tabela Pivot
  if (data.tipos_documentos && data.tipos_documentos.length > 0) {
    const associacoes = data.tipos_documentos.map((tipoId) => ({
      categoria_id: catData.id,
      tipo_documento_id: tipoId,
    }));
    const { error: errorAssoc } = await supabase
      .from("categorias_tipos_documentos")
      .insert(associacoes);
    if (errorAssoc) throw new Error(errorAssoc.message);
  }

  revalidatePath("/categorias");
}

export async function updateCategoria(id: string, data: CategoriaFormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categorias")
    .update({ descricao: data.descricao })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Limpa associações antigas
  await supabase
    .from("categorias_tipos_documentos")
    .delete()
    .eq("categoria_id", id);

  // Cria as novas associações selecionadas no formulário
  if (data.tipos_documentos && data.tipos_documentos.length > 0) {
    const associacoes = data.tipos_documentos.map((tipoId) => ({
      categoria_id: id,
      tipo_documento_id: tipoId,
    }));
    const { error: errorAssoc } = await supabase
      .from("categorias_tipos_documentos")
      .insert(associacoes);
    if (errorAssoc) throw new Error(errorAssoc.message);
  }

  revalidatePath("/categorias");
}

export async function deleteCategoria(id: string) {
  const supabase = await createClient();
  // O ON DELETE CASCADE no banco apagará da tabela de associação automaticamente
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/categorias");
}
