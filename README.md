# 📝 **README.md (completo y profesional)**


# 🌟 Llum Portfolio — Full-Stack Project

Proyecto full-stack construido con:

- **Backend:** Node.js + Express + TypeScript  
- **Base de datos:** PostgreSQL  
- **ORM:** Prisma  
- **Frontend:** React + Vite + TypeScript + TailwindCSS  
- **Contenedores:** Docker & Docker Compose  

Este repositorio contiene todo lo necesario para levantar un entorno moderno de desarrollo totalmente dockerizado.

---

## 📦 Estructura del proyecto


Llum_Portfolio/
│
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md


---

# 🐳 **Ejecución con Docker**

Asegúrate de tener instalados:

- Docker Desktop  
- Node.js 20+ (solo si deseas ejecutar scripts fuera de Docker)

---

## ▶️ **Iniciar todos los servicios**

Desde la raíz del proyecto:

```bash
docker compose up --build
````

Esto iniciará:

| Servicio     | Puerto local                                   | Descripción              |
| ------------ | ---------------------------------------------- | ------------------------ |
| **frontend** | [http://localhost:5173](http://localhost:5173) | React + Vite             |
| **backend**  | [http://localhost:4000](http://localhost:4000) | API REST en Express      |
| **postgres** | localhost:5432                                 | Base de datos PostgreSQL |

---

# 🧠 **Tecnologías utilizadas**

## 🔹 Backend

* Express + TypeScript
* Prisma ORM
* PostgreSQL
* ts-node-dev (hot reload)

### Scripts útiles del backend:

```bash
npm run dev          # Ejecutar servidor en desarrollo
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
```

---

# 🛢️ **Base de datos con Prisma**

### Crear migración:

```bash
npx prisma migrate dev --name init
```

### Regenerar Prisma Client:

```bash
npx prisma generate
```

### Abrir Prisma Studio:

```bash
npx prisma studio
```

---

# 🎨 **Frontend**

Frontend hecho con:

* React
* Vite
* TailwindCSS
* TypeScript

### Ejecutar fuera de Docker (opcional):

```bash
npm run dev
```

---

# ⚙️ **Variables de entorno**

Crear archivo `.env` dentro de `backend/`:

```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/portfolio"
```

Si deseas ejecutar el backend SIN Docker, debes cambiar `postgres` por `localhost`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
```

---

# 🐳 **docker-compose.yml**

Coordina los tres servicios:

* postgres
* backend
* frontend

El backend espera a la DB, y el frontend espera al backend.

---

# 🧪 **Endpoints del backend**

Ejemplo de endpoint inicial:

```http
GET http://localhost:4000/
```

Respuesta:

```json
{ "message": "API funcionando correctamente 🚀" }
```

Puedes agregar tus rutas dentro de `src/app.ts`.

---

# 🚀 Deployment futuro

Este proyecto puede desplegarse fácilmente en:

* Render
* Railway
* Fly.io
* Vercel (solo frontend)

Si deseas generar archivos de producción (imágenes más ligeras), puedo ayudarte.

---

# 🤝 Contribuciones

Pull requests y sugerencias siempre son bienvenidas.
Si encuentras algún bug, abre un issue ✨.
