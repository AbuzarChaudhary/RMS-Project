import Logo from '@/components/common/Logo';
import SocialLinks from '@/components/common/SocialLinks';
import './Footer.css';

// Public footer shows About / Support / Demo; back-office shows About / Support.
export default function Footer({ variant = 'public' }) {
  const navItems = variant === 'public' ? ['About', 'Support', 'Demo'] : ['About', 'Support'];
  return (
    <footer className="rms-footer" data-variant={variant}>
      <div className="rms-footer__left">
        <Logo size={32} radius={8} wordmarkSize={20} weight={600} />
        <nav className="rms-footer__nav">
          {navItems.map((item) => (
            <a key={item} href="#">{item}</a>
          ))}
        </nav>
      </div>
      <SocialLinks />
    </footer>
  );
}
