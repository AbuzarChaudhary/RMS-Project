import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { warehouseService } from '@/services/warehouseService';
import { PATHS } from '@/routes/paths';

export default function WarehouseInspectionPage() {
  const nav = useNavigate();
  const { rmaId } = useParams();
  const { state } = useLocation();
  const item = state?.item;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [inspected, setInspected] = useState(item?.stage === 'inspected');

  const markInspected = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await warehouseService.inspectItem(rmaId, {});
      setInspected(true);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not mark as inspected.');
    } finally {
      setBusy(false);
    }
  };

  const toRestock = () => nav(PATHS.WAREHOUSE_RESTOCK, { state: { rmaId, item } });

  return (
    <FlowStage backTo={PATHS.WAREHOUSE_INBOUND} title="Item Inspection" list>
      <div className="det">
        <div className="det__img"><Thumb src={item?.imageUrl} alt={item?.productName} /></div>
        <div className="det__panel">
          <span className="det__name">{item?.productName || 'Return item'} {item?.color ? <small>({item.color})</small> : null}</span>
          <span className="det__line">RMA ID: {rmaId}</span>
          {item?.size ? <span className="det__line">Size: {item.size}</span> : null}
          <span className="det__line">Status: {inspected ? 'Inspected' : (item?.stage || 'received')}</span>
        </div>
      </div>
      {error ? <p role="alert" style={{ textAlign: 'center', color: '#ff8a8a' }}>{error}</p> : null}
      <div className="row-center">
        {!inspected
          ? <Button size="md" pill onClick={markInspected} disabled={busy}>{busy ? '…' : 'MARK AS INSPECTED'}</Button>
          : <Button size="md" pill onClick={toRestock}>PROCEED TO RESTOCK</Button>}
      </div>
    </FlowStage>
  );
}
