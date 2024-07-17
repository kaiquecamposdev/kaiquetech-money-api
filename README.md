### RF (Requisitos Funcionais)

- [ ] Deve ser possível listar uma transação;
- [ ] Deve ser possível listar transações por:
  - [ ] Id
  - [ ] Categoria
  - [ ] Método de pagamento
- [x] Deve ser possível cadastrar uma transação:
  - [x] Nome
  - [x] Preço
  - [x] Desconto
  - [x] Taxa
  - [x] Descrição
  - [x] Categoria
  - [x] Sub-Categoria
  - [x] Método de pagamento
- [x] Deve ser possível cadastrar várias transações importando um CSV;
- [x] Deve ser possível editar uma transação:
  - [x] Nome
  - [x] Preço
  - [x] Desconto
  - [x] Taxa
  - [x] Descrição
  - [x] Categoria
  - [x] Sub-Categoria
  - [x] Método de pagamento
- [x] Deve ser possível deletar uma transação;
- [ ] Deve ser possível exportar os dados das transações para um formato de arquivo como .csv ou .xlsx;
- [ ] Deve ser possível gerar relatórios sobre o fluxo de caixa, incluindo receita total, despesas, lucro, etc;

### RN (Regras de Negócio)

- [x] O valor total da transação deve ser calculado com base no preço, desconto e taxa;
  - Valor Total = Preço - (Desconto + Imposto);
- [ ] Todas as transações devem ser registradas e mantidas no banco de dados;
- [x] Deve ser possível consultar o histórico de transações por data, categoria, método de pagamento, etc;
- [ ] O sistema deve gerar relatórios sobre o fluxo de caixa, incluindo receita total, despesas, lucro, etc;

### RNF (Requisitos Não Funcionais)

- [x] Utilize a biblioteca `csv-parser`;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;

### Configurando Variáveis de Ambiente

1. Arquivo .env:

Crie um arquivo .env na raiz do seu projeto. Adicione cada variável e seu valor, como mostrado abaixo:

```env
NODE_ENV=development
PORT=3000
DATABASE_USER=seu_usuario
DATABASE_NAME=nome_do_banco_de_dados
DATABASE_PASSWORD=sua_senha
```

- NODE_ENV: Define o ambiente da aplicação (development, test e production). Permite personalizar o comportamento da aplicação para cada ambiente.
- PORT: Define a porta em que a aplicação irá escutar as requisições.
- DATABASE_USER: Define o usuário do banco de dados.
- DATABASE_NAME: Define o nome do banco de dados.
- DATABASE_PASSWORD: Define a senha do banco de dados.

### Executando a aplicação

1. Clone o repositório:
```bash
git clone https://github.com/kaiquecamposdev/kaiquetech-money-api.git
```
or
```bash
gh repo clone kaiquecamposdev/kaiquetech-money-api
```

2. Instalar as dependências:
   
```bash
npm i
```
or
```bash
pnpm i
```

3. Criar e executar as migrations:

```bash
npm run prisma:generate && npm run prisma:dev
```
ou
```bash
pnpm prisma:generate && pnpm prisma:dev
```

4. Executar o servidor:

```bash
npm run dev
```
ou
```bash
pnpm dev
```

5. O servidor estará rodando na porta *http://localhost:8000*
