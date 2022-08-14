import { SortedArraySet } from "../sorted_array.js";


describe("SortedArraySet", () => {
    describe("add", () => {
        describe("does not add if already in, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            const cases: Array<[number, number]> = [[1, 1], [3, 3], [2, 3]]
            test.each(cases)("add %d result of add again %d expected max %d", (valueToAdd, expectedMax) => {
                expect(sortedArraySet.add(valueToAdd)).toEqual(valueToAdd)
                expect(sortedArraySet.add(valueToAdd)).toBeUndefined()
                expect(sortedArraySet.getMax()).toEqual(expectedMax)
            })
        })
    })

    describe("delete", () => {
        describe("does not delete if not in, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            for (let i = 1; i <= 3; i++) {
                sortedArraySet.add(i)
            }

            const cases: Array<[number, number | undefined]> = [[1, 3], [3, 2], [2, undefined]]
            test.each(cases)("delete %d result of delete again %d expected max %d", (valueToDelete, expectedMax) => {
                expect(sortedArraySet.delete(valueToDelete)).toEqual(valueToDelete)
                expect(sortedArraySet.delete(valueToDelete)).toBeUndefined()
                expect(sortedArraySet.getMax()).toEqual(expectedMax)
            })
        })
    })

    describe("has", () => {
        describe("correctly asserts that an item is in", () => {
            const sortedArraySet = new SortedArraySet<number>()

            for (let i = 1; i <= 3; i++) {
                sortedArraySet.add(i)
            }

            const cases: Array<number> = [1, 2, 3]
            test.each(cases)("%d exists", (value) => {
                expect(sortedArraySet.has(value)).toBeTruthy()
            })

            test.each(cases)("%d does not exist if deleted", (value) => {
                sortedArraySet.delete(value)
                expect(sortedArraySet.has(value)).toBeFalsy()
            })
        })
    })

    describe("select", () => {
        describe("correctly checks for boundaries", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(1)

            const cases: Array<number> = [1, -1]
            test.each(cases)("index %d is out of bounds of array with length 1", (index) => {
                expect(sortedArraySet.select(index)).toBeUndefined()
            })
        })
        describe("returns the expected value", () => {
            const sortedArraySet = new SortedArraySet<number>()

            for (let i = 3; i >= 1; i--) {
                sortedArraySet.add(i)
            }

            const cases: Array<[number, number]> = [[0, 1], [1, 2], [2, 3]]
            test.each(cases)("index %d contains value %d", (index, expectedValue) => {
                expect(sortedArraySet.select(index)).toEqual(expectedValue)
            })
        })
    })

    describe("remove", () => {
        describe("does not remove if out of bounds, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            for (let i = 3; i >= 1; i--) {
                sortedArraySet.add(i)
            }

            const cases: Array<[number | undefined, number]> = [[3, 2], [2, 1], [1, 0], [undefined, 0]]
            test.each(cases)("index %d contains value %d", (expectedValue, index) => {
                expect(sortedArraySet.getMax()).toEqual(expectedValue)
                expect(sortedArraySet.remove(index)).toEqual(expectedValue)
            })
        });
    })
})