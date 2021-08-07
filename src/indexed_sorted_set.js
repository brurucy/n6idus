import { SortedArraySet } from './sorted_array.js';
import { FenwickArray } from "./index.js";

class IndexedSortedSet {
    bucketSize = 1000;
    buckets = [];
    index = new FenwickArray([0]);
    length = 0;
    constructor(cmp, bucketSize) {
        this.cmp = cmp;
        this.buckets[0] = new SortedArraySet(this.cmp);
        this.bucketSize = bucketSize;
    }
    #balance(firstLevelIndex) {
        const half = Math.ceil(this.buckets[firstLevelIndex].bucket.length / 2);
        const newBucketContents = this.buckets[firstLevelIndex].bucket.slice(-half);
        const oldBucketContents = this.buckets[firstLevelIndex].bucket.slice(0, half);
        const newArraySet = new SortedArraySet(this.cmp);
        this.buckets[firstLevelIndex] = new SortedArraySet(this.cmp);
        for (const item of newBucketContents) {
            newArraySet.add(item);
        }
        for (const item of oldBucketContents) {
            this.buckets[firstLevelIndex].add(item);
        }
        this.buckets.splice(firstLevelIndex + 1, 0, newArraySet);
        const index = new Array(this.buckets.length);
        for (let i = 0; i < this.buckets.length; i++) {
            index[i] = this.buckets[i].bucket.length;
        }
        this.index = new FenwickArray(index);
    }
    #bucketIndexOf(item) {
        let low = 0,
            high = this.buckets.length,
            mid = 0;

        while (low < high) {
            mid = (low + high) >>> 1;
            let midVal = this.buckets[mid].max;
            if (
                midVal !== undefined &&
                this.cmp(midVal, item) &&
                !this.cmp(item, midVal)
            ) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return high;
    }
    #locate(nth) {
        if (nth >= this.length || nth < 0) {
            return null;
        } else {
            let firstLevelIndex = this.index.indexOf(nth);
            let offset = 0;
            if (firstLevelIndex !== 0) {
                offset = this.index.prefixSum(firstLevelIndex);
            }
            return [firstLevelIndex, nth - offset];
        }
    }
    add(item) {
        let firstLevelIndex = this.#bucketIndexOf(item);
        if (this.buckets[firstLevelIndex] === undefined) {
            firstLevelIndex = firstLevelIndex - 1;
        }
        const add = this.buckets[firstLevelIndex].add(item);
        if (add === null) {
            return null;
        } else {
            if (this.buckets[firstLevelIndex].bucket.length > this.bucketSize) {
                this.#balance(firstLevelIndex);
            } else {
                this.index.increaseLength(firstLevelIndex);
            }
            this.length = this.length + 1;
        }
    }
    select(nth) {
        const indexes = this.#locate(nth);
        let [firstLevelIndex, secondLevelIndex] = [0, 0];
        if (indexes === null) {
            return null;
        } else {
            [firstLevelIndex, secondLevelIndex] = indexes;
            return this.buckets[firstLevelIndex].select(secondLevelIndex);
        }
    }
    has(item) {
        let firstLevelIndex = this.#bucketIndexOf(item);
        if (this.buckets[firstLevelIndex] === undefined) {
            firstLevelIndex = firstLevelIndex - 1;
        }
        return this.buckets[firstLevelIndex].has(item);
    }
    delete(item) {
        let firstLevelIndex = this.#bucketIndexOf(item);
        if (this.buckets[firstLevelIndex] === undefined) {
            firstLevelIndex = firstLevelIndex - 1;
        }
        const deletion = this.buckets[firstLevelIndex].delete(item);
        if (deletion === null) {
            return null;
        } else {
            this.index.decreaseLength(firstLevelIndex);
            if (this.buckets[firstLevelIndex].bucket.length === 0) {
                if (this.length !== 1) {
                    this.buckets.splice(firstLevelIndex, 1);
                }
                const index = new Array(this.buckets.length);
                for (let i = 0; i < this.buckets.length; i++) {
                    index[i] = this.buckets[i].bucket.length;
                }
                this.index = new FenwickArray(index);
            }
            this.length = this.length - 1;
            return deletion;
        }
    }
    remove(nth) {
        const indexes = this.#locate(nth);
        let [firstLevelIndex, secondLevelIndex] = [0, 0];
        if (indexes === null) {
            return null;
        } else {
            [firstLevelIndex, secondLevelIndex] = indexes;
            const removal = this.buckets[firstLevelIndex].remove(secondLevelIndex);
            if (removal === null) {
                return null;
            } else {
                this.index.decreaseLength(firstLevelIndex);
                if (this.buckets[firstLevelIndex].bucket.length === 0) {
                    if (this.length !== 1) {
                        this.buckets.splice(firstLevelIndex, 1);
                    }
                    const index = new Array(this.buckets.length);
                    for (let i = 0; i < this.buckets.length; i++) {
                        index[i] = this.buckets[i].bucket.length;
                    }
                    this.index = new FenwickArray(index);
                }
                this.length = this.length - 1;
                return removal;
            }
        }
    }
}
export { IndexedSortedSet };
