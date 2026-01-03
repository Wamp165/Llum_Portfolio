# Llum_Portfolio

**Llum** is a minimalist, fully editable online portfolio designed for photographers and creatives. It features a public-facing gallery and a protected admin panel to manage categories, works, and layouts dynamically.

## Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS.
* **Backend:** Node.js, Express, TypeScript.
* **Database:** PostgreSQL (via Docker), Prisma ORM.
* **Storage:** Cloudinary (for image assets).

## Requirements

* Node.js (v18+)
* Docker & Docker Compose
* A Cloudinary account (for image hosting keys)

---

## Getting Started

### 1. Database Setup

The project uses a Postgres container defined in `docker-compose.yml`.

```bash
# Start the database container
docker-compose up -d

```

> **Note:** The database runs on port **5433** (mapped from internal 5432) to avoid conflicts with local Postgres instances.

### 2. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install

```

**Environment Variables:**
Create a `.env` file in the `backend/` root with the following values:

```env
# Database connection (User/pass match docker-compose.yml)
DATABASE_URL="postgresql://llum:llum@localhost:5433/llum?schema=public"

# Auth
JWT_SECRET="super-secret-key-change-this"

# Admin Seed Data (Used to create the first user)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="securepassword"

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

```

**Database Migration & Seeding:**
Once the `.env` is ready and Docker is running:

```bash
# Push schema to DB
npx prisma db push

# Seed the initial admin user
npx prisma db seed

```

**Run Server:**

```bash
npm run dev
# Server runs on http://localhost:3001

```

### 3. Frontend Setup

Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install

```

**Environment Variables:**
Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL="http://localhost:3001"

```

**Run Client:**

```bash
npm run dev
# Client runs on http://localhost:5173

```

---

## Usage

1. Open `http://localhost:5173`.
2. Go to `/admin/login`.
3. Log in using the credentials defined in your backend `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
4. From the dashboard, you can:
* Update profile info (Bio, Socials).
* Rename Categories.
* Add Works (Projects).
* Build layout sections for each work (Text, Images, Grids).



## Project Structure

* `backend/src/schemas`: Zod validation schemas.
* `backend/prisma/schema.prisma`: Database models.
* `frontend/src/components`: Reusable UI components.
* `frontend/src/pages/admin`: Protected routes for CMS logic.
