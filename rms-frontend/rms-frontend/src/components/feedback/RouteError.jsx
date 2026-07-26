import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

// Rendered by the router when a route throws (loader error, render crash, 404 in a layout).
export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message ?? 'Something went wrong';

  return (
    <section className="route-error" role="alert">
      <h1>Oops</h1>
      <p>{message}</p>
      <Link to={PATHS.HOME}>Back to home</Link>
    </section>
  );
}
