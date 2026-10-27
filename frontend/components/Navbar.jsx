import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import logo from "../assets/saarthi-logo.svg"
import { useLanguage } from "../context/LanguageContext"

export default function Navbar({
  tabs,
  theme,
  onToggleTheme,
  onOpenSettings,
}) {
  const language = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const languageLabel =
    language === "english" ? "English" : language === "hindi" ? "Hindi" : "Hinglish"
  const copy = {
    hinglish: {
      mindful: "Mindful UI",
      focus: "Focus Mode",
      openSettings: "Open settings",
      close: "Close",
      contact: "Contact",
      helpline: "Helpline",
      email: "Email",
    },
    english: {
      mindful: "Mindful UI",
      focus: "Focus Mode",
      openSettings: "Open settings",
      close: "Close",
      contact: "Contact",
      helpline: "Helpline",
      email: "Email",
    },
    hindi: {
      mindful: "Mindful UI",
      focus: "Focus Mode",
      openSettings: "Settings kholen",
      close: "Band",
      contact: "Sampark",
      helpline: "Helpline",
      email: "Email",
    },
  }
  const t = copy[language] ?? copy.hinglish

  useEffect(() => {
    if (!mobileMenuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--app-bg)] backdrop-blur animate-fade-in">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Saarthi AI logo" className="h-10 w-10" />
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)]">
              Saarthi AI
            </p>
            <span className="focus-hide rounded-full border border-[color:var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              {languageLabel}
            </span>
          </div>

          <div className="ml-auto hidden flex-wrap gap-2 lg:flex">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={tab.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-xs uppercase tracking-widest transition ${
                    isActive
                      ? "bg-amber-200 text-[#1b1306]"
                      : "border border-[color:var(--border)] text-[color:var(--muted)] hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-[color:var(--muted)]">
            <span className="focus-hide hidden rounded-full border border-[color:var(--border)] px-3 py-1 lg:inline-flex">
              {t.mindful}
            </span>
            <span className="focus-hide hidden rounded-full border border-[color:var(--border)] px-3 py-1 lg:inline-flex">
              {t.focus}
            </span>
            <button
              onClick={onToggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] text-sm text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? "\u263D" : "\u2600"}
            </button>
            <button
              onClick={onOpenSettings}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] text-sm text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
              title={t.openSettings}
              aria-label={t.openSettings}
            >
              {"\u2699"}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="ml-1 flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full border border-[color:var(--border)] lg:hidden"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? (
                <span className="text-sm text-[color:var(--muted)]">X</span>
              ) : (
                <>
                  <span className="h-[2px] w-4 bg-[color:var(--muted)]" />
                  <span className="h-[2px] w-4 bg-[color:var(--muted)]" />
                  <span className="h-[2px] w-4 bg-[color:var(--muted)]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            className="absolute inset-0 bg-[color:var(--overlay-backdrop)]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu overlay"
          />
          <div className="absolute right-0 top-0 flex h-full w-[86vw] max-w-[360px] flex-col border-l-2 border-amber-200/40 bg-[color:var(--panel)] p-5 shadow-[-20px_0_50px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Saarthi AI logo" className="h-9 w-9" />
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)]">
                  Saarthi AI
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)]"
                aria-label="Close sidebar"
              >
                {t.close}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.id}
                  to={tab.href}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-amber-200 text-[#1b1306]"
                        : "border border-[color:var(--border)] text-[color:var(--muted)]"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--brand-label)]">
                {t.contact}
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {t.helpline}: +91 98765 43210
              </p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {t.email}: help@saarthi.ai
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
