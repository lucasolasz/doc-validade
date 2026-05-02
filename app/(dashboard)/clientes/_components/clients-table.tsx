"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import type { Client } from "@/types/database.types";

export function ClientsTable({ data }: { data: Client[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Maps populated from the server
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [totalByCategory, setTotalByCategory] = useState<
    Record<string, number>
  >({});
  const [registeredByClient, setRegisteredByClient] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    const supabase = createClient();

    const clientIds = data.map((c) => c.id);
    const categoriaIds = Array.from(
      new Set(data.map((c) => c.categoria_id).filter(Boolean) as string[]),
    );

    async function loadCounts() {
      try {
        // Load categories descriptions
        if (categoriaIds.length > 0) {
          const { data: cats } = await supabase
            .from("categorias")
            .select("id,descricao")
            .in("id", categoriaIds);
          const cMap: Record<string, string> = {};
          (cats || []).forEach((c: { id: string; descricao: string }) => {
            cMap[c.id] = c.descricao;
          });
          setCategoryMap(cMap);

          // Load associations to count tipos per category
          const { data: rels } = await supabase
            .from("categorias_tipos_documentos")
            .select("categoria_id,tipo_documento_id")
            .in("categoria_id", categoriaIds);
          const totals: Record<string, Set<string>> = {};
          (rels || []).forEach(
            (r: { categoria_id: string; tipo_documento_id: string }) => {
              totals[r.categoria_id] = totals[r.categoria_id] || new Set();
              totals[r.categoria_id].add(r.tipo_documento_id);
            },
          );
          const totalByCat: Record<string, number> = {};
          Object.keys(totals).forEach((k) => (totalByCat[k] = totals[k].size));
          setTotalByCategory(totalByCat);
        }

        // Load documents for these clients and count distinct tipos per client
        if (clientIds.length > 0) {
          const { data: docs } = await supabase
            .from("documents")
            .select("client_id,tipo")
            .in("client_id", clientIds);
          const reg: Record<string, Set<string>> = {};
          (docs || []).forEach(
            (d: { client_id: string; tipo: string | null }) => {
              if (!d.tipo) return;
              reg[d.client_id] = reg[d.client_id] || new Set();
              reg[d.client_id].add(d.tipo);
            },
          );
          const regCount: Record<string, number> = {};
          Object.keys(reg).forEach((k) => (regCount[k] = reg[k].size));
          setRegisteredByClient(regCount);
        }
      } catch (err) {
        console.error(
          "Erro ao carregar contagens de documentos/categorias:",
          err,
        );
      }
    }

    loadCounts();
  }, [data]);

  const enhancedColumns = useMemo(() => {
    // columns.tsx is expected to export columns in the order: nome, cnpj, telefone, actions
    // Use indices to avoid relying on ColumnDef internals like accessorKey.
    const nomeCol = columns[0] as ColumnDef<Client>;
    const cnpjCol = columns[1] as ColumnDef<Client>;
    const telefoneCol = columns[2] as ColumnDef<Client>;
    const actionsCol = columns[3] as ColumnDef<Client>;

    const categoriaCol: ColumnDef<Client> = {
      id: "categoria",
      header: "Categoria",
      cell: ({ row }) => {
        const catId = row.original.categoria_id;
        return catId ? (categoryMap[catId] ?? "—") : "—";
      },
    };

    const docsCol: ColumnDef<Client> = {
      id: "documentos",
      header: "Documentos",
      cell: ({ row }) => {
        const clientId = row.original.id;
        const catId = row.original.categoria_id;
        const registered = registeredByClient[clientId] ?? 0;
        const total = (catId && totalByCategory[catId]) || 0;
        return `${registered}/${total}`;
      },
    };

    return [
      nomeCol,
      categoriaCol,
      docsCol,
      cnpjCol,
      telefoneCol,
      actionsCol,
    ] as ColumnDef<Client>[];
  }, [categoryMap, registeredByClient, totalByCategory]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar por nome, CNPJ ou telefone..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
