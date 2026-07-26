import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Button from '@/components/common/Button';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { aiVerificationService } from '@/services/aiVerificationService';
import { returnService } from '@/services/returnService';
import { PATHS } from '@/routes/paths';

export default function AiVerificationPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!flow.selectedItem) { nav(PATHS.HOME, { replace: true }); return; }
    const fd = new FormData();
    if (flow.photoFile) fd.append('image', flow.photoFile);
    aiVerificationService
      .verifyDefect(fd)
      .then((r) => { setResult(r); updateFlow({ verificationResult: r }); })
      .catch(() => setResult({ message: 'Could not run the check — you can still continue.', confidence: null }))
      .finally(() => setAnalyzing(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const proceed = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await returnService.createReturn({
        orderId: flow.orderId,
        orderItemId: flow.selectedItem.orderItemId,
        reasonCode: 'defected',
        defectConfidence: result?.confidence ?? undefined,
      });
      updateFlow({ returnId: res.returnId, rmaId: res.rmaId, refundAmount: res.refundAmount });
      nav(PATHS.RETURN_REFUND_METHOD);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not continue.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.RETURN_PHOTO}>
      <p className="msg" style={{ marginBottom: 4 }}>AI Damage Analysis</p>
      {analyzing ? (
        <p className="msg">Analyzing the photo…</p>
      ) : (
        <>
          {result?.confidence != null ? (
            <p className="msg" style={{ fontSize: 40, fontWeight: 800, margin: '4px 0' }}>{result.confidence}%</p>
          ) : null}
          <p className="msg">{result?.message || 'Analysis complete.'}</p>
        </>
      )}
      {error ? <p role="alert" style={{ textAlign: 'center', color: '#ff8a8a' }}>{error}</p> : null}
      <div className="row-center">
        <Button size="lg" pill onClick={proceed} disabled={analyzing || busy}>{busy ? '…' : 'CONTINUE'}</Button>
      </div>
    </FlowStage>
  );
}
