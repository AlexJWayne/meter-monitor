import * as React from "react"

import { Entry } from "@shared/types"

type Props = {
  current: Entry
  setPower: (boolean) => void
  loading: boolean
}

export default function Controls({ current, setPower, loading }: Props) {
  if (!current) return null

  return (
    <div className="controls">
      {loading ? <div>Loading…</div> : <div>&nbsp;</div>}
      <div
        className={"button " + (current.power ? "" : "selected")}
        onClick={() => setPower(false)}
      >
        LEDs off
      </div>
      <div
        className={"button " + (current.power ? "selected" : "")}
        onClick={() => setPower(true)}
      >
        LEDs on
      </div>
    </div>
  )
}
