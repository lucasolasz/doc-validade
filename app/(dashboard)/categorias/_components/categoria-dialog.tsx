"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategoria, updateCategoria } from "@/lib/actions/categorias";
import type { CategoriaFormData } from "@/lib/validations/categoria";
import { useState } from "react";
import { toast } from "sonner";
import { CategoriaForm } from "./categoria-form";

interface CategoriaDialogProps {
  categoria?: {
    id: string;
    descricao: string;
  };
  trigger: React.ReactNode;
}

export function CategoriaDialog({ categoria, trigger }: CategoriaDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!categoria;

  async function handleSubmit(data: CategoriaFormData) {
    try {
      if (isEditing && categoria) {
        await updateCategoria(categoria.id, data);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createCategoria(data);
        toast.success("Categoria criada com sucesso!");
      }
      setOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Erro ao salvar a categoria");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={
          isEditing ? "Editar categoria" : "Adicionar uma nova categoria"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <CategoriaForm
          defaultValues={
            categoria ? { descricao: categoria.descricao } : undefined
          }
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
