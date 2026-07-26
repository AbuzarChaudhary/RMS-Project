import Thumb from '@/components/common/Thumb';

// Article / product card. layout="row" (lists) or layout="col" (recommendations).
export default function ProductCard({ layout = 'row', name, meta, price, imageUrl, onClick }) {
  const cls = ['pcard', `pcard--${layout}`, onClick ? 'pcard--click' : ''].filter(Boolean).join(' ');
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={cls} onClick={onClick} {...(onClick ? { type: 'button' } : {})}>
      <span className="thumb"><Thumb src={imageUrl} alt={name} /></span>
      <span className="pcard__info">
        <span className="pcard__name">{name}</span>
        {meta ? <span className="pcard__meta">{meta}</span> : null}
        {price ? <span className="pcard__price">{price}</span> : null}
      </span>
    </Tag>
  );
}
