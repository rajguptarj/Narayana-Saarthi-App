async function connectDb() {
  return {
    status: "skipped",
    message: "MongoDB not configured yet.",
  }
}

module.exports = {
  connectDb,
}
