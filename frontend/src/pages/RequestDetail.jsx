import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { requests } from '../data/mock';

const MONO = "[font-family:'JetBrains_Mono',monospace]";

function ReasonDetail({ item }) {
  if (item.detailParts) {
    return item.detailParts.map((part, i) =>
      item.detailMonoIndices.includes(i) ? (
        <span key={i} className={`${MONO} tabular-nums text-[13px]`}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  }
  return item.detail;
}

function NotFound({ id }) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav
        active="requests"
        maxWidth={1120}
        crumb={
          <>
            요청 기록 <span className="text-[var(--muted)]">/</span>{' '}
            <span className={`${MONO} text-[13px] text-[var(--ink)]`}>{id}</span>
          </>
        }
      />
      <div className="mx-auto py-24 text-center" style={{ width: 'min(880px, 100% - 48px)' }}>
        <div className="text-base leading-[1.5] text-[var(--muted)]">
          해당 요청을 찾을 수 없습니다.
        </div>
        <div className="mt-3">
          <Link
            to="/requests"
            className="text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            요청 기록으로 돌아가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RequestDetail() {
  const { id } = useParams();
  const [verified, setVerified] = useState(false);
  const data = requests[id];

  if (!data) return <NotFound id={id} />;

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav
        active="requests"
        maxWidth={1120}
        crumb={
          <>
            요청 기록 <span className="text-[var(--muted)]">/</span>{' '}
            <span className={`${MONO} text-[13px] text-[var(--ink)]`}>{data.id}</span>
          </>
        }
      />

      <section className="bg-[var(--surface-dark)] py-12">
        <div
          className="mx-auto flex flex-wrap items-end justify-between gap-10"
          style={{ width: 'min(1120px, 100% - 48px)' }}
        >
          <div className="max-w-[640px]">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--verdict-block)]">
              {data.verdictLabel}
            </div>
            <h1 className="mt-3 text-pretty text-[clamp(30px,5.5vw,48px)] font-semibold leading-[1.1] tracking-[-1.2px] text-[var(--on-dark)]">
              {data.headlinePre}
              {data.headlineAmount && (
                <span className={`${MONO} tabular-nums tracking-[-0.5px]`}>{data.headlineAmount}</span>
              )}
              {data.headlinePost}
            </h1>
          </div>
          <div className="flex gap-9 pb-1.5">
            {data.traceSteps.map((step, i) => (
              <div
                key={i}
                data-anim="on"
                className={`min-w-[52px] animate-[traceIn_0.3s_ease-out_forwards] text-center opacity-0 ${
                  step.state === 'skip' ? 'opacity-30' : ''
                }`}
                style={{ animationDelay: `${0.1 + i * 0.22}s` }}
              >
                <div className="text-sm text-[var(--on-dark-soft)]">{step.step}</div>
                <div
                  className={`mt-2 text-[13px] ${
                    step.state === 'fail' ? 'text-[var(--verdict-block)]' : 'text-[var(--on-dark-soft)]'
                  }`}
                >
                  {step.label}
                </div>
                <div
                  className={`mt-1.5 text-base ${
                    step.state === 'fail' ? 'text-[var(--verdict-block)]' : 'text-[var(--on-dark-soft)]'
                  }`}
                >
                  {step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto pb-12" style={{ width: 'min(880px, 100% - 48px)' }}>
        <div
          className={`${MONO} pt-3 text-right text-[13px] tabular-nums text-[var(--muted)]`}
        >
          {data.timestamp}
        </div>

        <section className="mt-12">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
            요청 내용
          </div>
          <div className="mt-4 border-t border-[var(--hairline-strong)]">
            {data.requestFields.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-3.5"
              >
                <span className="text-sm text-[var(--body)]">{f.label}</span>
                <span
                  className={`text-right text-sm text-[var(--ink)] ${f.mono ? `${MONO} tabular-nums` : ''}`}
                >
                  {f.value}
                  {f.valueMono && (
                    <span className={`${MONO} text-[13px]`}>{f.valueMono}</span>
                  )}
                  {f.suffix && <span className="text-[var(--body)]">{f.suffix}</span>}
                  {f.badge && (
                    <span className="ml-1.5 inline-block rounded bg-[var(--surface-strong)] px-1.5 py-0.5 align-[2px] text-[11px] font-semibold tracking-[0.06em] text-[var(--body)]">
                      {f.badge}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
            판정 근거
          </div>
          <div className="mt-4 border-t border-[var(--hairline-strong)]">
            {data.reasoning.map((item, i) => {
              if (item.state === 'skip') {
                return (
                  <div
                    key={i}
                    className="flex gap-4 border-b border-[var(--hairline)] py-5 pl-4 opacity-30"
                  >
                    <span className="w-[18px] flex-none" />
                    <div className="flex-1">
                      <div className="text-lg font-semibold leading-[1.4] text-[var(--muted)]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-sm leading-[1.5] text-[var(--muted)]">미실행</div>
                    </div>
                  </div>
                );
              }
              const pass = item.state === 'pass';
              return (
                <div
                  key={i}
                  className={`flex gap-4 border-b border-[var(--hairline)] py-5 ${
                    pass ? 'pl-4' : 'border-l-2 border-l-[var(--verdict-block)] pl-3.5'
                  }`}
                >
                  <span
                    className={`w-[18px] flex-none text-base leading-[1.4] ${
                      pass ? 'text-[var(--muted)]' : 'text-[var(--verdict-block)]'
                    }`}
                  >
                    {pass ? '✓' : '✕'}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div
                        className={`text-lg font-semibold leading-[1.4] ${
                          pass ? 'text-[var(--muted)]' : 'text-[var(--ink)]'
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.tag && (
                        <span className="rounded-full bg-[var(--surface-strong)] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-[var(--body)]">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div
                      className={`mt-1 text-pretty text-sm leading-[1.5] ${
                        pass ? 'text-[var(--muted)]' : 'text-[var(--body)]'
                      }`}
                    >
                      <ReasonDetail item={item} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {data.paramSources && (
          <section className="mt-12">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
              파라미터 출처 등급
            </div>
            <div className="mt-4">
              <div
                className="grid gap-3 border-b border-[var(--hairline-strong)] py-2.5 text-[13px] text-[var(--muted)]"
                style={{ gridTemplateColumns: 'minmax(72px,1fr) minmax(110px,1.4fr) 64px 64px 48px' }}
              >
                <span>파라미터</span>
                <span>출처</span>
                <span>등급</span>
                <span>요구</span>
                <span className="text-right">판정</span>
              </div>
              {data.paramSources.map((row, i) => (
                <div
                  key={i}
                  className="grid items-baseline gap-3 border-b border-[var(--hairline)] py-3.5 text-sm text-[var(--ink)]"
                  style={{ gridTemplateColumns: 'minmax(72px,1fr) minmax(110px,1.4fr) 64px 64px 48px' }}
                >
                  <span>{row.param}</span>
                  <span className="text-[var(--body)]">{row.source}</span>
                  <span className={`${MONO} text-[13px] text-[var(--verdict-block)]`}>{row.grade}</span>
                  <span className={`${MONO} text-[13px] text-[var(--body)]`}>{row.required}</span>
                  <span className="text-right text-[var(--verdict-block)]">✕</span>
                </div>
              ))}
              <div className="mt-3 text-[13px] leading-[1.4] text-[var(--muted)]">
                {data.paramGradeLegend}
              </div>
            </div>
          </section>
        )}

        <section className="mt-12 grid items-stretch gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="flex flex-col">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
              사용자가 실제로 말한 것
            </div>
            <div className="mt-4 flex min-h-[220px] flex-1 items-center justify-center rounded-xl border border-[var(--hairline-strong)] p-8">
              <div className="text-[28px] font-semibold leading-[1.2] tracking-[-0.7px] text-[var(--ink)]">
                “{data.userUtterance}”
              </div>
            </div>
          </div>
          {data.agentPageUrl && (
            <div className="flex flex-col">
              <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
                에이전트가 읽은 웹페이지
              </div>
              <div className="mt-4 flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-xl bg-[var(--surface-dark)]">
                <div className="flex h-9 flex-none items-center border-b border-white/[0.06] bg-[var(--surface-dark-elevated)] px-4">
                  <span className={`${MONO} text-[11px] text-[var(--on-dark-soft)]`}>
                    {data.agentPageUrl}
                  </span>
                </div>
                <div
                  className={`${MONO} p-5 text-[13px] leading-[1.7] text-[var(--on-dark)]`}
                  style={{ overflowWrap: 'anywhere' }}
                >
                  <span className="text-[var(--on-dark-soft)]">...</span>
                  {data.pollutedPage.before}
                  <span className="text-[var(--on-dark-soft)]">
                    &lt;span style="display:none"&gt;
                  </span>
                  <span className="my-2 block border-l-2 border-[var(--verdict-block)] pl-2.5 text-[var(--verdict-block)]">
                    {data.pollutedPage.injected}
                  </span>
                  <span className="text-[var(--on-dark-soft)]">&lt;/span&gt;</span>
                  {data.pollutedPage.after}
                  <span className="text-[var(--on-dark-soft)]">...</span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline-strong)] pt-6">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-sm font-semibold text-[var(--ink)]">
              감사 기록 #{data.auditId}
            </span>
            <span
              className={`${MONO} text-[13px] text-[var(--muted)]`}
              style={{ overflowWrap: 'anywhere' }}
            >
              {data.auditHash}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {verified ? (
              <span className="text-sm text-[var(--body)]">
                <span className="text-[var(--verdict-pass)]">✓</span> 이 기록은 위변조되지
                않았습니다 · 체인{' '}
                <span className={`${MONO} tabular-nums text-[13px]`}>
                  {data.chainTotal}/{data.chainTotal}
                </span>{' '}
                검증 완료
              </span>
            ) : (
              <button
                onClick={() => setVerified(true)}
                className="rounded-lg border border-[var(--hairline-strong)] bg-[var(--canvas)] px-4 py-[9px] text-sm font-semibold text-[var(--ink)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
              >
                무결성 확인
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
