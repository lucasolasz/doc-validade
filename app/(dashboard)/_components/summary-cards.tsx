import Link from "next/link";

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={`/?status=${card.key}`}
          className={`rounded-lg border p-5 space-y-1 transition-opacity hover:opacity-80 ${card.color}`}
        >
          <p className={`text-sm font-medium ${card.textColor}`}>
            {card.label}
          </p>
          <p className={`text-4xl font-bold ${card.countColor}`}>
            {summary[card.key]}
          </p>
          <p className={`text-xs ${card.textColor} opacity-70`}>
            {card.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
