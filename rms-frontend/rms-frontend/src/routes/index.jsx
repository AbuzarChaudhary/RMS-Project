import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import WarehouseLayout from '@/layouts/WarehouseLayout';
import RouteError from '@/components/feedback/RouteError';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { PATHS } from '@/routes/paths';
import { ROLES } from '@/constants/roles';

/* ------------------------------------------------------------------ *
 * Pages are lazy-loaded: each screen ships as its own JS chunk, so the
 * browser only downloads the code for the route the user actually visits.
 * ------------------------------------------------------------------ */
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));

const OrderItemsPage = lazy(() => import('@/pages/order/OrderItemsPage'));
const OrderOptionsPage = lazy(() => import('@/pages/order/OrderOptionsPage'));

const ReturnReasonPage = lazy(() => import('@/pages/returns/ReturnReasonPage'));
const DefectPhotoPage = lazy(() => import('@/pages/returns/DefectPhotoPage'));
const RefundMethodPage = lazy(() => import('@/pages/returns/RefundMethodPage'));
const BankDetailsPage = lazy(() => import('@/pages/returns/BankDetailsPage'));
const RefundConfirmationPage = lazy(() => import('@/pages/returns/RefundConfirmationPage'));

const AiVerificationPage = lazy(() => import('@/pages/verification/AiVerificationPage'));

const ExchangeReasonPage = lazy(() => import('@/pages/exchange/ExchangeReasonPage'));
const SizeSelectionPage = lazy(() => import('@/pages/exchange/SizeSelectionPage'));
const WrongItemPage = lazy(() => import('@/pages/exchange/WrongItemPage'));
const ExchangeRecommendationsPage = lazy(() => import('@/pages/exchange/ExchangeRecommendationsPage'));

const EReceiptPage = lazy(() => import('@/pages/receipt/EReceiptPage'));
const TrackingLookupPage = lazy(() => import('@/pages/tracking/TrackingLookupPage'));
const TrackingStatusPage = lazy(() => import('@/pages/tracking/TrackingStatusPage'));

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));

const StaffLoginPage = lazy(() => import('@/pages/staff/StaffLoginPage'));
const StaffPanelPage = lazy(() => import('@/pages/staff/StaffPanelPage'));
const ReturnRequestDetailsPage = lazy(() => import('@/pages/staff/ReturnRequestDetailsPage'));

const WarehouseLoginPage = lazy(() => import('@/pages/warehouse/WarehouseLoginPage'));
const WarehouseInboundPage = lazy(() => import('@/pages/warehouse/WarehouseInboundPage'));
const WarehouseInspectionPage = lazy(() => import('@/pages/warehouse/WarehouseInspectionPage'));
const WarehouseRestockPage = lazy(() => import('@/pages/warehouse/WarehouseRestockPage'));

export const router = createBrowserRouter([
  // ---------- Customer-facing (public) ----------
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    children: [
      { path: PATHS.HOME, element: <HomePage /> },
      { path: PATHS.ORDER_ITEMS, element: <OrderItemsPage /> },
      { path: PATHS.ORDER_OPTIONS, element: <OrderOptionsPage /> },

      // Return branch
      { path: PATHS.RETURN_REASON, element: <ReturnReasonPage /> },
      { path: PATHS.RETURN_PHOTO, element: <DefectPhotoPage /> },
      { path: PATHS.RETURN_VERIFICATION, element: <AiVerificationPage /> },
      { path: PATHS.RETURN_REFUND_METHOD, element: <RefundMethodPage /> },
      { path: PATHS.RETURN_BANK_DETAILS, element: <BankDetailsPage /> },
      { path: PATHS.RETURN_CONFIRMATION, element: <RefundConfirmationPage /> },

      // Exchange branch
      { path: PATHS.EXCHANGE_REASON, element: <ExchangeReasonPage /> },
      { path: PATHS.EXCHANGE_SIZE, element: <SizeSelectionPage /> },
      { path: PATHS.EXCHANGE_WRONG_ITEM, element: <WrongItemPage /> },
      { path: PATHS.EXCHANGE_RECOMMENDATIONS, element: <ExchangeRecommendationsPage /> },

      // Shared finish + tracking
      { path: PATHS.RECEIPT, element: <EReceiptPage /> },
      { path: PATHS.TRACK, element: <TrackingLookupPage /> },
      { path: PATHS.TRACK_STATUS, element: <TrackingStatusPage /> },
    ],
  },

  // ---------- Admin + Staff (back office) ----------
  {
    element: <AdminLayout />,
    errorElement: <RouteError />,
    children: [
      // Public login screens
      { path: PATHS.ADMIN_LOGIN, element: <AdminLoginPage /> },
      { path: PATHS.STAFF_LOGIN, element: <StaffLoginPage /> },

      // Admin-only
      {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
        children: [
          { path: PATHS.ADMIN_DASHBOARD, element: <AdminDashboardPage /> },
        ],
      },

      // Staff (admins allowed too)
      {
        element: <ProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />,
        children: [
          { path: PATHS.STAFF_PANEL, element: <StaffPanelPage /> },
          { path: PATHS.STAFF_REQUEST_DETAILS, element: <ReturnRequestDetailsPage /> },
        ],
      },
    ],
  },

  // ---------- Warehouse ----------
  {
    element: <WarehouseLayout />,
    errorElement: <RouteError />,
    children: [
      { path: PATHS.WAREHOUSE_LOGIN, element: <WarehouseLoginPage /> },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE, ROLES.ADMIN]} />,
        children: [
          { path: PATHS.WAREHOUSE_INBOUND, element: <WarehouseInboundPage /> },
          { path: PATHS.WAREHOUSE_INSPECTION, element: <WarehouseInspectionPage /> },
          { path: PATHS.WAREHOUSE_RESTOCK, element: <WarehouseRestockPage /> },
        ],
      },
    ],
  },

  // ---------- Fallback ----------
  { path: PATHS.NOT_FOUND, element: <NotFoundPage /> },
]);
