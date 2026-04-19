import { ClientDialog } from "../../_components/client-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import type { Client } from "@/types/database.types";

export function ClientHeader({ client }: { client: Client }) {
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
          </p>
        </div>
      </div>
      <ClientDialog
        client={client}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            Editar cliente
          </Button>
        }
      />
    </div>
  );
}
