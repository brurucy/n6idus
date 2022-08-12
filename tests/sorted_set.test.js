"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sorted_set_1 = require("../src/data_structures/implementations/sorted_set");
// That's how simple it is to morph it into an array.
function flattenBuckets(indexedSortedArraySet) {
    let out = new Array();
    for (const bucket of indexedSortedArraySet.buckets) {
        for (const item of bucket.bucket) {
            out.push(item);
        }
    }
    return out;
}
describe("IndexedSortedArraySet", () => {
    describe("push", () => {
        describe("adds and returns undefined if an attempt to add a duplicate occurs", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [1, 1],
                [1, undefined],
            ];
            test.each(cases)("adding %d returns %d", (value, out) => {
                expect(indexedSortedArraySet.push(value)).toEqual(out);
            });
        });
        // This test is a lot more complex than it seems, since we are also testing the balance subroutine
        // which is by far the sketchiest part of the data structure.
        // However, in itself, it is a simple operation:
        // Whenever a bucket overflows, we split it in half, while retaining order.
        // It is done in three steps:
        // 1. Create a new bucket, straight out of the overflown one, from half up until the last element
        // 2. Copy all elements there(expensive)
        // 3. Remove all elements from the original array that are now in the new array(will trigger the gc causing a latency spike)
        // The "bucket size" property defines the point in which this splitting will occur. If we set it to 2, this means that
        // each underlying bucket will call `balance` once its length is greater than 2.
        describe("maintains the underlying sorted order", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 1, 2, 4, 5, 10]) {
                indexedSortedArraySet.push(item);
            }
            expect(flattenBuckets(indexedSortedArraySet)).toEqual([
                1, 2, 3, 4, 5, 10,
            ]);
        });
    });
    describe("locate", () => {
        class ExtendedIndexedSortedArraySet extends sorted_set_1.IndexedSortedArraySet {
            constructor(bucketSize) {
                super(bucketSize);
            }
            locateExtended(nth) {
                return this.locate(nth);
            }
            pushExtended(item) {
                return this.push(item);
            }
        }
        describe("correctly checks for invalid boundaries", () => {
            const extendedIndexedSortedArraySet = new ExtendedIndexedSortedArraySet(2);
            extendedIndexedSortedArraySet.pushExtended(1);
            const cases = [
                [-1, undefined],
                [1, undefined],
            ];
            test.each(cases)("locating %d returns %d", (nth, location) => {
                expect(extendedIndexedSortedArraySet.locateExtended(nth)).toEqual(location);
            });
        });
        describe("returns the expected two-level position", () => {
            const extendedIndexedSortedArraySet = new ExtendedIndexedSortedArraySet(2);
            for (const item of [3, 1, 2, 4, 5, 10]) {
                extendedIndexedSortedArraySet.pushExtended(item);
            }
            const cases = [
                [2, 3, [1, 0]],
                [0, 1, [0, 0]],
                [1, 2, [0, 1]],
                [3, 4, [1, 1]],
                [4, 5, [2, 0]],
                [5, 10, [2, 1]],
            ];
            test.each(cases)("%d is in bucket %d at the %d position", (nth, value, [expectedBucketNumber, expectedPositionInBucket]) => {
                const locatingAttempt = extendedIndexedSortedArraySet.locateExtended(nth);
                if (locatingAttempt != undefined) {
                    expect(locatingAttempt[0]).toEqual(expectedBucketNumber);
                    expect(locatingAttempt[1]).toEqual(expectedPositionInBucket);
                    // Here we are taking the returned indexes, and accessing them
                    expect(extendedIndexedSortedArraySet.buckets[locatingAttempt[0]].select(locatingAttempt[1])).toEqual(value);
                }
                else {
                    fail("locating attempt should never be undefined");
                }
            });
        });
    });
    // Slightly tricky function.
    // When `this.makeCursor` is called, the second argument, forward, is the direction of the return result
    // of calling `this.next`. So, the direction of the first element to be returned is determined by makeCursor.
    // The same holds true for all elements. Calling `this.next(true)` means that the **next** result will be forward
    // not the current one that is returned by next.
    describe("make cursor", () => {
        const elementsToBeInserted = [3, 1, 2, 4, 5, 10];
        describe("traverses the entire structure forward by position", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of elementsToBeInserted) {
                indexedSortedArraySet.push(item);
            }
            const enumeratedSortedArray = new Array();
            for (const item of flattenBuckets(indexedSortedArraySet).entries()) {
                enumeratedSortedArray.push(item);
            }
            const initiallyForwardCursor = indexedSortedArraySet.makeCursor(0, true);
            test.each(enumeratedSortedArray)("expected %d got %d", (expectedIndex, expectedValue) => {
                const nextForward = initiallyForwardCursor.next(true);
                expect(nextForward.value).toEqual([expectedIndex, expectedValue]);
            });
        });
        describe("traverses the entire structure backwards by position", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of elementsToBeInserted) {
                indexedSortedArraySet.push(item);
            }
            const invertedEnumeratedSortedArray = new Array();
            for (const item of flattenBuckets(indexedSortedArraySet).entries()) {
                invertedEnumeratedSortedArray.push(item);
            }
            const initiallyBackwardsCursor = indexedSortedArraySet.makeCursor(indexedSortedArraySet.length - 1, false);
            test.each(invertedEnumeratedSortedArray.reverse())("expected %d got %d", (expectedIndex, expectedValue) => {
                const nextForward = initiallyBackwardsCursor.next(false);
                expect(nextForward.value).toEqual([expectedIndex, expectedValue]);
            });
        });
    });
    describe("intersection", () => {
        describe("satisfies the definition of intersection", () => {
            const A = new sorted_set_1.IndexedSortedArraySet(2);
            const B = new sorted_set_1.IndexedSortedArraySet(2);
            const elementsToBeInsertedA = [3, 1, 2, 4, 5, 10];
            const elementsToBeInsertedB = [1, 2, 5, 10, 11, 6];
            for (const item of elementsToBeInsertedA) {
                A.push(item);
            }
            for (const item of elementsToBeInsertedB) {
                B.push(item);
            }
            const AIB = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [1, 2, 5, 10]) {
                AIB.push(item);
            }
            const emptySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [A, B, AIB],
                [B, A, AIB],
                [A, A, A],
                [B, B, B],
                [B, emptySet, emptySet],
                [A, emptySet, emptySet],
            ];
            test.each(cases)("%s ∩ %s = %s", (L, R, LIR) => {
                expect(flattenBuckets(L.intersection(R))).toEqual(flattenBuckets(LIR));
            });
        });
    });
    describe("union", () => {
        describe("satisfies the definition of union", () => {
            const A = new sorted_set_1.IndexedSortedArraySet(2);
            const B = new sorted_set_1.IndexedSortedArraySet(2);
            const elementsToBeInsertedA = [3, 1, 2, 4, 5, 10];
            const elementsToBeInsertedB = [1, 2, 5, 10, 11, 6];
            for (const item of elementsToBeInsertedA) {
                A.push(item);
            }
            for (const item of elementsToBeInsertedB) {
                B.push(item);
            }
            const AUB = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [1, 2, 3, 4, 5, 6, 10, 11]) {
                AUB.push(item);
            }
            const emptySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [A, B, AUB],
                [B, A, AUB],
                [A, A, A],
                [B, B, B],
                [B, emptySet, B],
                [A, emptySet, A],
            ];
            test.each(cases)("%s ∪ %s = %s", (L, R, LUR) => {
                expect(flattenBuckets(L.union(R))).toEqual(flattenBuckets(LUR));
            });
        });
    });
    describe("difference", () => {
        describe("satisfies the definition of difference", () => {
            const A = new sorted_set_1.IndexedSortedArraySet(2);
            const B = new sorted_set_1.IndexedSortedArraySet(2);
            const elementsToBeInsertedA = [3, 1, 2, 4, 5, 10];
            const elementsToBeInsertedB = [1, 2, 5, 10, 11, 6];
            for (const item of elementsToBeInsertedA) {
                A.push(item);
            }
            for (const item of elementsToBeInsertedB) {
                B.push(item);
            }
            const ADB = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 4]) {
                ADB.push(item);
            }
            const BDA = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [6, 11]) {
                BDA.push(item);
            }
            const emptySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [A, B, ADB],
                [B, A, BDA],
                [A, A, emptySet],
                [B, B, emptySet],
                [B, emptySet, B],
                [A, emptySet, A],
            ];
            test.each(cases)("%s  %s = %s", (L, R, LDR) => {
                expect(flattenBuckets(L.difference(R))).toEqual(flattenBuckets(LDR));
            });
        });
    });
    describe("symmetricDifference", () => {
        describe("satisfies the definition of symmetricDifference", () => {
            const A = new sorted_set_1.IndexedSortedArraySet(2);
            const B = new sorted_set_1.IndexedSortedArraySet(2);
            const elementsToBeInsertedA = [3, 1, 2, 4, 5, 10];
            const elementsToBeInsertedB = [1, 2, 5, 10, 11, 6];
            for (const item of elementsToBeInsertedA) {
                A.push(item);
            }
            for (const item of elementsToBeInsertedB) {
                B.push(item);
            }
            const ADB = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 4, 6, 11]) {
                ADB.push(item);
            }
            const emptySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [A, B, ADB],
                [B, A, ADB],
                [A, A, emptySet],
                [B, B, emptySet],
                [B, emptySet, B],
                [A, emptySet, A],
            ];
            test.each(cases)("%s Δ %s = %s", (L, R, LDR) => {
                expect(flattenBuckets(L.symmetricDifference(R))).toEqual(flattenBuckets(LDR));
            });
        });
    });
    describe("Symbol.iterator", () => {
        describe("correctly iterates from the beginning til the end", () => {
            const A = new sorted_set_1.IndexedSortedArraySet(2);
            const elementsToBeInsertedA = [3, 1, 2, 4, 5, 10];
            for (const item of elementsToBeInsertedA) {
                A.push(item);
            }
            const iterationResult = new Array();
            for (const item of A) {
                iterationResult.push(item);
            }
            const emptySet = new sorted_set_1.IndexedSortedArraySet(2);
            const cases = [
                [A, flattenBuckets(A)],
                [emptySet, []],
            ];
            test.each(cases)(`iterating %s yields %s`, (L, R) => {
                const iterationResult = new Array();
                for (const item of L) {
                    iterationResult.push(item);
                }
                expect(iterationResult).toEqual(R);
            });
        });
    });
    describe("delete", () => {
        describe("deletes and returns undefined if an attempt to delete something that doesn't exist occurs", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            indexedSortedArraySet.push(1);
            const cases = [
                [1, 1],
                [1, undefined],
            ];
            test.each(cases)("deleting %d returns %d", (value, out) => {
                expect(indexedSortedArraySet.delete(value)).toEqual(out);
            });
        });
        describe("maintains the underlying sorted order", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 1, 2, 4, 5, 10]) {
                indexedSortedArraySet.push(item);
            }
            const cases = [
                [1, 1],
                [2, 2],
                [3, 3],
                [4, 4],
                [5, 5],
                [10, 10],
            ];
            test.each(cases)("deleting %d returns %d", (value, out) => {
                expect(indexedSortedArraySet.delete(value)).toEqual(out);
            });
        });
    });
    describe("remove", () => {
        describe("removes and returns undefined if an attempt to remove something that doesn't exist occurs", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            indexedSortedArraySet.push(1);
            const cases = [
                [0, 1],
                [0, undefined],
            ];
            test.each(cases)("removing %d returns %d", (value, out) => {
                expect(indexedSortedArraySet.remove(value)).toEqual(out);
            });
        });
        describe("maintains the underlying sorted order", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 1, 2, 4, 5, 10]) {
                indexedSortedArraySet.push(item);
            }
            const cases = [
                [0, 1],
                [0, 2],
                [0, 3],
                [0, 4],
                [0, 5],
                [0, 10],
            ];
            test.each(cases)("removing %d returns %d", (value, out) => {
                expect(indexedSortedArraySet.remove(value)).toEqual(out);
            });
        });
    });
    describe("reduce", () => {
        describe("works as expected", () => {
            const indexedSortedArraySet = new sorted_set_1.IndexedSortedArraySet(2);
            for (const item of [3, 1, 2, 4, 5, 10]) {
                indexedSortedArraySet.push(item);
            }
            expect(indexedSortedArraySet.reduce((previousValue, currentValue) => {
                return previousValue + currentValue;
            }, 0)).toEqual(flattenBuckets(indexedSortedArraySet).reduce((previousValue, currentValue) => {
                return previousValue + currentValue;
            }, 0));
        });
    });
});
//# sourceMappingURL=sorted_set.test.js.map