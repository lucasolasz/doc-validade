import { z } from "zod";

function cleanCNPJ(cnpj: string) {
  return cnpj.replace(/\D/g, "");
}

function validateCNPJ(cnpj: string): boolean {
  const c = cleanCNPJ(cnpj);
  if (c.length !== 14) return false;
  if (/^(\d)\1+$/.test(c)) return false; // bloqueia 00000000000000

  const calc = (c: string, len: number) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(c[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  return calc(c, 12) === parseInt(c[12]) && calc(c, 13) === parseInt(c[13]);
}

export const clientSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  cnpj: z
    .string()
    .min(1, "CNPJ obrigatório")
    .refine((v) => validateCNPJ(v), "CNPJ inválido"),
  telefone: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
