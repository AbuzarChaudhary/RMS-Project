import { Link } from 'react-router-dom';
import './Logo.css';

// Reusable RMS logomark + wordmark. Used in the header (40px, square, ExtraBold)
// and the footer (32px, rounded, SemiBold).
export default function Logo({
  size = 40,
  radius = 0,
  wordmark = true,
  wordmarkSize = 24,
  weight = 800,
  to,
}) {
  const mark = (
    <span
      className="rms-logo__mark"
      style={{ width: size, height: size, borderRadius: radius }}
      aria-hidden="true"
    />
  );
  const word = wordmark ? (
    <span
      className="rms-logo__word"
      style={{ fontSize: wordmarkSize, fontWeight: weight, letterSpacing: weight >= 800 ? '-0.48px' : '-0.4px' }}
    >
      RMS
    </span>
  ) : null;

  if (to) {
    return (
      <Link to={to} className="rms-logo" aria-label="RMS home">
        {mark}
        {word}
      </Link>
    );
  }
  return (
    <span className="rms-logo">
      {mark}
      {word}
    </span>
  );
}
