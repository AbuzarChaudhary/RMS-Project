import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import OptionBar from '@/components/common/OptionBar';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { exchangeService } from '@/services/exchangeService';
import { PATHS } from '@/routes/paths';

export default function WrongItemPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!flow.selectedItem) nav(PATHS.HOME, { replace: true }); }, [flow.selectedItem, nav]);
  if (!flow.selectedItem) return null;

  const sameAgain = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await exchangeService.createExchange({
        orderId: flow.orderId,
        orderItemId: flow.selectedItem.orderItemId,
        reasonCode: flow.reasonCode || 'wrong_item',
        exchangeProductId: flow.selectedItem.productId,
        exchangeSize: flow.selectedItem.size,
      });
      updateFlow({ returnId: res.returnId, rmaId: res.rmaId });
      nav(PATHS.RECEIPT);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not create the exchange.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.EXCHANGE_REASON}>
      <div className="twocol">
        <div className="twocol__img"><Thumb src={flow.selectedItem?.imageUrl} alt={flow.selectedItem?.name} /></div>
        <div className="twocol__col">
          <OptionBar label="Exchange with different article" onClick={() => nav(PATHS.EXCHANGE_RECOMMENDATIONS)} />
          <OptionBar label="Order same article again" onClick={sameAgain} />
          {error ? <p role="alert" style={{ color: '#ff8a8a' }}>{error}</p> : null}
        </div>
      </div>
    </FlowStage>
  );
}
