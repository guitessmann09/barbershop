# 🪒 BarberShop - Sistema de Agendamento

<div align="center">
  <img src="public/logo.png" alt="BarberShop Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.17-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Stripe](https://img.shields.io/badge/Stripe-Pagamentos-6772e5?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
</div>

## 📋 Sobre o Projeto

BarberShop é uma aplicação moderna e intuitiva para gerenciamento de agendamentos de barbearia. Desenvolvida com as mais recentes tecnologias do mercado, oferece uma experiência fluida tanto para clientes quanto para profissionais.

### ✨ Principais Funcionalidades

- 📅 Sistema de agendamento intuitivo
- 👤 Perfis personalizados para clientes e barbeiros
- ⭐ Planos de assinatura com benefícios exclusivos
- 💳 Integração com Stripe para pagamentos recorrentes
- 🎨 Interface moderna e responsiva
- 🔒 Autenticação segura
- 📱 Design mobile-first

## 🚀 Tecnologias Utilizadas

- **Frontend:**

  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Day Picker
  - Embla Carousel
  - ShadCN
  - Stripe.js

- **Backend:**

  - Next.js API Routes
  - Prisma ORM
  - BetterAuth
  - PostgreSQL
  - Stripe (pagamentos e webhooks)

- **Ferramentas de Desenvolvimento:**
  - ESLint
  - Prettier
  - Husky
  - TypeScript

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/barbershop.git
cd barbershop
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Além das variáveis padrão, adicione as chaves do Stripe:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET_KEY=whsec_...
```

Copie o exemplo:

```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run prepare` - Configura o Husky

## 🆕 Novidades

### Sistema de Assinaturas

- Planos de assinatura com diferentes benefícios (ex: Corte Standard, Plus, Premium, etc).
- Checkout integrado com Stripe para pagamentos recorrentes.
- Webhooks para atualização automática do status da assinatura do usuário.
- Página exclusiva para visualizar e gerenciar assinaturas.

### Novos Componentes

- Banner animado promovendo planos de assinatura.
- Cards de assinatura e diálogo de assinatura.
- Componentes de loading e separadores visuais.

### Banco de Dados

- Novas tabelas e seeds para assinaturas e benefícios.
- Migrações automatizadas para suportar o novo fluxo de assinatura.

### Como testar o Stripe em modo sandbox

1. Crie uma conta em [Stripe](https://dashboard.stripe.com/test/dashboard).
2. Copie as chaves de API e webhook para o arquivo `.env`.
3. Use cartões de teste fornecidos pela Stripe para simular pagamentos.

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Guilherme Tessmann - [@gui_tessmann](https://www.instagram.com/gui_tessmann/) - tessmanng9@gmail.com

Link do Projeto: [https://dandys-den.vercel.app/](https://dandys-den.vercel.app/)
