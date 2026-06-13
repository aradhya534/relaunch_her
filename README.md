# Relaunch Her — Sri Lankan Return-to-Tech Platform

**Relaunch Her** is an investor-facing MVP full-stack website designed to help Sri Lankan women on career breaks upskill, evaluate their capabilities, and gain direct placements at partnering technology companies (such as WSO2, Dialog Axiata, IFS, Sysco LABS, and 99X).

The platform splits user experiences into two roles: **Returners** (women looking to upskill and search for algorithms-bypass jobs) and **Employers** (companies wanting to review candidates, post positions, and manage listing statuses).

---

## 🎨 Brand & Design Tokens

- **Primary Deep Indigo**: `#2D1B69`
- **Accent Electric Teal**: `#00C9B1`
- **Highlight Warm Gold**: `#F5A623`
- **Lavender White Background**: `#F0EBF8`
- **Body Font**: Inter
- **Headings Font**: Playfair Display

---

## 📁 Project Structure

```
/relaunch-her
  ├── README.md               # Setup instructions & developer guide
  │
  ├── /backend (Express API)
  │     ├── index.ts          # Server entry point
  │     ├── package.json      # Node dependency registry
  │     ├── tsconfig.json     # Compiler configuration
  │     ├── /routes           # API routes (auth, users, courses, jobs, applications)
  │     ├── /controllers      # Route controllers
  │     ├── /middleware       # Middleware handlers (auth, roleGuard)
  │     └── /prisma
  │           ├── schema.prisma  # Prisma schema definition
  │           ├── seed.ts        # Database seeder script
  │           └── client.ts      # Persistent JSON db mock client (allows running without setup!)
  │
  └── /frontend (Next.js)
        ├── package.json      # React dependency registry
        ├── tailwind.config.ts# Brand-colored styling sheet
        ├── middleware.ts     # Next.js route protection & role redirection
        ├── /components
        │     ├── /ui         # Buttons, Cards, Pill Badges, ProgressRings
        │     └── /layout     # Sticky Navbar, Sidebars, and Footers
        └── /app
              ├── layout.tsx  # Base layout & font configurations
              ├── page.tsx    # Home landing page
              ├── /login      # Auth credential forms
              ├── /signup     # Auth role selector registration forms
              ├── /assessment # Skills gap evaluation wizard
              ├── /dashboard  # Returner overview charts & courses list
              ├── /courses    # Module syllabus player interfaces
              ├── /jobs       # Placement board with match filters
              └── /employer   # Employer dashboards & posting forms
```

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
Create a file named `.env` in the `/backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/relaunch_her?schema=public"
JWT_SECRET="relaunch_her_super_secret_jwt_key_2026_investor_mvp"
```

### Frontend (`/frontend/.env.local`)
Create a file named `.env.local` in the `/frontend` folder:
```env
NEXTAUTH_SECRET="relaunch_her_nextauth_secret_key_2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## 🔌 Running the Application (Local Dev)

Follow these steps to spin up the application:

### Step 1: Install & Boot Backend
Open a terminal in the `/backend` directory:
```bash
cd backend
npm install
npm run prisma:seed    # Seeds the mock database to backend/prisma/db.json
npm run dev            # Starts backend on http://localhost:5000
```

### Step 2: Install & Boot Frontend
Open a **new** terminal in the `/frontend` directory:
```bash
cd frontend
npm install
npm run dev            # Starts Next.js server on http://localhost:3000
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🗄️ Database Toggle: Mock JSON vs Real PostgreSQL

This MVP comes with an **interactive JSON database mock client** pre-configured in `backend/prisma/client.ts`. This allows the application to run, register users, save CV profiles, post jobs, and complete course modules **instantly, without requiring any local database installation or credentials**.

### How to switch to real PostgreSQL:
When you are ready to transition from JSON mocks to your local PostgreSQL server:

1. Open `backend/prisma/client.ts`.
2. Swap the file contents to export the real database client:
   ```typescript
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   export default prisma;
   ```
3. Update your credentials in `backend/.env` (modify the `DATABASE_URL` string).
4. Run standard Prisma migrations to sync your schema:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

---

## 👥 Seeded Demo Credentials

Use the following seeded accounts to review the respective role experiences:

### 1. Returner Experience
- **Email**: `aradhya@relaunchher.lk`
- **Password**: `demo1234`
- **Features**: Dashboard, Skills Gap Score Circular Progress, Upskilling Courses, Course Player, Job Placement Matching with dynamic fit ratios, and verify badges.

### 2. Employer Experience
- **Email**: `wso2@relaunchher.lk`
- **Password**: `demo1234`
- **Features**: Statistics widgets, Listings toggle controller (Active/Paused), Applicants feed, Post Job forms with reactive board preview layout, and candidate Profile Viewer Modals.
