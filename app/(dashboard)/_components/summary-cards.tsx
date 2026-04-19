"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface SummaryCardsProps {
  summary: {
    expired: number;
    critical: number;
    warning: number;
    ok: number;
    total: number;
  };
}

const cards = [
  {
    key: "expired" as const,
    label: "Vencidos",
    description: "Documentos já expirados",
    color: "border-red-200 bg-red-50",
    textColor: "text-red-700",
    countColor: "text-red-600",
  },
  {
    key: "critical" as const,
    label: "Críticos",
    description: "Vencem em até 30 dias",
    color: "border-orange-200 bg-orange-50",
    textColor: "text-orange-700",
    countColor: "text-orange-600",
  },
  {
    key: "warning" as const,
    label: "A vencer",
    description: "Vencem em até 90 dias",
    color: "border-yellow-200 bg-yellow-50",
    textColor: "text-yellow-700",
    countColor: "text-yellow-600",
  },
  {
    key: "ok" as const,
    label: "Válidos",
    description: "Dentro do prazo",
    color: "border-green-200 bg-green-50",
    textColor: "text-green-700",
    countColor: "text-green-600",
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const activeStatus = searchParams.get("status");

  function handleClick(key: string) {
    // toggle: clicou no ativo → remove filtro
    const next = activeStatus === key ? null : key;
    setLoadingKey(next ?? key);
    router.push(next ? `/?status=${next}` : "/");
    setTimeout(() => setLoadingKey(null), 1500);
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isActive = activeStatus === card.key;
        const isLoading = loadingKey === card.key;

        return (
          <button
            key={card.key}
            onClick={() => handleClick(card.key)}
            className={cn(
              `rounded-lg border p-5 space-y-1 transition-all text-left w-full cursor-pointer`,
              card.color,
              isActive
                ? "ring-2 ring-offset-1 ring-current opacity-100"
                : "opacity-90 hover:opacity-100",
            )}
          >
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${card.textColor}`}>
                {card.label}
              </p>
              {isLoading && <Spinner className={`size-3 ${card.textColor}`} />}
            </div>
            <p className={`text-4xl font-bold ${card.countColor}`}>
              {summary[card.key]}
            </p>
            <p className={`text-xs ${card.textColor} opacity-70`}>
              {card.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
