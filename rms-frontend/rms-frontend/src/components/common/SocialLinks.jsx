// Footer social links. Simple monochrome glyphs (Instagram, LinkedIn, X).
export default function SocialLinks() {
  return (
    <nav className="rms-social" aria-label="Social links">
      <a href="#" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a href="#" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21H19.6v-5.3c0-1.27-.02-2.9-1.9-2.9-1.9 0-2.2 1.4-2.2 2.8V21H9z" />
        </svg>
      </a>
      <a href="#" aria-label="X">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.97 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </nav>
  );
}
