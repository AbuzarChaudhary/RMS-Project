import { useState } from 'react';

export default function SizePicker({ sizes = ['S', 'M', 'L', 'XL'], onChange }) {
  const [active, setActive] = useState(null);
  const pick = (s) => { setActive(s); if (onChange) onChange(s); };
  return (
    <div className="sizes" role="group" aria-label="Select size">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          className={`size${active === s ? ' size--active' : ''}`}
          onClick={() => pick(s)}
          aria-pressed={active === s}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
