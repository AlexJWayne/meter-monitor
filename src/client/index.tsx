import * as React from "react"
import * as ReactDOM from "react-dom"

import { Entry } from "@shared/types"
import Graph from "./graph"

class App extends React.Component<{}, { entries: Entry[] }> {
  constructor(props: {}) {
    super(props)
    this.state = { entries: [] }
    this.poll()
  }

  async poll() {
    const response = await fetch("/entries")
    this.setState({ entries: await response.json() })
    setInterval(() => this.poll(), 60 * 1000)
  }

  render() {
    return (
      <div>
        <Graph entries={this.state.entries} />
        <table>
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
        </table>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
