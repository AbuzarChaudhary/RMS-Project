import { useState } from 'react';
import { GarmentIcon } from '@/components/common/Icons';

// Shows a product image, falling back to the garment icon if the image is missing
// or fails to load (e.g. a Google Drive link that isn't shared publicly).
export default function Thumb({ src, alt = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <GarmentIcon />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }}
    />
  );
}
