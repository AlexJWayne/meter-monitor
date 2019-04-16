import * as particle from "./particle"

import db from "./database"

export async function logData(): Promise<void> {
  const date = new Date()

  let data: string
  try {
    const batLvl = await particle.getVarNumber("batLvl", 2)
    const slrLvl = await particle.getVarNumber("slrLvl", 2)
    const power = await particle.getVarBool("power")
    const pattern = await particle.getVarNumber("pattern")

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
  setInterval(logData, 5 * 60 * 1000)
}
