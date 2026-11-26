# Bot Orders · Rotisería Sin TACC

Chatbot de WhatsApp + panel web para una rotisería sin TACC. El equipo carga productos, stock,
precios y horarios desde el panel, y el bot atiende a los clientes usando **solo** esos datos.
Cada pedido llega al panel en tiempo real y un empleado lo confirma o rechaza.

> Proyecto personal de portfolio. Estado: en construcción (Sprint 1).

## Stack

Next.js (App Router) · TypeScript estricto · Tailwind CSS · PostgreSQL + Prisma · Auth.js · zod ·
WhatsApp Cloud API · Vitest · GitHub Actions · Vercel.

## Requisitos

- Node.js 20.9 o superior (probado con 24)
- npm

## Cómo correrlo

```bash
npm install
cp .env.example .env   # en PowerShell: Copy-Item .env.example .env
npm run dev
```

Abrí http://localhost:3000.

## Scripts

| Comando                | Qué hace                          |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Servidor de desarrollo            |
| `npm run build`        | Build de producción               |
| `npm run start`        | Corre el build de producción      |
| `npm run lint`         | Revisa el código con ESLint       |
| `npm run typecheck`    | Revisa los tipos con TypeScript   |
| `npm run format`       | Formatea todo con Prettier        |
| `npm run format:check` | Verifica el formato sin modificar |
| `npm test`             | Corre los tests con Vitest        |

## Estructura de carpetas

```
app/      Rutas y pantallas (App Router de Next.js)
lib/      Código compartido: utilidades, schemas de zod, constantes
server/   Lógica solo de servidor: bot, pedidos, WhatsApp, acceso a datos
prisma/   Schema y migraciones de la base de datos
public/   Archivos estáticos
```

## Roles

| Acción                               | Dueño | Empleado |
| ------------------------------------ | ----- | -------- |
| Gestionar usuarios                   | Sí    | No       |
| Cambiar precios                      | Sí    | No       |
| Crear y borrar categorías            | Sí    | No       |
| Cambiar nombre y orden de categorías | Sí    | Sí       |
| Crear y borrar productos             | Sí    | No       |
| Editar la ficha de un producto       | Sí    | Sí       |
| Cambiar stock                        | Sí    | Sí       |
| Confirmar o rechazar pedidos         | Sí    | Sí       |

La definición está en `lib/permisos.ts`. Cada página y Server Action restringida llama a
`requirePermission()`.

## Reglas del producto

El bot nunca inventa datos (todo sale de la base), la IA solo clasifica la intención, y si falta
un dato se deriva a una persona. Detalle completo en `CLAUDE.md`.
