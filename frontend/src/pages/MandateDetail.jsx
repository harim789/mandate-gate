import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { mandateStatusMeta } from '../data/mock';
import { useMandates } from '../context/MandatesContext';

const MONO = "[font-family:'JetBrains_Mono',monospace]";

function won(n) {
  return n.toLocaleString('ko-KR') + '원';
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="mandates" crumb="위임장" />
      <div className="mx-auto py-24 text-center" style={{ width: 'min(880px, 100% - 48px)' }}>
        <div className="text-base leading-[1.5] text-[var(--muted)]">
          해당 위임장을 찾을 수 없습니다.
        </div>
        <div className="mt-3">
          <Link
            to="/mandates"
            className="text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            위임장 목록으로 돌아가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MandateDetail() {
  const { id } = useParams();
  const { effective, revoke } = useMandates();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => setConfirming(false), [id]);

  const m = effective(id);
  if (!m) return <NotFound />;

  const meta = mandateStatusMeta[m.status];
  const revoked = m.status !== '유효';

  const certRows = [
    { label: '수임인', value: m.agent, mono: false, color: 'var(--ink)' },
    { label: '1회 한도', value: won(m.maxPerTx), mono: true, color: 'var(--ink)' },
    { label: '총 한도', value: won(m.maxTotal), mono: true, color: 'var(--ink)' },
    { label: '카테고리', value: m.categories.join(' · '), mono: false, color: 'var(--ink)' },
    { label: '시간대', value: `${m.hourFrom} – ${m.hourTo}`, mono: true, color: 'var(--ink)' },
    {
      label: '송금',
      value: m.allowTransfer ? `허용 · 등록 수취인 ${m.recipients.length}명` : '불허',
      mono: false,
      color: m.allowTransfer ? 'var(--verdict-hold)' : 'var(--body)',
      weight: m.allowTransfer ? 600 : 400,
    },
    { label: '유효기간', value: `${m.validFrom} ~ ${m.validUntil}`, mono: true, color: 'var(--ink)' },
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="mandates" crumb="위임장" />

      <div className="mx-auto py-12" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <Link
          to="/mandates"
          className="text-sm text-[var(--body)] hover:text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
        >
          ← 위임장 목록
        </Link>

        <div className="mt-5 flex flex-wrap items-baseline gap-4">
          <h1 className={`${MONO} text-[28px] font-medium leading-[1.2] tracking-[-0.7px] text-[var(--ink)]`}>
            #{m.id}
          </h1>
          <span className="text-sm font-semibold" style={{ color: meta.color }}>
            {meta.glyph} {m.status}
          </span>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[55fr_45fr]">
          <div
            className="overflow-hidden rounded-xl border border-[var(--hairline-strong)]"
            style={{ opacity: revoked ? 0.55 : 1 }}
          >
            <div className="h-0.5" style={{ background: revoked ? 'var(--muted)' : 'var(--verdict-pass)' }} />
            <div className="p-8">
              <div className="text-lg font-semibold tracking-[0.2em] text-[var(--ink)]">위임장</div>
              <div className={`${MONO} mt-1 text-[13px] text-[var(--muted)]`}>#{m.id}</div>
              <div className="mt-5 border-t border-[var(--hairline-strong)]">
                {certRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-3.5"
                  >
                    <span className="flex-none text-[13px] text-[var(--muted)]">{row.label}</span>
                    <span
                      className={`text-right text-sm leading-[1.5] tabular-nums ${row.mono ? MONO : ''}`}
                      style={{ color: row.color, fontWeight: row.weight || 400 }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pb-1 pt-3.5">
                  <span className="flex-none text-[13px] text-[var(--muted)]">상태</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: revoked ? 'var(--muted)' : 'var(--verdict-pass)' }}
                  >
                    {revoked ? '폐기됨' : '발급 완료'}
                  </span>
                </div>
                <div className={`${MONO} pt-2 text-right text-[13px] text-[var(--muted)]`}>
                  서명 {m.signature}
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <div className="rounded-xl border border-[var(--hairline-strong)] p-8">
              <div className="text-lg font-semibold leading-[1.4] text-[var(--ink)]">사용 현황</div>
              <div className="mt-4 border-t border-[var(--hairline-strong)]">
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-3.5">
                  <span className="text-[13px] text-[var(--muted)]">총 한도</span>
                  <span className={`${MONO} tabular-nums text-sm text-[var(--body)]`}>{won(m.maxTotal)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-3.5">
                  <span className="text-[13px] text-[var(--muted)]">사용액</span>
                  <span className={`${MONO} tabular-nums text-sm text-[var(--body)]`}>{won(m.usedAmount)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-3.5">
                  <span className="text-[13px] text-[var(--muted)]">잔여</span>
                  <span className={`${MONO} tabular-nums text-sm font-semibold text-[var(--ink)]`}>
                    {won(m.maxTotal - m.usedAmount)}
                  </span>
                </div>
              </div>
              <div className="mt-5 text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
                판정 이력
              </div>
              <div className="mt-2 text-[13px] leading-[1.4] text-[var(--body)]">
                통과 <span className={`${MONO} tabular-nums text-[var(--ink)]`}>{m.history.allow}</span> · 승인
                필요 <span className={`${MONO} tabular-nums text-[var(--ink)]`}>{m.history.hold}</span> · 차단{' '}
                <span className={`${MONO} tabular-nums text-[var(--ink)]`}>{m.history.block}</span>
              </div>
              <Link
                to="/requests"
                className="mt-4 inline-flex h-11 items-center rounded-lg border border-[var(--hairline-strong)] bg-[var(--canvas)] px-5 text-sm font-semibold text-[var(--ink)] hover:no-underline hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
              >
                이 위임장의 요청 기록 →
              </Link>
            </div>

            {!revoked && (
              <div className="rounded-xl border border-[var(--verdict-block)] bg-[var(--canvas)] p-8">
                <div className="text-lg font-semibold leading-[1.4] text-[var(--ink)]">위임장 폐기</div>
                {!confirming ? (
                  <div>
                    <p className="mt-2 text-pretty text-sm leading-[1.5] text-[var(--body)]">
                      폐기하면 {m.agent}는 즉시 아무 요청도 보낼 수 없습니다. 되돌릴 수 없습니다.
                    </p>
                    <button
                      onClick={() => setConfirming(true)}
                      className="mt-5 h-11 rounded-lg border border-[var(--verdict-block)] bg-[var(--canvas)] px-5 text-sm font-semibold text-[var(--verdict-block)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                    >
                      위임장 폐기
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="mt-2 text-sm leading-[1.5] text-[var(--ink)]">
                      <span className={`${MONO} text-[13px]`}>#{m.id}</span> 을 폐기합니다. 이 동작은 되돌릴 수
                      없습니다.
                    </p>
                    <div className="mt-5 flex items-center gap-5">
                      <button
                        onClick={() => {
                          revoke(m.id);
                          setConfirming(false);
                        }}
                        className="h-11 rounded-lg border border-[var(--verdict-block)] bg-[var(--verdict-block)] px-5 text-sm font-semibold text-[var(--on-dark)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                      >
                        폐기
                      </button>
                      <button
                        onClick={() => setConfirming(false)}
                        className="text-sm text-[var(--body)] underline hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {revoked && (
              <div className="text-[13px] leading-[1.4] text-[var(--muted)]">
                <span className={`${MONO} tabular-nums`}>{m.revokedAt || ''}</span> 폐기됨
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
