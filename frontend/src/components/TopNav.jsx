import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'demo', to: '/demo', label: '시뮬레이터' },
  { key: 'requests', to: '/requests', label: '요청 기록' },
  { key: 'approvals', to: '/approvals', label: '승인 대기' },
  { key: 'mandates', to: '/mandates', label: '위임장' },
  { key: 'audit', to: '/audit', label: '감사 기록' },
];

const linkBase =
  'flex-none whitespace-nowrap rounded text-sm hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2';

export default function TopNav({
  active,
  crumb,
  pendingCount = 2,
  maxWidth = 1120,
  showUser = true,
}) {
  const isLanding = active === 'landing';

  return (
    <nav className="flex h-16 items-center border-b border-[var(--hairline-strong)]">
      <div
        className="mx-auto flex items-center gap-6"
        style={{ width: `min(${maxWidth}px, 100% - 48px)` }}
      >
        <Link
          to="/"
          aria-current={isLanding ? 'page' : undefined}
          className={`${linkBase} font-semibold tracking-[-0.2px] text-[var(--ink)]`}
        >
          Mandate Gate
        </Link>

        {crumb != null && (
          <span
            data-nav-crumb
            className="hidden flex-none items-center gap-2 whitespace-nowrap text-sm text-[var(--body)] md:flex"
          >
            {crumb}
          </span>
        )}

        <div
          data-nav-menu
          className="ml-auto flex min-w-0 items-center gap-5 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`${linkBase} ${
                  isActive
                    ? 'font-semibold text-[var(--ink)]'
                    : 'text-[var(--body)] hover:text-[var(--ink)]'
                }`}
              >
                {item.key === 'approvals' ? (
                  <>
                    승인 대기{' '}
                    <span className="[font-family:'JetBrains_Mono',monospace] text-[13px] tabular-nums text-[var(--verdict-hold)]">
                      {pendingCount}
                    </span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}

          {showUser && (
            <span className="flex-none whitespace-nowrap text-[13px] text-[var(--muted)]">
              김민수 님
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
