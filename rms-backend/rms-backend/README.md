# RMS Backend (Node + Express + MySQL)

REST API for the Return Management System frontend. It reads your existing
shop data (customers, products, orders, order_items) and manages returns,
exchanges, tracking, staff review, and dashboard metrics.

## Requirements
- Node.js 18+ (you have v22)
- MySQL 8+ running locally

## Setup (step by step)

1. **Load your database, then the extra tables.** In MySQL, first run your
   `RMS_Sample_Data.sql`, then run `db/schema.sql` (it adds the `users` and
   `return_requests` tables). From a terminal:
   ```bash
   mysql -u root -p < /path/to/RMS_Sample_Data.sql
   mysql -u root -p < db/schema.sql
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create your `.env`** from the template and fill in your MySQL password:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `DB_PASSWORD` (and `JWT_SECRET` to any long random text).

4. **Create the login accounts** (Admin + Staff):
   ```bash
   npm run seed
   ```
   This creates `admin@rms.com / admin123` and `staff@rms.com / staff123`.

5. **(Optional) Add sample returns** so the dashboard/staff panel show data:
   ```bash
   npm run seed:data
   ```

6. **Start the server:**
   ```bash
   npm start
   ```
   You should see `RMS backend running on http://localhost:4000` and
   `MySQL connection: OK`. Test it: open http://localhost:4000/api/health

## Connect the frontend
In your **frontend** project, create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:4000/api
```
Then restart the frontend. Its service files (`returnService`, `adminService`,
etc.) already call these exact endpoints.

To make the login screen use this API instead of the built-in demo accounts,
change `AuthContext.login` in the frontend to call `authService.login({ email,
password, role })` and store the returned `token`.

## API endpoints
| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Log in (body: email, password, role) |
| GET | `/api/auth/me` | Current user (needs token) |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/orders/:orderId` | Look up an order + its items (validates + checks return window) |
| POST | `/api/returns` | Start a return |
| POST | `/api/returns/:returnId/refund-method` | Choose refund to bank or store credit |
| POST | `/api/returns/:returnId/bank-details` | Save bank details |
| GET | `/api/returns/:rmaId/receipt` | RMA receipt data |
| GET | `/api/exchanges/recommendations?item=:id` | Suggested products |
| POST | `/api/exchanges` | Start an exchange |
| POST | `/api/ai/verify-defect` | Defect photo check (placeholder) |
| GET | `/api/tracking/:rmaId` | Return tracking status + timeline |
| GET | `/api/admin/metrics` | Dashboard totals + charts (admin) |
| GET | `/api/admin/requests` | Staff work queue (admin/staff) |
| PATCH | `/api/admin/requests/:rmaId/decision` | Accept / reject (admin/staff) |
| GET | `/api/warehouse/inbound` | Accepted returns to process |
| POST | `/api/warehouse/inspect/:rmaId` | Mark inspected |
| POST | `/api/warehouse/restock` | Mark restocked + return stock |

## Test order IDs (from your sample data)
- Eligible: `ORD-20250401-0001`, `ORD-20250410-0003`, …
- Expired: `ORD-20250101-0002`
- Not found: `ORD-99999999-9999`  •  Wrong format: `ABCDEF`

> Note: your sample orders are dated April 2025, so `REFERENCE_DATE=2025-05-01`
> in `.env` keeps them inside the 30-day window for testing. Remove it to use
> today's real date.

## Project structure
```
src/
  server.js            start the server
  app.js               express app (CORS, JSON, routes, errors)
  config/db.js         MySQL connection pool
  middleware/          auth (JWT + roles), error handling
  utils/               RMA id + return-window helpers
  controllers/         business logic per feature
  routes/              URL -> controller wiring
db/schema.sql          the two new tables
scripts/               seed login accounts + sample returns
```
