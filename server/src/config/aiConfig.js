const apiProvider = (process.env.AI_PROVIDER || "auto").toLowerCase()
const openaiApiKey = process.env.OPENAI_API_KEY || ""
const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini"

module.exports = {
  apiProvider,
  openaiApiKey,
  openaiModel,
}
