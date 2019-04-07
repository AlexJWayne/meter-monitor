require("dotenv").config()

import poll from "./poll"
import db from "./database"

async function boot() {
  await db.connect()
  poll()
}

boot()
