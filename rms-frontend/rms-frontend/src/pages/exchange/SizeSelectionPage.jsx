import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import OptionBar from '@/components/common/OptionBar';
import SizePicker from '@/components/common/SizePicker';
import Button from '@/components/common/Button';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { exchangeService } from '@/services/exchangeService';
import { PATHS } from '@/routes/paths';

export default function SizeSelectionPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [size, setSize] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!flow.selectedItem) nav(PATHS.HOME, { replace: true }); }, [flow.selectedItem, nav]);
  if (!flow.selectedItem) return null;

  const sizes = flow.selectedItem.sizeOptions?.length ? flow.selectedItem.sizeOptions : ['S', 'M', 'L', 'XL'];

  const confirmSameArticle = async () => {
    if (busy || !size) return;
    setBusy(true);
    setError('');
    try {
      const res = await exchangeService.createExchange({
        orderId: flow.orderId,
        orderItemId: flow.selectedItem.orderItemId,
        reasonCode: flow.reasonCode || 'not_fit',
        exchangeProductId: flow.selectedItem.productId,
        exchangeSize: size,
      });
      updateFlow({ exchangeSize: size, returnId: res.returnId, rmaId: res.rmaId });
      nav(PATHS.RECEIPT);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not create the exchange.');
      setBusy(false);
    }
  };

  const differentArticle = () => { updateFlow({ exchangeSize: size }); nav(PATHS.EXCHANGE_RECOMMENDATIONS); };

  return (
    <FlowStage backTo={PATHS.EXCHANGE_REASON}>
      <div className="twocol">
        <div className="twocol__img"><Thumb src={flow.selectedItem?.imageUrl} alt={flow.selectedItem?.name} /></div>
        <div className="twocol__col">
          <h2 className="twocol__title">SIZE :</h2>
          <SizePicker sizes={sizes} onChange={setSize} />
          <div className="row-center" style={{ marginTop: 10 }}>
            <Button size="md" pill onClick={confirmSameArticle} disabled={!size || busy}>{busy ? '…' : 'CONFIRM EXCHANGE'}</Button>
          </div>
          <OptionBar label="Exchange with different article" onClick={differentArticle} style={{ marginTop: 8 }} />
          {error ? <p role="alert" style={{ color: '#ff8a8a' }}>{error}</p> : null}
        </div>
      </div>
    </FlowStage>
  );
}
