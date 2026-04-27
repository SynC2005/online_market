# Development Setup Guide

Panduan lengkap untuk setup lingkungan development Fluid Market.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [IDE Configuration](#ide-configuration)
4. [Database Setup](#database-setup)
5. [Local Authentication](#local-authentication)
6. [Running the Application](#running-the-application)
7. [Development Workflow](#development-workflow)
8. [Debugging](#debugging)
9. [Code Quality & Testing](#code-quality--testing)

---

## Prerequisites

### Required Software

```bash
# Node.js v20+ (recommended v22)
node --version
# v22.x.x

# npm v10+
npm --version
# 10.x.x

# Git v2.30+
git --version
# git version 2.40.0

# Docker (optional, for local database)
docker --version
# Docker version 27.x.x
```

### Installation

**macOS**:
```bash
# Using Homebrew
brew install node@22 git

# Or download from:
# - https://nodejs.org
# - https://git-scm.com
```

**Windows**:
```bash
# Using Chocolatey
choco install nodejs git

# Or download installers from:
# - https://nodejs.org
# - https://git-scm.com
```

**Linux (Ubuntu/Debian)**:
```bash
# Using apt
sudo apt-get update
sudo apt-get install nodejs npm git

# Or use NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
```

---

## Initial Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/online_market.git
cd online_market
```

### Step 2: Install Dependencies

```bash
npm install

# Production dependencies:
# - next@16.2.3
# - react@19.2.4
# - @supabase/supabase-js@2.101.1
# - next-auth@4.24.13

# Dev dependencies:
# - typescript@5
# - eslint@9
# - tailwindcss@4
```

### Step 3: Verify Installation

```bash
# Check Node
node -v

# Check npm
npm -v

# List installed packages
npm list | head -20
```

---

## IDE Configuration

### VS Code (Recommended)

#### Recommended Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-dotnettools.csharp",
    "github.copilot"
  ]
}
```

Installation:
```bash
# Install extensions automatically
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
```

#### VS Code Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.formatOnSave": true
  },
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

#### VS Code Launch Configuration (`.vscode/launch.json`)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Other IDEs

**WebStorm/IntelliJ IDEA**:
- Built-in Next.js support
- No additional configuration needed

**Vim/Neovim**:
- Ensure TypeScript server installed: `npm install -g typescript`
- Install coc-tsserver plugin

---

## Database Setup

### Option 1: Use Supabase Cloud (Recommended for Development)

#### Create Supabase Project

1. Go to: https://supabase.com
2. Create account or login
3. Create new project:
   - Project name: `fluid-market-dev`
   - Password: Complex password
   - Region: Closest to you
   - Pricing: Free tier OK for development

4. Wait for provisioning (5-10 minutes)

#### Get Connection Details

From Supabase dashboard:
- Go to: `Settings → API`
- Copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

#### Create Tables

Run SQL in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table  
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

#### Setup Row Level Security (RLS)

```sql
-- Users can only view their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Products readable by everyone  
CREATE POLICY "Products publicly readable"
  ON products FOR SELECT
  USING (true);

-- Orders only viewable by owner
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

### Option 2: Local PostgreSQL with Docker

For development without internet:

```bash
# Create docker-compose.yml
cat > docker-compose.dev.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fluid_market
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_dev_data:
EOF

# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Connect with psql
psql postgresql://devuser:devpassword@localhost:5432/fluid_market

# Or use GUI tools:
# - DBeaver: https://dbeaver.io
# - pgAdmin: docker run -p 5050:80 dpage/pgadmin4
```

---

## Local Authentication

### Option 1: Mock Authentication (Fastest for Development)

For development tanpa Keycloak setup:

```typescript
// app/lib/auth-mock.ts
export function mockAuthSession() {
  return {
    user: {
      id: "dev-user-123",
      email: "dev@example.com",
      name: "Developer",
      roles: ["admin", "user"]
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
}
```

Update `.env.local`:
```env
NEXTAUTH_DEBUG=true
NEXTAUTH_SKIP_VERIFICATION=true
USE_MOCK_AUTH=true
```

### Option 2: Keycloak Local Setup

#### Docker Keycloak

```bash
docker run -d \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -p 8080:8080 \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

Access: http://localhost:8080/admin

#### Create Realm

1. Login: admin / admin
2. Create Realm: `fluid-market`
3. Create Client:
   - Client ID: `fluid_market_dev`
   - Client Protocol: `openid-connect`
   - Redirect URI: `http://localhost:3000/api/auth/callback/keycloak`

4. Generate Client Secret:
   - Credentials tab → Copy Secret

#### Update .env.local

```env
KEYCLOAK_ID=fluid_market_dev
KEYCLOAK_SECRET=your_client_secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/fluid-market
```

#### Create Test User

1. In Keycloak: Users → Create User
   - Username: testuser
   - Email: test@example.com
   - First Name: Test

2. Set password: Credentials → Set password

---

## Running the Application

### Development Mode

```bash
# Start development server
npm run dev

# Output:
# ▲ Next.js 16.2.3
# - Local:        http://localhost:3000
# - Environments: .env.local
# ✓ Ready in 2.5s
```

### Build for Production

```bash
# Build application
npm run build

# Output:
# - Compiled client: 1.2 MB
# - Compiled server: 450 KB
# > Probes: 2 valid, 2 invalid

# Start production server
npm start

# Runs on: http://localhost:3000
```

### Lint & Type Check

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit
```

---

## Development Workflow

### Git Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, commit
git add .
git commit -m "feat: add new feature"

# Push & create PR
git push origin feature/your-feature-name

# After review/approval:
git checkout main
git merge feature/your-feature-name
git push origin main

# Delete local branch
git branch -d feature/your-feature-name
```

### File Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.jsx          # Login page
│   └── register/
│
├── (app)/
│   ├── home/
│   │   ├── page.jsx          # User dashboard
│   │   ├── orders/           # User orders
│   │   └── profile/          # User profile
│   │
│   ├── admin/
│   │   ├── page.jsx          # Admin dashboard
│   │   ├── products/         # Product management
│   │   │   ├── page.jsx      # Product list
│   │   │   └── add/          # Add product
│   │   └── orders/           # Order management
│   │
│   └── driver/
│       ├── page.tsx          # Driver dashboard
│       └── deliveries/       # Delivery tracking
│
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.js      # Auth endpoints
│
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── Header.jsx            # App header
│   ├── BottomNav.jsx         # Mobile nav
│   └── ProductCard.jsx       # Product display
│
├── actions/
│   ├── productActions.js     # Server actions for products
│   └── orderActions.js       # Server actions for orders
│
└── lib/
    └── auth.ts               # Auth utilities
```

### Adding New Feature

1. **Create branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Add files**
   ```bash
   mkdir -p app/new-feature/components
   touch app/new-feature/page.jsx
   touch app/new-feature/actions.js
   ```

3. **Implement feature**
   - Write components
   - Add server actions
   - Update styling

4. **Test locally**
   ```bash
   npm run dev
   # Test in browser
   ```

5. **Lint & format**
   ```bash
   npm run lint
   ```

6. **Commit & push**
   ```bash
   git add .
   git commit -m "feat: implement new feature"
   git push origin feature/new-feature
   ```

7. **Create pull request**
   - Push to GitHub
   - Create PR with description
   - Wait for code review

---

## Debugging

### Browser DevTools

1. **Chrome DevTools**
   - F12 or Cmd+Option+I
   - Console tab: View logs
   - Network tab: View API calls
   - Storage tab: Inspect cookies/localStorage

2. **Next.js Debug Mode**
   ```bash
   npm run dev -- --debug
   ```

### Server-Side Debugging

```bash
# Enable debug logging
NODE_DEBUG=http npm run dev

# Or use VS Code debugger
# Press F5 to start debugging session
```

### Common Issues

#### "Module not found" Error

```bash
# Solution: Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

#### TypeScript Errors

```bash
# Check types
npx tsc --noEmit

# Ignore for now (temporarily)
// @ts-ignore
const value = something;
```

#### Authentication Issues

```bash
# Enable NextAuth debug
NEXTAUTH_DEBUG=true npm run dev

# Check .env.local has all required vars
cat .env.local | grep -E 'NEXTAUTH|KEYCLOAK|SUPABASE'
```

#### Database Connection Error

```bash
# Test Supabase connection
curl https://xxxxx.supabase.co -H "Authorization: Bearer $SUPABASE_ANON_KEY"

# Check env vars
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Code Quality & Testing

### ESLint

```bash
# Run linter
npm run lint

# Fix auto-fixable errors
npm run lint -- --fix

# Check specific file
npm run lint -- app/page.tsx
```

### TypeScript

```bash
# Type checking
npx tsc --noEmit

# Build with strict mode
npx tsc --strict --noEmit
```

### Manual Testing Checklist

- [ ] Login/logout works
- [ ] Create product (admin)
- [ ] View products (user)
- [ ] Add to cart
- [ ] Checkout
- [ ] Payment flow
- [ ] Order history
- [ ] Mobile responsiveness
- [ ] Error handling

### Automated Testing (Recommended for Future)

```bash
# Setup Jest
npm install --save-dev jest @testing-library/react

# Create test file
touch app/components/__tests__/ProductCard.test.tsx

# Run tests
npm test
```

---

## Performance Optimization

### Next.js Performance Features

- **Image optimization**: `next/image`
- **Code splitting**: Automatic route-based
- **CSS optimization**: Tailwind purging
- **Bundle analysis**: `npm run build -- --analyze`

### Development Tips

```typescript
// Use server components by default
// Use 'use client' only when needed

// Use useMemo for expensive calculations
const memoized = useMemo(() => expensiveCalculation(), [deps]);

// Use useCallback for event handlers
const handleClick = useCallback(() => { ... }, [deps]);

// Lazy load components
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <p>Loading...</p>
});
```

---

## Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npx tsc --noEmit         # TypeScript check

# Git
git status               # Check changes
git fetch origin          # Get updates
git pull origin main      # Update main branch
git log --oneline        # View commit history

# Database (if using Docker)
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs postgres
docker-compose -f docker-compose.dev.yml down
```

---

## Further Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: April 2026
**Version**: 1.0.0
