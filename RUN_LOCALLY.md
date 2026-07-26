# Run RMS locally (frontend + backend, fully connected)

Two projects that talk to each other:
- **rms-backend** — Node + Express + MySQL API (http://localhost:4000)
- **rms-frontend** — React + Vite app (http://localhost:5173)

The frontend calls `/api`, and a Vite dev proxy forwards that to the backend — so
there is **no CORS setup** and nothing extra to configure for local dev.

---

## Prerequisites
- Node.js 18+  (`node -v`)
- MySQL 8+ running locally

## Step 1 — Database (once)
```bash
mysql -u root -p < RMS_Sample_Data.sql
mysql -u root -p < rms-backend/db/schema.sql
```
(macOS/Windows MySQL: works as-is. On Linux, table names are case-sensitive, so if the
sample file stops on a `SELECT * FROM CUSTOMERS` line, run the first command with `--force`.)

## Step 2 — Backend
```bash
cd rms-backend
npm install
cp .env.example .env          # then edit .env: set DB_PASSWORD (and JWT_SECRET)
npm run seed                  # creates the 3 accounts below
npm run seed:data             # optional: sample returns so the dashboard/queue have data
npm start                     # -> http://localhost:4000  ("MySQL connection: OK")
```
Leave it running.

## Step 3 — Frontend (new terminal)
```bash
cd rms-frontend
npm install
npm run dev                   # -> http://localhost:5173 (opens automatically)
```

Done — the whole app is running against your database.

---

## Accounts
| Role      | URL              | Email                | Password     |
|-----------|------------------|----------------------|--------------|
| Admin     | /admin/login     | admin@rms.com        | admin123     |
| Staff     | /staff/login     | staff@rms.com        | staff123     |
| Warehouse | /warehouse/login | warehouse@rms.com    | warehouse123 |

## Everything is connected to the backend
- **Customer — Return:** Home → enter Order ID → pick an article → **Return** → pick a reason
  (creates the return in the DB) → refund method → bank details / store credit → **e-receipt**
  with the real RMA. "Defected" adds a photo → AI check → then the return.
- **Customer — Exchange:** same start → **Exchange** → reason → pick a new size (same article) or
  choose from live **recommended articles** → creates the exchange → e-receipt.
- **Tracking:** Track → enter an RMA ID → live status timeline (Received → In Transit → Inspected → Restocked).
- **Admin:** dashboard totals + charts are pulled live from the DB.
- **Staff:** real request queue with search/filter; **Accept/Reject** updates the DB.
- **Warehouse:** login → **Inbound** (accepted returns) → open one → **Mark Inspected** →
  **Restock & Complete** (returns the item to stock and completes the RMA).

### Try a full loop
1. Customer: return `ORD-20250401-0001` and finish to the e-receipt — note the RMA ID.
2. Staff: find that RMA, **Accept** it.
3. Warehouse: it appears in Inbound → Inspect → Restock.
4. Tracking: paste the RMA — the timeline is now complete.

Test Order IDs: eligible `ORD-20250401-0001`; expired `ORD-20250101-0002`;
not found `ORD-99999999-9999`; wrong format `ABCDEF`.

## AI damage detection (Roboflow)
The **defected-item** path sends the customer's photo to your Roboflow workflow and
shows whether damage was found, a confidence %, and the detected classes. It's wired
into the backend at `POST /api/ai/verify-defect` and configured in `rms-backend/.env`:
```
ROBOFLOW_API_URL=https://serverless.roboflow.com
ROBOFLOW_API_KEY=gVpJl2mIgiI0gpiloCRG
ROBOFLOW_WORKSPACE=muhammad-suhaib-tqmwp
ROBOFLOW_WORKFLOW_ID=bkdn-huylv-datn-vbkdn-huylv-datn-uyp44-1-yolo26n-seg-t1-logic
```
Notes:
- Needs **Node 18+** (uses the built-in fetch) and outbound internet to reach Roboflow.
- If the model is unreachable (offline, quota, wrong key), the flow degrades gracefully:
  the customer sees "AI check unavailable — you can still continue," and the real reason
  is printed in the backend terminal (`[ai/verify-defect] Roboflow call failed: …`).
- The parser reads confidence/class from the workflow output automatically; the trimmed
  raw output is included in the response (`raw`) so you can fine-tune if your workflow's
  fields differ.

## Product images
Images come from the Google Drive links in your product data. The app converts each
Drive link to its image endpoint automatically, but Drive only serves the image if the
file is shared **"Anyone with the link."** If a file is private (or a link is broken),
that card falls back to the garment icon — nothing breaks. To show every image, open the
product images folder in Google Drive and set sharing to *Anyone with the link*.

## Troubleshooting
- **"make sure the backend server is running"** on login → Step 2 isn't running, or `.env` DB
  settings are wrong. The backend should print `MySQL connection: OK`.
- **Warehouse login fails / "Role must be admin, staff, or warehouse"** → if you set up the DB
  from an older copy, the `users.role` column may not include `warehouse`. Drop the users table
  and re-run `rms-backend/db/schema.sql`, then `npm run seed`.
- **Dates look expired** → sample orders are from April 2025; the backend `.env` sets
  `REFERENCE_DATE=2025-05-01` so they count as eligible while testing. Remove that line for real "today".
- **AI always says "unavailable"** → the backend can't reach Roboflow. Check internet
  access, the `ROBOFLOW_*` values in `.env`, and the backend terminal for the exact error.
- **Port already in use** → change `PORT` in the backend `.env`, or `port` in
  `rms-frontend/vite.config.js` (also update the proxy target if you change the backend port).
