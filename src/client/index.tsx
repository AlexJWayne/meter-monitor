import * as React from "react"
import * as ReactDOM from "react-dom"

import { Entry } from "@shared/types"
import Controls from "./controls"
import Graph from "./graph"
import startTime from "./start-time"

type State = {
  entries: Entry[]
  auth: boolean
  loading: boolean
}

class App extends React.Component<{}, State> {
  passwordField: React.RefObject<HTMLInputElement>

  constructor(props: {}) {
    super(props)
    this.passwordField = React.createRef()

    this.state = {
      entries: [],
      auth: false,
      loading: false,
    }

    this.poll()
    this.auth()
  }

  fetch(
    url: string,
    options: {
      method?: "GET" | "POST"
      jsonBody?: any
      body?: string
    } = {},
  ) {
    const { jsonBody, ...otherOptions } = options

    const promise = fetch(url, {
      cache: "no-cache",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: jsonBody ? JSON.stringify(jsonBody) : options.body,
      ...otherOptions,
    })

    return promise
  }

  async poll() {
    const response = await this.fetch("/entries")
    this.setState({ entries: await response.json() })
    setTimeout(() => this.poll(), 60 * 1000)
  }

  async setPower(power: boolean) {
    if (this.state.loading) return

    const jsonBody = power
      ? { name: "startPattern", argument: 0 }
      : { name: "turnOff" }

    this.setState({ loading: true })
    await this.fetch("/call", { method: "POST", jsonBody })
    await this.poll()
    this.setState({ loading: false })
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
    const res = await this.fetch("/auth", {
      method: "POST",
      jsonBody: { password },
    })
    const json = await res.json()
    this.setState({ auth: json.authorized })
  }

  render() {
    const current = this.state.entries[0]
    if (!current) return null

    return (
      <div className={this.state.loading ? "loading" : ""}>
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

        {current.awake && this.state.auth && (
          <Controls
            current={current}
            setPower={power => this.setPower(power)}
            loading={this.state.loading}
          />
        )}

        <h2>Today</h2>
        <Graph entries={this.entriesForDaysAgo(0)} />

        <h2>Yesterday</h2>
        <Graph entries={this.entriesForDaysAgo(1)} />

        <h2>The day before yesterday</h2>
        <Graph entries={this.entriesForDaysAgo(2)} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
