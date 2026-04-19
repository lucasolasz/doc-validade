import { differenceInDays, parseISO } from "date-fns";

export type ValidityStatus = "expired" | "critical" | "warning" | "ok";

export function getValidityStatus(dataValidade: string): ValidityStatus {
  const days = differenceInDays(parseISO(dataValidade), new Date());

  if (days < 0) return "expired";
  if (days <= 30) return "critical";
  if (days <= 90) return "warning";
  return "ok";
}

export function getValidityLabel(dataValidade: string): string {
  const days = differenceInDays(parseISO(dataValidade), new Date());

  if (days < 0) return `Vencido há ${Math.abs(days)} dias`;
  if (days === 0) return "Vence hoje!";
  if (days <= 30) return `Vence em ${days} dias`;
  if (days <= 90) return `Vence em ${days} dias`;
  return `Vence em ${days} dias`;
}

export const statusConfig = {
  expired: {
    label: "Vencido",
    class: "bg-red-100 text-red-800 border-red-200",
  },
  critical: {
    label: "Crítico",
    class: "bg-orange-100 text-orange-800 border-orange-200",
  },
  warning: {
    label: "A vencer",
    class: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  ok: {
    label: "Válido",
    class: "bg-green-100 text-green-800 border-green-200",
  },
};
