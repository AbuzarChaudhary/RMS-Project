import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import Button from '@/components/common/Button';
import { PATHS } from '@/routes/paths';
import './Header.css';

// Only the Home screen shows the LOGIN / TRACK / DEMO nav; every inner customer
// screen shows the logo only. LOGIN opens the shared Admin/Staff login screen.
export default function Header({ variant = 'public' }) {
  const { pathname } = useLocation();
  const showNav = variant === 'public' && pathname === PATHS.HOME;
  return (
    <header className="rms-header" data-variant={variant}>
      <Logo to={PATHS.HOME} size={40} radius={0} wordmarkSize={24} weight={800} />
      {showNav && (
        <nav className="rms-header__nav">
          <Link to={PATHS.ADMIN_LOGIN} className="rms-header__link">LOGIN</Link>
          <Link to={PATHS.TRACK} className="rms-header__link">TRACK</Link>
          <Button size="md">DEMO</Button>
        </nav>
      )}
    </header>
  );
}
