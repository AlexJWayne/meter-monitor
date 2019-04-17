import { useState, useEffect } from "react"

import apiFetch from "../api-fetch"

// Login or get login status.
async function fetchAuth(password?: string): Promise<boolean> {
  const res = await apiFetch("/auth", {
    method: "POST",
    jsonBody: { password },
  })
  const json = await res.json()
  return (json as { authorized: boolean }).authorized
}

// Authorization hook.
export default function useAuth(): [
  boolean,
  (password?: string) => Promise<void>
] {
  // Auth state
  const [auth, setAuth] = useState(false)

  // Function that authorizes, and then saves the result as state.
  const authorize = async (password?: string) =>
    setAuth(await fetchAuth(password))

  // Authorize on component load
  useEffect(() => {
    authorize()
  }, [])

  // Return state and authorize() function
  return [auth, authorize]
}
