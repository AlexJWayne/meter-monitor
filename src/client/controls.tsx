import React from "react"
import _ from "lodash"

import { Entry } from "@shared/types"

type Props = {
  current: Entry
  loading: boolean
  numPatterns: number
  setPower: (power: boolean) => any
  setPattern: (patternIdx: number) => any
}

export default function Controls({
  current,
  loading,
  numPatterns,
  setPower,
  setPattern,
}: Props) {
  if (!current) return null

  return (
    <div className="controls">
      {loading ? <div>Loading…</div> : <div>&nbsp;</div>}
      <div>
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
      <div>
        {_.times(numPatterns, i => (
          <div
            key={i}
            className={
              "button " +
              (current.power && current.pattern == i ? "selected" : "")
            }
            onClick={() => setPattern(i)}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  )
}
