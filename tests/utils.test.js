"use strict";
exports.__esModule = true;
var utils_1 = require("../src/utils/utils");
describe("Binary Search", function () {
    describe("indexOf", function () {
        it("returns the expected positions", function () {
            var arr = [];
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
});
