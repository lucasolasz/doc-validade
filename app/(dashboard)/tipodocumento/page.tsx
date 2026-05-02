import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

import { redirect } from "next/navigation";
import { TipoDocumentoDialog } from "./_components/tipo-documento-dialog";
import { TipoDocumentoActions } from "./_components/tipo-documento-actions";

export default async function TiposDocumentosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca todos os tipos de documentos
  const { data: tiposDocumentos, error } = await supabase
    .from("tipos_documentos")
    .select("*")
    .order("descricao", { ascending: true });

  if (error) {
    console.error("Erro ao buscar tipos de documentos:", error);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Tipos de Documentos
        </h1>
        <TipoDocumentoDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo
            </Button>
          }
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiposDocumentos && tiposDocumentos.length > 0 ? (
              tiposDocumentos.map((tipo) => (
                <TableRow key={tipo.id}>
                  <TableCell className="font-medium">
                    {tipo.descricao}
                  </TableCell>
                  <TableCell className="text-right">
                    <TipoDocumentoActions tipoDocumento={tipo} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum tipo de documento cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
