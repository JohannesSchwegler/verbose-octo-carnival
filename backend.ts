import { v4 } from 'uuid'
import Hapi from '@hapi/hapi'

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

const asc = (arr: number[]) => arr.sort((a, b) => a - b)
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const mean = (arr: number[]) => sum(arr) / arr.length

const quantile = (arr: number[], q: number) => {
  const sorted = asc(arr)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

type Stat = { success: number; avg: number; p95: number; p99: number; timestamp?: number }
type Check = { id: string; type: 'API' | 'BROWSER'; name: string } & Stat

/**
 * Generates a bunch of mocked checks and associated buckets
 */
const generateChecks = (): {
  checks: Map<string, Check>
  checkStats: Map<string, Stat[]>
} => {
  const checks = new Map<string, Check>()
  const checkBuckets = new Map<string, Stat[]>()

  console.log('please wait while I create a ton of random data..')
  for (let i = 0; i < 20; i++) {
    const id = v4()
    const type = getRandomInt(2) === 1 ? 'API' : 'BROWSER'
    const checkStats: {
      checkId: string
      success: number
      timestamp: number
      responseTime: number
    }[] = []
    let bucketValues: {
      checkId: string
      success: number
      timestamp: number
      responseTime: number
    }[] = []
    const hourlyBuckets: Stat[] = []
    const startingDate = new Date()
    let firstHour = startingDate.getHours()
    for (let j = 0; j < 30000; j++) {
      const timestamp = startingDate.valueOf() - j * 30000
      const responseTime = getRandomInt(1000)
      const result = { checkId: id, success: getRandomInt(2), timestamp, responseTime }
      checkStats.push(result)
      bucketValues.push(result)
      const currentHour = new Date(timestamp)
      if (currentHour.getHours() !== firstHour) {
        firstHour = currentHour.getHours()
        currentHour.setHours(firstHour, 0, 0, 0)
        const bucket = {
          success: mean(bucketValues.map((checkStat) => checkStat.success)),
          avg: mean(checkStats.map((checkStat) => checkStat.responseTime)),
          p95: quantile(
            checkStats.map((checkStat) => checkStat.responseTime),
            0.95
          ),
          p99: quantile(
            checkStats.map((checkStat) => checkStat.responseTime),
            0.99
          ),
          timestamp: currentHour.getTime()
        }
        bucketValues = []
        hourlyBuckets.push(bucket)
      }
    }
    checks.set(id, {
      id,
      name: `Check ${i}`,
      type,
      success: mean(checkStats.map((checkStat) => checkStat.success)),
      avg: mean(checkStats.map((checkStat) => checkStat.responseTime)),
      p95: quantile(
        checkStats.map((checkStat) => checkStat.responseTime),
        0.95
      ),
      p99: quantile(
        checkStats.map((checkStat) => checkStat.responseTime),
        0.99
      )
    })
    checkBuckets.set(id, hourlyBuckets)
  }
  console.log('thanks :-)')
  return {
    checks,
    checkStats: checkBuckets
  }
}

const initServer = async () => {
  const { checks, checkStats } = generateChecks()

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  /**
   * Returns a bunch of checks as a list.
   */
  server.route({
    method: 'GET',
    path: '/checks',
    handler: () => {
      return Array.from(checks.values())
    }
  })

  /**
   * Returns the buckets for a given check
   */
  server.route({
    method: 'GET',
    path: '/checks/{id}',
    handler: (request, h) => {
      const { id } = request.params
      if (!checkStats.has(id)) return h.response().code(404)

      return checkStats.get(id)
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

initServer()
