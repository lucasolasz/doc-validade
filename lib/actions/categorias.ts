"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type CategoriaFormData } from "@/lib/validations/categoria";

export async function createCategoria(data: CategoriaFormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("categorias").insert([
    {
      descricao: data.descricao,
    },
  ]);

  if (error) throw new Error(error.message);

  revalidatePath("/categorias");
}

export async function updateCategoria(id: string, data: CategoriaFormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categorias")
    .update({ descricao: data.descricao })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/categorias");
}

export async function deleteCategoria(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/categorias");
}
