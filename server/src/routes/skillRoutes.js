const express = require("express")
const { skillController } = require("../controllers/skillController")

const router = express.Router()

router.post("/", skillController)

module.exports = router
 