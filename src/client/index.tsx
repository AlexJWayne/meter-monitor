import * as React from "react"
import * as ReactDOM from "react-dom"

import { Entry } from "@shared/types"
import Graph from "./graph"
import startTime from "./start-time"

class App extends React.Component<{}, { entries: Entry[]; auth: boolean }> {
  passwordField: React.RefObject<HTMLInputElement>

  constructor(props: {}) {
    super(props)
    this.passwordField = React.createRef()
    this.state = { entries: [], auth: false }

    setInterval(() => this.poll(), 60 * 1000)
    this.poll()
    this.auth()
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

  async auth(password?: string | null) {
    const res = await fetch("/auth", {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    })
    const json = await res.json()
    this.setState({ auth: json.authorized })
  }

  render() {
    const current = this.state.entries[0]
    return (
      <div>
        <h2>Currently</h2>
        <ul>
          <li>
            {current && current.awake
              ? "Awake: Sculpture has power"
              : "Asleep: battery too low"}
          </li>
          <li>LEDs: {current && current.power ? "ON!" : "off"}</li>
          {current && current.power && <li>pattern: {current.pattern}</li>}
          <li>batLvl: {current && current.batLvl}</li>
          <li>slrLvl: {current && current.slrLvl}</li>
          <li>As of: {current && new Date(current.date).toLocaleString()}</li>
          <li>
            {this.state.auth ? (
              <em>AUTHORIZED</em>
            ) : (
              <React.Fragment>
                <input
                  ref={this.passwordField}
                  type="text"
                  placeholder="password"
                />
                <button
                  onClick={() => this.auth(this.passwordField.current.value)}
                >
                  Login
                </button>
              </React.Fragment>
            )}
          </li>
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
