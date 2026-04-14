# Fluid Market - Online Marketplace for Fresh Products

An enterprise-grade e-commerce platform built with **Next.js 16**, **React 19**, **TypeScript**, and **Supabase**.

---

## 🚀 Quick Start

### For Developers

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Complete Documentation

**Start here**: [BUILD_SUMMARY.md](./docs/BUILD_SUMMARY.md) - Complete project overview with 25,000+ words of documentation

**Core Documentation** (in `/docs/` folder):

1. **[SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md)** - System design, database schema, technology stack
2. **[THREAT_MODELING.md](./docs/THREAT_MODELING.md)** - Security assessment using STRIDE + DREAD methodology, 10 threats identified, measurement results
3. **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment for Vercel, Docker, and local development
4. **[DEVELOPMENT_SETUP.md](./docs/DEVELOPMENT_SETUP.md)** - IDE setup, database configuration, development workflow

## 🎯 Key Features

✅ User authentication via Keycloak OIDC  
✅ Product management (admin)  
✅ Shopping cart & checkout  
✅ Payment via Midtrans  
✅ Order tracking  
✅ Role-based access control  
✅ Row-level security on database  
✅ HTTPS with full encryption  
✅ OWASP Top 10 protected  
✅ Comprehensive threat modeling completed  

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js + Keycloak OIDC
- **Payment**: Midtrans
- **Hosting**: Vercel (CDN + Serverless)
- **Container**: Docker (multi-stage build)
- **CI/CD**: GitHub Actions

## 🔒 Security Status

**Overall Security Score**: 7.5/10 ✅

**10 Threats Assessed** (STRIDE + DREAD):
- ✅ Session Hijacking (DREAD 7.0) - Mitigated
- ✅ SQL Injection (DREAD 6.4) - Protected
- ✅ Data Exposure (DREAD 7.2) - Mitigated
- ✅ DDoS Attack (DREAD 6.0) - Protected
- ✅ Role Escalation (DREAD 4.4) - Prevented
- Plus 5 more threats analyzed and addressed

**Measurement Results**: ✅ 6 of 6 security tests PASSED

See [THREAT_MODELING.md](./docs/THREAT_MODELING.md) for complete assessment.

## 🔄 CI/CD Pipeline

Automated testing & deployment on every push:
1. Lint checking (ESLint)
2. Security scanning (npm audit + SAST)
3. Build & type checking (TypeScript)
4. Docker image build
5. Production deployment (Vercel main branch)

See [SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md#6-cicd-pipeline) for details.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v20+ (recommended v22)
- npm v10+
- Supabase account
- Keycloak OIDC server

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/online_market.git
cd online_market

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Start development
npm run dev

# 5. Open browser
open http://localhost:3000
```

For detailed setup: [DEVELOPMENT_SETUP.md](./docs/DEVELOPMENT_SETUP.md)

## 💻 Development Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npx tsc --noEmit         # TypeScript type checking
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t fluid-market:latest .
docker-compose up -d
```

For complete deployment guide: [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)

## 📞 Support

- **Documentation**: See `/docs/` folder
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/online_market/issues)
- **Security Issues**: security@example.com (DO NOT public)

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: April 2026  
**Security**: 7.5/10 (Target: 9/10 by Q3 2026)
