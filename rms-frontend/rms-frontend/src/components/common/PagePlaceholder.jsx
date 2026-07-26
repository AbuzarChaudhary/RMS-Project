/**
 * Temporary stand-in rendered by every page while the UI is being built.
 * Replace each page body with real components/feature views later.
 */
export default function PagePlaceholder({ title, description }) {
  return (
    <section className="page-placeholder">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      <p className="page-placeholder__note">UI not implemented yet — routing scaffold only.</p>
    </section>
  );
}
