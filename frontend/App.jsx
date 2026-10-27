import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import SettingsPanel from "./components/SettingsPanel"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { LanguageProvider } from "./context/LanguageContext"
import { ResultProvider } from "./context/ResultContext"
import Explanation from "./pages/Explanation"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SkillGuide from "./pages/SkillGuide"
import UploadPage from "./pages/UploadPage"

function AppShell() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("saarthi-theme")
    return saved === "light" ? "light" : "dark"
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(() => {
    return localStorage.getItem("saarthi-focus") === "on"
  })
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("saarthi-language") || "hinglish"
  })
  const [explanationLevel, setExplanationLevel] = useState(() => {
    return localStorage.getItem("saarthi-explanation-level") || "standard"
  })
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("saarthi-font-size") || "medium"
  })
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    return localStorage.getItem("saarthi-animations") !== "off"
  })
  const [authActionLoading, setAuthActionLoading] = useState(false)
  const [authActionError, setAuthActionError] = useState("")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "light") {
      root.classList.add("theme-light")
    } else {
      root.classList.remove("theme-light")
    }
    localStorage.setItem("saarthi-theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("saarthi-language", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("saarthi-explanation-level", explanationLevel)
  }, [explanationLevel])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("font-small", "font-medium", "font-large")
    root.classList.add(`font-${fontSize}`)
    localStorage.setItem("saarthi-font-size", fontSize)
  }, [fontSize])

  useEffect(() => {
    const root = document.documentElement
    if (animationsEnabled) {
      root.classList.remove("no-animations")
    } else {
      root.classList.add("no-animations")
    }
    localStorage.setItem("saarthi-animations", animationsEnabled ? "on" : "off")
  }, [animationsEnabled])

  useEffect(() => {
    const root = document.documentElement
    if (focusMode) {
      root.classList.add("focus-mode")
    } else {
      root.classList.remove("focus-mode")
    }
    localStorage.setItem("saarthi-focus", focusMode ? "on" : "off")
  }, [focusMode])

  async function handleLogout() {
    setAuthActionError("")
    setAuthActionLoading(true)
    try {
      await logout()
    } catch {
      setAuthActionError("Logout failed. Please try again.")
    } finally {
      setAuthActionLoading(false)
    }
  }

  function handleResetSettings() {
    setTheme("dark")
    setFocusMode(false)
    setLanguage("hinglish")
    setExplanationLevel("standard")
    setFontSize("medium")
    setAnimationsEnabled(true)
    localStorage.removeItem("saarthi-theme")
    localStorage.removeItem("saarthi-focus")
    localStorage.removeItem("saarthi-language")
    localStorage.removeItem("saarthi-explanation-level")
    localStorage.removeItem("saarthi-font-size")
    localStorage.removeItem("saarthi-animations")
  }

  const tabLabels = {
    hinglish: {
      home: "Home",
      upload: "Upload",
      explanation: "Explanation",
      skills: "Skills",
    },
    english: {
      home: "Home",
      upload: "Upload",
      explanation: "Explanation",
      skills: "Skills",
    },
    hindi: {
      home: "Home",
      upload: "Upload",
      explanation: "Vyakhya",
      skills: "Skills",
    },
  }

  const tabText = tabLabels[language] ?? tabLabels.hinglish

  const tabs = [
    { id: "home", label: tabText.home, href: "/" },
    { id: "upload", label: tabText.upload, href: "/upload" },
    { id: "explain", label: tabText.explanation, href: "/explanation" },
    { id: "skills", label: tabText.skills, href: "/skills" },
  ]

  return (
    <LanguageProvider language={language}>
      <ResultProvider>
        <div className="relative bg-[var(--app-bg)] text-[color:var(--app-text)]">
          <div className="app-bg-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,120,0.12),transparent_45%),radial-gradient(circle_at_bottom,rgba(120,190,255,0.12),transparent_50%)]" />
          <div className="app-bg-grid pointer-events-none absolute inset-0 bg-[linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] bg-[size:80px_80px] opacity-50" />

          <Navbar
            tabs={tabs}
            theme={theme}
            onToggleTheme={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <div className="relative animate-rise">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <UploadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explanation"
                element={
                  <ProtectedRoute>
                    <Explanation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <SkillGuide />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
          <SettingsPanel
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            theme={theme}
            onToggleTheme={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            explanationLevel={explanationLevel}
            onExplanationLevelChange={setExplanationLevel}
            language={language}
            onLanguageChange={setLanguage}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            animationsEnabled={animationsEnabled}
            onToggleAnimations={() => setAnimationsEnabled((prev) => !prev)}
            focusMode={focusMode}
            onToggleFocus={() => setFocusMode((prev) => !prev)}
            onClearHistory={() => {
              localStorage.removeItem("saarthi-results")
            }}
            onResetSettings={handleResetSettings}
            user={user}
            onLogout={handleLogout}
            authActionLoading={authActionLoading}
            authActionError={authActionError}
          />
        </div>
      </ResultProvider>
    </LanguageProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
