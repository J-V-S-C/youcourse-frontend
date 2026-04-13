# YouCourse Frontend — Guia para Claude

> Este projeto usa **Next.js 16** (App Router). APIs, convenções e estrutura de arquivos podem diferir do que está no seu treinamento. Leia `node_modules/next/dist/docs/` antes de escrever qualquer código que use APIs do Next.js e respeite avisos de depreciação.

---

## Stack Técnica

- **Next.js 16** com App Router — todas as rotas ficam em `app/`
- **TypeScript 5** — tipagem estrita, nada de `any`
- **MUI v9** + **Emotion** para componentes de UI
- **Tailwind CSS v4** para utilitários de layout/espaçamento
- **NextAuth.js v4** para gerenciamento de sessão e autenticação
- **pnpm** como package manager

---

## Estrutura de Diretórios

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

---

## Regras de Arquitetura

1. **Chamadas HTTP à API NestJS pertencem a `lib/`** — nunca dentro de componentes React ou em `app/api/`.
2. **`app/api/`** é exclusivo para Route Handlers do Next.js (ex: `[...nextauth]`).
3. **Sem lógica de negócio em componentes** — componentes chamam funções de `lib/`, não `fetch()` diretamente.
4. **Serviços tipados** — toda resposta de API deve ter um tipo DTO correspondente em `types.ts`.

---

## Autenticação

- **NextAuth.js** gerencia a sessão inteira. Nunca armazene tokens manualmente no `localStorage`.
- O `access_token` é renovado automaticamente via `refreshAccessToken()` em `lib/auth/auth.service.ts`.
- Rotas protegidas usam o componente `AuthGuard` (`app/components/AuthGuard.tsx`).
- `NEXTAUTH_SECRET` é somente servidor — nunca usar `NEXT_PUBLIC_NEXTAUTH_SECRET`.

---

## Variáveis de Ambiente

| Variável | Onde é usada | Exemplo |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `lib/` (browser) | `http://localhost:3333` |
| `NEXTAUTH_URL` | NextAuth (servidor) | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth (servidor) | chave aleatória segura |

---

## Endpoints da API (NestJS em `http://localhost:3333`)

Swagger disponível em `http://localhost:3333/api#/`.

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/sessions` | Login |
| `POST` | `/sessions/refresh` | Renovar access token |
| `POST` | `/accounts` | Cadastro |
| `GET` | `/accounts/{id}` | Buscar usuário |
| `PATCH` | `/accounts/{id}` | Editar usuário |
| `POST` | `/accounts/password` | Alterar senha |
| `POST` | `/accounts/password-reset` | Reset de senha |
| `GET` | `/courses` | Listar cursos |
| `POST` | `/courses` | Criar curso |
| `PUT` | `/courses/{courseId}` | Editar curso |
| `DELETE` | `/courses/{courseId}` | Remover curso |
| `PATCH` | `/courses/{courseId}/price` | Atualizar preço |
| `PATCH` | `/courses/{courseId}/publish` | Publicar |
| `PATCH` | `/courses/{courseId}/unpublish` | Despublicar |
| `PATCH` | `/courses/{courseId}/hide` | Ocultar |
| `POST` | `/courses/{courseId}/rating` | Avaliar curso |
| `PUT` | `/ratings/{ratingId}` | Editar avaliação |

---

## O Que Fazer Antes de Escrever Código

1. Leia `node_modules/next/dist/docs/` para qualquer API do Next.js que for usar.
2. Consulte `lib/http.ts` — use os helpers `get<T>()` e `post<T>()` existentes.
3. Adicione os tipos DTO em `lib/<domínio>/types.ts` antes de implementar o serviço.
4. Verifique se já existe um serviço em `lib/` para o domínio antes de criar um novo.

---

## Restrições

- **Não usar `any`** em TypeScript.
- **Não colocar segredos** em variáveis `NEXT_PUBLIC_*`.
- **Não fazer chamadas HTTP** em Server Components sem considerar cache e revalidação.
- **Não modificar** `types/next-auth.d.ts` sem entender o impacto na tipagem global da sessão.

---

## Comandos Úteis

```bash
pnpm dev          # Dev server em localhost:3000
pnpm build        # Build de produção
pnpm lint         # ESLint
```
