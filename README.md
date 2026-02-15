# ATQR Platform

Production-ready QR code SaaS built with Next.js, TypeScript, Firebase, and Stripe.

Live: https://www.atqr.app

---

## Overview

ATQR is a subscription-based QR code generator with advanced customization, cloud saving, and scalable billing integration.

Backend logic is powered by [atqr-functions](https://github.com/Zyrab/atqr-functions), handling Stripe billing, subscription sync, and user data.

The platform supports:

- Static QR generation
- Custom styling (colors, shapes, logo embedding)
- High-quality export (SVG, PNG, JPEG)
- User authentication
- Cloud storage for saved QR codes
- Stripe subscription & 7-day trial system
- Dynamic QR infrastructure (in progress)

---

## Tech Stack

**Frontend**

- Next.js (v16)
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

**Backend / Cloud**

- Firebase Authentication
- Firestore
- Firebase Cloud Functions
- Stripe Checkout & Webhooks

**Deployment**

- Vercel
- GitHub CI

---

## Architecture Highlights

- Debounced QR rendering to optimize performance
- Memoized QR generation logic
- Firestore-based tier logic (free vs paid)
- Stripe webhook synchronization for subscription state
- Optimized SVG export pipeline
- Modular component structure

---

## Features

### Free Users

- Unlimited downloads
- 10 cloud-saved QR codes

### Pro Users

- Unlimited cloud storage
- Dynamic QR support (planned)

---

## Local Development

```bash
git clone https://github.com/Zyrab/atqr-platform
cd atqr-platform
npm install
npm run dev
```

Requires Firebase and Stripe environment variables.

---

### Status

- Active development.
- Dynamic QR resolution logic in progress.
