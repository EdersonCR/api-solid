💪 Gym Check-in API

Uma API RESTful desenvolvida com Node.js + Fastify para gerenciamento de academias e check-ins. Usuários podem localizar academias próximas, registrar visitas e acompanhar seu histórico. Administradores podem validar check-ins e cadastrar novas academias.

💻 Tecnologias

&ensp;&ensp;[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
&ensp;&ensp;[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
&ensp;&ensp;[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
&ensp;&ensp;[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
&ensp;&ensp;[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
&ensp;&ensp;[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
&ensp;&ensp;[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
&ensp;&ensp;[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
&ensp;&ensp;[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
&ensp;&ensp;[![Zod](https://img.shields.io/badge/Zod-8A2BE2?style=for-the-badge)](https://zod.dev/)
&ensp;&ensp;[![tsup](https://img.shields.io/badge/tsup-3178C6?style=for-the-badge)](https://tsup.egoist.dev/)

## ⚙️ Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/EdersonCR/api-solid.git
   cd api-solid
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   ```env
   JWT_SECRET=sua_chave_jwt
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/database
   ```

4. Inicie o PostgreSQL com Docker:

   ```bash
   docker compose up -d
   ```

5. Rode o servidor:

   ```bash
   npm run dev
   ```

## 🧪 Testes

* **Testes unitários**:

  ```bash
  npm run test
  ```

* **Testes end-to-end (E2E)**:

  ```bash
  npm run test:e2e
  ```

## 📬 Endpoints

A API estará disponível em `http://localhost:3333`.

### 👤 Usuário

| Método | Rota             | Descrição                         | Body                        | Autenticado           | Status                            |
| ------ | ---------------- | --------------------------------- | --------------------------- | --------------------- | --------------------------------- |
| **POST**   | `/users`         | Registrar novo usuário            | `{ name, email, password }` | ❌                     | **201** Criado; **409** Usuário já registrado   |
| **POST**   | `/sessions`      | Autenticar usuário (login)        | `{ email, password }`       | ❌                     | **200** OK; **401** Não autorizado |
| **PATCH**  | `/token/refresh` | Renovar token                     | —                           | ❌ (via refresh token) | **200** OK; **401** Não autorizado        |
| **GET**    | `/me`            | Ver perfil do usuário autenticado | —                           | ✅                     | **200** OK                            |

### 🏋️ Academias

| Método | Rota           | Descrição                   | Query/Body                                             | Autenticado | Status                        |
| ------ | -------------- | --------------------------- | ------------------------------------------------------ | ----------- | ----------------------------- |
| **GET**    | `/gyms/search` | Buscar academias por nome   | `?query=nome-da-academia`                              | ✅           | **200** OK                        |
| **GET**    | `/gyms/nearby` | Buscar academias próximas   | `?latitude=...&longitude=...`                          | ✅           | **200** OK                        |
| **POST**   | `/gyms`        | Criar nova academia (ADMIN) | `{ title, description?, phone?, latitude, longitude }` | ✅ (admin)   | **201** Criado; **401** Não autorizado |

### 📍 Check-ins

| Método | Rota                             | Descrição                             | Body | Autenticado | Status                                                       |
| ------ | -------------------------------- | ------------------------------------- | ---- | ----------- | ------------------------------------------------------------ |
| **POST**   | `/gyms/:gymId/check-ins`         | Registrar check-in em uma academia    | —    | ✅           | **201** Criado; **404** Academia não encontrada            |
| **GET**    | `/check-ins/history`             | Ver histórico de check-ins do usuário | —    | ✅           | **200** OK                                                       |
| **GET**    | `/check-ins/metrics`             | Ver total e estatísticas de check-ins | —    | ✅           | **200** OK                                                       |
| **PATCH**  | `/check-ins/:checkInId/validate` | Validar um check-in (ADMIN)           | —    | ✅ (admin)   | **204** Validado; **401** Não autorizado; **404** Checki-in não encontrado |

## 🔐 Autenticação

A autenticação é feita via **JWT**:

* Após login (`/sessions`), serão retornados `accessToken` e `refreshToken`.
* Envie o `accessToken` no cabeçalho `Authorization` das requisições:

  ```
  Authorization: Bearer seu_token_aqui
  ```

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE.md) para mais detalhes.

## ✒️ Autor
Feito por **Éderson C. Rodrigues** 🏳️‍🌈

&ensp;&ensp;[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/edersoncr) 
&ensp;&ensp;[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/EdersonCR)