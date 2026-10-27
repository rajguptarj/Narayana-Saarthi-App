const fs = require("fs/promises")
const path = require("path")
const { execFile } = require("child_process")
const { promisify } = require("util")
const sharp = require("sharp")

const execFileAsync = promisify(execFile)

function parseJsonOutput(output) {
  const trimmed = (output || "").trim()
  if (!trimmed) {
    throw new Error("OpenCV script returned empty output.")
  }

  const lines = trimmed.split(/\r?\n/).filter(Boolean)
  const lastLine = lines[lines.length - 1]
  return JSON.parse(lastLine)
}

async function preprocessWithOpenCv(inputPath, processedPath) {
  const scriptPath = path.resolve(__dirname, "../../scripts/opencv_preprocess.py")
  const pythonCommand = process.env.PYTHON_BIN || "python"

  const { stdout, stderr } = await execFileAsync(
    pythonCommand,
    [scriptPath, "--input", inputPath, "--output", processedPath],
    {
      timeout: 45_000,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    }
  )

  const payload = parseJsonOutput(stdout)
  if (!payload?.ok) {
    throw new Error(payload?.error || stderr || "OpenCV preprocessing failed.")
  }

  return {
    processedPath: payload.output_path || processedPath,
    steps: Array.isArray(payload.steps) ? payload.steps : [],
  }
}

async function preprocessWithSharp(inputPath, processedPath) {
  const steps = [
    { name: "sharp_rotate", label: "Auto-rotated and aligned image" },
    { name: "sharp_grayscale", label: "Converted to grayscale" },
    { name: "sharp_contrast", label: "Enhanced contrast and sharpened text" },
    { name: "sharp_threshold", label: "Applied threshold for cleaner OCR" },
  ]

  await sharp(inputPath)
    .rotate()
    .flatten({ background: "#ffffff" })
    .grayscale()
    .normalize()
    .sharpen({ sigma: 1.1 })
    .threshold(168)
    .png()
    .toFile(processedPath)

  return { processedPath, steps }
}

async function preprocessImage(inputPath) {
  const steps = []

  steps.push({
    name: "load_image",
    label: "Loaded uploaded image",
  })

  const processedDir = path.join(path.dirname(inputPath), "processed")
  await fs.mkdir(processedDir, { recursive: true })

  const fileBase = path.parse(inputPath).name
  const processedPath = path.join(processedDir, `${fileBase}-processed.png`)
  let finalProcessedPath = processedPath
  let preprocessingEngine = "opencv"

  try {
    const openCvResult = await preprocessWithOpenCv(inputPath, processedPath)
    finalProcessedPath = openCvResult.processedPath
    steps.push(...openCvResult.steps)
  } catch (opencvError) {
    preprocessingEngine = "sharp"
    steps.push({
      name: "opencv_fallback",
      label: `OpenCV unavailable (${opencvError.message}). Using Sharp fallback.`,
    })

    const sharpResult = await preprocessWithSharp(inputPath, processedPath)
    finalProcessedPath = sharpResult.processedPath
    steps.push(...sharpResult.steps)
  }

  steps.push({
    name: "preprocess_done",
    label: `Preprocessing done with ${preprocessingEngine.toUpperCase()}`,
  })

  return {
    processedPath: finalProcessedPath,
    steps,
    preprocessingEngine,
  }
}
module.exports = {
  preprocessImage,
}
