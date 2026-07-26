import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import ProductCard from '@/components/common/ProductCard';
import { warehouseService } from '@/services/warehouseService';
import { PATHS } from '@/routes/paths';

export default function WarehouseInboundPage() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    warehouseService.listInbound()
      .then((d) => setItems(d.inbound || []))
      .catch((e) => setError(e?.response?.data?.error || 'Could not load inbound returns. Are you logged in as warehouse?'))
      .finally(() => setLoading(false));
  }, []);

  const open = (it) => nav(PATHS.WAREHOUSE_INSPECTION.replace(':rmaId', it.rmaId), { state: { item: it } });

  return (
    <FlowStage backTo={PATHS.WAREHOUSE_LOGIN} title="Inbound Returns" list>
      <div className="stack">
        {loading ? <p style={{ padding: 12 }}>Loading…</p> : null}
        {error ? <p role="alert" style={{ padding: 12, color: '#ff8a8a' }}>{error}</p> : null}
        {!loading && !error && items.length === 0 ? (
          <p style={{ padding: 12 }}>No inbound returns yet. (Accept a request in the staff panel first.)</p>
        ) : null}
        {items.map((it) => (
          <ProductCard
            key={it.rmaId}
            layout="row"
            name={`${it.productName} (${it.rmaId})`}
            meta={`${it.color} · ${it.size} · ${it.requestType} · ${it.stage}`}
            imageUrl={it.imageUrl}
            onClick={() => open(it)}
          />
        ))}
      </div>
    </FlowStage>
  );
}
