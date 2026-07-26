import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '@/components/common/Icons';

export default function BackButton({ to, floating = false }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={floating ? 'flow__back' : 'flow__back flow__back--inline'}
      onClick={() => navigate(to)}
      aria-label="Go back"
    >
      <ChevronLeft />
    </button>
  );
}
