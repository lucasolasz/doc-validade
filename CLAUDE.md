# Doc Validade - Sistema de Gestão de Documentos

## Visão Geral

Sistema para gerenciar documentos de clientes com controle de validade. Notifica quando documentos estão prestes a vencer ou já venceram.

## Stack

- **Frontend**: Next.js 16.2.4 (App Router), React 19, TypeScript, Tailwind CSS 4
- **UI**: shadcn/ui + Radix UI + Tailwind
- **Backend**: Supabase (banco de dados + autenticação + storage)
- **Autenticação**: Google OAuth
- **Validações**: Zod + React Hook Form

## Estrutura de Pastas

```
app/
├── (dashboard)/          # Rotas autenticadas
│   ├── page.tsx          # Dashboard principal
│   ├── clientes/         # Gestão de clientes
│   │   ├── page.tsx      # Lista de clientes
│   │   └── [id]/         # Detalhes do cliente
│   ├── categorias/       # Categorias de documentos
│   ├── tipodocumento/    # Tipos de documento
│   └── usuarios/         # Gestão de usuários
├── (auth)/               # Rotas públicas (login)
├── google-auth/          # Callback Google OAuth
└── callback/             # Callback interno

lib/
├── actions/              # Server Actions (CRUD)
├── supabase/             # Configuração cliente/servidor
├── validations/          # Schemas Zod
└── utils/                # Helpers (dateUtil, validity)

components/ui/            # Componentes shadcn/ui
types/database.types.ts   # Tipos do Supabase
```

## Modelo de Dados

### Clients
- id, nome, cnpj, telefone, categoria_id, drive_folder_id

### Documents
- id, client_id, numero, tipo, data_emissao, data_validade, file_url, file_name

## Status de Documentos

Documentos têm status baseado em dias para vencer:
- **expired**: já venceu
- **critical**: ≤ 7 dias
- **warning**: ≤ 30 dias
- **ok**: > 30 dias

## Comandos

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run lint     # Verificar código
```

## Configurações

Variáveis ambiente (.env.local):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET