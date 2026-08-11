import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { approvalRecords, layerStateMeta } from '../data/mock';

const MONO = "[font-family:'JetBrains_Mono',monospace]";

const btn = 'h-11 flex-[1_1_180px] rounded-lg text-sm font-semibold hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2';

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function now() {
  return '2026-08-07 ' + new Date().toTimeString().slice(0, 8);
}

export default function Approvals() {
  const [expandedId, setExpandedId] = useState(approvalRecords[0].id);
  const [confirmingId, setConfirmingId] = useState(null);
  const [countdown, setCountdown] = useState(() => ({
    remaining: approvalRecords.reduce((acc, a) => ({ ...acc, [a.id]: a.expiresInSec }), {}),
    resolved: {},
  }));
  const { remaining, resolved } = countdown;

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        const remaining = { ...prev.remaining };
        const resolved = { ...prev.resolved };
        let changed = false;
        approvalRecords.forEach((a) => {
          if (resolved[a.id]) return;
          remaining[a.id] = Math.max(0, remaining[a.id] - 1);
          changed = true;
          if (remaining[a.id] === 0) resolved[a.id] = { type: 'expired', at: now() };
        });
        return changed ? { remaining, resolved } : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function resolve(id, type, note) {
    setConfirmingId(null);
    setCountdown((prev) => ({
      ...prev,
      resolved: { ...prev.resolved, [id]: { type, at: now(), note } },
    }));
  }

  const pendingCount = approvalRecords.filter((a) => !resolved[a.id]).length;
  const allDone = pendingCount === 0;

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="approvals" crumb="승인 대기" pendingCount={pendingCount} />

      <div className="mx-auto py-12" style={{ width: 'min(880px, 100% - 48px)' }}>
        <h1 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
          승인 대기
        </h1>
        <p className="mt-3 max-w-[560px] text-pretty text-base leading-[1.5] text-[var(--body)]">
          게이트웨이가 판단을 보류한 요청입니다. 응답하지 않으면 자동으로 거부됩니다.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {approvalRecords.map((a) => {
            const res = resolved[a.id];
            const rem = remaining[a.id];
            const expanded = expandedId === a.id;
            const confirming = !res && confirmingId === a.id;
            const label = !res ? '승인 필요' : res.type === 'approved' ? '승인함' : res.type === 'rejected' ? '거부함' : '자동 거부됨';
            const labelColor = !res
              ? 'var(--verdict-hold)'
              : res.type === 'approved'
                ? 'var(--verdict-pass)'
                : res.type === 'rejected'
                  ? 'var(--verdict-block)'
                  : 'var(--muted)';
            const bar = !res ? 'var(--verdict-hold)' : res.type === 'approved' ? 'var(--verdict-pass)' : 'var(--verdict-block)';
            const resolvedText = res
              ? res.type === 'approved'
                ? res.note
                : res.type === 'rejected'
                  ? '거부'
                  : '응답이 없어 자동으로 거부했습니다'
              : '';

            return (
              <div key={a.id} className="flex items-stretch" style={{ opacity: res ? 0.55 : 1 }}>
                <div className="w-0.5 flex-none rounded-sm" style={{ background: bar }} />
                <div className="ml-3 min-w-0 flex-1 rounded-xl border border-[var(--hairline-strong)] bg-[var(--canvas)]">
                  <button
                    onClick={() => setExpandedId(expanded ? null : a.id)}
                    aria-expanded={expanded}
                    className="box-border flex min-h-16 w-full flex-wrap items-center gap-3 rounded-xl bg-transparent px-5 py-3 text-left font-sans focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ink)]"
                  >
                    <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.06em]" style={{ color: labelColor }}>
                      {label}
                    </span>
                    {!expanded && (
                      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[var(--body)]">
                        {a.summary}
                      </span>
                    )}
                    <span className="ml-auto flex items-baseline gap-3 whitespace-nowrap">
                      {!res && (
                        <span className="text-[13px]" style={{ color: rem < 120 ? 'var(--verdict-block)' : 'var(--muted)' }}>
                          <span className={`${MONO} tabular-nums`}>{fmt(rem)}</span> 후 자동 거부
                        </span>
                      )}
                      {!!res && !expanded && (
                        <span className="text-[13px] text-[var(--muted)]">
                          <span className={`${MONO} tabular-nums`}>{res.at}</span>
                        </span>
                      )}
                      <span aria-hidden="true" className="text-[13px] text-[var(--muted)]">
                        {expanded ? '▴' : '▾'}
                      </span>
                    </span>
                  </button>

                  {expanded && (
                    <div className="px-5 pb-6 pt-1">
                      <h2 className="text-pretty text-[clamp(22px,3.5vw,28px)] font-semibold leading-[1.2] tracking-[-0.7px] text-[var(--ink)]">
                        {a.headlinePre}
                        <span className={`${MONO} tabular-nums tracking-[-0.3px]`}>{a.headlineAmount}</span>
                        {a.headlinePost}
                      </h2>

                      <div className="mt-5 border-t border-[var(--hairline)]">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-3">
                          <span className="w-20 flex-none text-[13px] text-[var(--muted)]">{a.targetLabel}</span>
                          <span className="text-sm text-[var(--ink)]">
                            {a.targetName}
                            {a.account && (
                              <>
                                <span className="text-[var(--body)]"> · </span>
                                <span className={`${MONO} tabular-nums text-[13px] text-[var(--body)]`}>{a.account}</span>
                              </>
                            )}
                          </span>
                          {a.unregistered && (
                            <span className="ml-auto flex-none whitespace-nowrap rounded-full bg-[var(--surface-strong)] px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.06em] text-[var(--verdict-hold)]">
                              등록되지 않음
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-3">
                          <span className="w-20 flex-none text-[13px] text-[var(--muted)]">금액</span>
                          <span className={`${MONO} tabular-nums text-sm text-[var(--ink)]`}>{a.amountStr}</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-3">
                          <span className="w-20 flex-none text-[13px] text-[var(--muted)]">요청 시각</span>
                          <span className={`${MONO} tabular-nums text-[13px] text-[var(--ink)]`}>{a.requestedAt}</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-[var(--hairline)] py-3">
                          <span className="w-20 flex-none text-[13px] text-[var(--muted)]">위임장</span>
                          <span className="text-sm text-[var(--ink)]" style={{ wordBreak: 'keep-all' }}>
                            <span className={`${MONO} text-[13px]`}>#{a.mandateId}</span>
                            <span className="text-[var(--body)]"> · {a.mandateNote}</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
                        판정 근거
                      </div>
                      <div className="mt-2">
                        {a.layers.map((ly) => {
                          const meta = layerStateMeta[ly.state];
                          return (
                            <div
                              key={ly.no}
                              className={`flex gap-3.5 border-b border-[var(--hairline)] py-3.5 ${
                                meta.border ? 'pl-3.5' : 'pl-4'
                              }`}
                              style={meta.border ? { borderLeft: `2px solid ${meta.border}` } : undefined}
                            >
                              <span className="w-4 flex-none text-[15px] leading-[1.4]" style={{ color: meta.glyphColor }}>
                                {meta.glyph}
                              </span>
                              <div className="min-w-0">
                                <div className="text-base font-semibold leading-[1.4]" style={{ color: meta.nameColor }}>
                                  {ly.no} {ly.name}
                                </div>
                                <div className="mt-0.5 text-pretty text-sm leading-[1.5]" style={{ color: meta.msgColor }}>
                                  {ly.msg}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
                        사용자가 실제로 말한 것
                      </div>
                      <div className="mt-2 text-lg font-semibold leading-[1.4] text-[var(--ink)]">
                        “{a.userUtterance}”
                      </div>

                      <div className="mt-6 border-t border-[var(--hairline)] pt-5">
                        {!res && !confirming && (
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => resolve(a.id, 'rejected')}
                              className={`${btn} border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)]`}
                            >
                              거부
                            </button>
                            <button
                              onClick={() => setConfirmingId(a.id)}
                              className={`${btn} border border-[var(--primary)] bg-[var(--primary)] text-[var(--on-dark)]`}
                            >
                              승인
                            </button>
                          </div>
                        )}
                        {confirming && (
                          <div>
                            <p className="text-pretty text-sm leading-[1.5] text-[var(--ink)]">{a.approveNote}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-5">
                              <button
                                onClick={() => resolve(a.id, 'approved', a.approvedNote)}
                                className="h-11 rounded-lg border border-[var(--primary)] bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--on-dark)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                              >
                                승인 확정
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                className="text-sm text-[var(--body)] underline hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        )}
                        {!!res && (
                          <div className="text-[13px] leading-[1.4] text-[var(--muted)]">
                            <span className={`${MONO} tabular-nums`}>{res.at}</span> {resolvedText}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {allDone && (
          <div className="mt-12 text-center">
            <div className="text-base leading-[1.5] text-[var(--muted)]">대기 중인 요청이 없습니다.</div>
            <div className="mt-3">
              <Link
                to="/requests"
                className="text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
              >
                요청 기록 보기 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
