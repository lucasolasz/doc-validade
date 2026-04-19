"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ClientDialog } from "./client-dialog";
import { deleteClient } from "@/lib/actions/clients";
import type { Client } from "@/types/database.types";
import { toast } from "sonner";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

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

  async function handleDelete() {
    if (
      !confirm(`Excluir ${client.nome}? Todos os documentos serão removidos.`)
    )
      return;
    try {
      await deleteClient(client.id);
      toast.success("Cliente excluído");
    } catch (err: any) {
      toast.error(err.message);
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
      <ClientDialog
        client={client}
        trigger={
          <Button variant="ghost" size="icon" title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        title="Excluir"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
