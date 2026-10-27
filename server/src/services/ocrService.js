const Tesseract = require("tesseract.js")
const { preprocessImage } = require("./imagePreprocessService")

async function extractText(imagePath) {
  const result = await Tesseract.recognize(imagePath, "eng")
  const words = Array.isArray(result?.data?.words) ? result.data.words : []
  const validWordConfidences = words
    .map((word) => Number(word?.confidence || 0))
    .filter((value) => Number.isFinite(value) && value > 0)
  const meanWordConfidence =
    validWordConfidences.length > 0
      ? validWordConfidences.reduce((sum, value) => sum + value, 0) /
        validWordConfidences.length
      : 0

  return {
    text: result?.data?.text?.replace(/\s+\n/g, "\n").trim() || "",
    confidence: Number(result?.data?.confidence || 0),
    meanWordConfidence: Number(meanWordConfidence || 0),
  }
}

function cleanOcrText(text) {
  const raw = String(text || "")
  if (!raw) return ""

  const normalized = raw
    .replace(/\u00a0/g, " ")
    .replace(/[|]/g, "I")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[-‐‑]\s*\n\s*/g, "")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  const unique = []
  const seen = new Set()

  for (const line of lines) {
    const lineKey = line.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim()
    if (!lineKey) continue
    if (seen.has(lineKey)) continue

    const letters = (line.match(/[A-Za-z]/g) || []).length
    const digits = (line.match(/[0-9]/g) || []).length
    const symbols = line.length - letters - digits - (line.match(/\s/g) || []).length
    const letterRatio = letters / Math.max(1, letters + digits + symbols)
    const symbolRatio = symbols / Math.max(1, letters + digits + symbols)

    const isLikelyNoise =
      line.length > 18 &&
      (letterRatio < 0.35 || symbolRatio > 0.32) &&
      letters < 8

    if (isLikelyNoise) continue

    seen.add(lineKey)
    unique.push(line)
  }

  return unique.join("\n").trim()
}

function analyzeTextQuality(text, confidence, meanWordConfidence = 0) {
  const raw = String(text || "")
  const compact = raw.replace(/\s+/g, "")
  const total = compact.length
  if (total === 0) {
    return {
      score: 0,
      reasons: ["empty_text"],
      alphaRatio: 0,
      digitRatio: 0,
      symbolRatio: 1,
      confidence: Number(confidence || 0),
      meanWordConfidence: Number(meanWordConfidence || 0),
      meaningfulWordRatio: 0,
      shortUpperWordRatio: 1,
    }
  }

  const alpha = (compact.match(/[A-Za-z]/g) || []).length
  const digits = (compact.match(/[0-9]/g) || []).length
  const symbols = total - alpha - digits
  const vowels = (compact.match(/[AEIOUaeiou]/g) || []).length
  const longWords = (raw.match(/\b[A-Za-z]{4,}\b/g) || []).length

  const alphaRatio = alpha / total
  const digitRatio = digits / total
  const symbolRatio = symbols / total
  const vowelRatio = alpha > 0 ? vowels / alpha : 0
  const normalizedConfidence = Math.max(0, Math.min(1, Number(confidence || 0) / 100))
  const normalizedWordConfidence = Math.max(
    0,
    Math.min(1, Number(meanWordConfidence || 0) / 100)
  )

  const alphaTokens = (raw.match(/\b[A-Za-z]+\b/g) || []).map((token) => token.trim())
  const meaningfulWords = alphaTokens.filter(
    (token) =>
      token.length >= 4 && /[aeiou]/i.test(token) && !/(.)\1\1/i.test(token)
  ).length
  const shortUpperWords = alphaTokens.filter(
    (token) => token.length <= 2 && token === token.toUpperCase()
  ).length
  const meaningfulWordRatio =
    alphaTokens.length > 0 ? meaningfulWords / alphaTokens.length : 0
  const shortUpperWordRatio =
    alphaTokens.length > 0 ? shortUpperWords / alphaTokens.length : 1

  let score = normalizedConfidence * 0.45
  score += normalizedWordConfidence * 0.2
  score += alphaRatio * 0.18
  score += Math.max(0, 1 - symbolRatio) * 0.15
  score += Math.min(1, longWords / 12) * 0.07
  score += meaningfulWordRatio * 0.1
  score += Math.max(0, 1 - shortUpperWordRatio) * 0.05

  const reasons = []
  if (normalizedConfidence < 0.35) reasons.push("low_confidence")
  if (normalizedWordConfidence < 0.42) reasons.push("low_word_confidence")
  if (alphaRatio < 0.45) reasons.push("low_alpha_ratio")
  if (symbolRatio > 0.28) reasons.push("high_symbol_ratio")
  if (vowelRatio < 0.2) reasons.push("low_word_quality")
  if (digitRatio > 0.4) reasons.push("too_many_digits")
  if (meaningfulWordRatio < 0.28) reasons.push("too_many_gibberish_words")
  if (shortUpperWordRatio > 0.35) reasons.push("too_many_short_upper_tokens")

  return {
    score,
    reasons,
    alphaRatio,
    digitRatio,
    symbolRatio,
    confidence: Number(confidence || 0),
    meanWordConfidence: Number(meanWordConfidence || 0),
    meaningfulWordRatio,
    shortUpperWordRatio,
  }
}

function isReadableEnough(metrics) {
  if (!metrics) return false
  if (
    metrics.score >= 0.62 &&
    metrics.meaningfulWordRatio >= 0.28 &&
    metrics.shortUpperWordRatio <= 0.35
  ) {
    return true
  }
  if (
    metrics.confidence >= 62 &&
    metrics.meanWordConfidence >= 55 &&
    metrics.alphaRatio >= 0.5 &&
    metrics.symbolRatio <= 0.22 &&
    metrics.meaningfulWordRatio >= 0.32 &&
    metrics.shortUpperWordRatio <= 0.3
  ) {
    return true
  }
  return false
}

async function runOcr(filePath) {
  const { processedPath, steps, preprocessingEngine } = await preprocessImage(
    filePath
  )

  steps.push({
    name: "ocr",
    label: "Running OCR extraction",
  })

  const processedOcr = await extractText(processedPath)
  const processedCleanText = cleanOcrText(processedOcr.text)
  const processedMetrics = analyzeTextQuality(
    processedCleanText,
    processedOcr.confidence,
    processedOcr.meanWordConfidence
  )

  let bestOcr = {
    ...processedOcr,
    text: processedCleanText,
    source: "processed",
    metrics: processedMetrics,
  }

  steps.push({
    name: "ocr_quality_processed",
    label: `Processed OCR confidence: ${Math.round(processedMetrics.confidence)}% (word: ${Math.round(processedMetrics.meanWordConfidence)}%, quality: ${processedMetrics.score.toFixed(2)})`,
  })

  if (!isReadableEnough(processedMetrics)) {
    steps.push({
      name: "ocr_fallback",
      label: "OCR quality low. Trying original image fallback",
    })

    const originalOcr = await extractText(filePath)
    const originalCleanText = cleanOcrText(originalOcr.text)
    const originalMetrics = analyzeTextQuality(
      originalCleanText,
      originalOcr.confidence,
      originalOcr.meanWordConfidence
    )

    steps.push({
      name: "ocr_quality_original",
      label: `Original OCR confidence: ${Math.round(originalMetrics.confidence)}% (word: ${Math.round(originalMetrics.meanWordConfidence)}%, quality: ${originalMetrics.score.toFixed(2)})`,
    })

    if (originalMetrics.score > processedMetrics.score) {
      bestOcr = {
        ...originalOcr,
        text: originalCleanText,
        source: "original",
        metrics: originalMetrics,
      }
    }
  }

  if (!bestOcr.text || !isReadableEnough(bestOcr.metrics)) {
    throw new Error(
      "Image text is not readable yet. Please retake photo in bright light, hold camera straight, crop only textbook area, and upload again."
    )
  }

  steps.push({
    name: "done",
    label: `OCR completed successfully (${bestOcr.source} image used)`,
  })

  return {
    text: bestOcr.text,
    filePath,
    processedPath,
    preprocessingEngine,
    ocrConfidence: bestOcr.metrics.confidence,
    ocrQualityScore: Number(bestOcr.metrics.score.toFixed(3)),
    steps,
  }
}

module.exports = {
  runOcr,
}
