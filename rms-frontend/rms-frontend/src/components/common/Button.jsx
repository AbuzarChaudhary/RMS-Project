import './Button.css';

/**
 * Primary action button. Sizes map to the Figma instances:
 *   md  -> header DEMO        (16px, radius 12)
 *   lg  -> Sign In            (20px, radius 8, usually `block`)
 *   xl  -> SEARCH             (24px, usually `pill`)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  block = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    pill ? 'btn--pill' : '',
    block ? 'btn--block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}
