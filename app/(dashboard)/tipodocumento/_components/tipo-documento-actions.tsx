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
import { deleteTipoDocumento } from "@/lib/actions/tipos-documentos";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TipoDocumentoDialog } from "./tipo-documento-dialog";

interface TipoDocumentoActionsProps {
  tipoDocumento: {
    id: string;
    descricao: string;
  };
}

export function TipoDocumentoActions({
  tipoDocumento,
}: TipoDocumentoActionsProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteTipoDocumento(tipoDocumento.id);
      toast.success("Tipo de documento excluído com sucesso");
    } catch {
      toast.error("Ocorreu um erro ao excluir o tipo de documento");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex justify-end gap-1">
      <TipoDocumentoDialog
        tipoDocumento={tipoDocumento}
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              tipo de documento <strong>{tipoDocumento.descricao}</strong>.
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
