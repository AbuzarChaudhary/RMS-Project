import './Card.css';

// White, rounded, bordered surface (the login form container).
export default function Card({ className = '', children, ...props }) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
