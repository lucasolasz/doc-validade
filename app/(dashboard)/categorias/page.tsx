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
import { CategoriaDialog } from "./_components/categoria-dialog";
import { CategoriaActions } from "./_components/categoria-actions";

export default async function CategoriasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca todas as categorias
  const { data: categorias, error } = await supabase
    .from("categorias")
    .select("*")
    .order("descricao", { ascending: true });

  if (error) {
    console.error("Erro ao buscar categorias:", error);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Categorias de Estabelecimentos
        </h1>
        <CategoriaDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
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
            {categorias && categorias.length > 0 ? (
              categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">
                    {categoria.descricao}
                  </TableCell>
                  <TableCell className="text-right">
                    <CategoriaActions categoria={categoria} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma categoria cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
