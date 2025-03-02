import { describe, expect, test } from 'vitest'
import { utils } from './utils.js'

describe.only('increaseIndexSensitivity', () => {
    test('correctly transforms values', () => {
        const transformed = utils.increaseIndexSensitivity({
            index: 50,
            rangeStart: 20,
            rangeEnd: 80,
        })
        expect(transformed).toBe(50)
    })

    test('correctly increases index', () => {
        const transformed = utils.increaseIndexSensitivity({
            index: 50,
            rangeStart: 20,
            rangeEnd: 80,
            increaseIndexBy: 20,
        })
        expect(transformed).toBe(70)
    })

    test('throws an error for out of bounds index', () => {
        expect(() => {
            utils.increaseIndexSensitivity({
                index: 105,
                rangeStart: 20,
                rangeEnd: 80,
            })
        }).toThrow('Index must be between 0 and 100')

        expect(() => {
            utils.increaseIndexSensitivity({
                index: -5,
                rangeStart: 20,
                rangeEnd: 80,
            })
        }).toThrow('Index must be between 0 and 100')
    })

    test('handles values below rangeStart', () => {
        const transformed = utils.increaseIndexSensitivity({
            index: 10,
            rangeStart: 20,
            rangeEnd: 80,
        })
        expect(transformed).toBe(0) // Expected to be the minimum value
    })

    test('handles values above rangeEnd', () => {
        const transformed = utils.increaseIndexSensitivity({
            index: 85,
            rangeStart: 20,
            rangeEnd: 80,
        })
        expect(transformed).toBe(100) // Expected to be the maximum value
    })
})
