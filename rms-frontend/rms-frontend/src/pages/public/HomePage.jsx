import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { returnService } from '@/services/returnService';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { PATHS } from '@/routes/paths';
import './HomePage.css';

// Order ID search (customer entry point) — looks the order up on the backend.
export default function HomePage() {
  const nav = useNavigate();
  const { updateFlow, resetFlow } = useReturnFlow();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    const id = orderId.trim();
    if (!id) { setError('Please enter your Order ID.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await returnService.lookupOrder(id);
      resetFlow();
      updateFlow({ orderId: data.order.orderId, order: data.order, items: data.items });
      nav(PATHS.ORDER_ITEMS);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not find that order. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') search(); };

  return (
    <section className="home">
      <div className="home__inner">
        <h1 className="home__heading">
          Easily manage your returns, exchanges, or defective items — all in one place.
        </h1>
        <p className="home__subheading">
          Enter your product Order ID to begin the return or exchange process.
        </p>
        <div className="home__search">
          <Input
            size="lg" pill placeholder="ENTER YOUR ORDER ID" aria-label="Order ID"
            value={orderId} onChange={(e) => setOrderId(e.target.value)} onKeyDown={onKeyDown}
          />
        </div>
        {error ? <p role="alert" style={{ color: '#ff8a8a', marginTop: 10, fontWeight: 600 }}>{error}</p> : null}
        <Button className="home__button" size="xl" pill onClick={search} disabled={loading}>
          {loading ? 'SEARCHING…' : 'SEARCH'}
        </Button>
      </div>
    </section>
  );
}
