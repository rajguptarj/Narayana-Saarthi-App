import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"

export default function Home() {
  const language = useLanguage()
  const navigate = useNavigate()
  const flowRef = useRef(null)
  const [showFlowDemo, setShowFlowDemo] = useState(false)

  const copy = {
    hinglish: {
      heroTitle: "A quiet, powerful space for learning with intent",
      heroBody:
        "Saarthi AI helps students move from confusion to clarity. One upload, one concept, one calm explanation at a time.",
      primary: "Start learning",
      secondary: "Watch the flow",
      how: "How it works",
      flowTitle: "3 easy steps",
      flowCta: "View demo",
      flowHide: "Hide demo",
      demoTitle: "Detailed flow diagram",
      stepLabel: "Step",
      thenText: "Then ->",
      goExplanation: "Go to explanation",
      demoSteps: [
        {
          title: "1) Student uploads",
          detail: "Photo upload from mobile or desktop.",
        },
        {
          title: "2) Server reads text",
          detail: "OCR extracts textbook content.",
        },
        {
          title: "3) AI explains + maps skills",
          detail: "Hinglish output and career skills list.",
        },
      ],
      pillars: [
        {
          title: "Clarity First",
          copy: "Short explanations, visual anchors, and a calm UI that stays out of your way.",
        },
        {
          title: "Study Ritual",
          copy: "Daily focus windows and gentle progress markers keep momentum steady.",
        },
        {
          title: "Mentor Notes",
          copy: "Teacher-style guidance that feels personal without noise.",
        },
      ],
      steps: [
        {
          title: "Upload a concept",
          detail: "Snap a textbook section or type a question.",
        },
        {
          title: "Get a Hinglish explanation",
          detail: "Simple, grounded, and easy to revise before exams.",
        },
        {
          title: "Map it to skills",
          detail: "Understand where the topic lives in real careers.",
        },
      ],
    },
    english: {
      heroTitle: "A quiet, powerful space for learning with intent",
      heroBody:
        "Saarthi AI helps students move from confusion to clarity. One upload, one concept, one calm explanation at a time.",
      primary: "Start learning",
      secondary: "Watch the flow",
      how: "How it works",
      flowTitle: "3 easy steps",
      flowCta: "View demo",
      flowHide: "Hide demo",
      demoTitle: "Detailed flow diagram",
      stepLabel: "Step",
      thenText: "Then ->",
      goExplanation: "Go to explanation",
      demoSteps: [
        {
          title: "1) Student uploads",
          detail: "Photo upload from mobile or desktop.",
        },
        {
          title: "2) Server reads text",
          detail: "OCR extracts textbook content.",
        },
        {
          title: "3) AI explains + maps skills",
          detail: "Hinglish output and career skills list.",
        },
      ],
      pillars: [
        {
          title: "Clarity First",
          copy: "Short explanations, visual anchors, and a calm UI that stays out of your way.",
        },
        {
          title: "Study Ritual",
          copy: "Daily focus windows and gentle progress markers keep momentum steady.",
        },
        {
          title: "Mentor Notes",
          copy: "Teacher-style guidance that feels personal without noise.",
        },
      ],
      steps: [
        {
          title: "Upload a concept",
          detail: "Snap a textbook section or type a question.",
        },
        {
          title: "Get a Hinglish explanation",
          detail: "Simple, grounded, and easy to revise before exams.",
        },
        {
          title: "Map it to skills",
          detail: "Understand where the topic lives in real careers.",
        },
      ],
    },
    hindi: {
      heroTitle: "Uddeshyapurn seekhne ke liye shaant aur shaktishali sthal",
      heroBody:
        "Saarthi AI chhatron ko bhram se spashtata ki ore le jata hai. Ek upload, ek concept, ek shaant vyakhya.",
      primary: "Seekhna shuru karein",
      secondary: "Flow dekhein",
      how: "Kaise kaam karta hai",
      flowTitle: "3 easy steps",
      flowCta: "Demo dekhein",
      flowHide: "Demo hide karein",
      demoTitle: "Detailed flow diagram",
      stepLabel: "Step",
      thenText: "Phir ->",
      goExplanation: "Vyakhya par jao",
      demoSteps: [
        {
          title: "1) Student upload karta hai",
          detail: "Mobile ya desktop se photo upload.",
        },
        {
          title: "2) Server text nikalta hai",
          detail: "OCR textbook text read karta hai.",
        },
        {
          title: "3) AI explain + skill map",
          detail: "Hinglish output aur career skills list.",
        },
      ],
      pillars: [
        {
          title: "Pehle spashtata",
          copy: "Chhoti vyakhyaen, visual anchor, aur ek shaant UI jo dhyan bhang na kare.",
        },
        {
          title: "Study ritual",
          copy: "Dainik focus window aur pragati sanket aapki gati banae rakhte hain.",
        },
        {
          title: "Mentor notes",
          copy: "Shikshak jaisa margdarshan, bina shor ke.",
        },
      ],
      steps: [
        {
          title: "Concept upload karein",
          detail: "Textbook ka section photo lein ya prashn type karein.",
        },
        {
          title: "Hinglish vyakhya paein",
          detail: "Saral, kendrit, aur pariksha revision ke liye upyogi.",
        },
        {
          title: "Skills se map karein",
          detail: "Dekhein ki topic asli career se kaise judta hai.",
        },
      ],
    },
  }

  const t = copy[language] ?? copy.hinglish

  function goToStartLearning() {
    navigate("/upload")
  }

  function scrollToFlow() {
    flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function goToDemo() {
    setShowFlowDemo((prev) => !prev)
    requestAnimationFrame(() => {
      flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[color:var(--app-text)]">
      <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute -top-36 left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,200,120,0.35),rgba(255,200,120,0))] blur-2xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-[-30%] right-[-5%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(120,190,255,0.35),rgba(120,190,255,0))] blur-2xl animate-float-slow [animation-delay:1.5s]" />

        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--brand-label)] animate-rise">
            Saarthi AI
          </p>
          <h1 className="mt-5 max-w-2xl font-[Cinzel] text-4xl leading-tight text-[color:var(--brand-title)] sm:text-5xl animate-rise [animation-delay:120ms]">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base animate-rise [animation-delay:220ms]">
            {t.heroBody}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 animate-rise [animation-delay:320ms]">
            <button
              onClick={goToStartLearning}
              className="rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 px-6 py-3 text-sm font-semibold text-[#1b1306] shadow-[0_20px_40px_rgba(245,195,106,0.35)] transition hover:brightness-110 animate-glow-pulse"
            >
              {t.primary}
            </button>
            <button
              onClick={scrollToFlow}
              className="rounded-full border border-[color:var(--border)] px-6 py-3 text-sm text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
            >
              {t.secondary}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {t.pillars.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]"
            >
              <h3 className="font-[Cinzel] text-xl text-[color:var(--brand-title)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={flowRef} className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[36px] border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted-soft)]">
                {t.how}
              </p>
              <h2 className="mt-3 font-[Cinzel] text-3xl text-[color:var(--app-text)]">
                {t.flowTitle}
              </h2>
            </div>
            <button
              onClick={goToDemo}
              className="rounded-full border border-[color:var(--border)] px-5 py-2 text-xs uppercase tracking-widest text-[color:var(--muted)]"
            >
              {showFlowDemo ? t.flowHide : t.flowCta}
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {t.steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-5"
              >
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.stepLabel} {index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-[color:var(--app-text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          {showFlowDemo ? (
            <div className="mt-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--brand-label)]">
                {t.demoTitle}
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {t.demoSteps.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4"
                  >
                    <p className="text-sm font-semibold text-[color:var(--brand-title)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{item.detail}</p>
                    {index < t.demoSteps.length - 1 ? (
                      <p className="mt-3 text-xs text-[color:var(--brand-label)]">
                        {t.thenText}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/upload")}
                  className="rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 px-5 py-2 text-sm font-semibold text-[#1b1306]"
                >
                  {t.primary}
                </button>
                <button
                  onClick={() => navigate("/explanation")}
                  className="rounded-full border border-[color:var(--border)] px-5 py-2 text-sm text-[color:var(--muted)] hover:border-amber-200/60 hover:text-[color:var(--app-text)]"
                >
                  {t.goExplanation}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
