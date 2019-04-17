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

export async function getVar(name: string): Promise<number | boolean> {
  const results: number[] = []
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
    argument: argument.toString(),
  })
  return response.body.return_value
}
