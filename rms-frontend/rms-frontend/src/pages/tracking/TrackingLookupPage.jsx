import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStage from '@/components/common/FlowStage';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { trackingService } from '@/services/trackingService';
import { PATHS } from '@/routes/paths';

export default function TrackingLookupPage() {
  const nav = useNavigate();
  const [rma, setRma] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const track = async () => {
    const id = rma.trim();
    if (!id) { setError('Please enter your RMA ID.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await trackingService.getStatus(id);
      nav(PATHS.TRACK_STATUS, { state: { tracking: data } });
    } catch (e) {
      setError(e?.response?.data?.error || 'Could not find that RMA ID.');
    } finally {
      setLoading(false);
    }
  };
  const onKeyDown = (e) => { if (e.key === 'Enter') track(); };

  return (
    <FlowStage backTo={PATHS.HOME}>
      <div className="track">
        <Input size="lg" pill placeholder="ENTER YOUR RMA ID" aria-label="RMA ID" value={rma} onChange={(e) => setRma(e.target.value)} onKeyDown={onKeyDown} />
        {error ? <p role="alert" style={{ color: '#ff8a8a', fontWeight: 600 }}>{error}</p> : null}
        <Button size="xl" pill onClick={track} disabled={loading}>{loading ? 'TRACKING…' : 'TRACK'}</Button>
      </div>
    </FlowStage>
  );
}
