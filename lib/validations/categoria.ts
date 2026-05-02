import * as z from "zod";

export const categoriaSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória"),
  tipos_documentos: z.array(z.string()).optional(),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;
