# EGTech — Loja de Eletrônicos

Site da loja construído em Next.js (App Router), com login, carrinho, checkout
e pagamentos via **Asaas** (cartão de crédito transparente + PIX).

## O que já funciona

- **Login/cadastro** com e-mail e senha (e login com Google, se configurado)
- **Carrinho** persistido no navegador
- **Checkout** com endereço (busca automática por CEP), CPF/telefone e pagamento
- **Pagamento com cartão**: os dados são enviados direto pro Asaas pelo nosso
  servidor — o cliente nunca vê nem é redirecionado pra tela do Asaas
- **PIX**: gera QR Code e código "Copia e Cola" na hora, direto na nossa página
- **Webhook do Asaas**: confirma pagamentos automaticamente e atualiza o pedido
- **Painel admin** (`/admin`): cadastro de produtos, pedidos e faturamento reais
- **Minha conta / Meu perfil**: histórico de pedidos e dados pessoais

## Antes de rodar pela primeira vez

Você vai precisar de 3 coisas (todas com plano gratuito):

1. **Um banco Postgres** — recomendo o [Neon](https://neon.tech) (gratuito, e
   também dá pra conectar direto pela Vercel em Storage > Create Database).
2. **Uma conta no [Asaas](https://www.asaas.com)** com uma chave de API
   (Configurações > Integrações > Chaves de API). Comece pela chave de
   **sandbox** (ambiente de testes) antes de usar a de produção.
3. Opcional: **credenciais OAuth do Google**, se quiser habilitar o botão
   "Continuar com Google" (senão ele mostra um aviso e o login por e-mail
   continua funcionando normalmente).

### Configurando as variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores (veja os comentários
dentro do próprio arquivo). Localmente:

```bash
cp .env.example .env
```

Depois, **rode as migrações do banco** (isso cria as tabelas):

```bash
npm install
npx prisma migrate dev --name init
```

E finalmente:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Criando o primeiro usuário admin

Por padrão todo mundo que se cadastra vira `CUSTOMER`. Depois de criar sua
conta pelo site normalmente, transforme ela em admin rodando:

```bash
npx prisma studio
```

Abra a tabela `User`, encontre seu usuário e mude o campo `role` de
`CUSTOMER` para `ADMIN`. Agora `/admin` fica acessível pra você.

## Configurando o Asaas

1. **Chave de API**: cole em `ASAAS_API_KEY` no `.env` (e depois nas variáveis
   de ambiente da Vercel). Use `ASAAS_API_URL=https://api-sandbox.asaas.com/v3`
   pra testar, e troque pra `https://api.asaas.com/v3` só quando for vender
   de verdade com a chave de produção.
2. **Webhook**: no painel do Asaas, vá em Integrações > Webhooks e cadastre:
   - URL: `https://SEUDOMINIO.com/api/webhooks/asaas`
   - Token de autenticação: qualquer valor secreto que você escolher — cole
     esse MESMO valor na variável `ASAAS_WEBHOOK_TOKEN`
   - Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`,
     `PAYMENT_REFUNDED`, `PAYMENT_REPROVED_BY_RISK_ANALYSIS`

Sem o webhook configurado, pagamentos em PIX nunca vão ser confirmados
automaticamente (o cliente pagaria mas o pedido ficaria "aguardando" pra
sempre) — então esse passo não é opcional antes de vender de verdade.

## Deploy na Vercel (o projeto já está conectado ao GitHub)

1. No painel da Vercel, vá em **Settings > Environment Variables** do projeto
   e cadastre TODAS as variáveis do `.env.example` (com os valores reais).
2. Dê o deploy normalmente (push pro GitHub já dispara o deploy).
3. Depois do primeiro deploy com sucesso, rode as migrações contra o banco de
   produção — o jeito mais simples é rodar localmente apontando pro banco de
   produção:
   ```bash
   DATABASE_URL="sua-connection-string-de-producao" npx prisma migrate deploy
   ```
4. Configure o webhook do Asaas apontando pro domínio real da Vercel (veja
   seção acima).

## Estrutura do backend (pra quem for mexer no código)

- `prisma/schema.prisma` — modelos do banco (User, Product, Order, etc.)
- `lib/auth.ts` — sessão de login (JWT em cookie), sem depender de biblioteca
  externa de autenticação
- `lib/asaas.ts` — toda a comunicação com a API do Asaas
- `app/actions/` — Server Actions (login, cadastro, produtos, perfil)
- `app/api/orders/route.ts` — cria o pedido e dispara a cobrança
- `app/api/webhooks/asaas/route.ts` — recebe as confirmações de pagamento
- `proxy.ts` — protege `/admin`, `/checkout`, `/minha-conta`, `/meu-perfil`
  (no Next.js 16 o antigo `middleware.ts` foi renomeado pra `proxy.ts`)

## Limitações atuais (próximos passos sugeridos)

- Sem recuperação de senha ("esqueci minha senha")
- Sem endereços salvos/múltiplos cartões (cada compra pede os dados de novo)
- As avaliações de produto na página de produto ainda não são salvas no banco
- Integração automática com fornecedores (CJ Dropshipping) ainda não existe — a tela `/admin/integracao` está marcada como "Em breve". Hoje o cadastro de produto é manual, e em `/admin/pedidos` tem um botão "Enviar ao fornecedor" que só gera o texto do pedido pronto (produtos + endereço do cliente) pra copiar ou mandar no WhatsApp — não envia nada sozinho.

---

Projeto em Next.js 16 (App Router) + Tailwind + Prisma + Postgres.
