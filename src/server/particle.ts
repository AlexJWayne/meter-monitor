import Particle from "particle-api-js"
import delay from "./delay"

const particle = new Particle()
let token: string

export async function auth() {
  const response = await particle.login({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  })

  token = response.body.access_token
}

export async function getVarNumber(
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

export async function getVarBool(name: string): Promise<boolean> {
  const response = await particle.getVariable({
    auth: token,
    deviceId: process.env.DEVICE_ID,
    name,
  })
  return response.body.result
}

export async function callFunction(
  name: string,
  argument: number,
): Promise<number> {
  const response = await particle.callFunction({
    auth: token,
    deviceId: process.env.DEVICE_ID,
    name,
    argument,
  })
  return response.body.return_value
}
