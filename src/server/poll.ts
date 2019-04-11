import * as fs from "fs"
import * as Particle from "particle-api-js"
import chalk from "chalk"

import db from "./database"

const particle = new Particle()
let token: string

async function auth() {
  const response = await particle.login({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  })

  token = response.body.access_token
}

async function getVarNumber(
  name: string,
  samples: number = 1,
): Promise<number> {
  const results: number[] = []
  for (let i = 0; i < samples; i++) {
    const response = await particle.getVariable({
      auth: token,
      deviceId: process.env.DEVICE_ID,
      name,
    })
    results.push(response.body.result)
  }

  return Math.round(results.reduce((val, sum) => sum + val, 0) / samples)
}

async function getVarBool(name: string): Promise<boolean> {
  const response = await particle.getVariable({
    auth: token,
    deviceId: process.env.DEVICE_ID,
    name,
  })
  return response.body.result
}

async function logData() {
  const date = new Date()

  let data: string
  try {
    const batLvl = await getVarNumber("batLvl", 4)
    const slrLvl = await getVarNumber("slrLvl", 4)
    const power = await getVarBool("power")
    const pattern = await getVarNumber("pattern")

    // Awake
    db.logData(date, true, batLvl, slrLvl, power, pattern)
  } catch (e) {
    // Asleep
    db.logData(date, false)
  }
}

export default async function poll() {
  await auth()
  logData()
  setInterval(logData, 5 * 60 * 1000)
}
