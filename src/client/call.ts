import apiFetch from "./api-fetch"

export default async function call(
  name: string,
  {
    argument,
    loading,
    setLoading,
  }: {
    argument?: number | string
    loading: boolean
    setLoading: (isLoading: boolean) => any
  },
): Promise<void> {
  if (loading) return

  setLoading(true)
  const result = await apiFetch("/call", {
    method: "POST",
    jsonBody: { name, argument },
  })
  setLoading(false)
}
