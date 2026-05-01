export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          nome: string;
          cnpj: string;
          telefone: string | null;
          created_at: string;
          updated_at: string;
          drive_folder_id: string | null;
        };
        Insert: {
          id?: string;
          nome: string;
          cnpj: string;
          telefone?: string | null;
          created_at?: string;
          updated_at?: string;
          drive_folder_id?: string | null;
        };
        Update: {
          id?: string;
          nome?: string;
          cnpj?: string;
          telefone?: string | null;
          updated_at?: string;
          drive_folder_id?: string | null;
        };
      };
      documents: {
        Row: {
          id: string;
          client_id: string;
          numero: string;
          tipo: string | null;
          data_emissao: string;
          data_validade: string;
          created_at: string;
          updated_at: string;
          file_url: string | null;
          file_name: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          numero: string;
          tipo?: string | null;
          data_emissao?: string;
          data_validade: string;
          created_at?: string;
          updated_at?: string;
          file_url?: string | null;
          file_name?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          numero?: string;
          tipo?: string | null;
          data_emissao?: string;
          data_validade?: string;
          updated_at?: string;
          file_url?: string | null;
          file_name?: string | null;
        };
      };
    };
  };
};

export type DocumentWithStatus = {
  id: string;
  client_id: string;
  numero: string;
  tipo: string | null;
  data_emissao: string | null;
  data_validade: string;
  created_at: string;
  client_nome: string;
  client_cnpj: string;
  client_telefone: string | null;
  dias_para_vencer: number;
  status: "expired" | "critical" | "warning" | "ok";
};

// Helpers para facilitar o uso nos componentes
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert =
  Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate =
  Database["public"]["Tables"]["documents"]["Update"];
