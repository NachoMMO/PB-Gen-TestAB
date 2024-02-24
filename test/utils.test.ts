import { afterEach, describe, expect, it } from 'bun:test'
import { getFromSS, parseMetrics } from '../src/sharedCode/global/utils'

describe('Utils Test Cases', () => {
  it('should get value from sessionStorage', () => {
    const key = 'key'
    const value = 'value'
    sessionStorage.setItem(key, JSON.stringify(value))
    const result = getFromSS(key)
    expect(result).toEqual(value)
  });
  it('should parse metrics', () => {
    const metrics = ['metric1', 'metric2', 'metric3']
    const parsedMetrics = parseMetrics(metrics)
    expect(parsedMetrics).toEqual({
      metric1: 'metric1',
      metric2: 'metric2',
      metric3: 'metric3'
    })
  });
});