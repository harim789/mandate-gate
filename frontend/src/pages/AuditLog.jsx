import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { chainMeta, auditLogs } from '../data/mock';

const MONO = "[font-family:'JetBrains_Mono',monospace]";
const SOLID = 'solid var(--hairline-strong)';
const BROKEN = 'dashed var(--verdict-block)';
const VERDICT_COLOR = {
  통과: 'var(--verdict-pass)',
  '승인 필요': 'var(--verdict-hold)',
  차단: 'var(--verdict-block)',
};

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpoint,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isDesktop;
}

function hashSegments(hex, cut) {
  return { hi: hex.slice(0, 8), rest: cut ? hex.slice(8, 16) + '…' : hex.slice(8) };
}

function HashRow({ label, hex, cut, dim, hiColor, bg, onClick, cursor }) {
  const { hi, rest } = hashSegments(hex, cut);
  return (
    <button
      onClick={onClick}
      style={{ background: bg, cursor }}
      className="-ml-1.5 flex max-w-full items-baseline gap-2.5 rounded border-none px-1.5 py-0.5 text-left font-sans transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-1"
    >
      <span className="w-8 flex-none text-[11px] font-semibold tracking-[0.06em]" style={{ color: dim }}>
        {label}
      </span>
      <span className={`${MONO} text-[11px] leading-[1.4]`} style={{ overflowWrap: cut ? 'normal' : 'anywhere' }}>
        <span style={{ color: dim }}>sha256:</span>
        <span className="font-medium" style={{ color: hiColor }}>
          {hi}
        </span>
        <span style={{ color: dim }}>{rest}</span>
      </span>
    </button>
  );
}

export default function AuditLog() {
  const [tampered, setTampered] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [verifyState, setVerifyState] = useState('idle');
  const [verifyCount, setVerifyCount] = useState(0);
  const [hashOpen, setHashOpen] = useState({});
  const [moreNote, setMoreNote] = useState(false);
  const intervalRef = useRef(null);
  const isDesktop = useIsDesktop(1024);
  const mid = !isDesktop;

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function runVerify() {
    if (verifyState === 'running') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVerifyState('done');
      setVerifyCount(4821);
      return;
    }
    setVerifyState('running');
    setVerifyCount(0);
    let n = 0;
    intervalRef.current = setInterval(() => {
      n += 483;
      if (n >= 4821) {
        clearInterval(intervalRef.current);
        setVerifyState('done');
        setVerifyCount(4821);
      } else {
        setVerifyCount(n);
      }
    }, 20);
  }

  const resultBroken = tampered;
  const resultRunning = !tampered && verifyState === 'running';
  const resultDone = !tampered && verifyState === 'done';
  const resultIdle = !tampered && verifyState === 'idle';

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="audit" crumb="감사 기록" />

      <div className="mx-auto py-12" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <h1 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
          감사 기록
        </h1>
        <p className="mt-3 max-w-[560px] text-pretty text-base leading-[1.5] text-[var(--body)]">
          모든 판정은 직전 기록의 해시를 포함해 이어집니다. 한 건이라도 바뀌면 이후 사슬 전체가
          어긋납니다.
        </p>

        <div className="mt-8 rounded-xl bg-[var(--surface-dark)] p-6">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--on-dark-soft)]">
            체인 상태
          </div>
          <div className="mt-2 text-sm leading-[1.5] text-[var(--on-dark)]">
            <span className={`${MONO} tabular-nums`}>{chainMeta.total}</span>건 ·{' '}
            <span className={`${MONO} tabular-nums`}>{chainMeta.from}</span> ~{' '}
            <span className={`${MONO} tabular-nums`}>{chainMeta.to}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/[0.08] pt-5">
            <div className="min-w-0 flex-[1_1_260px]">
              {resultBroken && (
                <div>
                  <span className="text-sm font-semibold text-[var(--verdict-block)]">
                    ✕ 사슬이 끊어졌습니다 ·{' '}
                    <span className={`${MONO} tabular-nums`}>req_4823</span>에서 단절 · 이후{' '}
                    <span className={`${MONO} tabular-nums`}>2</span>건 검증 실패
                  </span>
                  <div className="mt-2 text-pretty text-[13px] leading-[1.4] text-[var(--muted)]">
                    오래된 기록을 고칠수록 다시 계산해야 하는 양이 늘어납니다. 6월 1일 기록을
                    고치면 <span className={`${MONO} tabular-nums`}>4,820</span>건을 전부 다시
                    계산해야 합니다.
                  </div>
                </div>
              )}
              {resultRunning && (
                <span className={`${MONO} tabular-nums text-sm text-[var(--on-dark-soft)]`}>
                  검증 중 · {verifyCount} / 4821
                </span>
              )}
              {resultDone && (
                <span className="text-sm font-semibold text-[var(--verdict-pass)]">
                  ✓ <span className={`${MONO} tabular-nums`}>4,821</span>건 전부 검증했습니다 ·
                  위변조 흔적 없음
                </span>
              )}
              {resultIdle && (
                <span className="text-sm font-semibold text-[var(--verdict-pass)]">
                  ✓ 위변조 흔적 없음
                </span>
              )}
            </div>
            {resultDone && (
              <span className="text-[13px] text-[var(--on-dark-soft)]">
                <span className={`${MONO} tabular-nums`}>2026-08-07 14:35:02</span> 검증
              </span>
            )}
            <button
              onClick={runVerify}
              disabled={verifyState === 'running'}
              className="h-11 flex-none whitespace-nowrap rounded-lg border border-white bg-[var(--on-dark)] px-5 text-sm font-semibold text-[var(--ink)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--on-dark)] focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50"
            >
              무결성 검증
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            role="switch"
            aria-checked={tampered}
            onClick={() => setTampered((t) => !t)}
            className="-m-1 flex items-center gap-2.5 rounded p-1 font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            <span
              className="inline-flex h-5 w-9 flex-none rounded-full p-0.5 transition-colors duration-200"
              style={{ background: tampered ? 'var(--surface-dark)' : 'var(--hairline-strong)' }}
            >
              <span
                className="h-4 w-4 rounded-full bg-[var(--on-dark)] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200"
                style={{ transform: tampered ? 'translateX(16px)' : 'translateX(0)' }}
              />
            </span>
            <span className="text-[13px] text-[var(--body)]">변조 시나리오 시연</span>
          </button>
        </div>

        <div className="mt-6 border-t border-[var(--hairline-strong)] pt-6">
          {auditLogs.map((log, i) => {
            const isTampered = tampered && log.id === 4823;
            const selfHex = isTampered ? log.tamperedSelf : log.self;
            const prevBrokenRow = tampered && log.id === 4825;
            const selfBrokenRow = isTampered;
            const open = !!hashOpen[log.id];
            const cut = mid && !open;
            const dimColor = (broken) => (broken ? 'var(--verdict-block)' : 'var(--muted)');
            const hiColor = (broken) => (broken ? 'var(--verdict-block)' : 'var(--ink)');
            const highlight = (on) => (on ? 'var(--surface-strong)' : 'transparent');
            const showDetailLink = log.verdict !== '통과';
            const detailHref = log.verdict === '승인 필요' ? '/approvals' : `/requests/req_${log.id}`;

            return (
              <div
                key={log.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="flex"
              >
                <div className="relative w-6 flex-none">
                  <div
                    className="absolute left-[9px] top-0 h-3 w-0 border-l transition-colors duration-200"
                    style={{ borderLeft: `1px ${log.id === 4823 && tampered ? BROKEN : SOLID}` }}
                  />
                  <div
                    className="absolute bottom-0 left-[9px] top-[19px] w-0 border-l transition-colors duration-200"
                    style={{ borderLeft: `1px ${log.id === 4825 && tampered ? BROKEN : SOLID}` }}
                  />
                  <div className="absolute left-[7px] top-3 h-[5px] w-[5px] bg-[var(--ink)]" />
                </div>
                <div className="min-w-0 flex-1 pb-6">
                  <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2">
                    {log.verdict === '차단' && (
                      <span aria-hidden="true" className="h-[13px] w-0.5 flex-none self-center bg-[var(--verdict-block)]" />
                    )}
                    <span className={`${MONO} tabular-nums text-sm font-medium text-[var(--ink)]`}>
                      req_{log.id}
                    </span>
                    <span className={`${MONO} tabular-nums text-[13px] text-[var(--body)]`}>{log.at}</span>
                    <span
                      className="whitespace-nowrap text-sm font-semibold"
                      style={{ color: VERDICT_COLOR[log.verdict] }}
                    >
                      {log.verdict}
                    </span>
                    <span
                      className="min-w-0 text-sm leading-[1.5] text-[var(--body)]"
                      style={{ wordBreak: 'keep-all' }}
                    >
                      {log.summary}
                    </span>
                    {showDetailLink && (
                      <Link
                        to={detailHref}
                        className="ml-auto flex-none whitespace-nowrap text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
                      >
                        판정 근거 →
                      </Link>
                    )}
                  </div>

                  {isTampered && (
                    <div className="mt-1 text-[13px] leading-[1.4] text-[var(--verdict-block)]">
                      금액 50,000원 → 500,000원 변조됨
                    </div>
                  )}

                  <div className="mt-2 flex flex-col items-start gap-0.5">
                    <HashRow
                      label="prev"
                      hex={log.prev}
                      cut={cut}
                      dim={dimColor(prevBrokenRow)}
                      hiColor={hiColor(prevBrokenRow)}
                      bg={highlight(hovered === i + 1)}
                      cursor={mid ? 'pointer' : 'default'}
                      onClick={() => {
                        if (mid) setHashOpen((p) => ({ ...p, [log.id]: !p[log.id] }));
                      }}
                    />
                    <HashRow
                      label="self"
                      hex={selfHex}
                      cut={cut}
                      dim={dimColor(selfBrokenRow)}
                      hiColor={hiColor(selfBrokenRow)}
                      bg={highlight(hovered === i)}
                      cursor={mid ? 'pointer' : 'default'}
                      onClick={() => {
                        if (mid) setHashOpen((p) => ({ ...p, [log.id]: !p[log.id] }));
                      }}
                    />
                  </div>

                  {isTampered && (
                    <div className="mt-2 text-pretty text-[13px] leading-[1.4] text-[var(--muted)]">
                      <span className={MONO}>req_4823</span>을 고치면 그 이후 모든 해시를 다시
                      계산해야 합니다. 사슬은 그것을 어렵게 만듭니다.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="border-t border-[var(--hairline-strong)] pt-5 text-center">
            <button
              onClick={() => setMoreNote(true)}
              className="cursor-pointer rounded bg-transparent p-0 font-sans text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
            >
              로그 <span className={`${MONO} tabular-nums`}>4,817</span>건 더 보기 ↓
            </button>
            {moreNote && (
              <div className="mt-2 text-[13px] leading-[1.4] text-[var(--muted)]">
                데모에서는 최근 8건만 표시합니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
