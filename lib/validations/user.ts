import { z } from "zod";

export const userSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  perfil: z.enum(["admin", "viewer"], {
    required_error: "Selecione um perfil",
  }),
});

export type UserFormData = z.infer<typeof userSchema>;
