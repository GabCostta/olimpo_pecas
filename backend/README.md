# 🏗️ Backend - Olimpo Peças

Este repositório contém a API do projeto **Olimpo Peças**, desenvolvida em **Node.js** com **Express**, seguindo o padrão **MVC** e utilizando **PostgreSQL** como banco de dados.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **Prisma ORM** - Mapeamento objeto-relacional (ORM) para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Middleware para permitir requisições de origens diferentes

---

## 📦 Instalação

1. **Clone o repositório**
```sh
git clone https://github.com/GabCostta/olimpo_pecas.git
```

2. **Acesse o diretório do backend**
```sh
cd olimpo_pecas/backend
```

3. **Instale as dependências**
```sh
npm install
```

4. **Configurar o banco de dados**
   - Crie um banco de dados PostgreSQL
   - Configure o arquivo `.env` com a string de conexão:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/olimpo_pecas"
```

5. **Rodar as migrations**
```sh
npx prisma migrate dev
```

6. **Iniciar o servidor**
```sh
npm run dev
```

O backend estará rodando em `http://localhost:3000`.

---

## 📜 Estrutura do Projeto

```
backend/
├── prisma/              # Configuração do Prisma ORM
│   ├── migrations/      # Migrations do banco de dados
│   ├── schema.prisma    # Definição do banco de dados
│   ├── ERD.svg          # Diagrama do banco de dados
│
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   ├── services/        # Regras de negócio
│   ├── app.js           # Configuração principal do Express
│   ├── server.js        # Inicialização do servidor
│
├── .env                 # Configuração do ambiente
├── package.json         # Dependências do projeto
├── README.md            # Documentação
```

---

## 📌 Endpoints da API

### 🔹 Autenticação
- `POST /auth/register` - Criar conta de usuário
- `POST /auth/login` - Autenticar usuário

### 🔹 Usuários
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário

### 🔹 Produtos
- `GET /products` - Listar produtos
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto

---

## 🛠️ ERD (Entity Relationship Diagram)

Para visualizar o diagrama do banco de dados, abra o arquivo `backend/prisma/ERD.svg`.

Caso queira regenerar o diagrama, execute:
```sh
npx prisma generate
```

---

## 🏗️ Contribuição

Se quiser contribuir, siga os passos:
1. Fork o repositório
2. Crie uma branch: `git checkout -b minha-branch`
3. Commit suas alterações: `git commit -m 'Minha contribuição'`
4. Faça push: `git push origin minha-branch`
5. Abra um Pull Request

---

## 📜 Licença

Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo `LICENSE`.

