"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CallbackPage() {
  const [token, setToken] = useState<string | null>(null);

  const handleGenerate = async () => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      toast.error("Código de autorização não encontrado na URL");
      return;
    }

    const res = await fetch("/callback/api/google/token", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    setToken(data.refresh_token);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 mt-10">
      <Link href="/">
        <span className="flex items-center">
          <ArrowLeft className="h-4 w-4" /> Voltar para home
        </span>
      </Link>
      <h1>Refresh Token</h1>

      <Button onClick={handleGenerate}>Gerar Token</Button>

      <pre className="text-black">{token}</pre>
    </div>
  );
}
