import type { Check } from '@/api'
import { convertSuccessToPercentage } from './check'

import { describe, it, expect } from 'vitest'

describe('check formatting', () => {
  const check: Check = {
    id: '1',
    avg: 510,
    p95: 892,
    p99: 912,
    success: 0.91,
    name: 'Check 1',
    type: 'API'
  }
  it('should format the success rate to a percentage', () => {
    expect(convertSuccessToPercentage(check)).toBe('91%')
  })
})
