import * as React from "react"

import { Entry, Pt } from "@shared/types"
import startTime from "./start-time"

const MIN = 2400
const MAX = 3100
const TIME_WIDTH = 24 * 60 * 60 * 1000

const width = 1000
const height = 300

function formatPoints(pts: Pt[]): string {
  return pts.map(pt => [pt.x, pt.y].join(",")).join(" ")
}

function getX(date: Date | string | number): number {
  const msAgo = new Date(date).getTime() - startTime().getTime()
  return width * (msAgo / TIME_WIDTH)
}

function GraphLine({
  entries,
  name,
}: {
  entries: Entry[]
  name: "batLvl" | "slrLvl"
}): any {
  const pts: Pt[] = []

  let awake: boolean = true

  for (const entry of entries) {
    const start = startTime()

    const msAgo = start.getTime() - new Date(entry.date).getTime()
    const x = getX(entry.date)

    let val = entry[name] || 0
    val = (height * (val - MIN)) / (MAX - MIN)

    if (val > 0 && !awake) {
      pts.push({ x, y: height })
      awake = true
    }

    if (val <= 0 && awake) {
      const lastPt = pts[pts.length - 1]
      if (lastPt) pts.push({ x: lastPt.x, y: height })
      awake = false
    }

    pts.push({ x, y: height - val })
  }

  return <polyline points={formatPoints(pts)} className={name} />
}

function HorizontalLines() {
  const result = []
  for (let i = 0; i < MAX - MIN; i += 100) {
    const y = height - (i / (MAX - MIN)) * height
    result.push(
      <line
        key={`${i}-line`}
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        className="hour-line"
      />,
      <text key={`${i}-text`} x={10} y={y - 5} className="hour-value">
        {MIN + i}
      </text>,
    )
  }
  return <g>{result}</g>
}

function HourLines() {
  const start = startTime()

  const sinceHour = start.getMinutes() * 60 * 1000 + start.getSeconds() * 1000

  const hour = 60 * 60 * 1000
  const elements = []
  for (let i = 0; i < 24; i++) {
    const x = (width * i) / 24

    let name = i.toString()

    let hour24 = i + 5
    if (hour24 > 24) hour24 -= 24
    if (hour24 > 12) name = `${hour24 - 12}p`
    else if (hour24 == 12) name = "12p"
    else if (hour24 == 0) name = "12a"
    else name = `${hour24}a`

    elements.push(
      <line
        key={`${i}-line`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        className="hour-line"
      />,
      <text key={`${i}-text`} x={x + 2} y={15} className="hour-value">
        {name}
      </text>,
    )
  }

  return <g>{elements}</g>
}

function LEDsOn({ entries }: { entries: Entry[] }) {
  const sliceWidth = ((11 * 60 * 1000) / TIME_WIDTH) * width
  return (
    <g>
      {entries.map(entry =>
        entry.power ? (
          <rect
            key={entry._id}
            x={getX(entry.date)}
            y={0}
            width={sliceWidth}
            height={height}
            className="leds-on"
          />
        ) : null,
      )}
    </g>
  )
}

export default function Graph({ entries }: { entries: Entry[] }) {
  return (
    <svg
      className="graph"
      viewBox={[0, 0, width, height].join(" ")}
      style={{ width, height }}
    >
      <LEDsOn entries={entries} />
      <HourLines />
      <HorizontalLines />
      <GraphLine entries={entries} name="batLvl" />
      <GraphLine entries={entries} name="slrLvl" />
    </svg>
  )
}
