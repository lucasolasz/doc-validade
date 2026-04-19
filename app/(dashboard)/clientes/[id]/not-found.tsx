import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <h2 className="text-2xl font-semibold">Cliente não encontrado</h2>
      <p className="text-muted-foreground">
        O cliente que você procura não existe ou foi removido.
      </p>
      <Button asChild>
        <Link href="/clientes">Voltar para clientes</Link>
      </Button>
    </div>
  );
}
