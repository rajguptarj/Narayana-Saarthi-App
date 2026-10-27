import { Fragment, useMemo, useRef, useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { useResults } from "../context/ResultContext"
import { explainText, mapSkills, uploadImage } from "../services/api"

function buildDiagramPoints(explanationText) {
  if (!explanationText) return []
  const cleanText = explanationText.replace(/\s+/g, " ").trim()
  const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(Boolean)
  const points = (sentences.length ? sentences : [cleanText]).slice(0, 3)

  return points.map((sentence, index) => ({
    id: `point-${index + 1}`,
    title: `Core Idea ${index + 1}`,
    text: sentence.length > 140 ? `${sentence.slice(0, 137)}...` : sentence,
  }))
}

export default function UploadPage() {
  const language = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [processSteps, setProcessSteps] = useState([])
  const [flowSteps, setFlowSteps] = useState([])
  const [topicLabel, setTopicLabel] = useState("")
  const [conceptExamples, setConceptExamples] = useState([])
  const [snapshot, setSnapshot] = useState(null)
  const { ocrText, setOcrText, explanation, setExplanation, skills, setSkills } =
    useResults()
  const fileInputRef = useRef(null)
  const diagramPoints = useMemo(() => {
    if (Array.isArray(flowSteps) && flowSteps.length > 0) {
      return flowSteps
        .map((step, index) => {
          if (typeof step === "string") {
            const cleanStep = step.trim()
            if (!cleanStep) return null
            return {
              id: `flow-${index + 1}`,
              title: `Step ${index + 1}`,
              text: cleanStep.length > 160 ? `${cleanStep.slice(0, 157)}...` : cleanStep,
            }
          }

          const title =
            typeof step?.title === "string" && step.title.trim()
              ? step.title.trim()
              : `Step ${index + 1}`
          const detailCandidate =
            typeof step?.detail === "string"
              ? step.detail
              : typeof step?.text === "string"
                ? step.text
                : ""
          const detail = detailCandidate.trim()
          if (!detail) return null

          return {
            id: `flow-${index + 1}`,
            title,
            text: detail.length > 160 ? `${detail.slice(0, 157)}...` : detail,
          }
        })
        .filter(Boolean)
        .slice(0, 5)
    }

    return buildDiagramPoints(explanation)
  }, [flowSteps, explanation])

  async function handleFile(file) {
    if (!file) return
    setLoading(true)
    setError("")
    setProcessSteps([])
    setOcrText("")
    setExplanation("")
    setSkills([])
    setFlowSteps([])
    setTopicLabel("")
    setConceptExamples([])
    setSnapshot(null)
    try {
      const ocr = await uploadImage(file)
      const ocrResult = ocr?.result || {}
      const text = ocrResult?.text || ""
      setProcessSteps(ocrResult?.steps || [])
      setOcrText(text)
      if (text) {
        const [exp, skill] = await Promise.all([
          explainText(text, language),
          mapSkills(text),
        ])
        const expResult = exp?.result || {}
        const skillResult = skill?.result || {}
        setExplanation(expResult.explanation || "")
        setFlowSteps(Array.isArray(expResult.flowSteps) ? expResult.flowSteps : [])
        setTopicLabel(expResult.topicLabel || "")
        setConceptExamples(
          Array.isArray(expResult.conceptExamples) ? expResult.conceptExamples : []
        )
        const mappedSkills = skillResult?.skills || []
        setSkills(mappedSkills)
        setSnapshot({
          topicLabel: expResult.topicLabel || "Unclassified",
          ocrConfidence:
            Number.isFinite(Number(ocrResult.ocrConfidence))
              ? Math.round(Number(ocrResult.ocrConfidence))
              : null,
          ocrQualityScore:
            Number.isFinite(Number(ocrResult.ocrQualityScore))
              ? Number(ocrResult.ocrQualityScore).toFixed(2)
              : null,
          preprocessingEngine: ocrResult.preprocessingEngine || "N/A",
          explanationSource: expResult.source || "unknown",
          skillsCount: mappedSkills.length,
        })
      }
    } catch (err) {
      setError(err?.message || "Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function onFileChange(event) {
    const file = event.target.files?.[0]
    handleFile(file)
  }

  function onSelectFile() {
    fileInputRef.current?.click()
  }
  const copy = {
    hinglish: {
      title: "Upload a textbook photo",
      body:
        "Choose a clear image and we will extract the text for Hinglish explanation. Supported: JPG, PNG, PDF (single page).",
      drop: "Drag & drop your image here",
      select: "Select file",
      camera: "Use camera",
      tips: "Tips",
      tipItems: [
        "Keep the page flat and well-lit.",
        "Crop extra margins and shadows.",
        "One chapter section works best.",
      ],
      preview: "Output preview",
      previewBody: "Extracted text will appear here before explanation.",
      results: "Results",
      explanation: "Explanation",
      skills: "Skill map",
      loading: "Processing...",
      processSteps: "Processing steps",
      fullExplanation: "Detailed explanation",
      topicClass: "Topic classification",
      snapshot: "Top Snapshot",
      ocrConf: "OCR confidence",
      ocrQuality: "OCR quality",
      preprocess: "Preprocess",
      explainSource: "Explain source",
      mappedSkills: "Mapped skills",
      diagram: "Concept diagram",
      diagramHint: "Simple flow from the generated explanation",
      conceptExamples: "Concept examples",
      step: "Step",
    },
    english: {
      title: "Upload a textbook photo",
      body:
        "Choose a clear image and we will extract the text for explanation. Supported: JPG, PNG, PDF (single page).",
      drop: "Drag & drop your image here",
      select: "Select file",
      camera: "Use camera",
      tips: "Tips",
      tipItems: [
        "Keep the page flat and well-lit.",
        "Crop extra margins and shadows.",
        "One chapter section works best.",
      ],
      preview: "Output preview",
      previewBody: "Extracted text will appear here before explanation.",
      results: "Results",
      explanation: "Explanation",
      skills: "Skill map",
      loading: "Processing...",
      processSteps: "Processing steps",
      fullExplanation: "Detailed explanation",
      topicClass: "Topic classification",
      snapshot: "Top Snapshot",
      ocrConf: "OCR confidence",
      ocrQuality: "OCR quality",
      preprocess: "Preprocess",
      explainSource: "Explain source",
      mappedSkills: "Mapped skills",
      diagram: "Concept diagram",
      diagramHint: "Simple flow from the generated explanation",
      conceptExamples: "Concept examples",
      step: "Step",
    },
    hindi: {
      title: "Textbook photo upload karein",
      body:
        "Clear image choose karein. Hum text extract karke Hinglish explanation banayenge. Supported: JPG, PNG, PDF (single page).",
      drop: "Image yahan drag & drop karein",
      select: "File select karein",
      camera: "Camera use karein",
      tips: "Tips",
      tipItems: [
        "Page ko seedha aur well-lit rakhein.",
        "Extra margins aur shadows crop karein.",
        "Ek chapter section best hota hai.",
      ],
      preview: "Output preview",
      previewBody: "Extracted text yahan explanation se pehle dikhega.",
      results: "Results",
      explanation: "Explanation",
      skills: "Skill map",
      loading: "Processing...",
      processSteps: "Processing steps",
      fullExplanation: "Detailed explanation",
      topicClass: "Topic classification",
      snapshot: "Top Snapshot",
      ocrConf: "OCR confidence",
      ocrQuality: "OCR quality",
      preprocess: "Preprocess",
      explainSource: "Explain source",
      mappedSkills: "Mapped skills",
      diagram: "Concept diagram",
      diagramHint: "Generated explanation ka simple flow",
      conceptExamples: "Concept examples",
      step: "Step",
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

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-8 transition hover:-translate-y-1 hover:border-amber-200/40 hover:bg-[color:var(--panel)]">
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--panel-strong)] text-center text-[color:var(--muted)]">
              {loading ? t.loading : t.drop}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onSelectFile}
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 px-6 py-3 text-sm font-semibold text-[#1b1306] shadow-[0_20px_40px_rgba(245,195,106,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 animate-glow-pulse"
              >
                {t.select}
              </button>
              <button className="rounded-full border border-[color:var(--border)] px-6 py-3 text-sm text-[color:var(--muted)] transition hover:border-amber-200/60 hover:text-[color:var(--app-text)]">
                {t.camera}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            {error && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6">
              <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                {t.tips}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
                {t.tipItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6">
              <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                {t.preview}
              </p>
              <p className="mt-4 text-sm text-[color:var(--muted)]">
                {ocrText || t.previewBody}
              </p>
            </div>
            {processSteps.length > 0 ? (
              <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-6">
                <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
                  {t.processSteps}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                  {processSteps.map((step) => (
                    <li key={step.name || step.label}>
                      {step.label || step.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {(explanation || skills.length > 0) && (
          <div className="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-8">
            <p className="text-xs uppercase tracking-widest text-[color:var(--muted-soft)]">
              {t.results}
            </p>

            {snapshot ? (
              <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-4">
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.snapshot}
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.topicClass}:{" "}
                    <span className="text-[color:var(--app-text)]">{snapshot.topicLabel}</span>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.ocrConf}:{" "}
                    <span className="text-[color:var(--app-text)]">
                      {snapshot.ocrConfidence ?? "N/A"}%
                    </span>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.ocrQuality}:{" "}
                    <span className="text-[color:var(--app-text)]">
                      {snapshot.ocrQualityScore ?? "N/A"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.preprocess}:{" "}
                    <span className="uppercase text-[color:var(--app-text)]">
                      {snapshot.preprocessingEngine}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.explainSource}:{" "}
                    <span className="text-[color:var(--app-text)]">
                      {snapshot.explanationSource}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-2 text-xs text-[color:var(--muted)]">
                    {t.mappedSkills}:{" "}
                    <span className="text-[color:var(--app-text)]">{snapshot.skillsCount}</span>
                  </div>
                </div>
              </div>
            ) : null}

            {conceptExamples.length > 0 && (
              <div className="mt-7">
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.conceptExamples}
                </p>
                <ul className="mt-3 space-y-3 text-sm text-[color:var(--muted)]">
                  {conceptExamples.map((item, index) => (
                    <li key={`${item.concept || "concept"}-${index}`}>
                      <strong className="text-[color:var(--app-text)]">
                        {item.concept}
                      </strong>
                      {" - "}
                      {item.example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {diagramPoints.length > 0 && (
              <div className="mt-7">
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.diagram}
                </p>
                <p className="mt-2 text-xs text-[color:var(--muted-soft)]">
                  {t.diagramHint}
                </p>
                <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch md:gap-3">
                  {diagramPoints.map((point, index) => (
                    <Fragment key={point.id}>
                      {index > 0 && (
                        <>
                          <span className="self-center text-amber-300/70 md:hidden">
                            |
                          </span>
                          <span className="self-center text-amber-300/70 md:hidden">
                            v
                          </span>
                          <span className="hidden self-center text-xl text-amber-300/70 md:block">
                            {" -> "}
                          </span>
                        </>
                      )}
                      <div className="flex-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-4">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
                          {t.step} {index + 1}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                          {point.title}
                        </p>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          {point.text}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div className="mt-7">
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.skills}
                </p>
                <div className="mt-3 space-y-3 text-sm text-[color:var(--muted)]">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.title}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-soft)] p-4"
                      style={{ marginLeft: `${Math.min(index * 16, 64)}px` }}
                    >
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted-soft)]">
                        Level {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                        {skill.title}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">{skill.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {explanation && (
              <div className="mt-5">
                {topicLabel ? (
                  <div className="mb-4 inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--panel-soft)] px-4 py-2 text-xs tracking-wide text-[color:var(--app-text)]">
                    {t.topicClass}: {topicLabel}
                  </div>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-amber-200/70">
                  {t.fullExplanation}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted)]">
                  {explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

