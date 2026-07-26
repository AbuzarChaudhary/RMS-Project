import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import ProductCard from '@/components/common/ProductCard';
import Button from '@/components/common/Button';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { PATHS } from '@/routes/paths';

export default function OrderOptionsPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const item = flow.selectedItem;

  useEffect(() => { if (!item) nav(PATHS.HOME, { replace: true }); }, [item, nav]);
  if (!item) return null;

  const startReturn = () => { updateFlow({ flowType: 'return' }); nav(PATHS.RETURN_REASON); };
  const startExchange = () => { updateFlow({ flowType: 'exchange' }); nav(PATHS.EXCHANGE_REASON); };

  return (
    <FlowStage backTo={PATHS.ORDER_ITEMS} title="Select an Option" list>
      <ProductCard layout="row" name={item.name} meta={`${item.quantity} pcs · ${item.color}`} price={`Rs ${item.unitPrice}`} imageUrl={item.imageUrl} />
      <div className="row-center" style={{ marginTop: 6 }}>
        <Button size="md" pill onClick={startReturn}>RETURN</Button>
        <Button size="md" pill onClick={startExchange}>EXCHANGE</Button>
      </div>
    </FlowStage>
  );
}
