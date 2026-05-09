import {
  getValidityStatus,
  getValidityLabel,
  statusConfig,
} from "@/lib/utils/validity";

export function DocumentStatusBadge({
  dataValidade,
}: {
  dataValidade: string | null;
}) {
  const status = getValidityStatus(dataValidade);
  const config = statusConfig[status];

  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full border ${config.class}`}
    >
      {getValidityLabel(dataValidade)}
    </span>
  );
}
