import { useEffect, useState } from 'react'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

const partsUntil = (target: number): CountdownParts => {
  const diff = target - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: false,
  }
}

/** Ticks every second until `isoDate`. */
export const useCountdown = (isoDate: string): CountdownParts => {
  const target = new Date(isoDate).getTime()
  const [parts, setParts] = useState(() => partsUntil(target))

  useEffect(() => {
    setParts(partsUntil(target))
    const id = setInterval(() => setParts(partsUntil(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return parts
}
