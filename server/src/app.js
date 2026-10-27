const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")

const ocrRoutes = require("./routes/ocrRoutes")
const explainRoutes = require("./routes/explainRoutes")
const skillRoutes = require("./routes/skillRoutes")
const { errorMiddleware } = require("./middlewares/errorMiddleware")

const app = express()

app.use(cors())
app.use(express.json({ limit: "2mb" }))

const uploadDir = path.join(__dirname, "..", "uploads")
const upload = multer({ dest: uploadDir })

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "up" })
})

app.use("/api/ocr", upload.single("image"), ocrRoutes)
app.use("/api/explain", explainRoutes)
app.use("/api/skills", skillRoutes)

app.use(errorMiddleware)

module.exports = app
