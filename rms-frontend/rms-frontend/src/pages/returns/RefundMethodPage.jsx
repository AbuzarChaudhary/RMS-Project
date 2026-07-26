import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { returnService } from '@/services/returnService';
import { PATHS } from '@/routes/paths';

export default function RefundMethodPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!flow.returnId) nav(PATHS.HOME, { replace: true }); }, [flow.returnId, nav]);
  if (!flow.returnId) return null;

  const choose = async (method) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await returnService.submitRefundMethod(flow.returnId, { method });
      updateFlow({ refundMethod: method });
      nav(method === 'bank_account' ? PATHS.RETURN_BANK_DETAILS : PATHS.RECEIPT);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not set the refund method.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.RETURN_REASON}>
      <div className="amount">AMOUNT : Rs {flow.refundAmount ?? '—'}</div>
      <div className="row-center">
        <Button size="md" pill onClick={() => choose('bank_account')} disabled={busy}>RETURN TO ACCOUNT</Button>
        <Button size="md" pill onClick={() => choose('store_credit')} disabled={busy}>RETURN AS STORE CREDIT</Button>
      </div>
      {error ? <p role="alert" style={{ textAlign: 'center', color: '#ff8a8a' }}>{error}</p> : null}
    </FlowStage>
  );
}
