"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentStatusBadge } from "@/app/(dashboard)/clientes/[id]/_components/document-status-badge";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import type { DocumentWithStatus } from "@/types/database.types";
import { formatDate } from "@/lib/utils/dateUtil";

const statusRowColor: Record<string, string> = {
  expired: "bg-red-50 hover:bg-red-100 cursor-pointer",
  critical: "bg-orange-50 hover:bg-orange-100 cursor-pointer",
  warning: "bg-yellow-50 hover:bg-yellow-100 cursor-pointer",
  ok: "hover:bg-muted/50 cursor-pointer",
};

interface ExpiringDocumentsProps {
  documents: DocumentWithStatus[];
  activeStatus?: string;
}

export function ExpiringDocuments({
  documents,
  activeStatus,
}: ExpiringDocumentsProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();

  const statusFilters = [
    { key: "", label: "Todos" },
    { key: "expired", label: "Vencidos" },
    { key: "critical", label: "Críticos" },
    { key: "warning", label: "A vencer" },
    { key: "ok", label: "Válidos" },
  ];

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchStatus = !activeStatus || doc.status === activeStatus;
      return matchStatus;
    });
  }, [documents, activeStatus]);

  const columns: ColumnDef<DocumentWithStatus>[] = useMemo(
    () => [
      {
        accessorKey: "client_nome",
        header: "Cliente",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.client_nome}</span>
        ),
      },
      {
        accessorKey: "client_cnpj",
        header: "CNPJ",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.client_cnpj}
          </span>
        ),
      },
      {
        accessorKey: "numero",
        header: "Documento",
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
        cell: ({ row }) => row.original.tipo ?? "—",
      },
      {
        accessorKey: "data_validade",
        header: "Validade",
        cell: ({ row }) => formatDate(row.original.data_validade),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <DocumentStatusBadge dataValidade={row.original.data_validade} />
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  function handleStatusFilter(key: string) {
    router.push(key ? `/?status=${key}` : "/");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Buscar por cliente, número ou tipo..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={
                activeStatus === f.key || (!activeStatus && f.key === "")
                  ? "default"
                  : "outline"
              }
              onClick={() => handleStatusFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

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
                <TableRow
                  key={row.id}
                  className={statusRowColor[row.original.status]}
                  onClick={() =>
                    router.push(`/clientes/${row.original.client_id}`)
                  }
                >
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
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum documento encontrado
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
