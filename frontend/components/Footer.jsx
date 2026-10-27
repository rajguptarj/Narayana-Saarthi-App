export default function Footer() {
  return (
    <footer className="focus-hide border-t border-[color:var(--border)] bg-[color:var(--app-bg)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-[color:var(--muted)]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--brand-label)]">
            Saarthi AI
          </p>
          <p className="mt-2 max-w-sm text-[color:var(--muted-soft)]">
            A quiet study companion designed for clarity, discipline, and
            momentum.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-[color:var(--border)] px-3 py-1">
            Version 0.1
          </span>
          <span className="rounded-full border border-[color:var(--border)] px-3 py-1">
            Saarthi AI
          </span>
          <span className="rounded-full border border-[color:var(--border)] px-3 py-1">
            Contact: hello@saarthi.ai
          </span>
        </div>
      </div>
    </footer>
  )
}
