import * as z from "zod";

export const categoriaSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória"),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;
