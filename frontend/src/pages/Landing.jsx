import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { landingPipeline, landingDotX, landingFourLayers, landingSourceGrades, landingExploreLinks } from '../data/mock';

const MONO = "[font-family:'JetBrains_Mono',monospace]";
const LOOP_SECONDS = 6;

function usePipelinePhase() {
  const [phase, setPhase] = useState(4);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase(4);
      return;
    }
    let timeouts = [];
    const cycle = () => {
      timeouts.forEach(clearTimeout);
      setPhase(0);
      timeouts = [700, 1400, 2100, 2600].map((t, i) => setTimeout(() => setPhase(i + 1), t));
    };
    cycle();
    const loop = setInterval(cycle, LOOP_SECONDS * 1000);
    return () => {
      clearInterval(loop);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return phase;
}

function pipelineStops(phase) {
  return landingPipeline.map((st, i) => {
    if (st.kind === 'pass') {
      return { no: st.no, name: st.name, opacity: 1, mark: phase >= i + 1 ? '✓' : '', markColor: 'var(--on-dark-soft)' };
    }
    if (st.kind === 'halt') {
      return { no: st.no, name: st.name, opacity: 1, mark: phase >= 3 ? '멈춤' : '', markColor: 'var(--verdict-block)' };
    }
    return {
      no: st.no,
      name: st.name,
      opacity: phase >= 3 ? 0.35 : 1,
      mark: phase >= 3 ? '미실행' : '',
      markColor: 'var(--on-dark-soft)',
    };
  });
}

export default function Landing() {
  const phase = usePipelinePhase();
  const stops = pipelineStops(phase);
  const idx = [0, 1, 2, 3, 3][phase];
  const dotColor = phase >= 3 ? 'var(--verdict-block)' : 'var(--on-dark)';
  const resultOpacity = phase >= 4 ? 1 : 0;

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <TopNav active="landing" showUser={false} />

      <section className="mx-auto py-[clamp(56px,9vw,96px)]" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <div className="text-[11px] font-semibold tracking-[0.06em] text-[var(--muted)]">
          에이전트 금융 권한 게이트웨이
        </div>
        <h1 className="mt-5 max-w-[880px] text-pretty text-[clamp(30px,4.5vw,56px)] font-semibold leading-[1.15] tracking-[-1.4px] text-[var(--ink)]">
          AI가 대신 결제하는 시대는 이미 시작됐는데,
          <br />
          그 AI가 옳게 행동하는지 검사하는 계층은 아직 없습니다.
        </h1>
        <p className="mt-6 max-w-[680px] text-pretty text-lg leading-[1.6] text-[var(--body)]">
          기존 금융 보안은 <span className="font-semibold text-[var(--ink)]">누가 하는가</span>를
          검증합니다. 에이전트 시대에는{' '}
          <span className="font-semibold text-[var(--ink)]">무엇을 위임받았는가</span>를 검증해야
          합니다. 인증은 통과했지만 위임받지 않은 행동 — 이 영역이 지금 비어 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/demo"
            className="inline-flex h-11 items-center rounded-lg bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--on-dark)] hover:no-underline hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            공격 시뮬레이터 실행
          </Link>
          <Link
            to="/requests/req_4821"
            className="text-sm font-semibold text-[var(--ink)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            요청 기록 보기 →
          </Link>
        </div>
      </section>

      <section className="bg-[var(--surface-dark)] py-20">
        <div className="mx-auto" style={{ width: 'min(1120px, 100% - 48px)' }}>
          {/* Horizontal pipeline (md and up) */}
          <div className="relative hidden md:block">
            <div className="absolute left-[10%] right-[10%] top-[13px] h-px bg-[var(--on-dark-soft)]/30" />
            <div
              className="absolute top-2.5 h-1.5 w-1.5 transition-[left,background] duration-500 ease-out"
              style={{ left: landingDotX[phase], background: dotColor }}
            />
            <div className="grid grid-cols-5">
              <div className="text-center">
                <span className="inline-block bg-[var(--surface-dark)] px-2.5 py-0.5 text-sm text-[var(--on-dark-soft)]">
                  에이전트 요청
                </span>
              </div>
              {stops.map((st, i) => (
                <div
                  key={i}
                  className="text-center transition-opacity duration-300"
                  style={{ opacity: st.opacity }}
                >
                  <span className="inline-block bg-[var(--surface-dark)] px-2.5 py-0.5 text-sm text-[var(--on-dark)]">
                    {st.no} {st.name}
                  </span>
                  <div className="mt-3 min-h-[20px] text-[13px]" style={{ color: st.markColor }}>
                    {st.mark}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical pipeline (below md) */}
          <div className="relative pl-6 md:hidden">
            <div className="absolute bottom-3 left-0.5 top-3 w-px bg-[var(--on-dark-soft)]/30" />
            <div
              className="absolute left-0 h-1.5 w-1.5 transition-[top,background] duration-500 ease-out"
              style={{ top: `${6 + idx * 49}px`, background: dotColor }}
            />
            <div className="flex flex-col gap-7">
              <div className="text-sm leading-[1.5] text-[var(--on-dark-soft)]">에이전트 요청</div>
              {stops.map((st, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-3 transition-opacity duration-300"
                  style={{ opacity: st.opacity }}
                >
                  <span className="text-sm leading-[1.5] text-[var(--on-dark)]">
                    {st.no} {st.name}
                  </span>
                  <span className="text-[13px]" style={{ color: st.markColor }}>
                    {st.mark}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p
            className="mt-10 text-pretty text-base leading-[1.5] text-[var(--on-dark)] transition-opacity duration-400"
            style={{ opacity: resultOpacity }}
          >
            외부 웹페이지에서 온 <span className={`${MONO} tabular-nums`}>490,000원</span> 결제
            요청이 3번째 층에서 멈췄습니다
          </p>
        </div>
      </section>

      <div className="flex h-14 items-center justify-center border-y border-[var(--hairline-strong)] px-6">
        <span className="text-center text-[13px] text-[var(--body)]">
          <span className="whitespace-nowrap">
            오늘 차단 <span className={`${MONO} tabular-nums text-[var(--ink)]`}>3</span>건
          </span>{' '}
          ·{' '}
          <span className="whitespace-nowrap">
            승인 요청 <span className={`${MONO} tabular-nums text-[var(--ink)]`}>1</span>건
          </span>{' '}
          ·{' '}
          <span className="whitespace-nowrap">
            통과 <span className={`${MONO} tabular-nums text-[var(--ink)]`}>27</span>건
          </span>
        </span>
      </div>

      <section className="mx-auto py-[clamp(56px,9vw,96px)]" style={{ width: 'min(1120px, 100% - 48px)' }}>
        <h2 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
          네 개의 층
        </h2>
        <div className="mt-8 border-t border-[var(--hairline)]">
          {landingFourLayers.map((l) => (
            <div
              key={l.no}
              className="flex flex-wrap items-center gap-5 border-b border-[var(--hairline)] py-5"
            >
              <span className={`${MONO} w-7 flex-none text-sm text-[var(--muted)]`}>{l.no}</span>
              <div className="min-w-0 flex-[1_1_320px]">
                <div className="text-lg font-semibold leading-[1.4] text-[var(--ink)]">{l.title}</div>
                <div className="mt-0.5 text-base leading-[1.5] text-[var(--body)]">{l.desc}</div>
              </div>
              <span className="ml-auto flex-none whitespace-nowrap rounded-full bg-[var(--surface-strong)] px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-[var(--body)]">
                {l.tag}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-[1.4] text-[var(--muted)]">
          결정론적 규칙 검사가 먼저 통과해야 확률적 판단이 실행됩니다.
        </p>
      </section>

      <section className="border-t border-[var(--hairline-strong)]">
        <div className="mx-auto py-[clamp(56px,9vw,96px)]" style={{ width: 'min(1120px, 100% - 48px)' }}>
          <h2 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
            출처를 등급으로 관리합니다
          </h2>
          <p className="mt-5 max-w-[640px] text-pretty text-lg leading-[1.6] text-[var(--muted)]">
            대부분의 방어는 "이 요청이 수상한가"를 묻습니다.
            <br />
            <span className="text-[var(--ink)]">Mandate Gate는 "이 값이 어디서 나왔는가"를 묻습니다.</span>
          </p>
          <div className="mt-8 max-w-[720px] border-t border-[var(--hairline)]">
            {landingSourceGrades.map((g) => (
              <div
                key={g.level}
                className={`flex flex-wrap items-baseline gap-4 border-b border-[var(--hairline)] py-4 ${
                  g.warn ? 'border-l-2 border-l-[var(--verdict-block)] pl-3.5' : 'pl-4'
                }`}
              >
                <span
                  className={`${MONO} w-8 flex-none text-[13px]`}
                  style={{ color: g.warn ? 'var(--verdict-block)' : 'var(--body)' }}
                >
                  {g.level}
                </span>
                <span
                  className="w-[140px] flex-none text-base font-semibold"
                  style={{ color: g.warn ? 'var(--verdict-block)' : 'var(--ink)' }}
                >
                  {g.name}
                </span>
                <span
                  className="flex-[1_1_200px] text-base leading-[1.5]"
                  style={{ color: g.warn ? 'var(--verdict-block)' : 'var(--body)' }}
                >
                  {g.desc}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-base leading-[1.5] text-[var(--body)]">
            결제 금액은 <span className={`${MONO} text-sm text-[var(--ink)]`}>L2</span> 이상을
            요구합니다. <span className={`${MONO} text-sm text-[var(--ink)]`}>L3</span>에서만
            발견된 값은 통과하지 못합니다.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--hairline-strong)]">
        <div className="mx-auto py-[clamp(56px,9vw,96px)]" style={{ width: 'min(1120px, 100% - 48px)' }}>
          <h2 className="text-4xl font-semibold leading-[1.15] tracking-[-0.9px] text-[var(--ink)]">
            직접 확인해 보세요
          </h2>
          <div className="mt-8">
            {landingExploreLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="mx-[-16px] flex flex-wrap items-baseline gap-x-6 gap-y-4 border-b border-[var(--hairline)] px-4 py-5 text-[var(--ink)] no-underline hover:bg-[var(--canvas-soft)] hover:no-underline focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--ink)]"
              >
                <span className="w-[140px] flex-none text-lg font-semibold leading-[1.4] text-[var(--ink)]">
                  {l.title}
                </span>
                <span className="flex-[1_1_260px] text-pretty text-sm leading-[1.5] text-[var(--body)]">
                  {l.desc}
                </span>
                <span aria-hidden="true" className="ml-auto flex-none text-sm text-[var(--muted)]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--hairline-strong)] bg-[var(--canvas-soft)]">
        <div
          className="mx-auto flex flex-wrap items-center justify-between gap-6 py-16"
          style={{ width: 'min(1120px, 100% - 48px)' }}
        >
          <p className="max-w-[640px] text-pretty text-[28px] font-semibold leading-[1.2] tracking-[-0.7px] text-[var(--ink)]">
            심사위원께 — 시뮬레이터에서 직접 공격을 실행해 보실 수 있습니다
          </p>
          <Link
            to="/demo"
            className="inline-flex h-11 flex-none items-center rounded-lg bg-[var(--primary)] px-6 text-sm font-semibold text-[var(--on-dark)] hover:no-underline hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
          >
            공격 시뮬레이터 실행
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--hairline-strong)]">
        <div
          className="mx-auto flex h-16 items-center justify-between gap-4"
          style={{ width: 'min(1120px, 100% - 48px)' }}
        >
          <span className="text-[13px] text-[var(--muted)]">
            2026 금융 AI Challenge · 금융보안원 / 데이콘
          </span>
          <div className="flex gap-5">
            <Link
              to="/requests/req_4821"
              className="text-[13px] text-[var(--body)] hover:text-[var(--ink)] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
            >
              문서
            </Link>
            <Link
              to="/demo"
              className="text-[13px] text-[var(--body)] hover:text-[var(--ink)] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2"
            >
              깃허브
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
