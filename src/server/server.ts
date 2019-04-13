import express from "express"
import bodyParser from "body-parser"
import cookieSession from "cookie-session"

import db from "./database"

const app = express()

app.use(express.static("dist"))
app.use(bodyParser.json())
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.CONTROLS_PASSWORD],
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  }),
)

app.get("/entries", async (_req, res) => {
  res.json(await db.getEntries())
})

app.post("/auth", (req, res) => {
  if (req.body.password === process.env.CONTROLS_PASSWORD) {
    req.session.authorized = true
  }

  res.json({ authorized: !!req.session.authorized })
})

export default function server() {
  app.listen(process.env.PORT || 3001)
}
