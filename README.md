<h1 align="center"> YouCourse Frontend </h1>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen?style=for-the-badge"/>
</p>

> Portal de cursos online — interface web construída para consumir a YouCourse API (NestJS + Prisma + AWS S3/CloudFront para hospedagem de vídeos).

## Índice 
* [Descrição do Projeto](#descrição-do-projeto)
* [Status do Projeto](#status-do-projeto)
* [Funcionalidades e Demonstração da Aplicação](#funcionalidades-e-demonstração-da-aplicação)
* [Acesso ao Projeto](#acesso-ao-projeto)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Arquitetura](#arquitetura)
* [Pessoas Desenvolvedoras do Projeto](#pessoas-desenvolvedoras-do-projeto)
* [Licença](#licença)

## Descrição do Projeto
YouCourse é uma plataforma para criação e consumo de cursos online. Este repositório contém o frontend da aplicação, focando em performance, responsividade e integração segura com a API backend para gerenciar contas, catálogo de cursos, avaliações e reprodução de vídeos.

## Status do Projeto
<h4 align="center"> 
  :construction: Projeto em construção :construction:
</h4>

## Funcionalidades e Demonstração da Aplicação
# :hammer: Funcionalidades do projeto
- `Autenticação`: Login, cadastro, refresh token automático e reset de senha via NextAuth.js.
- `Gerenciamento de Conta`: Edição de perfil e troca de senha.
- `Gestão de Cursos (CRUD)`: Criar, editar, publicar, despublicar, ocultar e excluir cursos.
- `Catálogo`: Listagem e busca de cursos disponíveis na plataforma.
- `Consumo de Conteúdo`: Visualização individual de curso e reprodução de vídeo para as aulas.
- `Interação`: Criação e edição de avaliações de cursos.

*(Adicione GIFs ou capturas de tela aqui para demonstração visual)*

## Acesso ao Projeto

### 📁 Pré-requisitos
- Node.js ≥ 20
- pnpm ≥ 9

### 🛠️ Abrir e rodar o projeto

1. Clone o repositório.
2. Crie um arquivo `.env.local` na raiz com as variáveis:
   ```env
   NEXT_PUBLIC_API_BASE_URL=[https://youcourse-api.duckdns.org](https://youcourse-api.duckdns.org)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=sua_chave_secreta_aqui
   ```
3. Instale as dependências:
  ```bash
  pnpm insrall
  ```
4. Inicie o servidor de desenvolvimento:
 ```bash
  pnpm dev
  ```

O servidor local iniciará em http://localhost:3000. Para build de produção, utilize pnpm build seguido de pnpm start.

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Framework** | Next.js 16.2 (App Router) |
| **Linguagem** | TypeScript 5 |
| **UI & Estilização** | MUI v9 (Material UI), Emotion, Tailwind CSS v4 |
| **Autenticação** | NextAuth.js v4 + jwt-decode |
| **Gerenciamento de Tema** | next-themes |
| **Testes** | Vitest, React Testing Library |
| **Cliente HTTP** | Fetch API Nativa (encapsulada em `lib/http.ts` e `lib/http-public.ts`) |
| **Gerenciador de Pacotes** | pnpm |

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura modular baseada em **Domain-Driven Design (DDD)** simplificado e separação de interesses (Separation of Concerns), estruturada da seguinte forma:

### 1. Camada de App (Next.js App Router)
* **Routes:** Páginas organizadas por domínios (`/courses`, `/manage`, `/profile`, `/auth`).
* **Providers:** Centralização de contextos globais em `app/providers/` (MUI, Auth e Theme).
* **Route Handlers:** Implementação do NextAuth em `app/api/auth/[...nextauth]`.

### 2. Camada de Componentes (`app/components/`)
* **Domínios:** Componentes específicos organizados por funcionalidade (`courses/`, `manage/`, `profile/`).
* **UI Base:** Componentes atômicos e customizações de interface em `ui/`.
* **State Management:** Uso de **Client Components** para lógica de interação (ex: `CoursePlayerClient.tsx`, `CourseManagerClient.tsx`) e **Server Components** para busca de dados inicial.

### 3. Camada de Serviços e Infraestrutura (`lib/`)
* **Serviços de Domínio:** Lógica de negócio e chamadas à API isoladas por contexto (`auth.service.ts`, `course.service.ts`, `lesson.service.ts`, `unit.service.ts`).
* **HTTP Clients:**
    * `http.ts`: Cliente para requisições autenticadas (inclui lógica de token).
    * `http-public.ts`: Cliente para rotas públicas.
* **Segurança:** `assert-owner.ts` para validações de permissão e `AuthGuard.tsx` para proteção de rotas no lado do cliente.

---

## 👨‍💻 Pessoas Desenvolvedoras do Projeto

<div align="center">

| [<img src="https://github.com/J-V-S-C.png" width="100px;" style="border-radius:50%;" alt="Foto do João Victor"/><br><sub><b>João Victor Sant'Ana Cortabitart</b></b></sub>](https://github.com/J-V-S-C) |
| :---: |

</div>

---

## 📄 Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).
