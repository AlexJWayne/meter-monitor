// Make an HTTP request to the API.
export default async function apiFetch(
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
