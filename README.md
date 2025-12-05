# 📘 **README.md — Llum Portfolio**

# 🌟 Llum Portfolio

Aplicación full-stack construida con:

- **Node.js + Express + TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Docker & Docker Compose**
- **React + Vite + TailwindCSS**

Este proyecto sirve como base para un portafolio profesional completamente desplegable mediante Docker.

---

## 📦 Tecnologías

### **Backend**
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker

### **Frontend**
- React + Vite
- TypeScript
- TailwindCSS

---

## 🚀 Cómo ejecutar el proyecto

### 🔧 **Requisitos previos**
Asegúrate de tener instalado:

- Docker  
- Docker Compose  
- Node.js (solo si deseas ejecutar el frontend fuera de Docker)

---

# 🐳 Ejecutar todo con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
````

Esto levanta:

| Servicio | Puerto | Descripción           |
| -------- | ------ | --------------------- |
| backend  | 4000   | API en Express/Prisma |
| postgres | 5432   | Base de datos         |
| frontend | 5173   | Aplicación React      |

Una vez en ejecución:

👉 **Frontend:** [http://localhost:5173](http://localhost:5173)
👉 **Backend:** [http://localhost:4000/api](http://localhost:4000/api)
👉 **Postgres (Docker):** postgres://user:password@localhost:5432/portfolio

---

## 🗄️ Migraciones de Prisma

Para crear el cliente de Prisma:

```bash
npx prisma generate
```

Para crear una migración:

```bash
npx prisma migrate dev --name init
```

Para abrir Prisma Studio:

```bash
npx prisma studio
```

---

## 📁 Estructura del proyecto

```
Llum_Portfolio/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts
│   │   └── app.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

## 🎨 Frontend (Vite + React + Tailwind)

Si quieres ejecutar el frontend sin Docker:

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Endpoints del backend

| Método   | Ruta          | Descripción                        |
| -------- | ------------- | ---------------------------------- |
| GET      | /api/health   | Verifica que el servidor funciona  |
| GET/POST | /api/projects | CRUD de proyectos (ejemplo futuro) |

---

## 🔐 Variables de entorno

Crea un archivo `.env` dentro de **backend/**:

```
DATABASE_URL="postgresql://postgres:password@postgres:5432/portfolio"
EXPOSED_PORT=4000
```

---

## 👤 Autor

**Oscar**
Proyecto full-stack con Docker, Prisma, PostgreSQL y React.

---

## ⭐ ¿Te gusta este repo?

¡No olvides dejar una estrella en GitHub ⭐!
