import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import ProductCard from '@/components/common/ProductCard';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { PATHS } from '@/routes/paths';

export default function OrderItemsPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const order = flow.order;
  const items = flow.items || [];

  useEffect(() => { if (!order) nav(PATHS.HOME, { replace: true }); }, [order, nav]);
  if (!order) return null;

  const choose = (item) => { updateFlow({ selectedItem: item }); nav(PATHS.ORDER_OPTIONS); };

  if (!order.eligible) {
    return (
      <FlowStage backTo={PATHS.HOME} title="Select an Article" list>
        <p style={{ textAlign: 'center', padding: '24px', lineHeight: 1.5 }}>
          This order was received on {order.receivedDate} and is outside the{' '}
          {order.returnWindowDays}-day return window, so it is no longer eligible
          for a return or exchange.
        </p>
      </FlowStage>
    );
  }

  return (
    <FlowStage backTo={PATHS.HOME} title="Select an Article" list>
      <div className="stack">
        {items.map((it) => (
          <ProductCard
            key={it.orderItemId}
            layout="row"
            name={it.name}
            meta={`${it.quantity} pcs · ${it.color}${it.size ? ' · ' + it.size : ''}`}
            price={`Rs ${it.unitPrice}`}
            imageUrl={it.imageUrl}
            onClick={() => choose(it)}
          />
        ))}
      </div>
    </FlowStage>
  );
}
