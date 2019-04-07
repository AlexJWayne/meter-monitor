import * as express from "express"

const app = express()

app.get("/", (_req, res) => {
  res.send("WIP")
})

export default function server() {
  app.listen(process.env.PORT || 3000)
}
