-- Script para tornar data_validade opcional em documents
-- Executar no Supabase SQL Editor
DROP VIEW IF EXISTS documents_with_status;

-- 1. Recriar view com suporte a documentos sem validade
CREATE OR REPLACE VIEW documents_with_status AS
SELECT
  d.id,
  d.client_id,
  d.numero,
  d.tipo,
  d.data_emissao,
  d.data_validade,
  d.created_at,
  c.nome AS client_nome,
  c.cnpj AS client_cnpj,
  c.telefone AS client_telefone,
  CASE
    WHEN d.data_validade IS NULL THEN NULL
    ELSE (d.data_validade::date - current_date)
  END AS dias_para_vencer,
  CASE
    WHEN d.data_validade IS NULL THEN 'no_expiry'
    WHEN (d.data_validade::date - current_date) < 0 THEN 'expired'
    WHEN (d.data_validade::date - current_date) <= 30 THEN 'critical'
    WHEN (d.data_validade::date - current_date) <= 90 THEN 'warning'
    ELSE 'ok'
  END AS status
FROM documents d
JOIN clients c ON c.id = d.client_id
ORDER BY d.data_validade ASC NULLS LAST;

-- 2. Alterar coluna para permitir NULL
ALTER TABLE documents ALTER COLUMN data_validade DROP NOT NULL;