import React, { useRef, useState } from "react"
import ReactDOM from "react-dom"

import { Entry } from "@shared/types"
import Controls from "./controls"
import Graph from "./graph"
import startTime from "./start-time"
import apiFetch from "./api-fetch"
import useLatestEntries from "./hooks/use-latest-entries"
import useAuth from "./hooks/use-auth"
import call from "./call"
import useNumPatterns from "./hooks/use-num-patterns"

// Group entries into a 24 hour chunk from X days ago.
function entriesForDaysAgo(entries: Entry[], daysAgo: number): Entry[] {
  const start = startTime()

  const day = 24 * 60 * 60 * 1000
  const min = start.getTime() - day * daysAgo
  const max = min + day

  return entries
    .filter(entry => {
      const timestamp = new Date(entry.date).getTime()
      return min < timestamp && timestamp < max
    })
    .map(entry => ({
      ...entry,
      date: new Date(new Date(entry.date).getTime() + day * daysAgo),
    }))
}

function App() {
  // State
  const [entries, poll] = useLatestEntries()
  const [auth, authorize] = useAuth()
  const [loading, setLoading] = useState(false)
  const numPatterns = useNumPatterns()

  // Refs
  const passwordField: React.RefObject<HTMLInputElement> = useRef()

  // Set LED power status.
  async function setPower(power: boolean) {
    if (power) {
      setPattern(0) // turn on
    } else {
      await call("turnOff", { loading, setLoading })
      poll()
    }
  }

  // Set current pattern. Also will turn on LEDs of off.
  async function setPattern(patternIdx: number) {
    await call("startPattern", {
      argument: patternIdx,
      loading,
      setLoading,
    })
    poll()
  }

  // Render
  const current = entries[0]
  if (!current) return null

  return (
    <div className={loading ? "loading" : ""}>
      <h2>Currently</h2>
      <ul>
        <li>
          {current && current.awake ? "Awake" : "Asleep"} as of{" "}
          {current && new Date(current.date).toLocaleString()}
        </li>
      </ul>

      {current.awake && auth && (
        <Controls
          current={current}
          setPower={setPower}
          loading={loading}
          numPatterns={numPatterns}
          setPattern={setPattern}
        />
      )}

      <div>
        {current && current.awake && (
          <div className="button bat">BAT: {current.batLvl}</div>
        )}
        {current && current.awake && (
          <div className="button slr">SLR: {current.slrLvl}</div>
        )}
      </div>

      <h2>Today</h2>
      <Graph entries={entriesForDaysAgo(entries, 0)} />

      <h2>Yesterday</h2>
      <Graph entries={entriesForDaysAgo(entries, 1)} />

      <h2>The day before yesterday</h2>
      <Graph entries={entriesForDaysAgo(entries, 2)} />

      {!auth && (
        <div className="login">
          <input
            ref={passwordField}
            type="text"
            placeholder="password"
            onKeyPress={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter") {
                authorize(passwordField.current && passwordField.current.value)
              }
            }}
          />
          <button
            onClick={() => {
              authorize(passwordField.current && passwordField.current.value)
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
