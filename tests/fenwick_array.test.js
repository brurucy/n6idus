"use strict";
exports.__esModule = true;
var fenwick_array_1 = require("../src/data_structures/fenwick_array");
describe("FenwickArray", function () {
    describe("constructor", function () {
        it("correctly initializes the array as expected", function () {
            // The Fenwick Array is a data structure built for logarithmic prefix sums
            // This "lengths" array could represent a sequence of lengths of other arrays
            var lengths = [1, 6, 3, 9, 2];
            // The expected output of the constructor, is a simple numeric array with partial sums
            // For instance, in this case, the second element, 7, is the sum of all elements up to the second, in the first array.
            // However, the third element, 3, is the same as in the original array.
            // The prefix sum until the third element, will be computed in runtime, logarithmically.
            // That's the gist of the Fenwick Array, logarithmic insertions with logarithmic prefix sum computation.
            var fenwickArray = [1, 7, 3, 19, 2];
            var index = new fenwick_array_1.FenwickArray(lengths);
            expect(fenwickArray).toEqual(index.innerStructure);
        });
    });
    describe("prefixSum", function () {
        describe("calculates the expected prefix sum", function () {
            var lengths = [1, 6, 3, 9, 2];
            var fenwickArray = new fenwick_array_1.FenwickArray(lengths);
            var cases = [[0, 0], [1, 1], [2, 7], [3, 10], [4, 19], [5, 21], [6, undefined]];
            // The prefix sum up until the zeroth element is 0, since there is nothing before it
            // The prefix sum up until an index larger than the length is undefined, since every element after the length - 1
            // is undefined
            test.each(cases)("index %d expected sum %d", function (index, sum) {
                expect(fenwickArray.prefixSum(index)).toEqual(sum);
            });
        });
    });
    describe("increaseLength", function () {
        describe("correctly adjusts the partial sums", function () {
            var lengths = [1, 6, 3, 9, 2];
            // innerStructure is [1, 7, 3, 19, 2]
            var fenwickArray = new fenwick_array_1.FenwickArray(lengths);
            // Once again, a neat aspect about the Fenwick Array is that by increasing the value of an index
            // Only a logarithmic number of other indexes will have to be changed, instead of the whole innerStructure
            fenwickArray.increaseLength(0);
            // Given that we are updating the zeroth element, we will have to also update the 1st 1, and the 3rd(11)
            var cases = [[0, 2], [1, 8], [2, 3], [3, 20], [4, 2]];
            test.each(cases)("index %d expected value %d", function (index, value) {
                expect(fenwickArray.innerStructure[index]).toEqual(value);
            });
        });
    });
    describe("decreaseLength", function () {
        describe("correctly adjusts the partial sums", function () {
            var lengths = [1, 6, 3, 9, 2];
            // innerStructure is [1, 7, 3, 19, 2]
            var fenwickArray = new fenwick_array_1.FenwickArray(lengths);
            // The rationale is equivalent to the previous test
            fenwickArray.decreaseLength(0);
            var cases = [[0, 0], [1, 6], [2, 3], [3, 18], [4, 2]];
            test.each(cases)("index %d expected value %d", function (index, value) {
                expect(fenwickArray.innerStructure[index]).toEqual(value);
            });
        });
    });
    describe("indexOf", function () {
        describe("returns the expected position of the given prefix sum", function () {
            var lengths = [1, 6, 3, 9, 2];
            var fenwickArray = new fenwick_array_1.FenwickArray(lengths);
            // This is, by far, the most useful aspect about the Fenwick Array, and what makes it suitable to be used
            // as an index. Given a prefix sum, indexOf returns the correct position in the inner structure of the Fenwick
            // Array that the prefix sum would inhabit
            var cases = [[0, 0], [1, 6], [2, 9], [3, 18], [4, 20]];
            // The cases may sound unintuitive. Taking the example the first pair in the cases array: [0, 0]
            // The output of indexOf will be the "bucket" in which the prefixSum value would fall in, had the sum been fully
            // calculated. For instance, if the Fenwick Array is [1, 7, 3, 19, 2], the prefixSum(2) would be 7, so if one were
            // to call indexOf(7) the result would be 2, since the bucket in which one would find 7 is the third
            test.each(cases)("prefix sum %d expected index %d", function (index, prefixSum) {
                expect(fenwickArray.indexOf(prefixSum)).toEqual(index);
            });
        });
    });
});