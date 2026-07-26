// Convert a Google Drive share link into a directly-embeddable image URL.
//
// Drive "view" links (https://drive.google.com/file/d/<id>/view) point at an HTML
// viewer page, so they can't be used as an <img src>. The thumbnail endpoint below
// returns the actual image bytes — but only for files shared as "Anyone with the link".
// If the URL isn't a Drive link we recognise, it's returned unchanged.
function driveImageUrl(raw) {
  if (!raw || typeof raw !== 'string') return raw || null;
  const s = raw.trim();
  // Already directly embeddable.
  if (/drive\.google\.com\/(thumbnail|uc)\b/.test(s) || /googleusercontent\.com/.test(s)) return s;
  let id = null;
  let m = s.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
  if (m) id = m[1];
  if (!id) { m = s.match(/[?&]id=([A-Za-z0-9_-]+)/); if (m) id = m[1]; }
  if (!id && /^[A-Za-z0-9_-]{20,}$/.test(s)) id = s; // a bare file id
  if (!id) return s; // not a Drive link — leave as-is
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
}

module.exports = { driveImageUrl };
