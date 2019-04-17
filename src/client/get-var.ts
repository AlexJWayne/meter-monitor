export default async function getVar(name: string): Promise<number | boolean> {
  const response = await fetch(`/var?name=${name}`)
  const json = await response.json()
  return json.value
}
