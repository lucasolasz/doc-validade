"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GoogleAuthPage() {
  const handleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

    const redirectUri = `${window.location.origin}/callback`;

    const url =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      "&response_type=code" +
      "&scope=https://www.googleapis.com/auth/drive" +
      "&access_type=offline" +
      "&prompt=consent";

    window.location.href = url;
  };

  return (
    <div className="flex flex-col gap-4 mt-10 items-center justify-center ">
      <Link href="/">
        <span className="flex items-center">
          <ArrowLeft className="h-4 w-4" /> Voltar para home
        </span>
      </Link>
      <Button className="p-4" onClick={handleAuth}>
        Gerar Refresh Token
      </Button>
    </div>
  );
}
