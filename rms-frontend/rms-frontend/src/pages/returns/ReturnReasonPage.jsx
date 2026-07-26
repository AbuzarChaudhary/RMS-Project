import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import OptionBar from '@/components/common/OptionBar';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { returnService } from '@/services/returnService';
import { PATHS } from '@/routes/paths';

const REASONS = [
  { code: 'not_fit', label: 'Item did not fit' },
  { code: 'wrong_item', label: 'I received the wrong item' },
  { code: 'not_like', label: 'I did not like the item' },
];

export default function ReturnReasonPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!flow.selectedItem) nav(PATHS.HOME, { replace: true }); }, [flow.selectedItem, nav]);
  if (!flow.selectedItem) return null;

  const startReturn = async (code) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await returnService.createReturn({
        orderId: flow.orderId,
        orderItemId: flow.selectedItem.orderItemId,
        reasonCode: code,
      });
      updateFlow({ flowType: 'return', reasonCode: code, returnId: res.returnId, rmaId: res.rmaId, refundAmount: res.refundAmount });
      nav(PATHS.RETURN_REFUND_METHOD);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not start the return.');
      setBusy(false);
    }
  };

  const defected = () => { updateFlow({ flowType: 'return', reasonCode: 'defected' }); nav(PATHS.RETURN_PHOTO); };

  return (
    <FlowStage backTo={PATHS.ORDER_OPTIONS}>
      <div className="twocol">
        <div className="twocol__img"><Thumb src={flow.selectedItem?.imageUrl} alt={flow.selectedItem?.name} /></div>
        <div className="twocol__col">
          <h2 className="twocol__title">REASON :</h2>
          {REASONS.map((r, i) => <OptionBar key={r.code} number={i + 1} label={r.label} onClick={() => startReturn(r.code)} />)}
          <OptionBar number={4} label="The item is defected" onClick={defected} />
          {error ? <p role="alert" style={{ color: '#ff8a8a' }}>{error}</p> : null}
        </div>
      </div>
    </FlowStage>
  );
}
