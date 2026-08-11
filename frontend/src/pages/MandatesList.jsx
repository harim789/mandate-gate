import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { mandateRecords, mandateStatusMeta } from '../data/mock';
import { useMandates } from '../context/MandatesContext';

const MONO = "[font-family:'JetBrains_Mono',monospace]";
const WIDE_COLS = '150px 110px minmax(0,1fr) 110px 90px 56px';

function won(n) {
  return n.toLocaleString('ko-KR');
}

export default function MandatesList() {
  const { effective } = useMandates();

  const rows = mandateRecords.map((raw) => {
    const m = effective(raw.id);
    const meta = mandateStatusMeta[m.status];
    const active = m.status === '유효';
    return {
      id: m.id,
      agent: m.agent,
      used: won(m.usedAmount),
      total: won(m.maxTotal),
      transfer: m.allowTransfer ? `허용 ${m.recipients.length}명` : '불허',
      transferColor: m.allowTransfer ? 'var(--verdict-hold)' : 'var(--body)',
      transferWeight: m.allowTransfer ? 600 : 400,
      status: m.status,
      statusColor: meta.color,
      statusGlyph: meta.glyph,
      opacity: active ? 1 : 0.55,
      hoverable: active,
      summary: active
        ? `${m.categories.join(' · ')} · ${m.hourFrom}–${m.hourTo} · ~${m.validUntil.slice(5)}`
        : `폐기 ${m.revokedAt || ''}`,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="mandates" crumb="위임장" />

      <div className="mx-auto py-12" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
              위임장
            </h1>
            <p className="mt-3 text-base leading-[1.5] text-[var(--body)]">
              에이전트가 할 수 있는 일의 범위를 정한 문서입니다.
            </p>
          </div>
          <Link
            to="/mandates/new"
            className="inline-flex h-11 flex-none items-center rounded-lg bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--on-dark)] hover:no-underline hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            위임장 발급
          </Link>
        </div>

        <div className="mt-8">
          {/* Wide table (>=768px) */}
          <div className="hidden md:block">
            <div
              className="grid gap-4 border-b border-[var(--hairline-strong)] py-3 pl-4 text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]"
              style={{ gridTemplateColumns: WIDE_COLS }}
            >
              <span>위임장 ID</span>
              <span>수임인</span>
              <span className="text-right">사용 / 총 한도</span>
              <span>송금</span>
              <span>상태</span>
              <span></span>
            </div>
            {rows.map((r) => (
              <Link
                key={r.id}
                to={`/mandates/${r.id}`}
                style={{ opacity: r.opacity }}
                className={`block border-b border-[var(--hairline)] py-3.5 pl-4 text-[var(--ink)] no-underline focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--ink)] ${
                  r.hoverable ? 'hover:bg-[var(--canvas-soft)] hover:no-underline' : ''
                }`}
              >
                <div className="grid items-baseline gap-4" style={{ gridTemplateColumns: WIDE_COLS }}>
                  <span className={`${MONO} text-[13px] text-[var(--ink)]`}>#{r.id}</span>
                  <span className="text-sm text-[var(--ink)]">{r.agent}</span>
                  <span className="whitespace-nowrap text-right">
                    <span className={`${MONO} tabular-nums text-sm text-[var(--ink)]`}>{r.used}</span>
                    <span className={`${MONO} tabular-nums text-sm text-[var(--muted)]`}> / {r.total}</span>
                  </span>
                  <span className="whitespace-nowrap text-sm" style={{ fontWeight: r.transferWeight, color: r.transferColor }}>
                    {r.transfer}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold" style={{ color: r.statusColor }}>
                    {r.statusGlyph} {r.status}
                  </span>
                  <span className="text-right">
                    <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">상세 →</span>
                  </span>
                </div>
                <div className="mt-1 text-[13px] leading-[1.4] text-[var(--muted)]">{r.summary}</div>
              </Link>
            ))}
          </div>

          {/* Narrow cards (<768px) */}
          <div className="md:hidden">
            {rows.map((r) => (
              <Link
                key={r.id}
                to={`/mandates/${r.id}`}
                style={{ opacity: r.opacity }}
                className={`block border-b border-[var(--hairline)] py-3.5 pl-4 text-[var(--ink)] no-underline focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--ink)] ${
                  r.hoverable ? 'hover:bg-[var(--canvas-soft)] hover:no-underline' : ''
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`${MONO} text-[13px] text-[var(--ink)]`}>#{r.id}</span>
                  <span className="text-sm text-[var(--ink)]">{r.agent}</span>
                  <span className="ml-auto whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">상세 →</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-3">
                  <span className="whitespace-nowrap">
                    <span className={`${MONO} tabular-nums text-sm text-[var(--ink)]`}>{r.used}</span>
                    <span className={`${MONO} tabular-nums text-sm text-[var(--muted)]`}> / {r.total}</span>
                  </span>
                  <span className="text-sm" style={{ fontWeight: r.transferWeight, color: r.transferColor }}>
                    {r.transfer}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: r.statusColor }}>
                    {r.statusGlyph} {r.status}
                  </span>
                </div>
                <div className="mt-1 text-[13px] leading-[1.4] text-[var(--muted)]">{r.summary}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
