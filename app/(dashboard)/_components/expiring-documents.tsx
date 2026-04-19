"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentStatusBadge } from "@/app/(dashboard)/clientes/[id]/_components/document-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import type { DocumentWithStatus } from "@/types/database.types";

const statusRowColor: Record<string, string> = {
  expired: "bg-red-50 hover:bg-red-100",
  critical: "bg-orange-50 hover:bg-orange-100",
  warning: "bg-yellow-50 hover:bg-yellow-100",
  ok: "hover:bg-muted/50",
};

interface ExpiringDocumentsProps {
  documents: DocumentWithStatus[];
  activeStatus?: string;
}

export function ExpiringDocuments({
  documents,
  activeStatus,
}: ExpiringDocumentsProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const statusFilters = [
    { key: "", label: "Todos" },
    { key: "expired", label: "Vencidos" },
    { key: "critical", label: "Críticos" },
    { key: "warning", label: "A vencer" },
    { key: "ok", label: "Válidos" },
  ];

  const filtered = documents.filter((doc) => {
    const matchSearch =
      doc.client_nome.toLowerCase().includes(search.toLowerCase()) ||
      doc.numero.toLowerCase().includes(search.toLowerCase()) ||
      (doc.tipo ?? "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = !activeStatus || doc.status === activeStatus;

    return matchSearch && matchStatus;
  });

  function handleStatusFilter(key: string) {
    if (key) {
      router.push(`/?status=${key}`);
    } else {
      router.push("/");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="Buscar por cliente, número ou tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((doc) => (
                <TableRow
                  key={doc.id}
                  className={`cursor-pointer ${statusRowColor[doc.status]}`}
                  onClick={() => router.push(`/clientes/${doc.client_id}`)}
                >
                  <TableCell className="font-medium">
                    {doc.client_nome}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {doc.client_cnpj}
                  </TableCell>
                  <TableCell>{doc.numero}</TableCell>
                  <TableCell>{doc.tipo ?? "—"}</TableCell>
                  <TableCell>{doc.data_validade}</TableCell>
                  <TableCell>
                    <DocumentStatusBadge dataValidade={doc.data_validade} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum documento encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Mostrando {filtered.length} de {documents.length} documentos
      </p>
    </div>
  );
}
