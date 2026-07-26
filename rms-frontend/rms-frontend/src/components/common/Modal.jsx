// Placeholder modal. Real portal/focus-trap implementation to be added later.
export default function Modal({ open, children }) {
  if (!open) return null;
  return <div className="modal" role="dialog" aria-modal="true">{children}</div>;
}
