import * as z from "zod";

export const tipoDocumentoSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória"),
});

export type TipoDocumentoFormData = z.infer<typeof tipoDocumentoSchema>;
