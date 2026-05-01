"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createUserAdmin, updateUserAdmin } from "@/lib/actions/users";
import type { UserFormData } from "@/lib/validations/user";
import { useState } from "react";
import { toast } from "sonner";
import { UserForm } from "./user-form";

interface UserDialogProps {
  user?: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
  trigger: React.ReactNode;
}

export function UserDialog({ user, trigger }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!user;

  async function handleSubmit(data: UserFormData) {
    try {
      if (isEditing) {
        await updateUserAdmin(user.id, data);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUserAdmin(data);
        toast.success("Usuário criado com sucesso!");
      }
      setOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Erro ao salvar usuário");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={
          isEditing ? "Editar usuário" : "Adicionar um novo usuário"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={
            user
              ? {
                  nome: user.nome,
                  email: user.email,
                  perfil: user.perfil as UserFormData["perfil"],
                }
              : undefined
          }
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
