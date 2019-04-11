import * as React from "react"
import * as ReactDOM from "react-dom"

import { Entry } from "@shared/types"
import Graph from "./graph"
import startTime from "./start-time"

class App extends React.Component<{}, { entries: Entry[] }> {
  constructor(props: {}) {
    super(props)
    this.state = { entries: [] }

    setInterval(() => this.poll(), 60 * 1000)
    this.poll()
  }

  async poll() {
    const response = await fetch("/entries")
    this.setState({ entries: await response.json() })
  }

  entriesForDaysAgo(daysAgo: number): Entry[] {
    const start = startTime()

    const day = 24 * 60 * 60 * 1000
    const min = start.getTime() - day * daysAgo
    const max = min + day
    return this.state.entries
      .filter(entry => {
        const timestamp = new Date(entry.date).getTime()
        return min < timestamp && timestamp < max
      })
      .map(entry => ({
        ...entry,
        date: new Date(new Date(entry.date).getTime() + day * daysAgo),
      }))
  }

  render() {
    const current = this.state.entries[0]
    return (
      <div>
        <h2>Current</h2>
        <ul>
          <li>
            {current && current.awake
              ? "Awake: Sculpture has power"
              : "Asleep: battery too low"}
          </li>
          <li>{current && current.power ? "LEDs ON!" : "LEDs off"}</li>
          <li>batLvl: {current && current.batLvl}</li>
          <li>slrLvl: {current && current.slrLvl}</li>
        </ul>

        <h2>Today</h2>
        <Graph entries={this.entriesForDaysAgo(0)} />

        <h2>Yesterday</h2>
        <Graph entries={this.entriesForDaysAgo(1)} />

        <h2>The day before yesterday</h2>
        <Graph entries={this.entriesForDaysAgo(2)} />

        {/* <table>
          <tbody>
            <tr>
              <th>Date</th>
              <th>Awake</th>
              <th>batLvl</th>
              <th>slrLvl</th>
              <th>LEDs on</th>
            </tr>
            {this.state.entries.map((entry, i) => (
              <tr key={entry._id}>
                <td>{new Date(entry.date).toLocaleString()}</td>
                <td>{entry.awake ? "YES" : "no"}</td>
                <td>{entry.batLvl || ""}</td>
                <td>{entry.slrLvl || ""}</td>
                <td>{entry.power ? "LEDs ON!" : "off"}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
