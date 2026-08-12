# 🏢 InfoAsses — Enterprise Mini ERP & CRM System

A modern, full-stack Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) platform built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (Neon DB), React 18, Vite, and Tailwind CSS.

---

## 📋 Table of Contents

1. [Live URLs & Access Credentials](#-live-urls--access-credentials)
2. [5. API Documentation & Postman Collection](#5-api-documentation--postman-collection)
3. [6. Setup and Deployment Instructions](#6-setup-and-deployment-instructions)
4. [7. System Architecture Explanation](#7-system-architecture-explanation)
5. [8. Known Limitations & Future Roadmap](#8-known-limitations--future-roadmap)

---

## 🌐 Live URLs & Access Credentials

| Resource | URL |
| :--- | :--- |
| **GitHub Repository** | [https://github.com/sk7dixit/InfoAsses.git](https://github.com/sk7dixit/InfoAsses.git) |
| **Live Frontend App** | [https://infoasse-frontend.onrender.com](https://infoasse-frontend.onrender.com) *(or local `http://localhost:5173`)* |
| **Live Backend API** | [https://infoasse-backend.onrender.com/api/v1](https://infoasse-backend.onrender.com/api/v1) *(or local `http://localhost:5000`)* |

### 🔑 Test Credentials (Role-Based Access Control)

| Role | Username / Employee ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin_emp` | `Admin@12` | Full system access (Employees, Users, Inventory, Sales, Accounts) |
| 💼 **Sales** | `saleemp_001` | `Sales@12` | Customer CRM, Lead Tracking, Product Catalog, Delivery Challan Creation |
| 📦 **Warehouse** | `whemp_001` | `House@12` | Product Master, Stock Adjustments, Inventory Audits, Warehouse Shelving |
| 📊 **Accounts** | `acemp_001` | `Account@12` | Financial Records, Invoices, Delivery Challan Audits & Verification |

---

## 5. API Documentation & Postman Collection

### 📬 Postman Collection
A pre-configured Postman v2.1 collection file is included directly in the root repository directory:
👉 [`postman_collection.json`](./postman_collection.json)

**How to use:**
1. Open Postman → Click **Import** → Select `postman_collection.json`.
2. Set the `baseUrl` variable to `http://localhost:5000/api/v1` (or your live Render backend URL).
3. Execute **Login** to receive a JWT bearer token, then set `token` in collection authorization.

### 🔌 REST API Endpoints Overview

| Module | Method | Endpoint | Auth | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | All | Authenticate user & return JWT token |
| **Auth** | `GET` | `/api/v1/auth/me` | Bearer | All | Fetch active user profile |
| **Employees** | `GET` | `/api/v1/employees` | Bearer | Admin | List all employees with pagination & role filters |
| **Employees** | `POST` | `/api/v1/employees` | Bearer | Admin | Create employee & link system user account |
| **Employees** | `PATCH` | `/api/v1/employees/:id/status` | Bearer | Admin | Enable/disable employee login access |
| **Products** | `GET` | `/api/v1/products` | Bearer | All | List products, stock levels, and warehouse locations |
| **Products** | `POST` | `/api/v1/products` | Bearer | Admin, Warehouse | Add new product master item |
| **Products** | `PUT` | `/api/v1/products/:id` | Bearer | Admin, Warehouse | Update product details & price |
| **Products** | `DELETE` | `/api/v1/products/:id` | Bearer | Admin | Delete product master record |
| **Customers** | `GET` | `/api/v1/customers` | Bearer | Admin, Sales, Accounts | Fetch customer directory |
| **Customers** | `POST` | `/api/v1/customers` | Bearer | Admin, Sales | Register new CRM customer |
| **Challans** | `GET` | `/api/v1/challans` | Bearer | All | List sales delivery challans |
| **Challans** | `POST` | `/api/v1/challans` | Bearer | Admin, Sales | Issue new delivery challan & adjust stock |
| **Challans** | `PATCH` | `/api/v1/challans/:id/status` | Bearer | Admin, Accounts, Warehouse | Update delivery challan status |
| **Inventory** | `POST` | `/api/v1/inventory/movement` | Bearer | Admin, Warehouse | Record manual stock IN/OUT adjustments |

---

## 6. Setup and Deployment Instructions

### 💻 Local Development Setup

#### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+)
- **Database**: PostgreSQL / Neon Cloud Database instance

#### Step 1: Clone Repository
```bash
git clone https://github.com/sk7dixit/InfoAsses.git
cd InfoAsses
```

#### Step 2: Backend Configuration & Server Start
```bash
cd backend
npm install

# Create .env file in backend directory
cp .env.example .env
```
Ensure your `backend/.env` contains:
```env
PORT=5000
DATABASE_URL="postgresql://neondb_owner:npg_qIDcQhT9Ks8a@ep-steep-mountain-axzkykvj-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="mini_erp_crm_super_secret_jwt_key_2026"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```
Generate Prisma Client & Seed Database:
```bash
npx prisma generate
npx ts-node prisma/seed.ts

# Start Backend Dev Server
npm run dev
```

#### Step 3: Frontend Configuration & Start
```bash
# Open new terminal in project root
cd frontend
npm install

# Create .env file in frontend directory
cp .env.example .env
```
Ensure your `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start Frontend Dev Server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

### 🚀 Production Deployment (Render)

The project includes a ready-to-use [`render.yaml`](./render.yaml) blueprint for 1-click Render deployment.

#### A. Deploy Backend Web Service on Render
1. Go to **Render Dashboard** → **New +** → **Web Service**.
2. Connect your GitHub repository `InfoAsses`.
3. Set configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://...`
   - `JWT_SECRET`: `[Your-Secret]`
   - `FRONTEND_URL`: `https://[your-frontend].onrender.com`

#### B. Deploy Frontend Static Site on Render
1. Go to **Render Dashboard** → **New +** → **Static Site**.
2. Connect your GitHub repository `InfoAsses`.
3. Set configuration:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://[your-backend-service].onrender.com/api/v1`

---

## 7. System Architecture Explanation

### 🏗️ Architecture Overview

The system follows a **Decoupled Client-Server Multi-Tier Architecture**:

```
 ┌────────────────────────────────────────────────────────┐
 │            Client Browser (React 18 + Vite)           │
 └───────────────────────────┬────────────────────────────┘
                             │ REST API (HTTPS / JSON + Bearer JWT)
 ┌───────────────────────────▼────────────────────────────┐
 │           Node.js + Express REST API Server            │
 ├────────────────────────────────────────────────────────┤
 │ • Controller / Route Layer                             │
 │ • JWT Authentication & Role RBAC Middleware            │
 │ • Business Service Logic                               │
 └───────────────────────────┬────────────────────────────┘
                             │ Prisma ORM Client Queries
 ┌───────────────────────────▼────────────────────────────┐
 │          Neon Serverless PostgreSQL Database          │
 └────────────────────────────────────────────────────────┘
```

### 🔒 Security & Role-Based Access Control (RBAC)
- **JWT Authorization**: Requests carry a signed JSON Web Token in the `Authorization: Bearer <token>` header.
- **Strict Role Verification**: Role claims (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`) are validated on both backend API routes and frontend React component guards.
- **Password Security**: Passwords are hashed using `bcryptjs` before storage.

### 🎨 Frontend UI/UX Design System
- Built with **React 18**, **TypeScript**, and **Tailwind CSS**.
- **Interactive Micro-animations**: Leverages **Framer Motion** and **WebGL (OGL)** for smooth page transitions and responsive user interactions.
- **State Management & Caching**: **TanStack React Query** handles API data caching, background revalidation, and optimistic updates.

---

## 8. Known Limitations & Future Roadmap

### ⚠️ Known Limitations

1. **Free Tier Cold Start Latency**:
   - On free hosting tiers (e.g. Render Free Web Services), the backend service spins down after 15 minutes of inactivity. Initial cold-start requests may take 20–30 seconds.
2. **Polling vs WebSockets for Live Updates**:
   - Inventory movements and stock status updates currently rely on HTTP request revalidation rather than bi-directional WebSocket connections.
3. **PDF Document Rendering**:
   - Delivery Challan PDF printing is generated client-side via print stylesheets rather than a dedicated server-side Puppeteer PDF generation service.

### 🔮 Future Roadmap (v2.0)
- [ ] Implement WebSocket server for real-time inventory threshold alerts.
- [ ] Add PDF generation service for formal tax invoices and delivery receipts.
- [ ] Mobile PWA support with offline stock scanning via barcode scanner integration.
- [ ] Automated E2E testing suite with Playwright.
