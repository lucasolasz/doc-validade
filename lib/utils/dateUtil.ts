import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date?: string | null) {
  if (!date) return "—";
  return format(parseDate(date)!, "dd/MM/yyyy", { locale: ptBR });
}

export function parseDate(dateStr?: string | null) {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
