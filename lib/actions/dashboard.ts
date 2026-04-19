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
  return data as DocumentWithStatus[];
}
