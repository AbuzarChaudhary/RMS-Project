import { useEffect, useState } from 'react';
import { Donut, Bars, Line } from '@/components/common/Charts';
import { adminService } from '@/services/adminService';

const BAR_COLORS = ['#a0bce8', '#6be6d3', '#111827', '#7dbbff', '#b899eb', '#71dd8c'];
const LOC_COLORS = ['#7dbbff', '#6be6d3', '#b899eb', '#a0bce8', '#71dd8c', '#111827'];

const niceLabels = (maxVal) => [
  String(maxVal),
  String(Math.round((maxVal * 2) / 3)),
  String(Math.round(maxVal / 3)),
  '0',
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getMetrics()
      .then(setMetrics)
      .catch((e) =>
        setError(e?.response?.data?.error || 'Could not load dashboard data. Is the backend running?')
      );
  }, []);

  if (error) return <div className="dash"><h1 className="dash__title">ADMIN DASHBOARD</h1><p style={{ color: '#ff8a8a' }}>{error}</p></div>;
  if (!metrics) return <div className="dash"><h1 className="dash__title">ADMIN DASHBOARD</h1><p>Loading…</p></div>;

  const STATS = [
    { label: 'Total Returns', value: metrics.totals.total, tone: 'a' },
    { label: 'Active Returns', value: metrics.totals.active, tone: 'a' },
    { label: 'Completed Returns', value: metrics.totals.completed, tone: 'b' },
  ];

  const BARS = metrics.byItem.map((d, i) => ({ label: d.label, value: d.value, color: BAR_COLORS[i % BAR_COLORS.length] }));
  const barMax = Math.max(1, ...BARS.map((d) => d.value));

  const locTotal = metrics.byLocation.reduce((s, d) => s + d.value, 0) || 1;
  const LOC = metrics.byLocation.map((d, i) => ({
    label: d.label,
    value: d.value,
    pct: `${((d.value / locTotal) * 100).toFixed(1)}%`,
    color: LOC_COLORS[i % LOC_COLORS.length],
  }));

  let lineVals = metrics.monthly.map((m) => m.value);
  let lineMonths = metrics.monthly.map((m) => m.month.slice(5)); // MM
  if (lineVals.length < 2) { lineVals = [0, ...lineVals]; lineMonths = ['', ...lineMonths]; }
  const lineMax = Math.max(1, ...lineVals);
  const LINE = [{ name: 'Returns', color: '#71dd8c', values: lineVals }];

  return (
    <div className="dash">
      <h1 className="dash__title">ADMIN DASHBOARD</h1>
      <div className="dash__grid">
        <div className="dash__stats">
          <div className="dash__filter">
            <label htmlFor="cat">Items Selection</label>
            <select id="cat" defaultValue="All items">
              <option>All items</option>
              {BARS.map((b) => <option key={b.label}>{b.label}</option>)}
            </select>
          </div>
          {STATS.map((s) => (
            <div className={`stat stat--${s.tone}`} key={s.label}>
              <div className="stat__label">{s.label}</div>
              <div className="stat__value">{Number(s.value).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <section className="chartblock dash__line">
          <div className="chartblock__title">Total Returns</div>
          <div className="chartblock__legend">
            {LINE.map((s) => (
              <span className="chip" key={s.name}><span className="chip__dot" style={{ background: s.color }} />{s.name}</span>
            ))}
          </div>
          <Line series={LINE} months={lineMonths} max={lineMax} yLabels={niceLabels(lineMax)} />
        </section>

        <section className="chartblock dash__bar">
          <div className="chartblock__title">Return by item</div>
          {BARS.length ? <Bars data={BARS} max={barMax} yLabels={niceLabels(barMax)} /> : <p style={{ padding: 12 }}>No returns yet.</p>}
        </section>

        <section className="chartblock dash__donut">
          <div className="chartblock__title">Returns by Location</div>
          <div className="donut-wrap">
            {LOC.length ? <Donut data={LOC} /> : <p style={{ padding: 12 }}>No returns yet.</p>}
            <div className="donut-legend">
              {LOC.map((d) => (
                <div className="legend-row" key={d.label}>
                  <span className="legend-left"><span className="legend-dot" style={{ background: d.color }} />{d.label}</span>
                  <span>{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
