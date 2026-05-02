"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { clientSchema, type ClientFormData } from "@/lib/validations/client";
import type { Client } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface ClientFormProps {
  defaultValues?: Partial<Client>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? "",
      cnpj: defaultValues?.cnpj ?? "",
      telefone: defaultValues?.telefone ?? "",
      categoria_id: (defaultValues as any)?.categoria_id ?? "",
    },
  });

  const [categorias, setCategorias] = useState<
    {
      id: string;
      descricao: string;
    }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setCategorias(data || []);
      })
      .catch(() => {
        if (mounted) setCategorias([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function maskCNPJ(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }

  function maskPhone(value: string) {
    value = value.replace(/\D/g, "");

    if (value.length <= 10) {
      return value
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    }

    return value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" placeholder="Razão social" {...register("nome")} />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="cnpj">CNPJ *</Label>
        <Input
          id="cnpj"
          placeholder="00.000.000/0000-00"
          {...register("cnpj")}
          onChange={(e) => setValue("cnpj", maskCNPJ(e.target.value))}
        />
        {errors.cnpj && (
          <p className="text-sm text-destructive">{errors.cnpj.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          placeholder="(11) 99999-9999"
          {...register("telefone")}
          onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
        />
        {errors.telefone && (
          <p className="text-sm text-destructive">{errors.telefone.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="categoria">Categoria</Label>
        <Controller
          control={control as any}
          name="categoria_id"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger id="categoria" className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem value={c.id} key={c.id}>
                    {c.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" /> Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
