"use strict";
exports.__esModule = true;
var sorted_array_1 = require("../src/data_structures/sorted_array");
describe("SortedArraySet", function () {
    describe("add", function () {
        it("does not add if already in, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            expect(sortedArraySet.add(1)).toEqual(1);
            expect(sortedArraySet.getMax()).toEqual(1);
            expect(sortedArraySet.add(1)).toBeUndefined();
            expect(sortedArraySet.add(3)).toEqual(3);
            expect(sortedArraySet.add(3)).toBeUndefined();
            expect(sortedArraySet.getMax()).toEqual(3);
            expect(sortedArraySet.add(2)).toEqual(2);
            expect(sortedArraySet.getMax()).toEqual(2);
            expect(sortedArraySet.add(2)).toBeUndefined();
        });
    });
    describe("delete", function () {
        it("does not delete if not in, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(1);
            sortedArraySet.add(2);
            sortedArraySet.add(3);
            expect(sortedArraySet["delete"](1)).toEqual(1);
            expect(sortedArraySet["delete"](1)).toBeUndefined();
            expect(sortedArraySet.getMax()).toEqual(3);
            expect(sortedArraySet["delete"](3)).toEqual(3);
            expect(sortedArraySet["delete"](3)).toBeUndefined();
            expect(sortedArraySet.getMax()).toEqual(2);
            expect(sortedArraySet["delete"](2)).toEqual(2);
            expect(sortedArraySet["delete"](2)).toBeUndefined();
            expect(sortedArraySet.getMax()).toBeUndefined();
        });
    });
    describe("has", function () {
        it("correctly asserts that an item is in", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(1);
            sortedArraySet.add(2);
            sortedArraySet.add(3);
            expect(sortedArraySet.has(1)).toBeTruthy();
            expect(sortedArraySet.has(2)).toBeTruthy();
            expect(sortedArraySet.has(3)).toBeTruthy();
            sortedArraySet["delete"](1);
            expect(sortedArraySet.has(1)).toBeFalsy();
            sortedArraySet["delete"](2);
            expect(sortedArraySet.has(2)).toBeFalsy();
            sortedArraySet["delete"](3);
            expect(sortedArraySet.has(3)).toBeFalsy();
        });
    });
    describe("select", function () {
        it("correctly checks for boundaries", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(1);
            expect(sortedArraySet.select(-1)).toBeUndefined();
            expect(sortedArraySet.select(1)).toBeUndefined();
        });
        it("returns the expected value", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(3);
            sortedArraySet.add(2);
            sortedArraySet.add(1);
            expect(sortedArraySet.select(0)).toEqual(1);
            expect(sortedArraySet.select(1)).toEqual(2);
            expect(sortedArraySet.select(2)).toEqual(3);
        });
    });
    describe("remove", function () {
        it("does not remove if not in, updates the maximum element correctly", function () {
            var sortedArraySet = new sorted_array_1.SortedArraySet();
            sortedArraySet.add(1);
            sortedArraySet.add(2);
            sortedArraySet.add(3);
            expect(sortedArraySet.getMax()).toEqual(3);
            expect(sortedArraySet.remove(0)).toEqual(1);
            expect(sortedArraySet.remove(2)).toBeUndefined();
            expect(sortedArraySet.remove(1)).toEqual(3);
            expect(sortedArraySet.getMax()).toEqual(2);
            expect(sortedArraySet.remove(0)).toEqual(2);
            expect(sortedArraySet.remove(0)).toBeUndefined();
            expect(sortedArraySet.getMax()).toBeUndefined();
        });
    });
});
