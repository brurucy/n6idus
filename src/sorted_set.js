import { SortedArraySet } from "./sorted_array.js";

class SortedSet {
  bucketSize = 1000;
  buckets = [];
  length = 0;
  constructor(cmp, bucketSize) {
    this.cmp = cmp;
    this.buckets[0] = new SortedArraySet(this.cmp);
    this.bucketSize = bucketSize;
  }
  #balance(firstLevelIndex) {
    const half = Math.ceil(this.buckets[firstLevelIndex].bucket.length / 2);
    const newBucketContents = this.buckets[firstLevelIndex].bucket.slice(-half);
    const oldBucketContents = this.buckets[firstLevelIndex].bucket.slice(
      0,
      half
    );
    const newArraySet = new SortedArraySet(this.cmp);
    this.buckets[firstLevelIndex] = new SortedArraySet(this.cmp);
    for (const item of newBucketContents) {
      newArraySet.add(item);
    }
    for (const item of oldBucketContents) {
      this.buckets[firstLevelIndex].add(item);
    }
    this.buckets.splice(firstLevelIndex + 1, 0, newArraySet);
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
      }
      this.length = this.length + 1;
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
      if (this.buckets[firstLevelIndex].bucket.length === 0) {
        if (this.length !== 1) {
          this.buckets.splice(firstLevelIndex, 1);
        }
      }
      this.length = this.length - 1;
      return deletion;
    }
  }
}
export { SortedSet };
