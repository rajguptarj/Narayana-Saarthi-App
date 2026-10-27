import { createContext, useContext, useEffect, useMemo, useState } from "react"

const ResultContext = createContext(null)

function loadSavedResults() {
  const fallback = { ocrText: "", explanation: "", skills: [] }
  try {
    const saved = localStorage.getItem("saarthi-results")
    if (!saved) return fallback
    const parsed = JSON.parse(saved)
    return {
      ocrText: parsed.ocrText || "",
      explanation: parsed.explanation || "",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    }
  } catch {
    localStorage.removeItem("saarthi-results")
    return fallback
  }
}

export function ResultProvider({ children }) {
  const [ocrText, setOcrText] = useState(() => loadSavedResults().ocrText)
  const [explanation, setExplanation] = useState(() => loadSavedResults().explanation)
  const [skills, setSkills] = useState(() => loadSavedResults().skills)

  useEffect(() => {
    localStorage.setItem(
      "saarthi-results",
      JSON.stringify({ ocrText, explanation, skills })
    )
  }, [ocrText, explanation, skills])

  const value = useMemo(
    () => ({
      ocrText,
      setOcrText,
      explanation,
      setExplanation,
      skills,
      setSkills,
      clear: () => {
        setOcrText("")
        setExplanation("")
        setSkills([])
      },
    }),
    [ocrText, explanation, skills]
  )

  return <ResultContext.Provider value={value}>{children}</ResultContext.Provider>
}

export function useResults() {
  const ctx = useContext(ResultContext)
  if (!ctx) {
    throw new Error("useResults must be used within ResultProvider")
  }
  return ctx
}
