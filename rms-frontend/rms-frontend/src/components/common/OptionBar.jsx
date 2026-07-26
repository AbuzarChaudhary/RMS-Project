import { ArrowRight } from '@/components/common/Icons';

export default function OptionBar({ number, label, onClick, style }) {
  return (
    <button type="button" className="optbar" onClick={onClick} style={style}>
      <span className="optbar__label">{number ? <span>{number}.</span> : null}<span>{label}</span></span>
      <span className="optbar__arrow"><ArrowRight /></span>
    </button>
  );
}
