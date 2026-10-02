# Migração do acesso ao banco para Prisma + MySQL

## 1. Objetivo

O projeto utilizava `mysql2/promise` para abrir um pool de conexões e executar SQL manualmente dentro dos modelos. A configuração foi migrada para o **Prisma ORM**, mantendo o **MySQL** como banco relacional SQL.

O resultado combina:

- Prisma Client para consultas tipadas em TypeScript;
- Prisma Migrate para versionar o schema do banco;
- MySQL como provedor SQL, sem trocar o banco já adotado pelo projeto;
- `DATABASE_URL` como configuração única de conexão.

> Prisma não é um banco de dados. Ele é uma camada de acesso ao banco (ORM) e uma ferramenta de schema/migrações. Neste projeto, o banco continua sendo MySQL.

## 2. Como o Prisma funciona neste projeto

O fluxo é:

1. `prisma/schema.prisma` descreve os modelos, tipos, índices e relacionamentos;
2. `prisma migrate dev` compara o schema com o histórico local e cria uma migração SQL;
3. os arquivos em `prisma/migrations` registram a evolução do banco;
4. `prisma generate` gera `@prisma/client`, uma API TypeScript baseada no schema;
5. os modelos da aplicação chamam `prisma.user`, `prisma.complaint` etc., sem montar SQL com strings e placeholders;
6. `prisma migrate deploy` aplica as migrações já versionadas em ambientes de homologação/produção.

### Exemplo de consulta

Antes, o projeto fazia uma consulta manual:

```ts
const [rows] = await connection.execute(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
```

Agora, a mesma operação é feita pelo Prisma:

```ts
return connection.user.findUnique({
  where: { email }
});
```

O Prisma continua gerando SQL para o MySQL internamente, mas a aplicação ganha tipagem, validação do modelo e uma API consistente.

## 3. Configuração do banco

O arquivo `.env.example` contém a configuração esperada:

```env
DATABASE_URL="mysql://root:@localhost:3306/uc32"
```

Formato geral:

```text
mysql://USUARIO:SENHA@HOST:PORTA/BANCO
```

Para uso local:

1. crie o banco `uc32` no MySQL, caso ele ainda não exista;
2. copie `.env.example` para `.env`;
3. ajuste usuário, senha, host, porta e nome do banco;
4. não versionar `.env` — ele está incluído no `.gitignore`.

O arquivo `.env` precisa ficar na raiz do projeto, pois é onde o Prisma CLI procura as variáveis. A aplicação também é iniciada a partir dessa raiz.

## 4. Schema criado

O arquivo `prisma/schema.prisma` representa as duas tabelas existentes:

### `User`

- `id`: inteiro autoincremental e chave primária;
- `name`: `VARCHAR(100)` obrigatório;
- `email`: `VARCHAR(150)` obrigatório e único;
- `password`: `VARCHAR(255)` obrigatório;
- `createdAt`: data de criação, mapeada para `created_at`;
- `complaints`: relação um-para-muitos com `Complaint`.

### `Complaint`

- `id`: inteiro autoincremental e chave primária;
- `userId`: chave estrangeira mapeada para `user_id`;
- `title`: `VARCHAR(150)` obrigatório;
- `description`: `TEXT` obrigatório;
- `status`: enum com `aberta`, `em_analise` e `resolvida`;
- `createdAt`: data de criação, mapeada para `created_at`;
- relação com `User`, com exclusão em cascata;
- índice em `user_id` para acelerar consultas por usuário.

Os atributos `@map` preservam os nomes snake_case que já existem no banco, enquanto o código TypeScript pode usar `createdAt` e `userId` na API interna do Prisma.

## 5. Mudanças realizadas

### Dependências

- adicionado `@prisma/client` na versão `6.19.0`;
- adicionado `prisma` na versão `6.19.0` como dependência de desenvolvimento;
- removido `mysql2`, pois os modelos não usam mais o pool manual;
- o Prisma 6 foi fixado para manter o formato convencional de configuração com `url = env("DATABASE_URL")` no schema e evitar uma migração de API não solicitada para a configuração experimental da versão 7.

### Scripts do `package.json`

- `npm run prisma:generate`: gera/atualiza o Prisma Client;
- `npm run prisma:migrate`: cria e aplica uma migração durante o desenvolvimento;
- `npm run prisma:deploy`: aplica somente migrações já versionadas;
- `npm run prisma:studio`: abre a interface visual do banco;
- `npm run build`: compila TypeScript para `dist`;
- `npm run dev`: inicia o servidor com recarga em desenvolvimento;
- `npm start`: inicia o JavaScript compilado.

### Conexão

`src/database/connection.ts` agora exporta uma instância singleton de `PrismaClient`. Em desenvolvimento, a instância é guardada em `globalThis` para evitar a criação de vários clientes durante recargas do `ts-node-dev`.

### Modelos

- `src/models/User.ts` passou a usar `user.create` e `user.findUnique`;
- `src/models/Complaint.ts` passou a usar `complaint.create`, `complaint.findMany` e `complaint.findFirst`;
- filtros e ordenação agora são objetos tipados do Prisma;
- os métodos de reclamações convertem os campos de saída para o formato legado (`user_id` e `created_at`), reduzindo impacto no restante da aplicação;
- o `id` criado continua sendo retornado pelos métodos `create`.

### Migrações

- adicionada `prisma/migrations/00000000000000_init/migration.sql`, que cria `users`, `complaints`, o enum de status, o índice e a chave estrangeira;
- adicionada `prisma/migrations/migration_lock.toml` com o provedor MySQL;
- removida a antiga `src/database/migrations/001_create_tables.sql` para não manter dois históricos concorrentes de migração.

### Tipos e TypeScript

- `ComplaintStatus` foi extraído para um tipo reutilizável;
- `tsconfig.json` foi criado com configuração compatível com TypeScript 7 e módulo Node16;
- `.env.example` foi criado como modelo seguro de configuração;
- `.gitignore` passou a ignorar `.env`, `node_modules` e `dist`.

## 6. Como instalar e executar

```bash
npm install
cp .env.example .env
# edite DATABASE_URL com as credenciais do seu MySQL
npm run prisma:generate
npm run prisma:deploy
npm run build
npm start
```

Durante o desenvolvimento, para criar uma nova alteração de banco:

```bash
# altere prisma/schema.prisma
npm run prisma:migrate -- --name nome_da_alteracao
npm run prisma:generate
```

O comando `prisma migrate dev` pode solicitar que o banco seja resetado quando detectar divergência entre o histórico e o banco local. Não aceite um reset em um banco com dados importantes sem realizar backup e revisar a migração.

## 7. Validações executadas

Foram executadas com sucesso:

```bash
npx prisma validate
npx prisma generate
npm run build
```

A aplicação não foi conectada a um servidor MySQL durante a validação automática deste pacote; portanto, `prisma migrate deploy` deve ser executado no ambiente que tenha o MySQL disponível e acessível pela `DATABASE_URL`.

## 8. Observações de segurança

- altere `SESSION_SECRET` em ambientes reais;
- use uma senha forte no MySQL;
- não publique `.env` nem credenciais no repositório;
- mantenha as migrações versionadas;
- execute `prisma migrate deploy` em produção, e não `prisma migrate dev`.
