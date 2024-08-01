import type { Check } from '@/api'

function convertSuccessToPercentage(check: Check) {
  return `${Math.round(check.success * 100)}%`
}

function formatP95(check: Check) {
  return `${Math.round(check.p95)}ms`
}
function formatP99(check: Check) {
  return `${Math.round(check.p99)}ms`
}
function formatAvg(check: Check) {
  return `${Math.round(check.avg)}ms`
}

export { convertSuccessToPercentage, formatP95, formatP99, formatAvg }
