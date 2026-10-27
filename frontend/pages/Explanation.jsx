import { useLanguage } from "../context/LanguageContext"
import { useResults } from "../context/ResultContext"

const bullets = {
  hinglish: [
    "Concept ko chhote blocks mein todta hai",
    "Science words ka simple Hinglish meaning",
    "Important lines ko highlight karta hai",
  ],
  english: [
    "Breaks the concept into small blocks",
    "Simple meaning for science terms",
    "Highlights the most important lines",
  ],
  hindi: [
    "Concept ko chhote blocks mein todta hai",
    "Science terms ka simple meaning deta hai",
    "Important lines ko highlight karta hai",
  ],
}

export default function Explanation() {
  const language = useLanguage()
  const { explanation, ocrText } = useResults()
  const copy = {
    hinglish: {
      title: "Hinglish explanation",
      body:
        "Abhi yahan tumhara concept ka simplified output aayega. Is flow ko exam revision ke liye optimize kiya gaya hai.",
      output: "Output",
      key: "Key lines",
      next: "Next step",
      nextBody: "Skill mapping report dekhne ke liye “Skills” tab open karo.",
      nextCta: "View skill map",
      empty: "Abhi koi explanation nahi hai. Pehle upload page par photo bhejo.",
    },
    english: {
      title: "Explanation",
      body:
        "Your simplified explanation appears here. This flow is optimized for quick exam revision.",
      output: "Output",
      key: "Key lines",
      next: "Next step",
      nextBody: "Open the Skills tab to see your skill mapping report.",
      nextCta: "View skill map",
      empty: "No explanation yet. Upload a photo first.",
    },
    hindi: {
      title: "Hinglish explanation",
      body:
        "Yahan aapke concept ka simplified output aayega. Ye flow exam revision ke liye optimized hai.",
      output: "Output",
      key: "Key lines",
      next: "Next step",
      nextBody: "Skill mapping report ke liye “Skills” tab open karein.",
      nextCta: "View skill map",
      empty: "Abhi koi explanation nahi hai. Pehle upload page par photo bhejein.",
    },
  }
  const t = copy[language] ?? copy.hinglish
  const list = bullets[language] ?? bullets.hinglish

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[color:var(--app-text)]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)] animate-rise">
          Saarthi AI
        </p>
        <h1 className="mt-4 font-[Cinzel] text-4xl text-[color:var(--brand-title)] animate-rise [animation-delay:120ms]">
          {t.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)] animate-rise [animation-delay:220ms]">
          {t.body}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-7 transition hover:-translate-y-1 hover:border-amber-200/40">
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
              {t.output}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-[color:var(--app-text)]">
              {explanation ? "Your explanation" : "No explanation yet"}
            </h2>
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              {explanation || t.empty}
            </p>
            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5">
              <p className="text-xs uppercase tracking-widest text-amber-200/70">
                {t.key}
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {ocrText
                  ? ocrText.slice(0, 180)
                  : "Upload ke baad key lines yahan dikhenge."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]">
              <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                Why this works
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]">
              <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                {t.next}
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {t.nextBody}
              </p>
              <button className="mt-5 rounded-full border border-[color:var(--border)] px-5 py-2 text-xs uppercase tracking-widest text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]">
                {t.nextCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
