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
  const pts: Pt[] = []

  let awake: boolean = true

  for (const entry of entries) {
    const msAgo = Date.now() - new Date(entry.date).getTime()
    const x = width - width * (msAgo / DAY)

    let val = entry[key] || 0
    val = (height * (val - MIN)) / (MAX - MIN)

    if (val > 0 && !awake) {
      pts.push({ x, y: height })
      awake = true
    }

    if (val <= 0 && awake) {
      pts.push({ x: pts[pts.length - 1].x, y: height })
      awake = false
    }

    pts.push({ x, y: height - val })
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
