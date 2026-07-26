import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ChevronLeft } from '@/components/common/Icons';
import { useAuth } from '@/context/AuthContext';
import { PATHS } from '@/routes/paths';

export default function WarehouseLoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const res = await login({ role: 'warehouse', email, password });
    setBusy(false);
    if (res.ok) nav(PATHS.WAREHOUSE_INBOUND);
    else setError(res.error);
  };

  return (
    <section className="login">
      <button type="button" className="login__back" onClick={() => nav(PATHS.HOME)} aria-label="Back to main screen"><ChevronLeft /></button>
      <Card className="login-card">
        <h2 style={{ textAlign: 'center', margin: '0 0 8px' }}>Warehouse Login</h2>
        <form className="login-form" onSubmit={submit}>
          <Input label="Email" id="wh-email" type="email" placeholder="company@gmail.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" id="wh-password" type="password" placeholder="*******" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="login-error" role="alert">{error}</p> : null}
          <Button type="submit" size="lg" block disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</Button>
          <p className="login-hint">Demo Warehouse login — warehouse@rms.com / warehouse123</p>
        </form>
      </Card>
    </section>
  );
}
