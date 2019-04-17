import { useState, useRef, useEffect } from "react"

import apiFetch from "../api-fetch"
import { Entry } from "@shared/types"

// Last 1000 entries hook.
export default function useLatestEntries(): [Entry[], () => Promise<void>] {
  const [entries, setEntries] = useState([] as Entry[])

  // Get updates.
  async function poll() {
    const response = await apiFetch("/entries")
    setEntries(await response.json())
  }

  // Get data and begin polling. Cleanup interval when unloaded.
  const pollInterval = useRef(null as number)
  useEffect(() => {
    poll()
    pollInterval.current = window.setInterval(poll, 60 * 1000)

    // Cleanup
    return () => {
      pollInterval.current && clearInterval(pollInterval.current)
      pollInterval.current = null
    }
  }, [])

  return [entries, poll]
}
