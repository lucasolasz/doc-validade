"use server";

import { createClient } from "@/lib/supabase/server";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import { Readable } from "stream";

function getGoogleAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return auth;
}

export async function uploadFileToDrive(formData: FormData) {
  const file = formData.get("file") as File;
  const documentId = formData.get("documentId") as string;
  const clientId = formData.get("clientId") as string;

  if (!file || !documentId || !clientId) {
    throw new Error("Dados incompletos para upload");
  }

  // Converte File para Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Autentica no Google Drive
  const auth = getGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  // Faz o upload
  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },
    fields: "id, name, webViewLink",
  });

  const fileId = response.data.id!;
  const fileName = response.data.name!;

  // Torna o arquivo público para download
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // URL direta de download
  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  // Salva no Supabase
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .update({ file_url: fileUrl, file_name: fileName })
    .eq("id", documentId);

  if (error) throw new Error(error.message);

  revalidatePath(`/clientes/${clientId}`);

  return { fileUrl, fileName };
}

export async function deleteFileFromDrive(
  documentId: string,
  clientId: string,
) {
  const supabase = await createClient();

  // Busca a URL atual para extrair o fileId
  const { data, error } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", documentId)
    .single();

  if (error || !data?.file_url) throw new Error("Arquivo não encontrado");

  // Extrai o fileId da URL
  const fileId = new URL(data.file_url).searchParams.get("id");

  if (fileId) {
    try {
      const auth = getGoogleAuth();
      const drive = google.drive({ version: "v3", auth });
      await drive.files.delete({ fileId });
    } catch {
      // Se falhar no Drive não bloqueia — remove do banco de qualquer forma
      console.error("Erro ao deletar arquivo do Drive");
    }
  }

  // Remove referência no Supabase
  await supabase
    .from("documents")
    .update({ file_url: null, file_name: null })
    .eq("id", documentId);

  revalidatePath(`/clientes/${clientId}`);
}
