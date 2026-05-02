"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  categoriaSchema,
  type CategoriaFormData,
} from "@/lib/validations/categoria";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    values: {
      descricao: defaultValues?.descricao || "",
      tipos_documentos: defaultValues?.tipos_documentos || [],
    },
  });

  const [tiposDisponiveis, setTiposDisponiveis] = useState<
    { id: string; descricao: string }[]
  >([]);
  const [loadingTipos, setLoadingTipos] = useState(true);

  useEffect(() => {
    async function loadTipos() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("tipos_documentos")
          .select("*")
          .order("descricao");
        if (error) throw error;
        if (data) setTiposDisponiveis(data);
      } catch (err) {
        console.error("Erro ao carregar tipos:", err);
      } finally {
        setLoadingTipos(false);
      }
    }
    loadTipos();
  }, []);

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

      <div className="space-y-2 pt-2">
        <Label>Tipos de Documentos Exigidos pela Categoria</Label>
        {loadingTipos ? (
          <div className="text-sm text-muted-foreground flex items-center">
            <Spinner className="mr-2 size-3" /> Carregando tipos...
          </div>
        ) : (
          <Controller
            control={control}
            name="tipos_documentos"
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-48 overflow-y-auto">
                {tiposDisponiveis.map((tipo) => (
                  <div key={tipo.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tipo-${tipo.id}`}
                      checked={field.value?.includes(tipo.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...(field.value || []), tipo.id])
                          : field.onChange(
                              field.value?.filter((value) => value !== tipo.id),
                            );
                      }}
                    />
                    <label
                      htmlFor={`tipo-${tipo.id}`}
                      className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tipo.descricao}
                    </label>
                  </div>
                ))}
                {tiposDisponiveis.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhum tipo cadastrado.
                  </span>
                )}
              </div>
            )}
          />
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
