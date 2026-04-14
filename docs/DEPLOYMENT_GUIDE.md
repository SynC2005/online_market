# Panduan Deployment Fluid Market

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Vercel Production Deployment](#vercel-production-deployment)  
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Sebelum melakukan deployment, pastikan Anda memiliki:

### System Requirements
- **Node.js**: v20+ (Recommended v22)
- **npm**: v10+
- **Docker**: v20+ (untuk Docker deployment)
- **Git**: v2.30+

### External Services Account
- [x] **Supabase Account**: https://supabase.com
- [x] **Keycloak Server**: Self-hosted atau cloud
- [x] **Vercel Account** (untuk production): https://vercel.com
- [x] **Midtrans Account** (untuk payment): https://midtrans.com
- [x] **GitHub Account**: Untuk CI/CD pipeline

### Credentials & Keys (dari setiap service)
```
From Supabase:
  ✓ NEXT_PUBLIC_SUPABASE_URL
  ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
  ✓ SUPABASE_SERVICE_ROLE_KEY

From Keycloak:
  ✓ KEYCLOAK_ID
  ✓ KEYCLOAK_SECRET
  ✓ KEYCLOAK_ISSUER

Generated Locally:
  ✓ NEXTAUTH_SECRET (openssl rand -base64 32)

From Vercel (optional):
  ✓ VERCEL_TOKEN
  ✓ VERCEL_ORG_ID
  ✓ VERCEL_PROJECT_ID
```

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/online_market.git
cd online_market
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected output:
```
up to date, audited 164 packages in 5s
found 0 vulnerabilities
```

### Step 3: Setup Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Edit file dengan editor favorit
nano .env.local
# atau
code .env.local
```

**Template .env.local** yang harus diisi:

```env
# =========================
# Application Setup
# =========================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# =========================
# Supabase Configuration
# =========================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# =========================
# Keycloak OIDC Provider
# =========================
KEYCLOAK_ID=fluid_market_client
KEYCLOAK_SECRET=your_client_secret
KEYCLOAK_ISSUER=https://auth.example.com/realms/master

# =========================
# Midtrans (Payment Gateway) - Optional
# =========================
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_SERVER_KEY=your_server_key
```

### Step 4: Generate NEXTAUTH_SECRET

```bash
# Generate secure random string
openssl rand -base64 32

# Output: G+a8nK/zP9mL4xY2bQ7jW5vH3cF1rD8sT6uI9kE0
# Copy ke NEXTAUTH_SECRET dalam .env.local
```

### Step 5: Start Development Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 16.2.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Step 6: Access Application

Buka browser ke: `http://localhost:3000`

**Login Flow**:
1. Click "Login"
2. Redirected ke Keycloak
3. Enter credentials
4. Redirect ke `/home` atau `/admin`

### Troubleshooting Development

| Problem | Solution |
|---------|----------|
| Port 3000 already in use | `npm run dev -- -p 3001` |
| Module not found error | Delete `node_modules` & `package-lock.json`, run `npm install` |
| Supabase connection error | Check NEXT_PUBLIC_SUPABASE_URL format |
| Keycloak not found | Verify KEYCLOAK_ISSUER URL is accessible |

---

## Docker Deployment

### Step 1: Build Docker Image

```bash
docker build -t fluid-market:latest .
```

Output:
```
[1/4] FROM node:22-alpine
...
Successfully built abc123def456
Successfully tagged fluid-market:latest
```

### Step 2: Prepare Environment File

```bash
# Create .env.docker file
cat > .env.docker << EOF
NODE_ENV=production
NEXTAUTH_URL=https://app.example.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
KEYCLOAK_ID=your_id
KEYCLOAK_SECRET=your_secret
KEYCLOAK_ISSUER=https://auth.example.com/realms/master
EOF
```

### Step 3: Run Docker Container

```bash
# Run single container
docker run -d \
  --name fluid-market \
  --env-file .env.docker \
  -p 3000:3000 \
  -e NODE_ENV=production \
  fluid-market:latest

# Check if running
docker ps | grep fluid-market
```

### Step 4: Verify Container Health

```bash
# Check logs
docker logs fluid-market

# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Expected: "Up X seconds (healthy)"
```

### Step 5: Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Step 6: Access Application

```bash
# Local access
curl http://localhost:3000

# From remote
curl https://your-domain.com
```

### Scaling with Docker

```bash
# Run multiple instances behind load balancer
docker-compose up -d --scale app=3

# Use Nginx/HAProxy for load balancing
# Configure: docker-compose.yml
```

---

## Vercel Production Deployment

### Option 1: Deploy via Git (Recommended)

#### Step 1: Connect Repository to Vercel

```bash
# Login ke Vercel
vercel login

# Link project
vercel link

# Follow prompts:
# - Select existing project or create new
# - Configure build settings
# - Set environment variables
```

#### Step 2: Set Environment Variables in Vercel

Go to: `https://vercel.com/dashboard/your-project/settings/environment-variables`

Add each variable:
```
NEXT_PUBLIC_SUPABASE_URL: https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: your_key
SUPABASE_SERVICE_ROLE_KEY: your_key
NEXTAUTH_SECRET: your_generated_secret
NEXTAUTH_URL: https://your-domain.com
KEYCLOAK_ID: your_id
KEYCLOAK_SECRET: your_secret
KEYCLOAK_ISSUER: https://auth.example.com/realms/master
```

#### Step 3: Deploy

```bash
# Deploy to production
vercel --prod

# Output:
# Vercel CLI 33.5.0
# > Production: https://fluid-market.vercel.app [in 2m]
# > HTTP2 Push: enabled
```

#### Step 4: Configure Custom Domain

In Vercel dashboard:
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records (provided by Vercel)
4. Wait 24-48 hours for DNS propagation

### Option 2: Deploy via GitHub Actions

CI/CD pipeline otomatis menghandle deployment:

```yaml
# .github/workflows/ci-cd.yml
# Automatically deploys to Vercel on push to main
```

Workflow:
1. Push code ke `main` branch
2. GitHub Actions triggered
3. Tests & build ran
4. Auto-deployed ke Vercel production

### Step 3: Verify Deployment

```bash
# Check deployment
vercel list

# View logs
vercel logs --prod

# Health check
curl https://your-domain.com/health
```

---

## Environment Configuration

### Development (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Staging (.env.staging)
```env
NEXTAUTH_URL=https://staging.example.com
NODE_ENV=production
```

### Production (.env.production)
```env
NEXTAUTH_URL=https://app.example.com
NODE_ENV=production
```

### Validation Checklist

```bash
# ✓ Check all required env vars present
node -e "
const required = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'KEYCLOAK_ID',
  'KEYCLOAK_SECRET',
  'KEYCLOAK_ISSUER'
];
const missing = required.filter(v => !process.env[v]);
console.log(missing.length ? '❌ Missing: ' + missing.join(', ') : '✅ All vars set');
"
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check HTTP connectivity
curl -I https://app.example.com

# Check API health
curl https://app.example.com/api/health

# Expected: 200 OK
```

### 2. Authentication Verification

```bash
# Test login flow
1. Visit https://app.example.com
2. Click Login
3. Verify redirect to Keycloak
4. Login with test account
5. Verify redirect back to app
6. Check session cookie set
```

### 3. Database Connectivity

```bash
# Check Supabase status
curl https://status.supabase.com

# Verify queries working
# In app: Create new product / order
# Check data appears in Supabase dashboard
```

### 4. Payment Gateway Test

```bash
# Test Midtrans integration
# Use test card: 4111111111111111
# Verify payment goes through
# Check transaction in Midtrans dashboard
```

### 5. Performance Monitoring

```bash
# Check Core Web Vitals
# Vercel Dashboard → Analytics → Core Web Vitals

# Expected:
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
```

### 6. Security Verification

```bash
# HTTPS check
curl -I https://app.example.com | grep "Strict-Transport"
# Expected: Strict-Transport-Security: max-age=31536000

# CORS check
curl -H "Origin: https://external.com" \
  -H "Access-Control-Request-Method: GET" \
  https://app.example.com

# SecurityHeaders check
curl -I https://app.example.com | grep -i "x-content-type-options"
# Expected: X-Content-Type-Options: nosniff
```

---

## Troubleshooting Deployment

### Issue: Build Fails on Vercel

**Symptom**: Build error in Vercel dashboard

**Solutions**:
```bash
# 1. Check local build works
npm run build

# 2. Check TypeScript errors
npm run build -- --debug

# 3. Verify all env vars set in Vercel

# 4. Check build logs in Vercel dashboard
# https://vercel.com/dashboard/project-name/deployments
```

### Issue: Authentication Not Working

**Symptom**: Login page blank or redirect loop

**Solutions**:
```bash
# 1. Verify NEXTAUTH_URL matches domain
# In .env production: NEXTAUTH_URL=https://app.example.com

# 2. Check NEXTAUTH_SECRET consistent across deploys
# Same value in all environments

# 3. Verify Keycloak redirect URI
# In Keycloak console: Add https://app.example.com/api/auth/callback/keycloak

# 4. Check logs: Vercel dashboard → Deployment logs
```

### Issue: Database Connection Timeout

**Symptom**: 504 Gateway Timeout or "Cannot connect to database"

**Solutions**:
```bash
# 1. Check Supabase status
# https://status.supabase.com

# 2. Verify SERVICE_ROLE_KEY in env
# Mismatched key causes 403 errors

# 3. Check connection pool limit
# Supabase dashboard → Database → Connections
# If at max (100), scale up plan

# 4. Verify IP whitelist (if configured)
# Vercel IPs: Check Vercel docs
```

### Issue: 500 Internal Server Error

**Symptom**: White page with "Internal Server Error"

**Solutions**:
```bash
# 1. Check server logs
vercel logs --prod

# 2. Check error traceback
# Look for: "Error: ..."

# 3. Common causes:
# - Missing env variables
# - Database connection failure
# - Unhandled promise rejection

# 4. Fix and deploy again
git push origin main
```

---

## Monitoring & Maintenance

### Daily Tasks

```bash
# Monitor error rate
# Check: Vercel dashboard → Analytics

# Check application logs
vercel logs --prod --tail

# Monitor database performance
# Supabase dashboard → Monitoring
```

### Weekly Tasks

```bash
# Verify backups
# Supabase dashboard → Backups

# Check dependency updates
npm outdated

# Review security alerts
# GitHub → Settings → Code security & analysis
```

### Monthly Tasks

```bash
# Update dependencies
npm update

# Run security audit
npm audit

# Review performance metrics
# Vercel dashboard → Analytics → Core Web Vitals

# Backup configuration
# Export .env vars somewhere secure
```

### Scaling Guide

**When to scale**:
- Response time increasing (> 200ms p95)
- Error rate increasing (> 0.1%)
- Database connections maxing out

**How to scale**:
```bash
# 1. Upgrade Supabase plan
# Supabase dashboard → Settings → Billing

# 2. Upgrade Vercel plan (if needed)
# Vercel dashboard → Settings → Billing

# 3. Add caching layer (Redis)
# For high-traffic scenarios

# 4. Implement database read replicas
# Supabase can add replicas for read-heavy workloads
```

---

## Rollback Procedure

If deployment causes issues:

```bash
# View deployment history
vercel list deployments

# Rollback to previous version
vercel rollback

# Or manually redeploy from previous code
git revert <commit-hash>
git push origin main
```

---

## Disaster Recovery

### Database Backup

```bash
# Supabase handles daily backups
# Restore via: Supabase dashboard → Backups

# Manual backup (PostgreSQL)
pg_dump postgresql://user:pass@db.supabase.co:5432/postgres > backup.sql

# Restore
psql postgresql://user:pass@db.supabase.co:5432/postgres < backup.sql
```

### Application Backup

```bash
# All code stored in Git
# Easy to redeploy any previous version

# Env vars stored in Vercel/GitHub Secrets
# Keep encrypted backup somewhere secure
```

### Contact List for Emergencies

```
On-call Developer: contact info
DevOps Lead: contact info  
CTO: contact info
Incident Commander: contact info
```

---

**Last Updated**: April 2026
**Version**: 1.0.0
