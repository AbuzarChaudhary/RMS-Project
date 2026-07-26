import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { warehouseService } from '@/services/warehouseService';
import { PATHS } from '@/routes/paths';

export default function WarehouseRestockPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const rmaId = state?.rmaId;
  const item = state?.item;
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!rmaId) nav(PATHS.WAREHOUSE_INBOUND, { replace: true }); }, [rmaId, nav]);
  if (!rmaId) return null;

  const restock = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await warehouseService.restock({ rmaId });
      setDone(true);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not restock.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.WAREHOUSE_INBOUND} title="Restock" list>
      <div className="det">
        <div className="det__img"><Thumb src={item?.imageUrl} alt={item?.productName} /></div>
        <div className="det__panel">
          <span className="det__name">{item?.productName || 'Return item'}</span>
          <span className="det__line">RMA ID: {rmaId}</span>
          <span className="det__line">Status: {done ? 'Restocked & completed' : 'Inspected'}</span>
        </div>
      </div>
      {error ? <p role="alert" style={{ textAlign: 'center', color: '#ff8a8a' }}>{error}</p> : null}
      <div className="row-center">
        {!done
          ? <Button size="md" pill onClick={restock} disabled={busy}>{busy ? '…' : 'RESTOCK & COMPLETE'}</Button>
          : <Button size="md" pill onClick={() => nav(PATHS.WAREHOUSE_INBOUND)}>BACK TO INBOUND</Button>}
      </div>
    </FlowStage>
  );
}
