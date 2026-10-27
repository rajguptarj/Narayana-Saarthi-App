async function parseApiError(response, fallbackMessage) {
  try {
    const payload = await response.json()
    return payload?.error || payload?.message || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch("/api/ocr", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const message = await parseApiError(response, "OCR failed")
    throw new Error(message)
  }
  return response.json()
}

export async function explainText(text, language = "hinglish") {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  })

  if (!response.ok) {
    const message = await parseApiError(response, "Explanation failed")
    throw new Error(message)
  }
  return response.json()
}

export async function mapSkills(text) {
  const response = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const message = await parseApiError(response, "Skill mapping failed")
    throw new Error(message)
  }
  return response.json()
}
