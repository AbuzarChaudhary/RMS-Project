import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ChevronLeft } from '@/components/common/Icons';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';
import { PATHS } from '@/routes/paths';
import { DEMO_CREDENTIALS } from '@/services/authService';
import './LoginScreen.css';

// Where each role lands after a successful sign-in (existing workflows).
const DESTINATION = {
  [ROLES.ADMIN]: PATHS.ADMIN_DASHBOARD,
  [ROLES.STAFF]: PATHS.STAFF_PANEL,
};
const LABEL = { [ROLES.ADMIN]: 'Admin', [ROLES.STAFF]: 'Staff' };

/**
 * Single shared login for Admin and Staff. The Email/Password fields stay
 * hidden until a role is chosen; each role authenticates against its own
 * credentials only.
 */
export default function LoginScreen() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const pickRole = (next) => {
    setRole(next);
    setError('');
    setEmail('');
    setPassword('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!role) return;
    setError('');
    const result = await login({ role, email, password });
    if (result.ok) nav(DESTINATION[role]);
    else setError(result.error);
  };

  return (
    <section className="login">
      <button
        type="button"
        className="login__back"
        onClick={() => nav(PATHS.HOME)}
        aria-label="Back to main screen"
      >
        <ChevronLeft />
      </button>
      <Card className="login-card">
        {/* Role selection — always visible, at the top */}
        <div className="login-roles" role="group" aria-label="Select a role to sign in">
          {[ROLES.ADMIN, ROLES.STAFF].map((r) => (
            <button
              key={r}
              type="button"
              className={`login-role${role === r ? ' is-active' : ''}`}
              aria-pressed={role === r}
              onClick={() => pickRole(r)}
            >
              {LABEL[r]}
            </button>
          ))}
        </div>

        {/* Email / password appear only after a role is selected */}
        {role && (
          <form className="login-form" onSubmit={submit}>
            <Input
              label="Email" id="email" type="email" placeholder="company@gmail.com"
              autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password" id="password" type="password" placeholder="*******"
              autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="login-error" role="alert">{error}</p> : null}
            <Button type="submit" size="lg" block>Sign In</Button>
            <button type="button" className="login-form__link">Forgot password?</button>
            <p className="login-hint">
              Demo {LABEL[role]} login — {DEMO_CREDENTIALS[role].email} / {DEMO_CREDENTIALS[role].password}
            </p>
          </form>
        )}
      </Card>
    </section>
  );
}
