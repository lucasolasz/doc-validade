<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Doc Validade

## Contexto do Projeto

Este é um sistema de gestão de documentos com validade para clientes. O projeto usa Next.js 16 App Router com Server Actions para mutations de dados.

## Regras Importantes

1. **Server Actions**: Toda escrita no banco é feita via Server Actions em `lib/actions/`. Nunca fazer mutations direto no componente.
2. **Autenticação**: O sistema usa Supabase Auth com Google OAuth. Middleware está em `lib/supabase/middleware.ts`.
3. **Componentes**: UI em `components/ui/` é shadcn/ui. Não modificar diretamente.
4. **Validações**: Usar Zod schemas em `lib/validations/` para formulários.
5. **Styling**: Usar classes Tailwind. Não usar CSS modules ou styled-components.
6. **Autenticação Google**: Fluxo: google-auth → callback → dashboard. Usuário só acessa dashboard se autenticado.

## Estrutura de Arquivos

```
app/
├── (dashboard)/           # Grupo de rotas autenticadas
│   ├── page.tsx          # Dashboard
│   ├── clientes/         # Clientes
│   │   ├── page.tsx      # Lista
│   │   ├── _components/  # Componentes específicos
│   │   └── [id]/         # Detalhe do cliente
│   ├── categorias/       # Categorias
│   ├── tipodocumento/    # Tipos de documento
│   └── usuarios/         # Usuários
├── (auth)/               # Login
└── layout.tsx            # Layout raiz

lib/
├── actions/              # Server Actions
│   ├── clients.ts       # CRUD clientes
│   ├── documents.ts     # CRUD documentos
│   ├── dashboard.ts     # Dados do dashboard
│   ├── upload.ts        # Upload de arquivos
│   └── *.ts             # Demais actions
├── supabase/            # Configuração Supabase
├── validations/         # Schemas Zod
└── utils/               # Helpers

components/ui/            # Componentes UI (shadcn)
types/database.types.ts   # Tipos TypeScript do banco
```

## Padrões de Código

### Server Action
```typescript
// lib/actions/example.ts
"use server";

export async function myAction(formData: FormData) {
  // Validação
  // Operações banco
  // Retorno
}
```

### Componente de Formulário
```typescript
// Usar react-hook-form com resolver zod
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
});
```

### Componente de Página
- Páginas de detalhes (cliente/[id]) são Server Components
- Podem usar Client Components para interatividade
- Buscam dados via Server Actions

## Status de Documentos

Calculado em `lib/utils/validity.ts`:
- **expired**: data_validade < hoje
- **critical**: 0-7 dias para vencer
- **warning**: 8-30 dias para vencer
- **ok**: > 30 dias

## Comandos Úteis

```bash
npm run dev      # Iniciar desenvolvimento
npm run build    # Build produção
npm run lint     # Verificar lint
```

## Dependências Principais

- next: 16.2.4
- react: 19.2.4
- @supabase/supabase-js: 2.103.3
- @tanstack/react-query: 5.99.2
- zod: 4.3.6
- react-hook-form: 7.72.1

## Fluxo de Autenticação

1. Usuário acessa `/google-auth`
2. Redireciona para Google OAuth
3. Google callback em `/callback/api/google/token`
4. Cria sessão Supabase
5. Redireciona para `/dashboard`