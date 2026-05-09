import { z } from "zod";

export const documentSchema = z
  .object({
    numero: z.string().min(1, "Número obrigatório"),
    tipo: z.string().min(1, "Tipo obrigatório"),
    data_emissao: z.string().optional(),
    data_validade: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.data_emissao || !data.data_validade) return true;
      return new Date(data.data_emissao) < new Date(data.data_validade);
    },
    {
      message: "Data de emissão deve ser anterior à validade",
      path: ["data_emissao"],
    },
  );

export type DocumentFormData = z.infer<typeof documentSchema>;
