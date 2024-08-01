/**
 * Predefined function call to interact with the backend
 */

const BACKEND_URL = 'http://localhost:3000'

const API_URLS = {
  CHECKS: `${BACKEND_URL}/checks`,
  STATS_BY_ID: (checkId: string) => `${BACKEND_URL}/checks/${checkId}`
} as const

type Check = {
  id: string
  name: string
  type: 'BROWSER' | 'API'
  success: number
  avg: number
  p95: number
  p99: number
}

type CheckStat = Omit<Check, 'id' | 'name' | 'type'> & { timestamp: number }

async function getChecks(): Promise<Check[]> {
  return fetch(`${BACKEND_URL}/checks`).then((statsResponse) => statsResponse.json())
}

async function getCheckStats(checkId: string): Promise<CheckStat[]> {
  return fetch(`${BACKEND_URL}/checks/${checkId}`).then((statsResponse) => statsResponse.json())
}

const API = {
  getChecks,
  getCheckStats
}

export { API, type Check, type CheckStat, API_URLS }
