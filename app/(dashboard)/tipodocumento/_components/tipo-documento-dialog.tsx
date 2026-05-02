"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createTipoDocumento,
  updateTipoDocumento,
} from "@/lib/actions/tipos-documentos";
import type { TipoDocumentoFormData } from "@/lib/validations/tipo-documento";
import { useState } from "react";
import { toast } from "sonner";
import { TipoDocumentoForm } from "./tipo-documento-form";

interface TipoDocumentoDialogProps {
  tipoDocumento?: {
    id: string;
    descricao: string;
  };
  trigger: React.ReactNode;
}

export function TipoDocumentoDialog({
  tipoDocumento,
  trigger,
}: TipoDocumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!tipoDocumento;

  async function handleSubmit(data: TipoDocumentoFormData) {
    try {
      if (isEditing && tipoDocumento) {
        await updateTipoDocumento(tipoDocumento.id, data);
        toast.success("Tipo de documento atualizado com sucesso!");
      } else {
        await createTipoDocumento(data);
        toast.success("Tipo de documento criado com sucesso!");
      }
      setOpen(false);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || "Erro ao salvar o tipo de documento",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={
          isEditing
            ? "Editar tipo de documento"
            : "Adicionar um novo tipo de documento"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tipo de Documento" : "Novo Tipo de Documento"}
          </DialogTitle>
        </DialogHeader>
        <TipoDocumentoForm
          defaultValues={
            tipoDocumento ? { descricao: tipoDocumento.descricao } : undefined
          }
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
