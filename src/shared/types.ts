export type Entry = {
  _id: string
  date: Date
  awake: boolean
  batLvl?: number
  slrLvl?: number
  power?: boolean
}

export type Pt = {
  x: number
  y: number
}
