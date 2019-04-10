import * as React from "react"

import { Entry, Pt } from "@shared/types"

const MIN = 2400
const MAX = 3300
const DAY = 24 * 60 * 60 * 1000

const width = 1000
const height = 500

function formatPoints(pts: Pt[]): string {
  return pts.map(pt => [pt.x, pt.y].join(",")).join(" ")
}

function line(entries: Entry[], key: "batLvl" | "slrLvl"): any {
  let lastEntry: Entry | null
  const pts: Pt[] = []

  for (const entry of entries) {
    const msAgo = Date.now() - new Date(entry.date).getTime()

    let val = entry[key] || 0
    val = (height * (val - MIN)) / (MAX - MIN)

    const x = width - width * (msAgo / DAY)

    if (lastEntry && !lastEntry[key] && val) {
      pts.push({ x, y: 0 })
    }

    pts.push({ x, y: height - val })

    lastEntry = entry
  }

  return <polyline points={formatPoints(pts)} className={key} />
}

export default function Graph({ entries }: { entries: Entry[] }) {
  return (
    <svg
      className="graph"
      viewBox={[0, 0, width, height].join(" ")}
      style={{ width, height }}
    >
      {line(entries, "slrLvl")}
      {line(entries, "batLvl")}
    </svg>
  )
}
