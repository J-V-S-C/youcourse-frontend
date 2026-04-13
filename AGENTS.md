<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# YouCourse Frontend — Guia para Agentes de IA

## Visão Geral do Projeto

**YouCourse** é um portal de cursos online. Este repositório é o **frontend** (Next.js 16, App Router), que consome a YouCourse API (NestJS, rodando em `http://localhost:3333`).

## Stack Técnica

- **Next.js 16** com App Router — todas as rotas ficam em `app/`
- **TypeScript 5** — tipagem estrita, nada de `any`
- **MUI v9** + **Emotion** para componentes de UI
- **Tailwind CSS v4** para utilitários de layout/espaçamento
- **NextAuth.js v4** para gerenciamento de sessão e autenticação
- **pnpm** como package manager

## Convenções Críticas

### Estrutura de Diretórios

```
app/              → Rotas e componentes de página (App Router)
app/api/auth/     → Route handlers do NextAuth (não é onde chamadas à API NestJS ficam)
app/components/   → Componentes React reutilizáveis
app/providers/    → Providers de contexto global
lib/              → Serviços HTTP e utilitários (chamadas à API NestJS ficam AQUI)
lib/auth/         → auth.service.ts, jwt.ts, types.ts
lib/user/         → user.service.ts, types.ts
lib/http.ts       → Helpers genéricos get<T>() e post<T>()
types/            → Declarações de tipo globais (ex: extensões do next-auth)
public/           → Assets estáticos
```

### Regras de Arquitetura

1. **Chamadas HTTP à API NestJS pertencem a `lib/`**, nunca dentro de componentes React ou em `app/api/`.
2. **`app/api/`** é exclusivo para Route Handlers do Next.js (ex: `[...nextauth]`).
3. **Sem lógica de negócio em componentes** — componentes chamam funções de `lib/`, não `fetch()` diretamente.
4. **Serviços tipados** — toda resposta de API deve ter um tipo DTO correspondente em `types.ts`.

### Autenticação

- **NextAuth.js** gerencia a sessão inteira. Nunca armazene tokens manualmente no `localStorage`.
- O `access_token` é renovado automaticamente via `refreshAccessToken()` em `lib/auth/auth.service.ts`.
- Rotas protegidas usam o componente `AuthGuard` (`app/components/AuthGuard.tsx`).
- A variável `NEXTAUTH_SECRET` é somente servidor — nunca usar `NEXT_PUBLIC_NEXTAUTH_SECRET`.

### Variáveis de Ambiente

| Variável | Onde é usada | Exemplo |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `lib/` (browser) | `http://localhost:3333` |
| `NEXTAUTH_URL` | NextAuth (servidor) | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth (servidor) | chave aleatória segura |

### Endpoints da API

A API NestJS é documentada em `http://localhost:3333/api#/`. Os principais grupos:

- **Accounts**: `/accounts`, `/accounts/{id}`, `/accounts/password`, `/accounts/password-reset`
- **Sessions**: `/sessions`, `/sessions/refresh`
- **Courses**: `/courses`, `/courses/{courseId}`, `/courses/{courseId}/rating`, e patches de status
- **Ratings**: `/ratings/{ratingId}`

## O Que Fazer Antes de Escrever Código

1. Leia `node_modules/next/dist/docs/` para qualquer API do Next.js que for usar.
2. Consulte `lib/http.ts` — use os helpers `get<T>()` e `post<T>()` existentes.
3. Adicione os tipos DTO em `lib/<domínio>/types.ts` antes de implementar o serviço.
4. Verifique se já existe um serviço para aquele domínio em `lib/` antes de criar um novo.

## Comandos Úteis

```bash
pnpm dev          # Dev server em localhost:3000
pnpm build        # Build de produção
pnpm lint         # ESLint
```

## Restrições

- **Não usar `any`** em TypeScript.
- **Não colocar segredos** em variáveis `NEXT_PUBLIC_*`.
- **Não fazer chamadas HTTP** em Server Components sem considerar cache e revalidação.
- **Não modificar** `types/next-auth.d.ts` sem entender o impacto na tipagem global da sessão.
