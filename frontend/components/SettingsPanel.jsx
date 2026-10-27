const languages = [
  { id: "hinglish", label: "Hinglish" },
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
]

const explanationLevels = [
  { id: "basic", label: "Basic" },
  { id: "standard", label: "Standard" },
  { id: "advanced", label: "Advanced" },
]

const fontSizes = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
]

export default function SettingsPanel({
  open,
  onClose,
  focusMode,
  onToggleFocus,
  language,
  onLanguageChange,
  explanationLevel,
  onExplanationLevelChange,
  theme,
  onToggleTheme,
  fontSize,
  onFontSizeChange,
  animationsEnabled,
  onToggleAnimations,
  user,
  onLogout,
  authActionLoading,
  authActionError,
  onClearHistory,
  onResetSettings,
}) {
  if (!open) return null

  const copy = {
    hinglish: {
      title: "Settings",
      close: "Close",
      learning: "Learning",
      focusMode: "Focus Mode",
      language: "Language",
      explanationLevel: "Explanation Level",
      appearance: "Appearance",
      lightDark: "Light / Dark",
      fontSize: "Font Size",
      animations: "Animations",
      account: "Account",
      googleProfile: "Google Profile",
      notLoggedIn: "Not logged in",
      logout: "Logout",
      data: "Data",
      clearHistory: "Clear History",
      resetSettings: "Reset Settings",
      about: "About",
      appInfo: "App Info",
      appInfoValue: "Saarthi AI learning assistant",
      version: "Version",
      on: "On",
      off: "Off",
      light: "Light",
      dark: "Dark",
    },
    english: {
      title: "Settings",
      close: "Close",
      learning: "Learning",
      focusMode: "Focus Mode",
      language: "Language",
      explanationLevel: "Explanation Level",
      appearance: "Appearance",
      lightDark: "Light / Dark",
      fontSize: "Font Size",
      animations: "Animations",
      account: "Account",
      googleProfile: "Google Profile",
      notLoggedIn: "Not logged in",
      logout: "Logout",
      data: "Data",
      clearHistory: "Clear History",
      resetSettings: "Reset Settings",
      about: "About",
      appInfo: "App Info",
      appInfoValue: "Saarthi AI learning assistant",
      version: "Version",
      on: "On",
      off: "Off",
      light: "Light",
      dark: "Dark",
    },
    hindi: {
      title: "Settings",
      close: "Band karein",
      learning: "Learning",
      focusMode: "Focus Mode",
      language: "Bhasha",
      explanationLevel: "Explanation Level",
      appearance: "Appearance",
      lightDark: "Light / Dark",
      fontSize: "Font Size",
      animations: "Animations",
      account: "Account",
      googleProfile: "Google Profile",
      notLoggedIn: "Login nahin hai",
      logout: "Logout",
      data: "Data",
      clearHistory: "History clear karein",
      resetSettings: "Settings reset karein",
      about: "About",
      appInfo: "App Info",
      appInfoValue: "Saarthi AI learning assistant",
      version: "Version",
      on: "On",
      off: "Off",
      light: "Light",
      dark: "Dark",
    },
  }

  const t = copy[language] ?? copy.hinglish

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[color:var(--overlay-backdrop)] px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)]">
            {t.title}
          </p>
          <button
            onClick={onClose}
            className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs uppercase tracking-widest text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
          >
            {t.close}
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{t.learning}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted)]">{t.focusMode}</span>
                <button
                  onClick={onToggleFocus}
                  className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
                >
                  {focusMode ? t.on : t.off}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[color:var(--muted)]">{t.language}</span>
                <select
                  value={language}
                  onChange={(event) => onLanguageChange(event.target.value)}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--app-text)]"
                >
                  {languages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[color:var(--muted)]">{t.explanationLevel}</span>
                <select
                  value={explanationLevel}
                  onChange={(event) => onExplanationLevelChange(event.target.value)}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--app-text)]"
                >
                  {explanationLevels.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{t.appearance}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted)]">{t.lightDark}</span>
                <button
                  onClick={onToggleTheme}
                  className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
                >
                  {theme === "light" ? t.light : t.dark}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[color:var(--muted)]">{t.fontSize}</span>
                <select
                  value={fontSize}
                  onChange={(event) => onFontSizeChange(event.target.value)}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--app-text)]"
                >
                  {fontSizes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted)]">{t.animations}</span>
                <button
                  onClick={onToggleAnimations}
                  className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
                >
                  {animationsEnabled ? t.on : t.off}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{t.account}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-sm text-[color:var(--muted)]">
                {t.googleProfile}: {user?.displayName || user?.email || t.notLoggedIn}
              </div>
              {authActionError ? (
                <p className="text-xs text-red-400">{authActionError}</p>
              ) : null}
              <button
                onClick={onLogout}
                disabled={!user || authActionLoading}
                className="rounded-full border border-[color:var(--border)] px-4 py-2 text-xs uppercase tracking-widest text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)] disabled:opacity-60"
              >
                {t.logout}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{t.data}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onClearHistory}
                className="rounded-full border border-[color:var(--border)] px-4 py-2 text-xs uppercase tracking-widest text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
              >
                {t.clearHistory}
              </button>
              <button
                onClick={onResetSettings}
                className="rounded-full border border-red-400/40 px-4 py-2 text-xs uppercase tracking-widest text-red-300 transition hover:border-red-300"
              >
                {t.resetSettings}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-4">
            <p className="text-sm font-semibold text-[color:var(--app-text)]">{t.about}</p>
            <div className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
              <p>
                {t.appInfo}: {t.appInfoValue}
              </p>
              <p>{t.version}: 0.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
