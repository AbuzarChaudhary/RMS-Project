import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { GarmentIcon } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { adminService } from '@/services/adminService';
import { PATHS } from '@/routes/paths';

export default function ReturnRequestDetailsPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { rmaId: rmaParam } = useParams();
  const req = state?.request;
  const rmaId = req?.rmaId || rmaParam;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const decide = async (decision) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await adminService.decideRequest(rmaId, decision);
      nav(PATHS.STAFF_PANEL);
    } catch (e) {
      setError(e?.response?.data?.error || 'Action failed. Please try again.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.STAFF_PANEL}>
      <div className="det">
        <div className="det__img"><Thumb src={req?.imageUrl} alt={req?.productName} /></div>
        <div className="det__panel">
          <span className="det__name">{req?.productName || 'Return request'} {req?.color ? <small>({req.color})</small> : null}</span>
          {req?.price != null ? <span className="det__line">Rs {req.price}</span> : null}
          <span className="det__line">REASON: {req?.reason || '—'}</span>
          <span className="det__line">RMA ID: {rmaId}</span>
          {req?.status ? <span className="det__line">STATUS: {req.status}</span> : null}
        </div>
      </div>
      {error ? <p role="alert" style={{ textAlign: 'center', color: '#ff8a8a' }}>{error}</p> : null}
      <div className="row-center">
        <Button size="md" pill onClick={() => decide('accept')} disabled={busy}>{busy ? '…' : 'ACCEPT'}</Button>
        <Button size="md" pill onClick={() => decide('reject')} disabled={busy}>{busy ? '…' : 'REJECT'}</Button>
      </div>
    </FlowStage>
  );
}
