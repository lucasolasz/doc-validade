"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  categoriaSchema,
  type CategoriaFormData,
} from "@/lib/validations/categoria";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CategoriaFormProps {
  defaultValues?: Partial<CategoriaFormData>;
  isEditing?: boolean;
  onSubmit: (data: CategoriaFormData) => Promise<void>;
  onCancel: () => void;
}

export function CategoriaForm({
  defaultValues,
  isEditing,
  onSubmit,
  onCancel,
}: CategoriaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: defaultValues || {
      descricao: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="descricao">Descrição da Categoria *</Label>
        <Input
          id="descricao"
          placeholder="Ex: Restaurante, Loja, etc."
          {...register("descricao")}
        />
        {errors.descricao && (
          <p className="text-sm text-destructive">{errors.descricao.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="mr-2" />}
          {isSubmitting
            ? "Salvando..."
            : isEditing
              ? "Salvar Alterações"
              : "Cadastrar Categoria"}
        </Button>
      </div>
    </form>
  );
}
