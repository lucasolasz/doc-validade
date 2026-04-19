"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  documentSchema,
  type DocumentFormData,
} from "@/lib/validations/document";
import { createDocument } from "@/lib/actions/documents";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/types/database.types";

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

  async function handleAddNew(data: DocumentFormData) {
    try {
      await createDocument({ ...data, client_id: clientId });
      toast.success("Documento adicionado!");
      reset();
      setAddingNew(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function handleCancelNew() {
    reset();
    setAddingNew(false);
  }

  return (
    <div className="space-y-3">
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
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Linha de novo documento */}
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
                  <Input
                    type="date"
                    {...register("data_emissao")}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    {...register("data_validade")}
                    className="h-8"
                  />
                  {errors.data_validade && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.data_validade.message}
                    </p>
                  )}
                </TableCell>
                <TableCell />
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSubmit(handleAddNew)}
                      disabled={isSubmitting}
                    >
                      <Check className="h-4 w-4 text-green-600" />
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

            {/* Linhas existentes */}
            {documents.length > 0
              ? documents.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} clientId={clientId} />
                ))
              : !addingNew && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
    </div>
  );
}
