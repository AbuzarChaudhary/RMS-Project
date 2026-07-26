import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '@/components/common/Icons';

// The shared backdrop ("Rectangle 1") that every flow screen sits on.
// title -> renders the #757575 title bar; list -> top-aligns content.
export default function FlowStage({ backTo, title, list = false, children }) {
  const nav = useNavigate();
  return (
    <section className="flow">
      <div className={list ? 'stage stage--list' : 'stage'}>
        <button type="button" className="stage__back" onClick={() => nav(backTo)} aria-label="Go back">
          <ChevronLeft />
        </button>
        {title ? <div className="titlebar">{title}</div> : null}
        {children}
      </div>
    </section>
  );
}
