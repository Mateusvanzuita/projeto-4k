# 4K Team PWA

Plataforma completa para coaches e alunos gerenciarem treinos, dietas, suplementação e evolução.

## 🚀 Estrutura do Projeto

\`\`\`
├── app/                      # Next.js App Router
│   ├── auth/                # Rotas de autenticação
│   │   └── login/          # Página de login
│   ├── coach/              # Portal do Coach
│   │   └── dashboard/      # Dashboard do coach
│   ├── aluno/              # Portal do Aluno
│   │   └── dashboard/      # Dashboard do aluno
│   ├── layout.tsx          # Layout raiz com AuthProvider
│   ├── page.tsx            # Splash screen e redirecionamento
│   └── globals.css         # Estilos globais e tema
│
├── components/              # Componentes reutilizáveis
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── splash-screen.tsx   # Tela de splash animada
│   └── protected-route.tsx # HOC para rotas protegidas
│
├── contexts/               # React Context API
│   └── auth-context.tsx   # Contexto de autenticação
│
├── services/               # Camada de serviço (API)
│   ├── auth-service.ts    # Serviço de autenticação
│   └── api-service.ts     # Cliente HTTP genérico
│
├── hooks/                  # Custom React Hooks
│   └── use-api.ts         # Hook para chamadas API
│
├── types/                  # TypeScript Types
│   ├── auth.ts            # Types de autenticação
│   └── api.ts             # Types de API
│
└── public/                 # Arquivos estáticos
    └── manifest.json      # PWA manifest
\`\`\`

## 🎨 Design System

**Cores principais:**
- Primary: `#003E63` (Azul escuro)
- Secondary: `#F2B139` (Dourado)
- Background: `#FAFAFA` (Cinza claro)
- Foreground: `#1A1A1A` (Preto)

## 🔐 Autenticação

### Credenciais de Teste (Mock)

**Coach:**
- Email: `coach@4kteam.com`
- Senha: `coach123`

**Aluno:**
- Email: `aluno@4kteam.com`
- Senha: `aluno123`

### Fluxo de Autenticação

1. **Splash Screen** (3 segundos) → Redireciona para login
2. **Login** → Valida credenciais e retorna JWT + role
3. **Redirecionamento** baseado no papel:
   - `coach` → `/coach/dashboard`
   - `aluno` → `/aluno/dashboard`

### Sistema de Tokens

- **Access Token**: Armazenado em sessionStorage/localStorage
- **Refresh Token**: Usado para renovar access token
- **Auto-refresh**: A cada 14 minutos (antes de expirar)
- **Persistência**: Opção "Lembrar-me" usa localStorage

## 🔧 Integração com Backend

### Preparação para API Real

Todos os serviços estão preparados para integração com backend. Procure por comentários `TODO:` no código:

**auth-service.ts:**
\`\`\`typescript
// TODO: Replace mock implementation with actual API call
async login(email: string, password: string): Promise<LoginResponse> {
  // Substitua esta implementação mock pela chamada real:
  // const response = await fetch(`${this.apiUrl}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password }),
  // })
}
\`\`\`

**api-service.ts:**
- Cliente HTTP genérico com interceptors
- Refresh automático de tokens
- Tratamento de erros 401
- Headers de autenticação automáticos

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_URL=https://sua-api.com/api
\`\`\`

## 📱 PWA Features

- ✅ Manifest configurado
- ✅ Splash screen nativa
- ✅ Tema customizado
- ✅ Ícones adaptáveis
- ⏳ Service Worker (adicionar quando necessário)
- ⏳ Offline support (adicionar quando necessário)

## 🚀 Como Usar

1. **Instalar dependências:**
\`\`\`bash
npm install
\`\`\`

2. **Rodar em desenvolvimento:**
\`\`\`bash
npm run dev
\`\`\`

3. **Build para produção:**
\`\`\`bash
npm run build
npm start
\`\`\`

## 📝 Próximos Passos

1. **Backend Integration:**
   - Substituir mocks por chamadas reais de API
   - Configurar variáveis de ambiente
   - Implementar refresh token no backend

2. **Features do Coach:**
   - CRUD de alunos
   - Criação de protocolos de treino
   - Gestão de dietas e suplementação
   - Dashboard com métricas

3. **Features do Aluno:**
   - Visualização de treinos
   - Registro de evolução
   - Acompanhamento de dieta
   - Histórico de progresso

4. **PWA Avançado:**
   - Service Worker para cache
   - Notificações push
   - Sincronização em background
   - Modo offline completo

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Autenticação**: JWT + Refresh Token
- **State Management**: React Context API
- **PWA**: Next.js PWA ready
