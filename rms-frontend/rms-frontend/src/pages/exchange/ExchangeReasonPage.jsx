import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import OptionBar from '@/components/common/OptionBar';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { PATHS } from '@/routes/paths';

export default function ExchangeReasonPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();

  useEffect(() => { if (!flow.selectedItem) nav(PATHS.HOME, { replace: true }); }, [flow.selectedItem, nav]);
  if (!flow.selectedItem) return null;

  const go = (code, path) => { updateFlow({ flowType: 'exchange', reasonCode: code }); nav(path); };
  const defected = () => { updateFlow({ flowType: 'return', reasonCode: 'defected' }); nav(PATHS.RETURN_PHOTO); };

  return (
    <FlowStage backTo={PATHS.ORDER_OPTIONS}>
      <div className="twocol">
        <div className="twocol__img"><Thumb src={flow.selectedItem?.imageUrl} alt={flow.selectedItem?.name} /></div>
        <div className="twocol__col">
          <h2 className="twocol__title">REASON :</h2>
          <OptionBar number={1} label="Item did not fit" onClick={() => go('not_fit', PATHS.EXCHANGE_SIZE)} />
          <OptionBar number={2} label="I received the wrong item" onClick={() => go('wrong_item', PATHS.EXCHANGE_WRONG_ITEM)} />
          <OptionBar number={3} label="I did not like the item" onClick={() => go('not_like', PATHS.EXCHANGE_RECOMMENDATIONS)} />
          <OptionBar number={4} label="The item is defected" onClick={defected} />
        </div>
      </div>
    </FlowStage>
  );
}
