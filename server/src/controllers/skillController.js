const { mapSkills } = require("../services/skillMapService")

async function skillController(req, res, next) {
  try {
    const { text } = req.body
    if (!text) {
      return res.status(400).json({ error: "Text is required" })
    }
    const result = await mapSkills(text)
    return res.json({ ok: true, result })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  skillController,
}
