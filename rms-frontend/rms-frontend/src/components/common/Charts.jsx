// Lightweight inline charts for the admin dashboard (no external deps).

export function Donut({ data, size = 140, stroke = 28 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let off = 0;
  return (
    <svg className="donut" viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Returns by location">
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((d, i) => {
          const len = (c * d.value) / total;
          const seg = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={d.color} strokeWidth={stroke} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} />
          );
          off += len; return seg;
        })}
      </g>
    </svg>
  );
}

export function Bars({ data, max = 6.5, yLabels = ['6K', '4K', '2K', '0'] }) {
  return (
    <div className="bars-chart">
      <div className="bars-y">{yLabels.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="bars-main">
        <div className="bars-plot">
          {data.map((d, i) => (
            <div className="bar-col" key={i}><div className="bar" style={{ height: `${(d.value / max) * 100}%`, background: d.color }} /></div>
          ))}
        </div>
        <div className="bars-x">{data.map((d, i) => <span key={i}>{d.label}</span>)}</div>
      </div>
    </div>
  );
}

export function Line({ series, months, max = 30, yLabels = ['30K', '20K', '10K', '0'] }) {
  const W = 620, H = 190;
  const pts = (vals) => vals.map((v, i) => `${(i / (vals.length - 1)) * W},${H - (v / max) * H}`).join(' ');
  return (
    <div className="line-chart">
      <div className="line-y">{yLabels.map((l) => <span key={l}>{l}</span>)}</div>
      <div className="line-main">
        <div className="line-plot">
          <svg className="line-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            {series.map((s, i) => (
              <polyline key={i} points={pts(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
        <div className="line-x">{months.map((m) => <span key={m}>{m}</span>)}</div>
      </div>
    </div>
  );
}
