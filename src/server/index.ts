require("dotenv").config()

import poll from "./poll"
import db from "./database"
import server from "./server"

async function boot() {
  await db.connect()
  server()
  poll()
}

boot()
