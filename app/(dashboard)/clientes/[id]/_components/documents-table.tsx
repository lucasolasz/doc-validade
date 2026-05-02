"use client";

import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createDocument } from "@/lib/actions/documents";
import {
  documentSchema,
  type DocumentFormData,
} from "@/lib/validations/document";
import type { Document } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Check, Plus, X, CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DocumentRow } from "./document-row";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { parseDate } from "@/lib/utils/dateUtil";

function toISO(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("sv-SE");
}

interface DocumentsTableProps {
  documents: Document[];
  clientId: string;
}

export function DocumentsTable({ documents, clientId }: DocumentsTableProps) {
  const [addingNew, setAddingNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      numero: "",
      tipo: "",
      data_emissao: "",
      data_validade: "",
    },
  });

  const dataEmissao = watch("data_emissao");
  const dataValidade = watch("data_validade");

  // Colunas dummy só para o TanStack Table funcionar com paginação
  // A renderização real é feita pelo DocumentRow
  const columns: ColumnDef<Document>[] = useMemo(
    () => [
      { accessorKey: "numero" },
      { accessorKey: "tipo" },
      { accessorKey: "data_emissao" },
      { accessorKey: "data_validade" },
    ],
    [],
  );

  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  async function handleAddNew(data: DocumentFormData) {
    try {
      await createDocument({ ...data, client_id: clientId });
      toast.success("Documento adicionado!");
      reset();
      setAddingNew(false);
    } catch {
      toast.error("Erro ao adicionar Documento");
    }
  }

  function handleCancelNew() {
    reset();
    setAddingNew(false);
  }

  // Pega os documentos da página atual pelo índice
  const paginatedDocs = table.getRowModel().rows.map((row) => row.original);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documentos</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddingNew(true)}
          disabled={addingNew}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar documento
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arquivo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {addingNew && (
              <TableRow className="bg-muted/30">
                <TableCell>
                  <Input
                    {...register("numero")}
                    placeholder="Ex: 12345"
                    className="h-8"
                  />
                  {errors.numero && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.numero.message}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    {...register("tipo")}
                    placeholder="Ex: Alvará"
                    className="h-8"
                  />
                  {errors.tipo && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.tipo.message}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-8 px-3 ${!dataEmissao && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEmissao
                          ? format(parseDate(dataEmissao)!, "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        fromYear={1900}
                        toYear={2200}
                        mode="single"
                        captionLayout="dropdown"
                        selected={parseDate(dataEmissao)}
                        onSelect={(date) =>
                          setValue("data_emissao", toISO(date))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-8 px-3 ${!dataValidade && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataValidade
                          ? format(parseDate(dataValidade)!, "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        fromYear={1900}
                        toYear={2200}
                        mode="single"
                        captionLayout="dropdown"
                        selected={parseDate(dataValidade)}
                        onSelect={(date) =>
                          setValue("data_validade", toISO(date))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.data_validade && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.data_validade.message}
                    </p>
                  )}
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSubmit(handleAddNew)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner />
                      ) : (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelNew}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {paginatedDocs.length > 0
              ? paginatedDocs.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} clientId={clientId} />
                ))
              : !addingNew && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum documento cadastrado. Clique em + Adicionar
                      documento para começar.
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
