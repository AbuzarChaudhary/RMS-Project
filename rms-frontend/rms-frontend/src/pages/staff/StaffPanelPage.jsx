import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ChevronLeft } from '@/components/common/Icons';
import Thumb from '@/components/common/Thumb';
import { adminService } from '@/services/adminService';
import { PATHS } from '@/routes/paths';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function StaffPanelPage() {
  const nav = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const load = (params) => {
    setLoading(true);
    setError('');
    adminService
      .listRequests(params)
      .then((data) => setRequests(data.requests || []))
      .catch((e) => setError(e?.response?.data?.error || 'Could not load requests. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const open = (req) => nav(PATHS.STAFF_REQUEST_DETAILS.replace(':rmaId', req.rmaId), { state: { request: req } });

  return (
    <section className="staff">
      <button type="button" className="staff__back" onClick={() => nav(PATHS.STAFF_LOGIN)} aria-label="Go back"><ChevronLeft /></button>
      <div className="staff__bar">
        <div className="staff__search">
          <Input pill placeholder="ENTER RMA ID" aria-label="RMA ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Button size="md" pill onClick={() => load(query.trim() ? { search: query.trim() } : undefined)}>SEARCH</Button>
        <Button size="md" pill onClick={() => load({ status: 'pending' })}>PENDING</Button>
        <Button size="md" pill onClick={() => load({ status: 'completed' })}>COMPLETED</Button>
        <Button size="md" pill onClick={() => load()}>ALL</Button>
      </div>

      <div className="staff__list">
        {loading ? <p style={{ padding: 16 }}>Loading…</p> : null}
        {error ? <p role="alert" style={{ padding: 16, color: '#ff8a8a' }}>{error}</p> : null}
        {!loading && !error && requests.length === 0 ? <p style={{ padding: 16 }}>No requests found.</p> : null}
        {requests.map((r) => (
          <button type="button" className="req" key={r.rmaId} onClick={() => open(r)}>
            <span className="req__thumb"><Thumb src={r.imageUrl} alt={r.productName} /></span>
            <span className="req__name">{r.productName} <small>({r.color})</small></span>
            <span className="req__price">Rs {r.price}</span>
            <span className="req__meta"><span>RMA ID: {r.rmaId}</span><span>Status : {cap(r.status)}</span></span>
          </button>
        ))}
      </div>
    </section>
  );
}
