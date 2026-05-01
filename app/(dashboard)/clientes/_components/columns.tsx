"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ClientDialog } from "./client-dialog";
import { deleteClient } from "@/lib/actions/clients";
import type { Client } from "@/types/database.types";
import { toast } from "sonner";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
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

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ row }) => row.original.telefone ?? "—",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <RowActions client={row.original} />,
  },
];

function RowActions({ client }: { client: Client }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
      await deleteClient(client.id);
      toast.success("Cliente excluído");
    } catch {
      toast.error("Ocorreu um erro ao apagar o cliente");
    } finally {
      setDeleting(false); // Dica: use o finally para evitar repetir código
    }
  }
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(`/clientes/${client.id}`)}
        title="Ver documentos"
      >
        <FileText className="h-4 w-4" />
      </Button>
      <ClientDialog client={client} trigger={<Pencil className="h-4 w-4" />} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={deleting}>
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
              cliente {client.nome}.
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
