import './Input.css';

/**
 * Text field with an optional bold label (matches the Figma InputField).
 * Pass size="lg" + pill for the rounded Order ID search box.
 */
export default function Input({ label, id, size = 'md', pill = false, className = '', ...props }) {
  const controlCls = [
    'field__control',
    size === 'lg' ? 'field__control--lg' : '',
    pill ? 'field__control--pill' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className="field" htmlFor={id}>
      {label ? <span className="field__label">{label}</span> : null}
      <input id={id} className={controlCls} {...props} />
    </label>
  );
}
