import { getClientById } from "@/lib/actions/clients";
import { getDocumentsByClient } from "@/lib/actions/documents";
import { ClientHeader } from "./_components/client-header";
import { DocumentsTable } from "./_components/documents-table";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>; // ← Promise aqui
}

export default async function ClientePage({ params }: Props) {
  const { id } = await params; // ← await aqui

  const [client, documents] = await Promise.all([
    getClientById(id).catch(() => null),
    getDocumentsByClient(id),
  ]);

  if (!client) notFound();

  return (
    <div className="space-y-8">
      <ClientHeader client={client} />
      <DocumentsTable documents={documents} clientId={client.id} />
    </div>
  );
}
