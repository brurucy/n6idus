"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedSortedArraySet = void 0;
const sorted_array_1 = require("./sorted_array");
const fenwick_array_1 = require("./fenwick_array");
const utils_1 = require("../utils/utils");
class IndexedSortedArraySet {
    constructor(bucketSize, compare) {
        this.length = 0;
        this.index = new fenwick_array_1.FenwickArray([0]);
        this.compare =
            compare || utils_1.defaultComparator;
        this.bucketSize =
            bucketSize || 1000;
        this.buckets = new Array(1);
        this.buckets[0] = new sorted_array_1.SortedArraySet(this.compare);
    }
    buildIndex() {
        this.index = new fenwick_array_1.FenwickArray(this.buckets, (sortedArraySet) => {
            return sortedArraySet.length();
        });
    }
    balance(firstLevelIndex) {
        const half = Math.ceil(this.buckets[firstLevelIndex].bucket.length / 2);
        const newBucketContents = this.buckets[firstLevelIndex].bucket.slice(half, this.buckets[firstLevelIndex].bucket.length);
        const oldBucketContents = this.buckets[firstLevelIndex].bucket.slice(0, half);
        const newArraySet = new sorted_array_1.SortedArraySet(this.compare);
        this.buckets[firstLevelIndex] = new sorted_array_1.SortedArraySet(this.compare);
        newArraySet.bucket = newBucketContents;
        this.buckets[firstLevelIndex].bucket = oldBucketContents;
        newArraySet.max = newArraySet.bucket[newArraySet.bucket.length - 1];
        this.buckets[firstLevelIndex].max =
            this.buckets[firstLevelIndex].bucket[this.buckets[firstLevelIndex].bucket.length - 1];
        this.buckets.splice(firstLevelIndex + 1, 0, newArraySet);
        this.buildIndex();
    }
    push(item) {
        let firstLevelIndex = (0, utils_1.indexOf)(this.buckets, this.buckets.length, item, (bucket, item) => {
            if (bucket.max == undefined) {
                return -1;
            }
            return this.compare(bucket.max, item);
        });
        if (this.buckets[firstLevelIndex] === undefined) {
            firstLevelIndex = firstLevelIndex - 1;
        }
        const add = this.buckets[firstLevelIndex].add(item);
        if (add === undefined) {
            return undefined;
        }
        if (this.buckets[firstLevelIndex].bucket.length > this.bucketSize) {
            this.balance(firstLevelIndex);
        }
        else {
            this.index.increaseLength(firstLevelIndex);
        }
        this.length += 1;
        return add;
    }
    locate(nth) {
        if (nth >= this.length || nth < 0) {
            return undefined;
        }
        const firstLevelIndex = this.index.indexOf(nth);
        let offset = 0;
        if (firstLevelIndex !== 0) {
            offset = this.index.prefixSum(firstLevelIndex);
        }
        // This will never happen, since indexOf cannot return a value greater than length.
        if (offset === undefined) {
            return undefined;
        }
        return [firstLevelIndex, nth - offset];
    }
    locateNextOrPrevious(coordinates, next) {
        const firstLevelIndex = coordinates[0];
        const secondLevelIndex = coordinates[1];
        const proposedBucket = this.buckets[firstLevelIndex];
        if (next) {
            if (proposedBucket.length() - 1 === secondLevelIndex) {
                if (this.buckets.length - 1 === firstLevelIndex) {
                    return undefined;
                }
                return [firstLevelIndex + 1, 0];
            }
            return [firstLevelIndex, secondLevelIndex + 1];
        }
        if (secondLevelIndex - 1 >= 0) {
            return [firstLevelIndex, secondLevelIndex - 1];
        }
        if (this.buckets.length - 1 >= 0) {
            return [firstLevelIndex - 1, proposedBucket.length() - 1];
        }
        return undefined;
    }
    *makeCursor(from, forward) {
        let currentIndex = from;
        const coordinates = this.locate(currentIndex);
        if (coordinates == undefined) {
            return;
        }
        let firstLevelIndex = coordinates[0];
        let secondLevelIndex = coordinates[1];
        while (true) {
            if (currentIndex > this.length - 1 || currentIndex < 0) {
                break;
            }
            forward = yield [currentIndex, this.buckets[firstLevelIndex].select(secondLevelIndex)];
            const newCoordinates = this.locateNextOrPrevious([firstLevelIndex, secondLevelIndex], forward);
            if (newCoordinates == undefined) {
                break;
            }
            firstLevelIndex = newCoordinates[0];
            secondLevelIndex = newCoordinates[1];
            if (forward) {
                currentIndex += 1;
            }
            else {
                currentIndex -= 1;
            }
        }
    }
}
exports.IndexedSortedArraySet = IndexedSortedArraySet;
//# sourceMappingURL=sorted_set.js.map