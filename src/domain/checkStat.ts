import type { CheckStat } from '@/api'
import { roundUp } from '@/helpers/roundUp'

function convertSuccessToPercentage(check: CheckStat) {
  return `${Math.round(check.success * 100)}%`
}

function convertToMillis(stat: CheckStat): CheckStat {
  return {
    ...stat,
    avg: roundUp(stat.avg / 1000),
    p95: roundUp(stat.p95 / 1000),
    p99: roundUp(stat.p99 / 1000)
  }
}

export { convertSuccessToPercentage, convertToMillis }
