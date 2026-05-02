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
import { Pencil, Trash2, Check, X, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import type { Document } from "@/types/database.types";
import { Spinner } from "@/components/ui/spinner";
import { DocumentFileCell } from "./document-file-cell";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatDate, parseDate } from "@/lib/utils/dateUtil";

function toISO(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("sv-SE");
}

export function DocumentRow({
  doc,
  clientId,
  tiposDisponiveis,
}: {
  doc: Document;
  clientId: string;
  tiposDisponiveis?: { id: string; descricao: string }[];
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      numero: doc.numero,
      tipo: doc.tipo ?? "",
      data_emissao: doc.data_emissao ?? "",
      data_validade: doc.data_validade,
    },
  });

  const dataEmissao = watch("data_emissao");
  const dataValidade = watch("data_validade");

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
          <Select
            value={watch("tipo") || ""}
            onValueChange={(v) => setValue("tipo", v)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDisponiveis?.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                className="w-full justify-start text-left"
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
                onSelect={(date) => setValue("data_emissao", toISO(date))}
              />
            </PopoverContent>
          </Popover>
        </TableCell>

        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
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
                mode="single"
                captionLayout="dropdown"
                fromYear={1900}
                toYear={2200}
                selected={parseDate(dataValidade)}
                onSelect={(date) => setValue("data_validade", toISO(date))}
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
      <TableCell>
        {tiposDisponiveis?.find((t) => t.id === doc.tipo)?.descricao ||
          doc.tipo ||
          "—"}
      </TableCell>
      <TableCell>{formatDate(doc.data_emissao)}</TableCell>
      <TableCell>{formatDate(doc.data_validade)}</TableCell>
      <TableCell>
        <DocumentStatusBadge dataValidade={doc.data_validade} />
      </TableCell>
      <TableCell>
        <DocumentFileCell doc={doc} clientId={clientId} />
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                disabled={deleting}
                className="cursor-pointer"
              >
                {deleting ? (
                  <Spinner />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O documento será removido
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
