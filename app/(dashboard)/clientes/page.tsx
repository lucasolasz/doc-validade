import { getClients } from "@/lib/actions/clients";
import { Plus } from "lucide-react";
import { ClientDialog } from "./_components/client-dialog";
import { ClientsTable } from "./_components/clients-table";

export default async function ClientesPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-muted-foreground text-sm">
            {clients.length} cadastrado(s)
          </p>
        </div>
        <ClientDialog
          trigger={
            <span className="flex items-center bg-black text-white gap-1 px-4 py-2 rounded-full">
              <Plus size={15} /> Novo cliente
            </span>
          }
        />
      </div>

      <ClientsTable data={clients} />
    </div>
  );
}
