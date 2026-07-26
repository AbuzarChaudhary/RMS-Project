import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import ProductCard from '@/components/common/ProductCard';
import Button from '@/components/common/Button';
import { useReturnFlow } from '@/context/ReturnFlowContext';
import { exchangeService } from '@/services/exchangeService';
import { PATHS } from '@/routes/paths';

export default function ExchangeRecommendationsPage() {
  const nav = useNavigate();
  const { flow, updateFlow } = useReturnFlow();
  const [recs, setRecs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!flow.selectedItem) { nav(PATHS.HOME, { replace: true }); return; }
    exchangeService.getRecommendations(flow.selectedItem.orderItemId)
      .then((d) => setRecs(d.recommendations || []))
      .catch((e) => setError(e?.response?.data?.error || 'Could not load recommendations.'))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const exchange = async () => {
    if (busy) return;
    const productId = selected ?? recs[0]?.productId;
    if (!productId) return;
    setBusy(true);
    setError('');
    try {
      const res = await exchangeService.createExchange({
        orderId: flow.orderId,
        orderItemId: flow.selectedItem.orderItemId,
        reasonCode: flow.reasonCode || 'not_like',
        exchangeProductId: productId,
        exchangeSize: flow.exchangeSize,
      });
      updateFlow({ exchangeProductId: productId, returnId: res.returnId, rmaId: res.rmaId });
      nav(PATHS.RECEIPT);
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not create the exchange.');
      setBusy(false);
    }
  };

  return (
    <FlowStage backTo={PATHS.EXCHANGE_REASON} title="Recommended Articles" list>
      <div className="reco">
        {loading ? <p style={{ padding: 12 }}>Loading…</p> : null}
        {error ? <p role="alert" style={{ padding: 12, color: '#ff8a8a' }}>{error}</p> : null}
        {recs.map((p) => (
          <div key={p.productId} style={{ outline: selected === p.productId ? '3px solid #44ff00' : 'none', borderRadius: 12 }}>
            <ProductCard layout="col" name={p.name} meta={p.color} price={`Rs ${p.price}`} imageUrl={p.imageUrl} onClick={() => setSelected(p.productId)} />
          </div>
        ))}
      </div>
      <div className="row-center">
        <Button size="md" pill onClick={exchange} disabled={busy || recs.length === 0}>{busy ? '…' : 'EXCHANGE'}</Button>
      </div>
    </FlowStage>
  );
}
