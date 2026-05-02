import { Button } from "@/components/ui/button";
import type { Client } from "@/types/database.types";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { ClientDialog } from "../../_components/client-dialog";

export function ClientHeader({
  client,
}: {
  client: Client & { categoria_descricao?: string | null };
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{client.nome}</h1>
          <p className="text-sm text-muted-foreground">
            CNPJ: {client.cnpj}
            {client.telefone && ` · Tel: ${client.telefone}`}
            {client.categoria_descricao &&
              ` · Categoria: ${client.categoria_descricao}`}
          </p>
        </div>
      </div>
      <ClientDialog
        client={client}
        trigger={
          <span className="flex items-center bg-yellow-400 text-black gap-1 px-4 py-2 rounded-full">
            <Pencil size={15} /> Editar cliente
          </span>
        }
      />
    </div>
  );
}
