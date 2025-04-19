import { expect, test } from 'vitest'
import { groupBy } from './group-by.js'

test('groupBy', () => {
  const data = [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
    { id: 3, category: 'A' },
    { id: 4, category: 'C' },
    { id: 5, category: 'B' },
  ]

  const result = groupBy(data, (item) => item.category)

  const expected = {
    A: [
      { id: 1, category: 'A' },
      { id: 3, category: 'A' },
    ],
    B: [
      { id: 2, category: 'B' },
      { id: 5, category: 'B' },
    ],
    C: [{ id: 4, category: 'C' }],
  }

  expect(result).toEqual(expected)
})
