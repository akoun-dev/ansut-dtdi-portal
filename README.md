# Portail des Services Centraux ANSUT

Portail unifié de services numériques internes pour l'**Agence Nationale des Services Universels des Télécommunications (ANSUT)** — Côte d'Ivoire.

## Stack

| Technologie       | Usage                          |
| ----------------- | ------------------------------ |
| **Next.js 16**    | Framework (App Router, React 19) |
| **TypeScript**    | Langage                        |
| **Tailwind CSS 4**| Styling                        |
| **shadcn/ui**     | Composants UI (New York)       |
| **Zustand**       | State management               |
| **TanStack Query**| Data fetching                  |
| **Prisma**        | ORM (SQLite)                   |
| **next-auth**     | Authentification               |
| **next-intl**     | Internationalisation           |
| **Framer Motion** | Animations                     |
| **Recharts**      | Graphiques                     |

## Fonctionnalités

- Tableau de bord centralisé des services ANSUT
- 8 services internes (COCKPIT, CONNECTMAP, FSU CONNECT, LABÉLISATION, L'AFRIQUE MOBILE, MEMO, MON TOIT, RADAR)
- 6 catégories de services
- Surveillance de statut en temps réel (pings HTTP HEAD, auto-refresh 5 min)
- Vue grille / liste avec animations
- Recherche par nom, description ou domaine
- Thème clair / sombre
- Design responsive
- API REST : `GET /api/services`, `GET /api/services/status`

## Prérequis

- [Bun](https://bun.sh) >= 1.x
- Node.js >= 20

## Installation

```bash
bun install
```

## Configuration

```bash
export DATABASE_URL="file:./dev.db"
```

## Scripts

| Commande           | Description                        |
| ------------------ | ---------------------------------- |
| `bun run dev`      | Démarre le serveur de dev (port 3000) |
| `bun run build`    | Build de production (standalone)   |
| `bun run start`    | Lance le serveur de production     |
| `bun run lint`     | Vérification ESLint                |
| `bun run db:push`  | Push du schéma Prisma vers la DB   |
| `bun run db:generate` | Génération du client Prisma    |
| `bun run db:migrate`  | Migration Prisma                |

## Déploiement

Le build produit une sortie standalone dans `.next/standalone/` :

```bash
bun run build
bun run start
```

Un reverse proxy **Caddy** est pré-configuré (port 81 → localhost:3000) avec support de forwarding WebSocket.

## Structure

```
src/
├── app/            # Pages et API routes (App Router)
├── components/     # Composants React (dashboard + ui/)
├── hooks/          # Hooks personnalisés
└── lib/            # Utilitaires, services, DB
prisma/             # Schéma et migrations
examples/           # Exemples (WebSocket)
public/             # Assets statiques
```
