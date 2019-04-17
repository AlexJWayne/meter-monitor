import { useState, useEffect } from "react"
import getVar from "../get-var"

export default function useNumPatterns() {
  const [numPatterns, setNumPatterns] = useState(0)

  async function getNumPatterns() {
    setNumPatterns((await getVar("numPatterns")) as number)
  }

  useEffect(() => {
    getNumPatterns()
  }, [])

  return numPatterns
}
