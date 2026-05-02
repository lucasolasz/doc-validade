"use server";

import { createClient } from "@/lib/supabase/server";
import type { DocumentWithStatus } from "@/types/database.types";

export async function getDashboardSummary() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents_with_status")
    .select("status");

  if (error) throw new Error(error.message);

  const summary = {
    expired: data.filter((d) => d.status === "expired").length,
    critical: data.filter((d) => d.status === "critical").length,
    warning: data.filter((d) => d.status === "warning").length,
    ok: data.filter((d) => d.status === "ok").length,
    total: data.length,
  };

  return summary;
}

export async function getExpiringDocuments(
  status?: "expired" | "critical" | "warning" | "ok",
) {
  const supabase = await createClient();

  let query = supabase.from("documents_with_status").select("*");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  // Load tipos_documentos descricoes for documents that have a tipo
  const tipoIds = Array.from(
    new Set(
      (data as DocumentWithStatus[])
        .map((d) => d.tipo)
        .filter(Boolean) as string[],
    ),
  );

  let tiposMap: Record<string, string> = {};
  if (tipoIds.length > 0) {
    const { data: tiposData, error: tiposError } = await supabase
      .from("tipos_documentos")
      .select("id,descricao")
      .in("id", tipoIds as string[]);
    if (tiposError) throw new Error(tiposError.message);
    if (tiposData) {
      tiposMap = Object.fromEntries(
        (tiposData as { id: string; descricao: string }[]).map((t) => [
          t.id,
          t.descricao,
        ]),
      );
    }
  }

  return (data as DocumentWithStatus[]).map((d) => ({
    ...d,
    tipo_descricao: d.tipo ? (tiposMap[d.tipo] ?? null) : null,
  }));
}
