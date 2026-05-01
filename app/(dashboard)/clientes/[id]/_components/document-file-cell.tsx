"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { deleteFileFromDrive, uploadFileToDrive } from "@/lib/actions/upload";
import type { Document } from "@/types/database.types";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface DocumentFileCellProps {
  doc: Document;
  clientId: string;
}

export function DocumentFileCell({ doc, clientId }: DocumentFileCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return "Erro inesperado";
  }

  function handleUploadClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentId", doc.id);
    formData.append("clientId", clientId);

    startTransition(async () => {
      try {
        await uploadFileToDrive(formData);
        toast.success("Arquivo enviado com sucesso!");
      } catch (err: unknown) {
        console.log(getErrorMessage(err));
        toast.error("Erro ao enviar arquivo");
      } finally {
        // Limpa o input para permitir re-upload do mesmo arquivo
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Remover o arquivo deste documento?")) return;
    try {
      setIsDeleting(true);
      await deleteFileFromDrive(doc.id, clientId);
      toast.success("Arquivo removido");
    } catch (err: unknown) {
      console.log(getErrorMessage(err));
      toast.error("Erro ao remover arquivo");
    } finally {
      setIsDeleting(false);
    }
  }

  // Tem arquivo vinculado
  if (doc.file_url && doc.file_name) {
    return (
      <div className="flex items-center gap-1">
        {/* Nome do arquivo truncado */}
        <span
          className="text-xs text-muted-foreground max-w-[120px] truncate"
          title={doc.file_name}
        >
          <FileText className="inline h-3 w-3 mr-1" />
          {doc.file_name}
        </span>

        {/* Download */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          asChild
          title="Baixar arquivo"
        >
          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
            <Download className="h-3.5 w-3.5 text-blue-600" />
          </a>
        </Button>

        {/* Substituir arquivo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleUploadClick}
          disabled={isPending}
          title="Substituir arquivo"
        >
          {isPending ? (
            <Spinner className="size-3" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
        </Button>

        {/* Remover arquivo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Remover arquivo"
        >
          {isDeleting ? (
            <Spinner className="size-3" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          )}
        </Button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
      </div>
    );
  }

  // Sem arquivo — mostra botão de upload
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground gap-1.5"
        onClick={handleUploadClick}
        disabled={isPending}
        title="Enviar arquivo"
      >
        {isPending ? (
          <>
            <Spinner className="size-3" /> Enviando...
          </>
        ) : (
          <>
            <Upload className="h-3.5 w-3.5" /> Anexar
          </>
        )}
      </Button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
    </div>
  );
}
