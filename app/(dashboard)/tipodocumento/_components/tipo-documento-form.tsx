"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  tipoDocumentoSchema,
  type TipoDocumentoFormData,
} from "@/lib/validations/tipo-documento";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TipoDocumentoFormProps {
  defaultValues?: Partial<TipoDocumentoFormData>;
  isEditing?: boolean;
  onSubmit: (data: TipoDocumentoFormData) => Promise<void>;
  onCancel: () => void;
}

export function TipoDocumentoForm({
  defaultValues,
  isEditing,
  onSubmit,
  onCancel,
}: TipoDocumentoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TipoDocumentoFormData>({
    resolver: zodResolver(tipoDocumentoSchema),
    defaultValues: defaultValues || {
      descricao: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="descricao">Descrição do Tipo de Documento *</Label>
        <Input
          id="descricao"
          placeholder="Ex: Alvará de Funcionamento, AVCB, etc."
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
              : "Cadastrar Tipo"}
        </Button>
      </div>
    </form>
  );
}
