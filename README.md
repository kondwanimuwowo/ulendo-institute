# Ulendo Institute

> **BYOL-inspired subscription-based course platform built with Next.js, Prisma, and PostgreSQL**

A world-class course platform for leadership, personal development, and creative skills. Features plan-based subscriptions with Lenco payments, instructor approval workflow, and a BYOL-inspired conversion-focused UX.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Seeded Credentials](#seeded-credentials)
- [Project Structure](#project-structure)
- [Phase Implementation](#phase-implementation)
- [API Routes](#api-routes)
- [Testing](#testing)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

---

## ✨ Features

### Phase 1 (Current)
- ✅ JWT-based authentication with HttpOnly cookies
- ✅ Complete Prisma schema (Users, Plans, Subscriptions, Courses, Lessons)
- ✅ BYOL-inspired landing page with hero, pricing, testimonials
- ✅ Course catalog with category filtering
- ✅ YouTube video embeds (MVP)
- ✅ Responsive Tailwind v4 styling
- ✅ Server-side rendering for SEO

### Upcoming Phases
- 🔜 **Phase 2**: Instructor application & admin approval workflow
- 🔜 **Phase 3**: Lenco payment integration & subscription gating
- 🔜 **Phase 4**: Instructor content management UI
- 🔜 **Phase 5**: Admin dashboard, CI/CD, production deployment

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (JavaScript, Pages Router)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS v4 (BYOL-inspired design)
- **Authentication**: JWT + bcrypt
- **Payments**: Lenco (server-side integration)
- **Email**: SendGrid (transactional)
- **Video**: YouTube embeds (MVP) → Cloudflare Stream (future)

---

## ✅ Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (local or cloud)
- Git

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
cd c:\Users\kondw\Desktop\repos\ulendo-institute
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values (see [Environment Variables](#environment-variables) section below).

### 4. Start PostgreSQL

**Option A: Local PostgreSQL**
Make sure PostgreSQL is running on your machine (default port 5432).

**Option B: Docker Compose** (recommended)

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ulendo_user
      POSTGRES_PASSWORD: ulendo_password
      POSTGRES_DB: ulendo_institute
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start the container:

```bash
docker-compose up -d
```

Update your `.env` `DATABASE_URL`:
```
DATABASE_URL=postgresql://ulendo_user:ulendo_password@localhost:5432/ulendo_institute
```

### 5. Run Prisma Migrations

Generate the Prisma client and create database tables:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Seed the Database

Populate the database with sample data (admin user, instructors, courses, plans):

```bash
npm run prisma:seed
```

You should see output confirming creation of admin, instructors (Dario, Taonga), categories, courses, and plans.

### 7. Start the Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ulendo_institute

# Authentication (CRITICAL: Use a secure random string in production)
JWT_SECRET=your-very-secure-jwt-secret-min-32-characters-long-change-this-in-production

# Email (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here

# Payment (Lenco)
LENCO_SECRET_KEY=your-lenco-secret-key-here
LENCO_WEBHOOK_SECRET=your-lenco-webhook-secret-here

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **⚠️ Security Reminders**
- **NEVER commit the `.env` file to version control.**
- Rotate `JWT_SECRET` and all API keys immediately if they are ever exposed.
- Use environment-specific secrets (separate for dev, staging, production).

---

## 🗄 Database Setup

### Prisma Studio (Visual Database Explorer)

To visually inspect and edit database records:

```bash
npm run prisma:studio
```

This opens Prisma Studio at **http://localhost:5555**.

### Reset Database (Wipe & Re-Seed)

If you need to reset the database to a clean state:

```bash
npx prisma migrate reset
```

This will:
1. Drop all tables
2. Re-run migrations
3. Re-seed the database

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

---

## 👤 Seeded Credentials

After running `npm run prisma:seed`, the following users are created:

| Role          | Email                        | Password     | Approved |
|---------------|------------------------------|--------------|----------|
| **Admin**     | admin@example.com            | password123  | N/A      |
| **Instructor**| dario@example.com            | password123  | ✅ Yes   |
| **Instructor**| taonga@example.com           | password123  | ✅ Yes   |
| **Pending**   | pending_instructor@example.com | password123 | ❌ No    |

### Test Logins

Use these credentials to test authentication via `/api/auth/login`:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt
```

---

## 📂 Project Structure

```
ulendo-institute/
├── .github/
│   └── workflows/          # CI/CD workflows (Phase 5)
├── components/
│   ├── Layout.js           # Main layout with nav/footer
│   ├── HeroWithCTA.js      # BYOL-inspired hero section
│   ├── PricingTable.js     # Plan comparison table
│   ├── CourseCard.js       # Course preview card
│   ├── LessonList.js       # Lesson list with lock/unlock states
│   └── ProtectedRoute.js   # HOC for auth-protected pages (Phase 2+)
├── lib/
│   ├── prisma.js           # Prisma client singleton
│   ├── auth.js             # JWT & bcrypt helpers
│   ├── validators.js       # Input validation & sanitization
│   ├── sendgrid.js         # SendGrid email wrapper (Phase 2)
│   └── lenco.js            # Lenco payment API wrapper (Phase 3)
├── pages/
│   ├── _app.js             # Next.js app wrapper
│   ├── index.js            # Landing page (BYOL-inspired)
│   ├── pricing.js          # Pricing page with FAQ
│   ├── about.js            # About page
│   ├── faq.js              # FAQ page
│   ├── api/
│   │   ├── auth/           # Auth endpoints (signup, login, logout)
│   │   ├── users/          # User endpoints (me)
│   │   ├── plans.js        # Get all plans
│   │   ├── create-payment.js # Lenco checkout (Phase 3)
│   │   ├── webhooks/       # Lenco webhooks (Phase 3)
│   │   └── instructors/    # Instructor application & approval (Phase 2+)
│   ├── courses/
│   │   ├── index.js        # Course catalog
│   │   └── [slug].js       # Course detail page
│   ├── instructors/        # Instructor dashboard (Phase 4)
│   ├── admin/              # Admin dashboard (Phase 5)
│   └── plans/              # Plan detail pages (Phase 3)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Seed script
├── styles/
│   └── globals.css         # Global styles + Tailwind
├── .env.example            # Environment template
├── .gitignore              # Ignored files
├── next.config.js          # Next.js config
├── package.json            # Dependencies & scripts
├── postcss.config.js       # PostCSS for Tailwind
├── tailwind.config.js      # Tailwind CSS v4 config
└── README.md               # This file
```

---

## 🏗 Phase Implementation

### Phase 1: Core Scaffold & Content ✅ (Current)
- Next.js app scaffold, Tailwind v4, Prisma schema
- Landing page, course pages, pricing page
- Signup/login/logout with JWT cookies
- Seeded data (admin, instructors, courses, plans)

### Phase 2: Instructor Application & Admin Approval 🔜
- `/api/instructors/apply` endpoint
- Admin dashboard to approve/reject instructor applications
- SendGrid integration for application emails
- Enforce `instructorApproved=true` check for instructor actions

### Phase 3: Plans, Payments & Gating 🔜
- Plan CRUD in database
- `/api/create-payment` calling Lenco
- `/api/webhooks/lenco` with signature verification
- Subscription-based content gating (free first lesson, lock rest)

### Phase 4: Instructor Content Management 🔜
- Instructor dashboard UI
- Create/edit course and lesson forms
- Markdown editor for lesson content
- YouTube URL input (video upload Phase 5+)

### Phase 5: Admin Features, CI & Deploy 🔜
- Admin management for plans, subscriptions, users
- GitHub Actions CI workflow
- Full documentation for deployment
- Security checklist & key rotation guide

---

## 🔌 API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user, return JWT
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/users/me` - Get current authenticated user

### Plans
- `GET /api/plans` - List all active subscription plans

### Courses (Upcoming)
- `GET /api/courses` - List all published courses
- `GET /api/courses/:slug` - Get course details

### Instructors (Phase 2+)
- `POST /api/instructors/apply` - Submit instructor application
- `POST /api/instructors/approve` - Admin-only approve instructor

### Payments (Phase 3+)
- `POST /api/create-payment` - Create Lenco checkout session
- `POST /api/webhooks/lenco` - Handle Lenco webhooks

---

## 🧪 Testing

### Manual Testing (Phase 1)

**1. Test Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**2. Test Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c cookies.txt
```

**3. Test Get Current User**
```bash
curl -X GET http://localhost:3000/api/users/me -b cookies.txt
```

**4. Test Get Plans**
```bash
curl http://localhost:3000/api/plans
```

### Webhook Testing (Phase 3)

Use **ngrok** to expose localhost for Lenco webhook delivery:

```bash
ngrok http 3000
```

Then configure the ngrok URL in Lenco dashboard:
```
https://your-ngrok-url.ngrok.io/api/webhooks/lenco
```

Send a test webhook from Lenco's dashboard or use curl:

```bash
curl -X POST http://localhost:3000/api/webhooks/lenco \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice.paid","data":{"subscription_id":"sub_123"}}'
```

---

## 🔐 Security

### Best Practices Implemented
✅ **HttpOnly Cookies** for JWT storage (XSS protection)  
✅ **Secure flag** on cookies in production (HTTPS only)  
✅ **bcrypt** password hashing (10 rounds)  
✅ **Input validation** and **sanitization** on all endpoints  
✅ **No secrets in codebase** (.env.example only)  
✅ **Webhook signature verification** (Phase 3: Lenco)  

### Security Checklist

- [ ] Rotate `JWT_SECRET` immediately if ever exposed
- [ ] Use strong, unique secrets for all environments (dev/staging/prod)
- [ ] Enable HTTPS in production (automatic on Vercel/Netlify)
- [ ] Rotate Lenco API keys if they appear in logs or chat
- [ ] Review Prisma logs before deploying (don't log secrets)
- [ ] Set up rate limiting on auth endpoints (Phase 5)
- [ ] Enable CORS only for trusted domains (Phase 5)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard (from `.env.example`)
4. Auto-deploys on every push to `main`

### Railway / Render

1. Connect GitHub repo
2. Set environment variables
3. Add PostgreSQL service (Railway provides one)
4. Deploy

### Webhook Configuration (Phase 3)

After deploying, update Lenco webhook URL:
```
https://yourdomain.com/api/webhooks/lenco
```

Ensure `LENCO_WEBHOOK_SECRET` matches the secret in Lenco dashboard.

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

This is a private/proprietary project. For questions, contact **kondwanimuwowo**.

---

## 📧 Support

For any issues or questions:
- Email: support@ulendo-institute.com
- GitHub Issues: [Create an issue](https://github.com/kondwanimuwowo/ulendo-institute/issues)

---

**Built with ❤️ by kondwanimuwowo**
