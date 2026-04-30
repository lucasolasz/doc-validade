"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientForm } from "./client-form";
import { createClient_, updateClient } from "@/lib/actions/clients";
import type { Client } from "@/types/database.types";
import type { ClientFormData } from "@/lib/validations/client";
import { toast } from "sonner";

interface ClientDialogProps {
  client?: Client; // se vier, é edição; se não, é criação
  trigger?: React.ReactNode;
}

export function ClientDialog({ client, trigger }: ClientDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!client;

  async function handleSubmit(data: ClientFormData) {
    try {
      if (isEditing) {
        await updateClient(client.id, data);
        toast.success("Cliente atualizado!");
      } else {
        await createClient_(data);
        toast.success("Cliente criado!");
      }
      setOpen(false);
    } catch {
      toast.error("Erro ao salvar cliente");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent aria-describedby="Editar ou adicionar um novo cliente">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
        </DialogHeader>
        <ClientForm
          defaultValues={client}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
