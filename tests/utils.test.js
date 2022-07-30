"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils/utils");
describe("indexOf", () => {
    describe("returns the expected positions", () => {
        let arr = [];
        // if it is empty, then what is to be added should go to the zeroth position
        expect((0, utils_1.indexOf)(arr, arr.length, 1, utils_1.defaultComparator)).toEqual(0);
        arr = [1, 2, 5, 9];
        // if it is in, then it should give the exact position
        expect((0, utils_1.indexOf)(arr, arr.length, 2, utils_1.defaultComparator)).toEqual(1);
        // if it is not in, but is bigger than something in, it should be to the right of it
        expect((0, utils_1.indexOf)(arr, arr.length, 3, utils_1.defaultComparator)).toEqual(2);
        // if it is in, then it should give the exact position
        expect((0, utils_1.indexOf)(arr, arr.length, 5, utils_1.defaultComparator)).toEqual(2);
        // if it is in, and it is greater than everything, it should give length
        expect((0, utils_1.indexOf)(arr, arr.length, 10, utils_1.defaultComparator)).toEqual(arr.length);
        // if it is smaller than everything, it should be zero
        expect((0, utils_1.indexOf)(arr, arr.length, 0, utils_1.defaultComparator)).toEqual(0);
    });
});
describe("mostSignificantBit", () => {
    describe('correctly returns the value of the most significant bit', function () {
        const cases = [[1, 1], [11, 8], [219, 128], [249, 128], [255, 128], [256, 256]];
        test.each(cases)("number %d expected msb value %d", (value, msbValue) => {
            expect((0, utils_1.mostSignificantBit)(value)).toEqual(msbValue);
        });
    });
});
describe("leastSignificantBit", () => {
    describe('correctly returns the value of the least significant bit', function () {
        const cases = [[1, 1], [11, 1], [16, 16], [32, 32], [55, 1], [256, 256]];
        test.each(cases)("number %d expected lsb value %d", (value, lsbValue) => {
            expect((0, utils_1.leastSignificantBit)(value)).toEqual(lsbValue);
        });
    });
});
//# sourceMappingURL=utils.test.js.map