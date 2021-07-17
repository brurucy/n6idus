const binaryInsertAt = (A, cmp, item) => {
  let low = 0;
  let high = A.length;
  let mid = 0;
  while (low < high) {
    mid = (low + high) >>> 1;
    let midVal = A[mid];
    if (midVal !== undefined && cmp(midVal, item)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return high;
};

const binarySearchAt = (A, cmp, item) => {
  let low = 0;
  let high = A.length;
  let mid = 0;
  while (low < high) {
    mid = (low + high) >>> 1;
    let midVal = A[mid];
    if (midVal !== undefined && cmp(midVal, item) && !cmp(item, midVal)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return high;
};

const binarySearch = (A, cmp, item) => {
  let low = 0;
  let high = A.length;
  let mid = 0;
  while (low < high) {
    mid = (low + high) >>> 1;
    let midVal = A[mid];
    if (midVal !== undefined && cmp(midVal, item) && !cmp(item, midVal)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  if (cmp(A[high], item) && cmp(item, A[high])) {
    return true;
  } else {
    return false;
  }
};

const getSortedMax = (A) => {
  if (A.length === 0) {
    return undefined;
  } else {
    return A[A.length - 1];
  }
};

const cmpMax = (x, y, cmp) => {
  if (x.length === 0 && y.length === 0) {
    return true;
  } else {
    if (Array.isArray(x[0]) && Array.isArray(y[0])) {
      return cmp(getSortedMax(x), getSortedMax(y));
    } else if (Array.isArray(x[0]) && !Array.isArray(y[0])) {
      return cmp(getSortedMax(x), y);
    } else {
      return cmp(x, getSortedMax(y));
    }
  }
};

class SortedSet {
  bucketSize = 1000;
  buckets = [];
  index = [];
  length = 0;
  constructor(cmp, bucketSize) {
    this.cmp = cmp;
    this.buckets[0] = [];
    this.bucketSize = bucketSize;
  }
  #balance(index) {
    const half = Math.ceil(this.buckets[index].length / 2);
    const newBucket = this.buckets[index].slice(-half);
    this.buckets[index] = this.buckets[index].slice(0, half);
    this.buckets.splice(index + 1, 0, newBucket);
    this.index = [];
    let accumulatedLength = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      accumulatedLength = accumulatedLength + this.buckets[i].length;
      this.index[i] = accumulatedLength;
    }
  }
  #bucketInsertSearch(cmp, item) {
    return binaryInsertAt(
      this.buckets,
      (x, y) => {
        return cmpMax(x, y, this.cmp);
      },
      item
    );
  }
  #bucketSearch(cmp, item) {
    return binarySearchAt(
      this.buckets,
      (x, y) => {
        return cmpMax(x, y, this.cmp);
      },
      item
    );
  }
  add(item) {
    let firstLevelIndex = this.#bucketInsertSearch(this.cmp, item);
    let candidateBucket = [];
    if (this.buckets[firstLevelIndex] === undefined) {
      firstLevelIndex = firstLevelIndex - 1;
      candidateBucket = this.buckets[firstLevelIndex];
    } else {
      candidateBucket = this.buckets[firstLevelIndex];
    }
    const secondLevelIndex = binaryInsertAt(candidateBucket, this.cmp, item);
    this.buckets[firstLevelIndex].splice(secondLevelIndex, 0, item);
    if (this.buckets[firstLevelIndex].length > this.bucketSize) {
      this.#balance(firstLevelIndex);
    } else {
      if (this.index[firstLevelIndex] === undefined) {
        this.index[firstLevelIndex] = 0;
      }
      for (let i = firstLevelIndex; i < this.index.length; i++) {
        this.index[firstLevelIndex] = this.index[firstLevelIndex] + 1;
      }
    }
    this.length = this.length + 1;
  }
  delete(item) {
    let firstLevelIndex = this.#bucketSearch(this.cmp, item);
    if (this.buckets[firstLevelIndex] === undefined) {
      firstLevelIndex = firstLevelIndex - 1;
    }
    if (binarySearch(this.buckets[firstLevelIndex], this.cmp, item)) {
      this.buckets[firstLevelIndex] = this.buckets[firstLevelIndex].filter(
        (values) => !(this.cmp(item, values) && this.cmp(values, item))
      );
      if (this.buckets[firstLevelIndex].length === 0) {
        this.index[firstLevelIndex] = 0;
        this.index = this.index.filter((idx) => idx > 0);
        if (this.length !== 1) {
          this.buckets = this.buckets.filter((bucket) => bucket.length);
        }
      }
      for (let i = firstLevelIndex; i < this.index.length; i++) {
        this.index[i] = this.index[i] - 1;
      }
      this.length = this.length - 1;
      return true;
    } else {
      return false;
    }
  }
}
export { SortedSet, binarySearch, cmpMax, binaryInsertAt, getSortedMax };
