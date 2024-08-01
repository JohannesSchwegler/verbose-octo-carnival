// eslint-disable-next-line no-undef
const { v4 } = require('uuid')

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

const asc = (arr) => arr.sort((a, b) => a - b)

const sum = (arr) => arr.reduce((a, b) => a + b, 0)

const mean = (arr) => sum(arr) / arr.length

const quantile = (arr, q) => {
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

// eslint-disable-next-line no-undef
module.exports = () => {
  const data = { checks: [], check_stats: [] }
  console.log('please wait while I create a ton of random data..')
  for (let i = 0; i < 20; i++) {
    const id = v4()
    const type = getRandomInt(2) === 1 ? 'API' : 'BROWSER'
    const checkStats = []
    let bucketValues = []
    const hourlyBuckets = []
    const startingDate = new Date()
    let firstHour = startingDate.getHours()
    for (let j = 0; j < 30000; j++) {
      const timestamp = startingDate - j * 30000
      const responseTime = getRandomInt(1000)
      const result = { checkId: id, success: getRandomInt(2), timestamp, responseTime }
      checkStats.push(result)
      bucketValues.push(result)
      const currentHour = new Date(timestamp)
      if (currentHour.getHours() !== firstHour) {
        firstHour = currentHour.getHours()
        currentHour.setHours(firstHour, 0, 0, 0)
        const bucket = {
          checkId: id,
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
    const check = { id, name: `Check ${i}`, type }
    check.success = mean(checkStats.map((checkStat) => checkStat.success))
    check.avg = mean(checkStats.map((checkStat) => checkStat.responseTime))
    check.p95 = quantile(
      checkStats.map((checkStat) => checkStat.responseTime),
      0.95
    )
    check.p99 = quantile(
      checkStats.map((checkStat) => checkStat.responseTime),
      0.99
    )
    data.checks.push(check)
    data.check_stats.push(...hourlyBuckets)
  }
  console.log('thanks :-)')
  return data
}
