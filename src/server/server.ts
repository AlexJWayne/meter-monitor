import * as express from "express"
import * as path from "path"

import db from "./database"

const app = express()

app.use(express.static("dist"))

app.get("/entries", async (_req, res) => {
  res.json(await db.getEntries())
})

export default function server() {
  app.listen(process.env.PORT || 3001)
}
