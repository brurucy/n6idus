import {indexOf, defaultComparator, mostSignificantBit, leastSignificantBit} from "../src/data_structures/utils/utils";

describe("indexOf", () => {
    describe("returns the expected positions", () => {
        let arr: Array<number> = [];

        // if it is empty, then what is to be added should go to the zeroth position
        expect(indexOf(arr, arr.length, 1, defaultComparator)).toEqual(0)

        arr = [1, 2, 5, 9]

        // if it is in, then it should give the exact position
        expect(indexOf(arr, arr.length, 2, defaultComparator)).toEqual(1)
        // if it is not in, but is bigger than something in, it should be to the right of it
        expect(indexOf(arr, arr.length, 3, defaultComparator)).toEqual(2)
        // if it is in, then it should give the exact position
        expect(indexOf(arr, arr.length, 5, defaultComparator)).toEqual(2)
        // if it is in, and it is greater than everything, it should give length
        expect(indexOf(arr, arr.length, 10, defaultComparator)).toEqual(arr.length)
        // if it is smaller than everything, it should be zero
        expect(indexOf(arr, arr.length, 0, defaultComparator)).toEqual(0)
    })
});

describe("mostSignificantBit", () => {
    describe('correctly returns the value of the most significant bit', function () {
        const cases: Array<[number, number]> = [[1, 1], [11, 8], [219, 128], [249, 128], [255, 128], [256, 256]]
        test.each(cases)("number %d expected msb value %d", (value, msbValue) => {
            expect(mostSignificantBit(value)).toEqual(msbValue)
        })
    });
})

describe("leastSignificantBit", () => {
    describe('correctly returns the value of the least significant bit', function () {
        const cases: Array<[number, number]> = [[1, 1], [11, 1], [16, 16], [32, 32], [55, 1], [256, 256]]
        test.each(cases)("number %d expected lsb value %d", (value, lsbValue) => {
            expect(leastSignificantBit(value)).toEqual(lsbValue)
        })
    });
})
