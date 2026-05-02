"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { deleteCategoria } from "@/lib/actions/categorias";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoriaDialog } from "./categoria-dialog";

interface CategoriaActionsProps {
  categoria: {
    id: string;
    descricao: string;
  };
}

export function CategoriaActions({ categoria }: CategoriaActionsProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteCategoria(categoria.id);
      toast.success("Categoria excluída com sucesso");
    } catch {
      toast.error("Ocorreu um erro ao excluir a categoria");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex justify-end gap-1">
      <CategoriaDialog
        categoria={categoria}
        trigger={
          <Button variant="ghost" size="icon" title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Excluir"
            disabled={deleting}
          >
            {deleting ? (
              <Spinner />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              categoria <strong>{categoria.descricao}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
