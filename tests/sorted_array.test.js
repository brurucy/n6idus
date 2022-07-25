"use strict";
exports.__esModule = true;
var sorted_array_1 = require("../src/data_structures/sorted_array");
describe("SortedArraySet", function () {
    describe("add", function () {
        describe("does not add if already in, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            var cases = [[1, 1], [3, 3], [2, 2]];
            test.each(cases)("add %d result of add again %d expected max %d", function (valueToAdd, expectedMax) {
                expect(sortedArraySet.add(valueToAdd)).toEqual(valueToAdd);
                expect(sortedArraySet.add(valueToAdd)).toBeUndefined();
                expect(sortedArraySet.getMax()).toEqual(expectedMax);
            });
        });
    });
    describe("delete", function () {
        describe("does not delete if not in, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            for (var i = 1; i <= 3; i++) {
                sortedArraySet.add(i);
            }
            var cases = [[1, 3], [3, 2], [2, undefined]];
            test.each(cases)("delete %d result of delete again %d expected max %d", function (valueToDelete, expectedMax) {
                expect(sortedArraySet["delete"](valueToDelete)).toEqual(valueToDelete);
                expect(sortedArraySet["delete"](valueToDelete)).toBeUndefined();
                expect(sortedArraySet.getMax()).toEqual(expectedMax);
            });
        });
    });
    describe("has", function () {
        describe("correctly asserts that an item is in", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            for (var i = 1; i <= 3; i++) {
                sortedArraySet.add(i);
            }
            var cases = [1, 2, 3];
            test.each(cases)("%d exists", function (value) {
                expect(sortedArraySet.has(value)).toBeTruthy();
            });
            test.each(cases)("%d does not exist if deleted", function (value) {
                sortedArraySet["delete"](value);
                expect(sortedArraySet.has(value)).toBeFalsy();
            });
        });
    });
    describe("select", function () {
        describe("correctly checks for boundaries", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(1);
            var cases = [1, -1];
            test.each(cases)("index %d is out of bounds of array with length 1", function (index) {
                expect(sortedArraySet.select(index)).toBeUndefined();
            });
        });
        describe("returns the expected value", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            for (var i = 3; i >= 1; i--) {
                sortedArraySet.add(i);
            }
            var cases = [[0, 1], [1, 2], [2, 3]];
            test.each(cases)("index %d contains value %d", function (index, expectedValue) {
                expect(sortedArraySet.select(index)).toEqual(expectedValue);
            });
        });
    });
    describe("remove", function () {
        describe("does not remove if out of bounds, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            for (var i = 3; i >= 1; i--) {
                sortedArraySet.add(i);
            }
            var cases = [[3, 2], [2, 1], [1, 0], [undefined, 0]];
            test.each(cases)("index %d contains value %d", function (expectedValue, index) {
                expect(sortedArraySet.getMax()).toEqual(expectedValue);
                expect(sortedArraySet.remove(index)).toEqual(expectedValue);
            });
        });
    });
});
