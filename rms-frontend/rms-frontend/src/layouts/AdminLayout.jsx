import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundDecor from '@/components/common/BackgroundDecor';
import Loader from '@/components/common/Loader';

export default function AdminLayout() {
  return (
    <div className="app-shell" data-area="admin">
      <Header variant="admin" />
      <main className="app-main">
        <BackgroundDecor />
        <div className="app-content">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer variant="minimal" />
    </div>
  );
}
