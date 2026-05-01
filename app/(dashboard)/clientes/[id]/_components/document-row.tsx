"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  documentSchema,
  type DocumentFormData,
} from "@/lib/validations/document";
import { updateDocument, deleteDocument } from "@/lib/actions/documents";
import { DocumentStatusBadge } from "./document-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/types/database.types";
import { Spinner } from "@/components/ui/spinner";
import { DocumentFileCell } from "./document-file-cell";

export function DocumentRow({
  doc,
  clientId,
}: {
  doc: Document;
  clientId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      numero: doc.numero,
      tipo: doc.tipo ?? "",
      data_emissao: doc.data_emissao ?? "",
      data_validade: doc.data_validade,
    },
  });

  async function handleSave(data: DocumentFormData) {
    try {
      await updateDocument(doc.id, clientId, data);
      toast.success("Documento atualizado!");
      setEditing(false);
    } catch {
      toast.error("Erro ao atualizar documento");
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir este documento?")) return;
    try {
      setDeleting(true);
      await deleteDocument(doc.id, clientId);
      toast.success("Documento excluído");
    } catch {
      toast.error("Erro ao excluir documento");
      setDeleting(false);
    }
  }

  function handleCancel() {
    reset();
    setEditing(false);
  }

  if (editing) {
    return (
      <TableRow className="bg-muted/30">
        <TableCell>
          <Input {...register("numero")} className="h-8" />
          {errors.numero && (
            <p className="text-xs text-destructive mt-1">
              {errors.numero.message}
            </p>
          )}
        </TableCell>
        <TableCell>
          <Input {...register("tipo")} className="h-8" />
          {errors.tipo && (
            <p className="text-xs text-destructive mt-1">
              {errors.tipo.message}
            </p>
          )}
        </TableCell>
        <TableCell>
          <Input type="date" {...register("data_emissao")} className="h-8" />
        </TableCell>
        <TableCell>
          <Input type="date" {...register("data_validade")} className="h-8" />
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
              onClick={handleSubmit(handleSave)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{doc.numero}</TableCell>
      <TableCell>{doc.tipo ?? "—"}</TableCell>
      <TableCell>{doc.data_emissao ?? "—"}</TableCell>
      <TableCell>{doc.data_validade}</TableCell>
      <TableCell>
        <DocumentStatusBadge dataValidade={doc.data_validade} />
      </TableCell>
      <TableCell>
        <DocumentFileCell doc={doc} clientId={clientId} /> {/* ← NOVO */}
      </TableCell>
      <TableCell>
        <div className="flex gap-1 justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer"
          >
            {deleting ? (
              <Spinner />
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
