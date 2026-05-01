"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createUserAdmin } from "@/lib/actions/users";
import type { UserFormData } from "@/lib/validations/user";
import { useState } from "react";
import { toast } from "sonner";
import { UserForm } from "./user-form";

interface UserDialogProps {
  trigger: React.ReactNode;
}

export function UserDialog({ trigger }: UserDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: UserFormData) {
    try {
      await createUserAdmin(data);
      toast.success("Usuário criado com sucesso!");
      setOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Erro ao salvar usuário");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby="Adicionar um novo usuário">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
