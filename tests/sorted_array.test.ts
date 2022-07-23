import { SortedArraySet } from "../src/ds/sorted_array";


describe("SortedArraySet", () => {
    describe("add", () => {
        it("does not add if already in, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            expect(sortedArraySet.add(1)).toEqual(1)
            expect(sortedArraySet.getMax()).toEqual(1)
            expect(sortedArraySet.add(1)).toBeUndefined()

            expect(sortedArraySet.add(3)).toEqual(3)
            expect(sortedArraySet.add(3)).toBeUndefined()
            expect(sortedArraySet.getMax()).toEqual(3)

            expect(sortedArraySet.add(2)).toEqual(2)
            expect(sortedArraySet.getMax()).toEqual(2)
            expect(sortedArraySet.add(2)).toBeUndefined()
        })
    })

    describe("delete", () => {
        it("does not delete if not in, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(1)
            sortedArraySet.add(2)
            sortedArraySet.add(3)

            expect(sortedArraySet.delete(1)).toEqual(1)
            expect(sortedArraySet.delete(1)).toBeUndefined()

            expect(sortedArraySet.getMax()).toEqual(3)
            expect(sortedArraySet.delete(3)).toEqual(3)
            expect(sortedArraySet.delete(3)).toBeUndefined()

            expect(sortedArraySet.getMax()).toEqual(2)
            expect(sortedArraySet.delete(2)).toEqual(2)
            expect(sortedArraySet.delete(2)).toBeUndefined()

            expect(sortedArraySet.getMax()).toBeUndefined()
        })
    })

    describe("has", () => {
        it("correctly asserts that an item is in", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(1)
            sortedArraySet.add(2)
            sortedArraySet.add(3)

            expect(sortedArraySet.has(1)).toBeTruthy()
            expect(sortedArraySet.has(2)).toBeTruthy()
            expect(sortedArraySet.has(3)).toBeTruthy()

            sortedArraySet.delete(1)
            expect(sortedArraySet.has(1)).toBeFalsy()

            sortedArraySet.delete(2)
            expect(sortedArraySet.has(2)).toBeFalsy()

            sortedArraySet.delete(3)
            expect(sortedArraySet.has(3)).toBeFalsy()
        })
    })


    describe("select", () => {
        it("correctly checks for boundaries", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(1)

            expect(sortedArraySet.select(-1)).toBeUndefined()
            expect(sortedArraySet.select(1)).toBeUndefined()
        })
        it("returns the expected value", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(3)
            sortedArraySet.add(2)
            sortedArraySet.add(1)

            expect(sortedArraySet.select(0)).toEqual(1)
            expect(sortedArraySet.select(1)).toEqual(2)
            expect(sortedArraySet.select(2)).toEqual(3)
        })
    })

    describe("remove", () => {
        it("does not remove if not in, updates the maximum element correctly", () => {
            const sortedArraySet = new SortedArraySet<number>()

            sortedArraySet.add(1)
            sortedArraySet.add(2)
            sortedArraySet.add(3)

            expect(sortedArraySet.getMax()).toEqual(3)
            expect(sortedArraySet.remove(0)).toEqual(1)
            expect(sortedArraySet.remove(2)).toBeUndefined()

            expect(sortedArraySet.remove(1)).toEqual(3)
            expect(sortedArraySet.getMax()).toEqual(2)

            expect(sortedArraySet.remove(0)).toEqual(2)
            expect(sortedArraySet.remove(0)).toBeUndefined()
            expect(sortedArraySet.getMax()).toBeUndefined()
        });
    })
})