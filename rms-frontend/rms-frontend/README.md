# RMS — Return Management System (Frontend)

Production-oriented React scaffold: **project structure + routing only**.
Every screen renders a placeholder — no product UI is implemented yet.

## Stack
- React 18 + Vite
- React Router v6 (data router via `createBrowserRouter`)
- Axios (pre-configured client + per-domain service modules)
- `@` path alias → `src/`

## Getting started
```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL etc.
npm run dev
```

## Architecture
Organized around the four folders you asked for, plus supporting layers for scale.

```
src/
├── assets/        Static files + baseline styles (images, icons, styles)
├── components/    Reusable, presentational building blocks
│   ├── common/      Button, Input, Card, Modal, Loader, PagePlaceholder
│   ├── layout/      Header, Footer
│   └── feedback/    RouteError
├── pages/         One folder per domain; each file = one route screen
│   ├── public/      Home, NotFound
│   ├── order/       Item selection, return-vs-exchange choice
│   ├── returns/     Reason, defect photo, refund method, bank details, confirmation
│   ├── verification/ AI defect analysis result
│   ├── exchange/    Reason, size, wrong-item, recommendations
│   ├── receipt/     E-receipt (RMA + shipping label)
│   ├── tracking/    RMA lookup + status
│   ├── admin/       Login, dashboard
│   ├── staff/       Login, returns queue, request details
│   └── warehouse/   Login, inbound, inspection, restock
├── services/      API layer (axios client + endpoints + one module per domain)
├── routes/        paths.js (all URLs), index.jsx (router), ProtectedRoute.jsx
├── layouts/       PublicLayout, AdminLayout, WarehouseLayout (chrome + <Outlet/>)
├── context/       AuthContext, ReturnFlowContext (multi-step return state)
├── hooks/         Reusable hooks (useDisclosure …)
├── utils/         formatters …
├── constants/     roles, flowTypes, returnReasons, orderStatus
└── config/        env.js (single place to read env vars)
```

### Why this scales for the three core areas
- **AI verification** — isolated in `services/aiVerificationService.js` + the `verification/` page + a `verificationResult` slot in `ReturnFlowContext`. Swapping/expanding the AI provider touches one service, not the UI.
- **Return processing** — the whole multi-step journey is driven by `ReturnFlowContext` + `returnService`, so branching (e.g. defective vs. other reasons) is state-driven, not duplicated across URLs.
- **Warehouse flow** — its own route group, layout, role guard, service, and pages, ready to grow independently of the customer app.

## Routing map
| Area | Path | Page |
|------|------|------|
| Public | `/` | Home (order lookup) |
| Public | `/order/:orderId/items` | Item selection |
| Public | `/order/:orderId/options` | Return or exchange |
| Return | `/returns/reason` | Reason |
| Return | `/returns/photo` | Defect photo |
| Return | `/returns/verification` | AI verification |
| Return | `/returns/refund-method` | Refund method |
| Return | `/returns/bank-details` | Bank details |
| Return | `/returns/confirmation` | Refund confirmation |
| Exchange | `/exchange/reason` | Reason |
| Exchange | `/exchange/size` | Size selection |
| Exchange | `/exchange/wrong-item` | Wrong-item options |
| Exchange | `/exchange/recommendations` | Recommended articles |
| Shared | `/receipt/:rmaId` | E-receipt |
| Tracking | `/track` · `/track/:rmaId` | Lookup · Status |
| Admin | `/admin/login` · `/admin/dashboard` | Login · Dashboard (guarded) |
| Staff | `/staff/login` · `/staff/panel` · `/staff/requests/:rmaId` | Login · Queue · Details (guarded) |
| Warehouse | `/warehouse/login` · `/warehouse/inbound` · `/warehouse/inspection/:rmaId` · `/warehouse/restock` | (guarded) |

> The mockups had separate URLs for defective vs. other refund paths (and duplicate
> `_for3` screens). Those are consolidated here into single state-driven routes.

## Next steps
1. Build shared UI primitives in `components/common` (this is where the design system lives).
2. Implement each page, consuming services + `ReturnFlowContext`.
3. Wire real auth in `AuthContext` + `authService` and turn the route guards on.
