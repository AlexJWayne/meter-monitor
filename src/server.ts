import * as express from "express"

import db from "./database"

const app = express()

app.get("/", async (_req, res) => {
  const entries = await db.getEntries()

  let html = "<table border='1'>"
  html += "<tr>"
  html += "<th>Date</th>"
  html += "<th>Awake</th>"
  html += "<th>batLvl</th>"
  html += "<th>slrLvl</th>"
  html += "<th>LEDs on</th>"
  html += "</tr>"

  entries.forEach((entry, i) => {
    html += "<tr>"
    html += `<td>${i == 0 ? "CURRENT" : entry.date.toLocaleString()}</td>`
    html += `<td>${entry.awake ? "YES" : "no"}</td>`
    html += `<td>${entry.batLvl || ""}</td>`
    html += `<td>${entry.slrLvl || ""}</td>`
    html += `<td>${entry.power ? "LEDs ON!" : "off"}</td>`
    html += "</tr>"
  })

  html += "</table>"
  res.send(html)
})

export default function server() {
  app.listen(process.env.PORT || 3001)
}
