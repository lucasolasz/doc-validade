import { getClients } from "@/lib/actions/clients";
import { ClientsTable } from "./_components/clients-table";
import { ClientDialog } from "./_components/client-dialog";

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
        <ClientDialog />
      </div>

      <ClientsTable data={clients} />
    </div>
  );
}
