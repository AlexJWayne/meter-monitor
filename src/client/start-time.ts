export default function startTime(): Date {
  const start = new Date()
  start.setHours(5)
  start.setMinutes(0)
  start.setSeconds(0)
  start.setMilliseconds(0)
  return start
}
