import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PATHS } from '@/routes/paths';

/**
 * Role-aware route guard. Use it to wrap a group of protected routes:
 *
 *   { element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />, children: [...] }
 *
 * Auth is currently stubbed (see context/AuthContext.jsx) so this lets
 * everything through until you wire real authentication.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.ADMIN_LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <Outlet />;
}
