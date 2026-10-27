const { runOcr } = require("../services/ocrService")

async function ocrController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    const result = await runOcr(req.file.path)
    return res.json({ ok: true, result })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  ocrController,
}
