# BlockPerp Frontend

The frontend application for **BlockPerp**, an onchain perpetual trading and protocol analytics platform.

Built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Overview

BlockPerp provides a dashboard interface for exploring perpetual markets, trading activity, positions, and protocol analytics.

The frontend is being developed incrementally. Dashboard values that use demonstration data are illustrative placeholders and must not be treated as live market data or financial information.

## Features and Pages

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Overview | Dashboard summary and key metrics |
| `/trade` | Trade | Trading interface |
| `/positions` | Positions | Position overview |
| `/activity` | Activity | Trading activity interface |
| `/analytics` | Protocol Analytics | Protocol-level analytics |

Additional routes inherited from the starter template may remain available during development. They will be reviewed as the application evolves.

## Technology Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **UI:** React and shadcn/ui
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Package manager:** pnpm

## Prerequisites

- Node.js compatible with the project's Next.js dependencies
- pnpm
- Git

## Getting Started

From the repository root:

```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Alternatively, from the repository root, use the provided development script:

```bash
./scripts/frontend-dev.sh
```

## Build and Validation

From the frontend directory:

```bash
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

From the repository root, the production build can also be run with:

```bash
./scripts/frontend-build.sh
```

## Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── trade/
│   │   │   ├── positions/
│   │   │   ├── activity/
│   │   │   └── analytics/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       └── blockperp/
│           └── dashboard-ui.tsx
├── public/
└── package.json
```

The project may contain additional components, routes, and assets not shown in this abbreviated structure.

## Development Guidelines

- Keep shared UI components reusable.
- Use TypeScript types for component props and data contracts.
- Clearly distinguish demonstration data from live onchain data.
- Handle loading, empty, and error states when integrating external data.
- Keep credentials and private keys out of source control.
- Store environment-specific configuration in environment variables. Commit only safe example values in `.env.example`.

## Project Status

The frontend foundation and initial dashboard routes have been scaffolded. The application is being developed toward integration with the BlockPerp smart contracts and supporting data services.

Refer to the repository's root `README.md` and `docs/` directory for project-wide setup, architecture, and development workflow documentation.

## License

Refer to the repository's root license file for the applicable project license.
