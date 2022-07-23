import {indexOf, defaultComparator} from "../src/utils/utils";

describe("Binary Search", () => {
    describe("indexOf", () => {
        it("returns the expected positions", () => {
            let arr: Array<number> = [];

            // if it is empty, then what is to be added should go to the zeroth position
            expect(indexOf<number>(arr, arr.length, 1, defaultComparator)).toEqual(0)

            arr = [1, 2, 5, 9]

            // if it is in, then it should give the exact position
            expect(indexOf<number>(arr, arr.length, 2, defaultComparator)).toEqual(1)
            // if it is not in, but is bigger than something in, it should be to the right of it
            expect(indexOf<number>(arr, arr.length, 3, defaultComparator)).toEqual(2)
            // if it is in, then it should give the exact position
            expect(indexOf<number>(arr, arr.length, 5, defaultComparator)).toEqual(2)
            // if it is in, and it is greater than everything, it should give length
            expect(indexOf<number>(arr, arr.length, 10, defaultComparator)).toEqual(arr.length)
            // if it is smaller than everything, it should be zero
            expect(indexOf<number>(arr, arr.length, 0, defaultComparator)).toEqual(0)
        })
    })
})