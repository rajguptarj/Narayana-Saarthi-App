import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

function mapFirebaseError(errorCode) {
  const errorMap = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/popup-closed-by-user": "Google sign-in popup was closed.",
  }
  return errorMap[errorCode] || "Authentication failed. Please try again."
}

export default function Login() {
  const language = useLanguage()
  const { user, login, register, loginWithGoogle, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const copy = {
    hinglish: {
      title: "Sacred clarity for modern learners",
      body:
        "A focused learning experience inspired by timeless discipline. Log in to continue your path, track progress, and access curated lessons.",
      signIn: "Sign in",
      register: "Register",
      subtitle: "Welcome back to your study space",
      email: "Email",
      password: "Password",
      ctaLogin: "Enter the path",
      ctaRegister: "Create account",
      switchToRegister: "Create an account",
      switchToLogin: "Already have an account?",
      loggedInAs: "Logged in as",
      signOut: "Sign out",
      google: "Continue with Google",
    },
    english: {
      title: "Sacred clarity for modern learners",
      body:
        "A focused learning experience inspired by timeless discipline. Log in to continue your path, track progress, and access curated lessons.",
      signIn: "Sign in",
      register: "Register",
      subtitle: "Welcome back to your study space",
      email: "Email",
      password: "Password",
      ctaLogin: "Enter the path",
      ctaRegister: "Create account",
      switchToRegister: "Create an account",
      switchToLogin: "Already have an account?",
      loggedInAs: "Logged in as",
      signOut: "Sign out",
      google: "Continue with Google",
    },
    hindi: {
      title: "Modern learners ke liye sacred clarity",
      body:
        "Focused learning experience jo timeless discipline se inspired hai. Log in karke apni journey continue karein.",
      signIn: "Sign in",
      register: "Register",
      subtitle: "Welcome back to your study space",
      email: "Email",
      password: "Password",
      ctaLogin: "Enter the path",
      ctaRegister: "Create account",
      switchToRegister: "Create an account",
      switchToLogin: "Already have an account?",
      loggedInAs: "Logged in as",
      signOut: "Sign out",
      google: "Google se continue karein",
    },
  }

  const t = copy[language] ?? copy.hinglish
  const redirectPath = location.state?.from || "/"

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (mode === "register") {
        await register(email, password)
      } else {
        await login(email, password)
      }
      setPassword("")
      navigate(redirectPath, { replace: true })
    } catch (nextError) {
      setError(mapFirebaseError(nextError.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    setError("")
    setLoading(true)
    try {
      await logout()
    } catch (nextError) {
      setError(mapFirebaseError(nextError.code))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError("")
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate(redirectPath, { replace: true })
    } catch (nextError) {
      setError(mapFirebaseError(nextError.code))
    } finally {
      setLoading(false)
    }
  }

  const isRegisterMode = mode === "register"

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[color:var(--app-text)]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,200,120,0.35),rgba(255,200,120,0))] blur-2xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(120,190,255,0.35),rgba(120,190,255,0))] blur-2xl animate-float-slow [animation-delay:1.4s]" />

        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
          <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)] animate-rise">
                Saarthi AI
              </p>
              <h1 className="mt-4 font-[Cinzel] text-4xl leading-tight text-[color:var(--brand-title)] sm:text-5xl animate-rise [animation-delay:120ms]">
                {t.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-[color:var(--muted)] sm:text-base animate-rise [animation-delay:220ms]">
                {t.body}
              </p>

              <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3 animate-rise [animation-delay:320ms]">
                {[
                  { label: "Guided Focus", value: "Deep sessions" },
                  { label: "Progress", value: "Daily ritual" },
                  { label: "Support", value: "Mentor notes" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-4 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]"
                  >
                    <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                      {item.label}
                    </p>
                    <p className="mt-2 font-semibold text-[color:var(--brand-title)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-amber-300/20 via-transparent to-sky-300/20 blur-xl" />
              <div className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-amber-200/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-[Cinzel] text-2xl text-[color:var(--app-text)]">
                      {isRegisterMode ? t.register : t.signIn}
                    </h2>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {t.subtitle}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-soft)] text-amber-200">
                    OM
                  </div>
                </div>

                {user ? (
                  <div className="mt-8 space-y-4">
                    <p className="text-sm text-[color:var(--muted)]">
                      {t.loggedInAs}:{" "}
                      <span className="text-amber-200">{user.email}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full rounded-xl border border-[color:var(--border)] px-4 py-3 text-sm font-semibold text-[color:var(--app-text)] transition hover:border-amber-200/60 disabled:opacity-60"
                    >
                      {t.signOut}
                    </button>
                  </div>
                ) : (
                  <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                        {t.email}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@email.com"
                        className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-3 text-sm text-[color:var(--app-text)] placeholder:text-[color:var(--muted-soft)] focus:border-amber-200/60 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                        {t.password}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="********"
                        className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-3 text-sm text-[color:var(--app-text)] placeholder:text-[color:var(--muted-soft)] focus:border-amber-200/60 focus:outline-none"
                        required
                        minLength={6}
                      />
                    </div>

                    {error ? (
                      <p className="text-sm text-red-400">{error}</p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 px-4 py-3 text-sm font-semibold text-[#1b1306] shadow-[0_20px_40px_rgba(245,195,106,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Please wait..."
                        : isRegisterMode
                          ? t.ctaRegister
                          : t.ctaLogin}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] px-4 py-3 text-sm font-semibold text-[color:var(--app-text)] transition hover:border-amber-200/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.google}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMode((prev) => (prev === "login" ? "register" : "login"))
                      }
                      className="w-full text-center text-xs text-[color:var(--muted-soft)] hover:text-amber-200/90"
                    >
                      {isRegisterMode ? t.switchToLogin : t.switchToRegister}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
