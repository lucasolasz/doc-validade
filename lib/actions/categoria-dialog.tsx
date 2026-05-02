"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategoria, updateCategoria } from "@/lib/actions/categorias";
import type { CategoriaFormData } from "@/lib/validations/categoria";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CategoriaForm } from "./categoria-form";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

interface CategoriaDialogProps {
  categoria?: {
    id: string;
    descricao: string;
  };
  trigger: React.ReactNode;
}

export function CategoriaDialog({ categoria, trigger }: CategoriaDialogProps) {
  const [open, setOpen] = useState(false);
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!categoria;

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen && isEditing) {
      setLoading(true);
    } else if (!isOpen) {
      setTiposSelecionados([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    if (open && isEditing && categoria) {
      const catId = categoria.id; // Guarda o ID para evitar erro de escopo do TypeScript
      const fetchRelacoes = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("categorias_tipos_documentos")
            .select("tipo_documento_id")
            .eq("categoria_id", catId);

          if (error) throw error;
          if (isMounted && data) {
            setTiposSelecionados(
              data.map(
                (d: { tipo_documento_id: string }) => d.tipo_documento_id,
              ),
            );
          }
        } catch (err) {
          console.error("Erro ao buscar relações:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchRelacoes();
    }

    return () => {
      isMounted = false;
    };
  }, [open, isEditing, categoria?.id]);

  async function handleSubmit(data: CategoriaFormData) {
    try {
      if (isEditing && categoria) {
        await updateCategoria(categoria.id, data);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await createCategoria(data);
        toast.success("Categoria criada com sucesso!");
      }
      setOpen(false);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Erro ao salvar a categoria");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={
          isEditing ? "Editar categoria" : "Adicionar uma nova categoria"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="size-6" />
          </div>
        ) : (
          <CategoriaForm
            defaultValues={
              categoria
                ? {
                    descricao: categoria.descricao,
                    tipos_documentos: tiposSelecionados,
                  }
                : undefined
            }
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onCancel={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
