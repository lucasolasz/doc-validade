"use server";

import { createClient } from "@/lib/supabase/server";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import { Readable } from "stream";

function getGoogleAuth() {
  const auth = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
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

  // Busca o drive_folder_id do cliente
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("drive_folder_id, nome")
    .eq("id", clientId)
    .single();

  // Se não tiver pasta ainda, cria agora
  let folderId = client?.drive_folder_id;

  if (!folderId) {
    try {
      folderId = await createClientFolder(client?.nome ?? clientId);

      // Salva o folder_id no cliente
      await supabase
        .from("clients")
        .update({ drive_folder_id: folderId })
        .eq("id", clientId);
    } catch {
      // Fallback para pasta raiz se falhar
      folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const auth = getGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: [folderId], // ← pasta do cliente
    },
    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },
    fields: "id, name, webViewLink",
  });

  const fileId = response.data.id!;
  const fileName = response.data.name!;

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

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

export async function createClientFolder(clientName: string): Promise<string> {
  const auth = getGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.create({
    requestBody: {
      name: clientName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    fields: "id",
  });

  return response.data.id!;
}
