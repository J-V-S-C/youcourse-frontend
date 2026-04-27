# YouCourse Frontend

> Portal de cursos online — interface web construída com **Next.js 16**, **MUI v9**, **Tailwind CSS v4** e autenticação via **NextAuth.js**.

---

## Visão Geral

YouCourse é uma plataforma para criação e consumo de cursos online. Este repositório contém o **frontend** da aplicação, que se comunica com a [YouCourse API]([https://youcourse-api.duckdns.org/api]) (NestJS + Prisma + AWS).

---

## Tecnologias

| Camada | Biblioteca / Framework |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | MUI v9 + Emotion |
| Estilos | Tailwind CSS v4 |
| Autenticação | NextAuth.js v4 |
| HTTP Client | Fetch nativo (via `lib/http.ts`) |
| Linguagem | TypeScript 5 |
| Package Manager | pnpm |

---

## Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9

---

## Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL pública da API 
NEXT_PUBLIC_API_BASE_URL=https://youcourse-api.duckdns.org

# Configurações do NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_aqui
```
---

## Instalação

```bash
pnpm install
```

---

## Scripts

```bash
# Servidor de desenvolvimento com hot-reload
pnpm dev

# Build de produção
pnpm build

# Iniciar servidor de produção (requer build prévio)
pnpm start

# Lint
pnpm lint
```

O servidor de desenvolvimento sobe em [http://localhost:3000](http://localhost:3000).

---

## Estrutura de Pastas

```
youcourse-frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/   # Route handler do NextAuth
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── AuthGuard.tsx        # HOC de proteção de rota
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── ui/                  # Componentes de UI base
│   ├── login/                   # Página de login
│   ├── profile/                 # Página de perfil do usuário
│   ├── register/                # Página de cadastro
│   ├── providers/
│   │   └── SessionProvider.tsx  # Provider de sessão do NextAuth
│   ├── globals.css
│   ├── layout.tsx               # Root layout (fontes, providers globais)
│   └── page.tsx                 # Home page
├── lib/
│   ├── auth/
│   │   ├── auth.service.ts      # login(), refreshAccessToken()
│   │   ├── jwt.ts               # Decodificação do JWT
│   │   └── types.ts             # Tipos de autenticação (AuthUser, AuthToken…)
│   ├── user/
│   │   ├── user.service.ts      # Chamadas relacionadas ao usuário
│   │   └── types.ts             # Tipos de usuário
│   └── http.ts                  # Helpers genéricos: get<T>() e post<T>()
├── types/
│   └── next-auth.d.ts           # Extensão de tipos do NextAuth
├── public/                      # Assets estáticos
├── .env.local                   # Variáveis de ambiente (não versionado)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Arquitetura

### Camada de Serviços (`lib/`)

Toda comunicação com a API é centralizada em `lib/`. Os helpers genéricos `get<T>` e `post<T>` em `lib/http.ts` encapsulam o `fetch` nativo e lançam erros em respostas não-ok.

Serviços específicos (`auth.service.ts`, `user.service.ts`) consomem esses helpers e expõem funções tipadas.

### Autenticação

O fluxo de autenticação usa **NextAuth.js** com uma `CredentialsProvider` customizada:

1. `login()` chama `POST /sessions` na API e recebe `access_token` + `refresh_token`.
2. O JWT é decodificado via `jwt-decode` para extrair `sub` (ID do usuário) e `exp`.
3. Quando o `access_token` expira, `refreshAccessToken()` chama `POST /sessions/refresh` automaticamente.
4. `AuthGuard.tsx` protege rotas que requerem autenticação.

### Temas

O projeto suporta temas claro/escuro via `next-themes`, com persistência de preferência no `localStorage`.

---

## API (YouCourse — NestJS)

A API roda localmente em `http://localhost:3333`. Documentação Swagger disponível em [http://localhost:3333/api#/](http://localhost:3333/api#/).

### Endpoints utilizados

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/sessions` | Autenticação (login) |
| `POST` | `/sessions/refresh` | Renovação do access token |
| `POST` | `/accounts` | Cadastro de usuário |
| `GET` | `/accounts/{id}` | Buscar dados do usuário |
| `PATCH` | `/accounts/{id}` | Editar dados do usuário |
| `POST` | `/accounts/password` | Alterar senha |
| `POST` | `/accounts/password-reset` | Solicitar reset de senha |
| `GET` | `/courses` | Listar cursos (catálogo) |
| `POST` | `/courses` | Criar curso |
| `PUT` | `/courses/{courseId}` | Editar detalhes do curso |
| `DELETE` | `/courses/{courseId}` | Remover curso |
| `PATCH` | `/courses/{courseId}/price` | Atualizar preço |
| `PATCH` | `/courses/{courseId}/publish` | Publicar curso |
| `PATCH` | `/courses/{courseId}/unpublish` | Despublicar curso |
| `PATCH` | `/courses/{courseId}/hide` | Ocultar curso |
| `POST` | `/courses/{courseId}/rating` | Avaliar curso |
| `PUT` | `/ratings/{ratingId}` | Editar avaliação |

---

## Boas Práticas

- **Nenhuma lógica de negócio nos componentes** — toda chamada HTTP fica em `lib/`.
- **Tipagem estrita** — TypeScript em modo estrito; evitar `any`.
- **Variáveis de ambiente** — segredos ficam apenas no servidor (`NEXTAUTH_SECRET`); dados públicos usam o prefixo `NEXT_PUBLIC_`.
- **Proteção de rotas** — rotas autenticadas usam `AuthGuard`.
- **Tokens** — o refresh automático de JWT é gerenciado pelo NextAuth.

---

## Roadmap do Projeto

### Concluído ✅
- Autenticação (login, cadastro, refresh token, reset de senha)
- Gerenciamento de conta (edição de perfil, troca de senha)
- CRUD de cursos (criar, editar, publicar, despublicar, ocultar, excluir)
- Catálogo de cursos
- Avaliações (criar, editar)
- Swagger na API

### Em Andamento / Planejado 🔧
- [x] Busca de cursos no catálogo
- [x] Visualização individual de curso
- [x] Reprodução de vídeo para as aulas
- [ ] Checkout e processamento de pagamento
- [ ] Entrega de acesso ao conteúdo
- [ ] Exclusão de avaliação
- [ ] Notificações
- [x] HTTPS / TLS
- [x] Deploy + CD pipeline

---


