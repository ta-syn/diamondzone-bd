# 💎 DiamondZoneBD

[![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://diamondzone-bd.vercel.app)
[![Next.js 15](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

**Bangladesh's Most Advanced Gaming Top-Up Platform.**
Instant delivery for Free Fire, PUBG, MLBB, and Valorant with tactical precision.

---

## ⚡ Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB + Mongoose, Redis (ioredis)
- **State Management**: Zustand (Auth, Toasts, Cart)
- **Payment Gateway**: SSLCommerz (bKash, Nagad, Rocket, Cards)
- **Recharge Protocols**: Smile.one Merchant API Integration
- **Emails**: SendGrid API

## 🛰️ Production Setup

### 1. Environment Variables
Create a `.env.local` file with the following coordinates:

```env
# System Uplink
PORT=3000
NEXT_PUBLIC_URL=http://localhost:3000

# Database & Caching
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://default:...

# Tactical Auth
JWT_SECRET=super_secret_cipher_key_here

# Payment Infrastructure (SSLCommerz)
SSLCOMMERZ_STORE_ID=...
SSLCOMMERZ_STORE_PASSWORD=...
SSLCOMMERZ_IS_LIVE=false

# Global Recharge (Smile.one)
SMILEONE_EMAIL=...
SMILEONE_API_KEY=...

# Intelligence Gathering (SendGrid)
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@diamondzone.bd
```

### 2. Strategic Commands
```bash
# Clone the repository
git clone https://github.com/nishan/diamondzone-bd
cd diamondzone-bd

# Install tactical dependencies
npm install

# Run development uplink
npm run dev

# Execute production build
npm run build
```

## 🚀 Deployment (Vercel)
The project is optimized for deployment on Vercel:
1. Push coordinates to GitHub.
2. Link repository to Vercel.
3. Configure all `.env` variables.
4. Set Build Command: `npm run build`
5. Set Output Directory: `.next`

---

## 🛡️ Operational Features
- **Instant Delivery**: Automated Smile.one recharge upon payment confirmation.
- **Reseller Portal**: Special discounted rates for strategic partners.
- **Order Tracking**: High-fidelity live status updates via order codes.
- **Wallet Protocol**: Secure credit deposits and instant one-click recharges.
- **Advanced Security**: Rate-limited endpoints, JWT auth, and SSL encryption.

---

© 2025 **DiamondZoneBD** — Tactical Gaming Intel.
Designed for high-performance operatives.
