const { explainText } = require("../services/aiExplainService")

async function explainController(req, res, next) {
  try {
    const { text, language } = req.body
    if (!text) {
      return res.status(400).json({ error: "Text is required" })
    }
    const result = await explainText(text, { language })
    return res.json({ ok: true, result })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  explainController,
}
