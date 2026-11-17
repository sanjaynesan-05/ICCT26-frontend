/**
 * Backend warm-up
 *
 * The backend runs on a host that sleeps after ~15 minutes idle and needs
 * 30–60s to wake up. We ping /health as soon as the site opens (and again on
 * the Registration page) so the server is awake long before anyone presses
 * Submit. Registration can also wait on it before sending the form.
 */

import { useEffect, useState } from 'react'

export type BackendStatus = 'idle' | 'waking' | 'awake' | 'unreachable'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://icct26-backend.onrender.com'
const HEALTH_URL = `${API_BASE_URL}/health`

const REQUEST_TIMEOUT_MS = 20_000 // a single ping may hang while the server boots
const RETRY_DELAY_MS = 4_000
const MAX_WAKE_MS = 90_000 // give up (status: unreachable) after this long
const STALE_AFTER_MS = 10 * 60_000 // re-ping if the last success is older than this

let status: BackendStatus = 'idle'
let lastAwakeAt = 0
let inFlight: Promise<boolean> | null = null
const listeners = new Set<(s: BackendStatus) => void>()

const setStatus = (next: BackendStatus) => {
  status = next
  listeners.forEach((fn) => fn(next))
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const pingOnce = async (): Promise<boolean> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(HEALTH_URL, { method: 'GET', cache: 'no-store', signal: controller.signal })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

const isFresh = () => status === 'awake' && Date.now() - lastAwakeAt < STALE_AFTER_MS

/**
 * Start (or join) a warm-up. Safe to call many times — only one ping loop runs.
 * Resolves true once the backend answers, false after MAX_WAKE_MS.
 */
export const warmUpBackend = (): Promise<boolean> => {
  if (isFresh()) return Promise.resolve(true)
  if (inFlight) return inFlight

  inFlight = (async () => {
    // Only show "waking" UI if we don't already believe it's up
    if (status !== 'awake') setStatus('waking')
    const startedAt = Date.now()

    while (Date.now() - startedAt < MAX_WAKE_MS) {
      if (await pingOnce()) {
        lastAwakeAt = Date.now()
        setStatus('awake')
        return true
      }
      await sleep(RETRY_DELAY_MS)
    }

    setStatus('unreachable')
    return false
  })().finally(() => {
    inFlight = null
  })

  return inFlight
}

/** Wait for the backend before a critical request (e.g. Submit). */
export const ensureBackendAwake = (): Promise<boolean> => warmUpBackend()

export const getBackendStatus = () => status

/** React hook: current backend status, re-rendering on change. */
export const useBackendStatus = (): BackendStatus => {
  const [current, setCurrent] = useState<BackendStatus>(status)
  useEffect(() => {
    listeners.add(setCurrent)
    setCurrent(status)
    return () => {
      listeners.delete(setCurrent)
    }
  }, [])
  return current
}
