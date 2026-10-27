import { useLanguage } from "../context/LanguageContext"
import { useResults } from "../context/ResultContext"

export default function SkillGuide() {
  const language = useLanguage()
  const { skills } = useResults()
  const copy = {
    hinglish: {
      title: "Skill guide",
      body:
        "Ye report batata hai ki tumhara concept real-world careers se kaise link hota hai. Career map ko short, actionable steps mein todte hain.",
      cta: "Explore roadmap",
      next: "Suggested next topic",
      nextTitle: "Cellular respiration",
      nextBody:
        "Energy production ka next natural step. Is topic se biotech aur medicine dono connect hote hain.",
      empty: "Abhi koi skill map nahi hai. Pehle upload page par text bhejo.",
    },
    english: {
      title: "Skill guide",
      body:
        "This report shows how your concept connects with real-world careers. We break the map into short, actionable steps.",
      cta: "Explore roadmap",
      next: "Suggested next topic",
      nextTitle: "Cellular respiration",
      nextBody:
        "The next natural step in energy production. This topic connects to biotech and medicine.",
      empty: "No skill map yet. Upload a concept first.",
    },
    hindi: {
      title: "Skill guide",
      body:
        "Yeh report batata hai ki aapka concept real-world careers se kaise link hota hai. Career map ko short, actionable steps mein todte hain.",
      cta: "Explore roadmap",
      next: "Suggested next topic",
      nextTitle: "Cellular respiration",
      nextBody:
        "Energy production ka next natural step. Is topic se biotech aur medicine dono connect hote hain.",
      empty: "Abhi koi skill map nahi hai. Pehle upload page par text bhejein.",
    },
  }
  const t = copy[language] ?? copy.hinglish

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

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {(skills.length ? skills : []).map((skill) => (
            <div
              key={skill.title}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]"
            >
              <h3 className="font-[Cinzel] text-xl text-[color:var(--brand-title)]">
                {skill.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {skill.reason || skill.detail}
              </p>
              <button className="mt-5 rounded-full border border-[color:var(--border)] px-5 py-2 text-xs uppercase tracking-widest text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]">
                {t.cta}
              </button>
            </div>
          ))}
        </div>
        {skills.length === 0 && (
          <p className="mt-6 text-sm text-[color:var(--muted)]">{t.empty}</p>
        )}

        <div className="mt-10 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-7 transition hover:-translate-y-1 hover:border-amber-200/40">
          <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
            {t.next}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--app-text)]">
            {t.nextTitle}
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {t.nextBody}
          </p>
        </div>
      </div>
    </div>
  )
}
