import * as particle from "./particle"

import db from "./database"

export async function logData(): Promise<void> {
  const date = new Date()

  let data: string
  try {
    const batLvl = (await particle.getVar("batLvl")) as number
    const slrLvl = (await particle.getVar("slrLvl")) as number
    const power = (await particle.getVar("power")) as boolean
    const pattern = (await particle.getVar("pattern")) as number

    // Awake
    await db.logData(date, true, batLvl, slrLvl, power, pattern)
  } catch (e) {
    // Asleep
    await db.logData(date, false)
  }
}

export default async function poll() {
  await particle.auth()
  logData()
  setInterval(logData, 10 * 60 * 1000)
}
