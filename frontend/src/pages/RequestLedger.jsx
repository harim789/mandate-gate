import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { ledgerTabs, ledgerSummary, ledgerRequests, verdictMeta } from '../data/mock';

const MONO = "[font-family:'JetBrains_Mono',monospace]";

const WIDE_COLS = '88px 110px 130px minmax(0,1fr) 110px 56px';
const FOLD_COLS = '88px 110px minmax(0,1fr) 110px 56px';

function getHref(verdict, id) {
  if (verdict === '차단') return `/requests/${id}`;
  if (verdict === '승인 필요') return '/approvals';
  return null;
}

function RowShell({ href, bar, className, children }) {
  const base = 'items-center border-l-2 border-b border-[var(--hairline)] text-[var(--ink)] no-underline';
  const style = { borderLeftColor: bar };
  if (href) {
    return (
      <Link
        to={href}
        style={style}
        className={`${base} ${className} hover:bg-[var(--canvas-soft)] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)]`}
      >
        {children}
      </Link>
    );
  }
  return (
    <div style={style} className={`${base} ${className} cursor-default`}>
      {children}
    </div>
  );
}

function VerdictLabel({ verdict }) {
  const m = verdictMeta[verdict];
  return (
    <span className="whitespace-nowrap text-sm font-semibold" style={{ color: m.color }}>
      <span className="text-[13px]">{m.glyph}</span> {verdict}
    </span>
  );
}

export default function RequestLedger() {
  const [filter, setFilter] = useState('all');

  const rows = (filter === 'all' ? ledgerRequests : ledgerRequests.filter((r) => r.verdict === filter)).map(
    (r) => ({
      ...r,
      amountStr: r.amount.toLocaleString('ko-KR') + '원',
      href: getHref(r.verdict, r.id),
      bar: r.verdict === '통과' ? 'transparent' : verdictMeta[r.verdict].color,
      isBlock: r.verdict === '차단',
      hasReason: !!r.reason,
    }),
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="requests" crumb="요청 기록" />

      <div className="mx-auto py-12" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <h1 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
          요청 기록
        </h1>
        <p className="mt-3 text-base leading-[1.5] text-[var(--body)]">
          게이트웨이가 판정한 모든 요청입니다.
        </p>
        <div className={`mt-4 text-[13px] leading-[1.4] text-[var(--muted)]`}>
          <span className={`${MONO} tabular-nums`}>{ledgerSummary.date}</span> · 오늘{' '}
          <span className={`${MONO} tabular-nums`}>{ledgerSummary.todayCount}</span>건 판정 ·
          마지막 요청 <span className={`${MONO} tabular-nums`}>{ledgerSummary.lastAt}</span>
        </div>

        <div className="mt-8 overflow-x-auto overflow-y-hidden border-b border-[var(--hairline)]">
          <div className="flex gap-7 whitespace-nowrap">
            {ledgerTabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`-mb-px cursor-pointer border-b-2 bg-transparent px-0.5 pb-3 font-sans text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2 ${
                    active
                      ? 'border-[var(--ink)] font-semibold text-[var(--ink)]'
                      : 'border-transparent font-normal text-[var(--muted)]'
                  }`}
                >
                  {tab.name} <span className={`${MONO} text-[13px] tabular-nums`}>{tab.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="border-b border-[var(--hairline)] px-6 py-24 text-center">
            <div className="text-base leading-[1.5] text-[var(--muted)]">해당하는 요청이 없습니다.</div>
            <div className="mt-3">
              <Link
                to="/demo"
                className="text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
              >
                시뮬레이터에서 요청 보내기 →
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop: wide table (>=1024px) */}
            <div className="hidden lg:block">
              <div
                className="grid items-center gap-4 border-b border-[var(--hairline-strong)] py-3 pl-[18px] text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]"
                style={{ gridTemplateColumns: WIDE_COLS }}
              >
                <span>시각</span>
                <span>에이전트</span>
                <span className="text-right">금액</span>
                <span>가맹점 / 수취인</span>
                <span>판정</span>
                <span></span>
              </div>
              {rows.map((r) => (
                <RowShell key={r.id} href={r.href} bar={r.bar} className="grid min-h-[63px] gap-4 py-2.5 pl-4">
                  <span className={`${MONO} text-[13px] tabular-nums text-[var(--body)]`}>{r.at}</span>
                  <span className="text-sm text-[var(--ink)]">{r.agent}</span>
                  <span className="text-right">
                    <span className={`${MONO} text-sm tabular-nums text-[var(--ink)]`}>{r.amountStr}</span>
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`text-sm leading-[1.5] text-[var(--body)] ${r.isAccount ? MONO : ''}`}
                    >
                      {r.target}
                    </span>
                    {r.isNew && (
                      <span className="ml-2 rounded-full bg-[var(--surface-strong)] px-2 py-0.5 align-[1px] text-[11px] font-semibold tracking-[0.06em] text-[var(--body)]">
                        신규
                      </span>
                    )}
                    {r.hasReason && (
                      <span className="mt-0.5 block text-[13px] leading-[1.4] text-[var(--muted)]">
                        {r.reason}
                      </span>
                    )}
                  </span>
                  <VerdictLabel verdict={r.verdict} />
                  <span className="text-right">
                    {r.isBlock && (
                      <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">상세 →</span>
                    )}
                  </span>
                </RowShell>
              ))}
            </div>

            {/* Tablet: folded table (768px–1023px) */}
            <div className="hidden md:block lg:hidden">
              <div
                className="grid items-center gap-4 border-b border-[var(--hairline-strong)] py-3 pl-[18px] text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]"
                style={{ gridTemplateColumns: FOLD_COLS }}
              >
                <span>시각</span>
                <span>에이전트</span>
                <span className="text-right">금액</span>
                <span>판정</span>
                <span></span>
              </div>
              {rows.map((r) => (
                <RowShell key={r.id} href={r.href} bar={r.bar} className="grid min-h-[63px] gap-4 py-2.5 pl-4">
                  <span className={`${MONO} text-[13px] tabular-nums text-[var(--body)]`}>{r.at}</span>
                  <span className="text-sm text-[var(--ink)]">{r.agent}</span>
                  <span className="text-right">
                    <span className={`${MONO} text-sm tabular-nums text-[var(--ink)]`}>{r.amountStr}</span>
                    <span
                      className={`mt-0.5 block text-[13px] leading-[1.4] text-[var(--body)] ${r.isAccount ? MONO : ''}`}
                    >
                      {r.target}
                    </span>
                    {r.hasReason && (
                      <span className="mt-0.5 block text-[13px] leading-[1.4] text-[var(--muted)]">
                        {r.reason}
                      </span>
                    )}
                  </span>
                  <VerdictLabel verdict={r.verdict} />
                  <span className="text-right">
                    {r.isBlock && (
                      <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--ink)]">상세 →</span>
                    )}
                  </span>
                </RowShell>
              ))}
            </div>

            {/* Mobile: stacked cards (<768px) */}
            <div className="md:hidden">
              {rows.map((r) => (
                <RowShell key={r.id} href={r.href} bar={r.bar} className="block py-3.5 pl-3.5">
                  <span className="flex items-baseline gap-3">
                    <span className={`${MONO} text-[13px] tabular-nums text-[var(--body)]`}>{r.at}</span>
                    <span className="text-sm text-[var(--ink)]">{r.agent}</span>
                    <span className="ml-auto">
                      <VerdictLabel verdict={r.verdict} />
                    </span>
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-baseline gap-3">
                    <span className={`${MONO} text-sm tabular-nums text-[var(--ink)]`}>{r.amountStr}</span>
                    <span className={`text-sm text-[var(--body)] ${r.isAccount ? MONO : ''}`}>{r.target}</span>
                    {r.isNew && (
                      <span className="rounded-full bg-[var(--surface-strong)] px-2 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-[var(--body)]">
                        신규
                      </span>
                    )}
                  </span>
                  {r.hasReason && (
                    <span className="mt-1 block text-[13px] leading-[1.4] text-[var(--muted)]">{r.reason}</span>
                  )}
                </RowShell>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
