import {
  getDashboardSummary,
  getExpiringDocuments,
} from "@/lib/actions/dashboard";
import { SummaryCards } from "./_components/summary-cards";
import { ExpiringDocuments } from "./_components/expiring-documents";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const [summary, documents] = await Promise.all([
    getDashboardSummary(),
    getExpiringDocuments(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          {summary.total} documento(s) cadastrado(s) no total
        </p>
      </div>

      <SummaryCards summary={summary} />

      <div>
        <h2 className="text-lg font-semibold mb-4">Todos os documentos</h2>
        <ExpiringDocuments documents={documents} activeStatus={status} />
      </div>
    </div>
  );
}
