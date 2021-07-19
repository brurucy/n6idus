import { SortedArraySet } from './sorted_array.js'

class SortedSet {
  bucketSize = 1000;
  buckets = [];
  index = [];
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
    this.index = [];
    let accumulatedLength = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      accumulatedLength = accumulatedLength + this.buckets[i].bucket.length;
      this.index[i] = accumulatedLength;
    }
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
  #indexIndexOf(nth) {
    let low = 0,
        high = this.buckets.length,
        mid = 0;

    while (low < high) {
      mid = (low + high) >>> 1;
      let midVal = this.index[mid];
      if (
          midVal !== undefined &&
          midVal <= nth
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
      return undefined;
    } else {
      let firstLevelIndex = this.#indexIndexOf(nth);
      let offset = 0;
      if (firstLevelIndex !== 0) {
        offset = this.index[firstLevelIndex - 1];
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
    if (add === undefined) {
      return undefined
    } else {
      if (this.buckets[firstLevelIndex].bucket.length > this.bucketSize) {
        this.#balance(firstLevelIndex);
      } else {
        if (this.index[firstLevelIndex] === undefined) {
          this.index[firstLevelIndex] = 0;
        }
        for (let i = firstLevelIndex; i < this.index.length; i++) {
          this.index[i] = this.index[i] + 1;
        }
      }
      this.length = this.length + 1;
    }
  }
  select(nth) {
    const indexes = this.#locate(nth);
    let [firstLevelIndex, secondLevelIndex] = [0, 0];
    if (indexes === undefined) {
      return undefined;
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
    if (deletion === undefined) {
      return undefined
    } else {
      if (this.length !== 1 && this.buckets[firstLevelIndex].bucket.length === 0) {
        this.buckets.splice(firstLevelIndex, 1);
      }
      for (let i = firstLevelIndex; i < this.index.length; i++) {
        this.index[i] = this.index[i] - 1;
      }
      this.index = this.index.filter((x) => x > 0);
      this.length = this.length - 1;
    }
  }
  remove(nth) {
    const indexes = this.#locate(nth);
    let [firstLevelIndex, secondLevelIndex] = [0, 0];
    if (indexes === undefined) {
      return undefined;
    } else {
      [firstLevelIndex, secondLevelIndex] = indexes;
      return this.buckets[firstLevelIndex].select(secondLevelIndex);
    }
  }
}
export { SortedSet };
