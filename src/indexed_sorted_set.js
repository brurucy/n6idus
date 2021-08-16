import { SortedArraySet } from "./sorted_array.js";
import { FenwickArray } from "./index.js";

class IndexedSortedSet {
  buckets = [];
  index = new FenwickArray([0]);
  length = 0;
  constructor(cmp, bucketSize) {
    this.cmp =
      cmp ??
      function (x, y) {
        return x <= y;
      };
    this.buckets[0] = new SortedArraySet(this.cmp);
    this.bucketSize = bucketSize ?? 500;
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
    newArraySet.bucket = newBucketContents;
    this.buckets[firstLevelIndex].bucket = oldBucketContents;
    newArraySet.max = newArraySet.bucket[newArraySet.bucket.length - 1];
    this.buckets[firstLevelIndex].max =
      this.buckets[firstLevelIndex].bucket[
        this.buckets[firstLevelIndex].bucket.length - 1
      ];
    this.buckets.splice(firstLevelIndex + 1, 0, newArraySet);
    this.#buildIndex();
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
  #buildIndex() {
    this.index = new FenwickArray(this.buckets, true);
  }
  *makeForwardCursor() {
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        yield [length, this.buckets[i].select(j)];
        length += 1;
      }
    }
  }
  getMin() {
    return this.buckets[0].bucket[0];
  }
  getMax() {
    return this.buckets[this.buckets.length - 1].bucket[
      this.buckets[this.buckets.length - 1].bucket.length - 1
    ];
  }
  shift() {
    const out = this.buckets[0].bucket.shift();
    this.index.decreaseLength(0);
    this.buckets[0].max =
      this.buckets[0].bucket[this.buckets[0].bucket.length - 1];
    if (this.buckets[0].bucket.length === 0) {
      if (this.length !== 1) {
        this.buckets.shift();
        this.#buildIndex();
      }
    }
    this.length = this.length - 1;
    return out;
  }
  pop() {
    const out = this.buckets[this.buckets.length - 1].bucket.pop();
    this.index.decreaseLength(this.buckets.length - 1);
    this.buckets[this.buckets.length - 1].max =
      this.buckets[this.buckets.length - 1].bucket[
        this.buckets[this.buckets.length - 1].bucket.length - 1
      ];
    if (this.buckets[this.buckets.length - 1].bucket.length === 0) {
      if (this.length !== 1) {
        this.buckets.pop();
        this.#buildIndex();
      }
    }
    this.length = this.length - 1;
    return out;
  }
  nextHigherKey(item) {
    const firstLevelIndex = this.#bucketIndexOf(item);
    const secondLevelIndex = this.buckets[fromFirstLevelIndex].indexOf(item);
    if (secondLevelIndex < this.buckets[firstLevelIndex].bucket.length - 2) {
      return this.buckets[firstLevelIndex].select(secondLevelIndex + 1);
    } else if (firstLevelIndex === this.buckets.length - 1) {
      return null;
    } else {
      return this.buckets[firstLevelIndex + 1].select(0);
    }
  }
  nextLowerKey(item) {
    const firstLevelIndex = this.#bucketIndexOf(item);
    const secondLevelIndex = this.buckets[firstLevelIndex].indexOf(item);
    if (secondLevelIndex > 0) {
      return this.buckets[firstLevelIndex].select(secondLevelIndex - 1);
    } else if (firstLevelIndex > 0) {
      return this.buckets[firstLevelIndex - 1].select(
        this.buckets[firstLevelIndex - 1].bucket[
          this.buckets[firstLevelIndex - 1].bucket.length
        ]
      );
    }
  }
  map(callbackFn, cmp, bucketSize) {
    const cmpFunc = cmp ?? this.cmp;
    const bS = bucketSize ?? this.bucketSize;
    const out = new IndexedSortedSet(cmpFunc, bS);
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        out.push(callbackFn([length, this.buckets[i].select(j)]));
        length += 1;
      }
    }
    return out;
  }
  filter(callbackFn, cmp, bucketSize) {
    const cmpFunc = cmp ?? this.cmp;
    const bS = bucketSize ?? this.bucketSize;
    const out = new IndexedSortedSet(cmpFunc, bS);
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        const item = [length, this.buckets[i].select(j)];
        if (callbackFn(item)) {
          out.push(this.buckets[i].select(j));
        }
        length += 1;
      }
    }
    return out;
  }
  filterToArray(callbackFn) {
    const out = [];
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        const item = [length, this.buckets[i].select(j)];
        if (callbackFn(item)) {
          out.push(this.buckets[i].select(j));
        }
        length += 1;
      }
    }
    return out;
  }
  every(callbackFn) {
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        const item = [length, this.buckets[i].select(j)];
        if (!callbackFn(item)) {
          return false;
        }
        length += 1;
      }
    }
    return true;
  }
  some(callbackFn) {
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        const item = [length, this.buckets[i].select(j)];
        if (callbackFn(item)) {
          return true;
        }
        length += 1;
      }
    }
    return false;
  }
  mapToArray(callbackFn) {
    const out = [];
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        out.push(callbackFn([length, this.buckets[i].select(j)]));
        length += 1;
      }
    }
    return out;
  }
  reduce(callbackFn, acc) {
    let value = acc;
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        value = callbackFn(value, [length, this.buckets[i].select(j)]);
        length += 1;
      }
    }
    return value;
  }
  reduceRight(callbackFn, acc) {
    let value = acc;
    let length = 0;
    for (let i = this.buckets.length - 1; i >= 0; i--) {
      for (let j = this.buckets[i].bucket.length - 1; j >= 0; j--) {
        value = callbackFn(value, [length, this.buckets[i].select(j)]);
        length += 1;
      }
    }
    return value;
  }
  forEach(callbackFn) {
    let length = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].bucket.length; j++) {
        callbackFn([length, this.buckets[i].bucket.select(j)]);
        length += 1;
      }
    }
  }
  *makeForwardCursorByIndex(from, to) {
    const [fromFirstLevelIndex, fromSecondLevelIndex] = this.#locate(from);
    const [toFirstLevelIndex, toSecondLevelIndex] = this.#locate(to);

    let length = from;
    for (let i = fromFirstLevelIndex; i <= toFirstLevelIndex; i++) {
      for (
        let j = fromFirstLevelIndex === i ? fromSecondLevelIndex : 0;
        j < this.buckets[i].bucket.length;
        j++
      ) {
        yield [length, this.buckets[i].select(j)];
        if (toFirstLevelIndex === i && toSecondLevelIndex === j) {
          break;
        }
        length += 1;
      }
    }
  }
  *makeForwardCursorByValue(from, to) {
    const fromFirstLevelIndex = this.#bucketIndexOf(from);
    const fromSecondLevelIndex =
      this.buckets[fromFirstLevelIndex].indexOf(from);
    const startingPoint =
      this.index.prefixSum(fromFirstLevelIndex) + fromSecondLevelIndex;
    const toFirstLevelIndex = this.#bucketIndexOf(to);

    let length = startingPoint;
    for (let i = fromFirstLevelIndex; i <= toFirstLevelIndex; i++) {
      for (
        let j = fromFirstLevelIndex === i ? fromSecondLevelIndex : 0;
        j < this.buckets[i].bucket.length;
        j++
      ) {
        yield [length, this.buckets[i].select(j)];
        if (
          this.cmp(this.buckets[i].select(j), to) &&
          this.cmp(to, this.buckets[i].select(j))
        ) {
          break;
        }
        length += 1;
      }
    }
  }
  *makeBackwardsCursor() {
    let length = this.length - 1;
    for (let i = this.buckets.length - 1; i >= 0; i--) {
      for (let j = this.buckets[i].bucket.length - 1; j >= 0; j--) {
        yield [length, this.buckets[i].select(j)];
        length -= 1;
      }
    }
  }
  *makeBackwardsCursorByIndex(from, to) {
    const [fromFirstLevelIndex, fromSecondLevelIndex] = this.#locate(from);
    const [toFirstLevelIndex, toSecondLevelIndex] = this.#locate(to);

    let length = from;
    for (let i = fromFirstLevelIndex; i >= toFirstLevelIndex; i--) {
      for (
        let j =
          fromFirstLevelIndex === i
            ? fromSecondLevelIndex
            : this.buckets[i].bucket.length - 1;
        j >= 0;
        j--
      ) {
        yield [length, this.buckets[i].select(j)];
        if (toFirstLevelIndex === i && toSecondLevelIndex === j) {
          break;
        }
        length -= 1;
      }
    }
  }
  *makeBackwardsCursorByValue(from, to) {
    const fromFirstLevelIndex = this.#bucketIndexOf(from);
    const fromSecondLevelIndex =
      this.buckets[fromFirstLevelIndex].indexOf(from);
    const startingPoint =
      this.index.prefixSum(fromFirstLevelIndex) + fromSecondLevelIndex;
    const toFirstLevelIndex = this.#bucketIndexOf(to);

    let length = startingPoint;
    for (let i = fromFirstLevelIndex; i >= toFirstLevelIndex; i--) {
      for (
        let j =
          fromFirstLevelIndex === i
            ? fromSecondLevelIndex
            : this.buckets[i].bucket.length - 1;
        j >= 0;
        j--
      ) {
        yield [length, this.buckets[i].select(j)];
        if (
          this.cmp(this.buckets[i].select(j), to) &&
          this.cmp(to, this.buckets[i].select(j))
        ) {
          break;
        }
        length -= 1;
      }
    }
  }
  sliceByIndex(from, to) {
    const [fromFirstLevelIndex, fromSecondLevelIndex] = this.#locate(from);
    const [toFirstLevelIndex, toSecondLevelIndex] = this.#locate(to);
    const bucketArray = [];

    if (fromFirstLevelIndex === toFirstLevelIndex) {
      bucketArray.push(
        this.buckets[fromFirstLevelIndex].bucket.slice(
          fromSecondLevelIndex,
          toSecondLevelIndex + 1
        )
      );
    } else {
      const firstSlice =
        this.buckets[fromFirstLevelIndex].bucket.slice(fromSecondLevelIndex);
      const lastSlice = this.buckets[toFirstLevelIndex].bucket.slice(
        0,
        toSecondLevelIndex + 1
      );
      bucketArray.push(firstSlice);
      if (toFirstLevelIndex - fromFirstLevelIndex > 1) {
        for (const sortedArray of this.buckets.slice(
          fromFirstLevelIndex + 1,
          toFirstLevelIndex
        )) {
          bucketArray.push(sortedArray.bucket);
        }
      }
      bucketArray.push(lastSlice);
    }
    const newIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);
    newIndexedSortedSet.fromPreBucketedArray(bucketArray);

    return newIndexedSortedSet;
  }
  sliceByValue(from, to) {
    const fromFirstLevelIndex = this.#bucketIndexOf(from);
    const fromSecondLevelIndex =
      this.buckets[fromFirstLevelIndex].indexOf(from);
    const toFirstLevelIndex = this.#bucketIndexOf(to);
    const toSecondLevelIndex = this.buckets[toFirstLevelIndex].indexOf(to);

    const bucketArray = [];

    if (fromFirstLevelIndex === toFirstLevelIndex) {
      bucketArray.push(
        this.buckets[fromFirstLevelIndex].bucket.slice(
          fromSecondLevelIndex,
          toSecondLevelIndex + 1
        )
      );
    } else {
      const firstSlice =
        this.buckets[fromFirstLevelIndex].bucket.slice(fromSecondLevelIndex);
      const lastSlice = this.buckets[toFirstLevelIndex].bucket.slice(
        0,
        toSecondLevelIndex + 1
      );
      bucketArray.push(firstSlice);
      if (toFirstLevelIndex - fromFirstLevelIndex > 1) {
        for (const sortedArray of this.buckets.slice(
          fromFirstLevelIndex + 1,
          toFirstLevelIndex
        )) {
          bucketArray.push(sortedArray.bucket);
        }
      }
      bucketArray.push(lastSlice);
    }
    const newIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);
    newIndexedSortedSet.fromPreBucketedArray(bucketArray);

    return newIndexedSortedSet;
  }
  spliceByIndex(from, to) {
    const [fromFirstLevelIndex, fromSecondLevelIndex] = this.#locate(from);
    const [toFirstLevelIndex, toSecondLevelIndex] = this.#locate(to);

    if (fromFirstLevelIndex === toFirstLevelIndex) {
      this.buckets[fromFirstLevelIndex].bucket.splice(
        fromSecondLevelIndex,
        fromSecondLevelIndex - toSecondLevelIndex
      );
    } else {
      this.length -=
        this.buckets[fromFirstLevelIndex].bucket.length - fromSecondLevelIndex;
      this.buckets[fromFirstLevelIndex].bucket.splice(fromSecondLevelIndex);
      this.buckets[fromFirstLevelIndex].max =
        this.buckets[fromFirstLevelIndex].bucket[
          this.buckets[fromFirstLevelIndex].bucket.length - 1
        ];
      this.length -= toSecondLevelIndex + 1;
      this.buckets[toFirstLevelIndex].bucket.splice(0, toSecondLevelIndex + 1);
      this.buckets[toFirstLevelIndex].max =
        this.buckets[toFirstLevelIndex].bucket[
          this.buckets[toFirstLevelIndex].bucket.length - 1
        ];
      if (toFirstLevelIndex - fromFirstLevelIndex > 1) {
        for (let i = fromFirstLevelIndex + 1; i < toFirstLevelIndex; i++) {
          this.length -= this.buckets[i].bucket.length;
        }
        this.buckets.splice(fromFirstLevelIndex + 1, toFirstLevelIndex);
      }
    }
    this.#buildIndex();
  }
  spliceByValue(from, to) {
    const fromFirstLevelIndex = this.#bucketIndexOf(from);
    const fromSecondLevelIndex =
      this.buckets[fromFirstLevelIndex].indexOf(from);
    const toFirstLevelIndex = this.#bucketIndexOf(to);
    const toSecondLevelIndex = this.buckets[toFirstLevelIndex].indexOf(to);

    if (fromFirstLevelIndex === toFirstLevelIndex) {
      this.buckets[fromFirstLevelIndex].bucket.splice(
        fromSecondLevelIndex,
        fromSecondLevelIndex - toSecondLevelIndex
      );
    } else {
      this.length -=
        this.buckets[fromFirstLevelIndex].bucket.length - fromSecondLevelIndex;
      this.buckets[fromFirstLevelIndex].bucket.splice(fromSecondLevelIndex);
      this.buckets[fromFirstLevelIndex].max =
        this.buckets[fromFirstLevelIndex].bucket[
          this.buckets[fromFirstLevelIndex].bucket.length - 1
        ];
      this.length -= toSecondLevelIndex + 1;
      this.buckets[toFirstLevelIndex].bucket.splice(0, toSecondLevelIndex + 1);
      this.buckets[toFirstLevelIndex].max =
        this.buckets[toFirstLevelIndex].bucket[
          this.buckets[toFirstLevelIndex].bucket.length - 1
        ];
      if (toFirstLevelIndex - fromFirstLevelIndex > 1) {
        for (let i = fromFirstLevelIndex + 1; i < toFirstLevelIndex; i++) {
          this.length -= this.buckets[i].bucket.length;
        }
        this.buckets.splice(fromFirstLevelIndex + 1, toFirstLevelIndex);
      }
    }
    this.#buildIndex();
  }
  fromPreBucketedArray(preBucketedAndSortedArray) {
    const arraySets = new Array(preBucketedAndSortedArray.length);
    let length = 0;
    for (let i = 0; i < arraySets.length; i++) {
      let arraySet = new SortedArraySet(this.cmp);
      arraySet.bucket = preBucketedAndSortedArray[i];
      arraySet.max = arraySet.bucket[arraySet.bucket.length - 1];
      arraySets[i] = arraySet;
      length = length + preBucketedAndSortedArray[i].length;
    }
    this.buckets = arraySets;
    this.length = length;
    this.#buildIndex();
  }
  toArray() {
    const flatSortedArray = [];
    for (const item of this.buckets) {
      flatSortedArray.push(...item.bucket);
    }
    return flatSortedArray;
  }
  push(item) {
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
        this.index = new FenwickArray(this.buckets, true);
      }
      this.length = this.length - 1;
      return deletion;
    }
  }
  deleteByIndex(nth) {
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
          this.index = new FenwickArray(this.buckets, true);
        }
        this.length = this.length - 1;
        return removal;
      }
    }
  }
  union(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0,
      productOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0,
      productInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    const product = [[]],
      productIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);

    while (leftIterator + rightIterator < rightLength + leftLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      if (product[productOuterIterator].length === this.bucketSize) {
        product.push([]);
        productOuterIterator = productOuterIterator + 1;
        productInnerIterator = -1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (leftIterator >= leftLength) {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentRightValue);
      } else if (rightIterator >= rightLength) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentRightValue);
      }
    }
    productIndexedSortedSet.fromPreBucketedArray(product);
    return productIndexedSortedSet;
  }
  intersection(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0,
      productOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0,
      productInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    const product = [[]],
      productIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      if (product[productOuterIterator].length === this.bucketSize) {
        product.push([]);
        productOuterIterator = productOuterIterator + 1;
        productInnerIterator = -1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }
    productIndexedSortedSet.fromPreBucketedArray(product);
    return productIndexedSortedSet;
  }
  difference(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0,
      productOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0,
      productInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    const product = [[]],
      productIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);

    while (leftIterator + rightIterator < rightLength + leftLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      if (product[productOuterIterator].length === this.bucketSize) {
        product.push([]);
        productOuterIterator = productOuterIterator + 1;
        productInnerIterator = -1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (leftIterator >= leftLength) {
        break;
      } else if (rightIterator >= rightLength) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentRightValue);
      }
    }
    productIndexedSortedSet.fromPreBucketedArray(product);
    return productIndexedSortedSet;
  }
  symmetricDifference(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0,
      productOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0,
      productInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    const product = [[]],
      productIndexedSortedSet = new IndexedSortedSet(this.cmp, this.bucketSize);

    while (leftIterator + rightIterator < rightLength + leftLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      if (product[productOuterIterator].length === this.bucketSize) {
        product.push([]);
        productOuterIterator = productOuterIterator + 1;
        productInnerIterator = -1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (leftIterator >= leftLength) {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentRightValue);
      } else if (rightIterator >= rightLength) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentLeftValue);
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
        productInnerIterator = productInnerIterator + 1;
        product[productOuterIterator].push(currentRightValue);
      }
    }
    productIndexedSortedSet.fromPreBucketedArray(product);
    return productIndexedSortedSet;
  }
  sameAs(otherIndexedSortedSet) {
    let eq = true;
    if (this.length !== otherIndexedSortedSet.length) {
      eq = false;
      return eq;
    }
    const leftCursor = this.makeForwardCursor();
    const rightCursor = otherIndexedSortedSet.makeForwardCursor();

    while (true) {
      const leftCursorIteration = leftCursor.next();
      const leftValue = leftCursorIteration.value;
      const leftStatus = leftCursorIteration.done;
      const rightCursorIteration = rightCursor.next();
      const rightValue = rightCursorIteration.value;
      const rightStatus = rightCursorIteration.done;
      if (leftStatus !== true && rightStatus !== true) {
        if (
          !(
            this.cmp(leftValue[1], rightValue[1]) &&
            this.cmp(rightValue[1], leftValue[1])
          )
        ) {
          eq = false;
          return eq;
        }
      } else {
        break;
      }
    }
    return eq;
  }
  isDisjointWith(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    let isDisjoint = true;

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        isDisjoint = false;
        return isDisjoint;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }
    return isDisjoint;
  }
  isEmpty() {
    return this.length === 0;
  }
  isSubsetOf(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    let matches = 0;

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        matches = matches + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }

    if (matches === this.length) {
      return true;
    } else {
      return false;
    }
  }
  isProperSubsetOf(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    let matches = 0;

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        matches = matches + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }

    if (
      matches === this.length &&
      this.length !== otherIndexedSortedSet.length
    ) {
      return true;
    } else {
      return false;
    }
  }
  isSupersetOf(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    let matches = 0;

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        matches = matches + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }

    if (matches === otherIndexedSortedSet.length) {
      return true;
    } else {
      return false;
    }
  }
  isProperSupersetOf(otherIndexedSortedSet) {
    let leftOuterIterator = 0,
      rightOuterIterator = 0;

    let leftInnerIterator = 0,
      rightInnerIterator = 0;

    let leftIterator = 0,
      rightIterator = 0;

    const leftLength = this.length,
      rightLength = otherIndexedSortedSet.length;

    let matches = 0;

    while (leftIterator < leftLength && rightIterator < rightLength) {
      if (
        rightInnerIterator >
          otherIndexedSortedSet.buckets[rightOuterIterator].bucket.length - 1 &&
        rightIterator < rightLength
      ) {
        rightInnerIterator = 0;
        rightOuterIterator = rightOuterIterator + 1;
      }
      if (
        leftInnerIterator > this.buckets[leftOuterIterator].bucket.length - 1 &&
        leftIterator < leftLength
      ) {
        leftInnerIterator = 0;
        leftOuterIterator = leftOuterIterator + 1;
      }
      const currentLeftValue =
          this.buckets[leftOuterIterator].select(leftInnerIterator),
        currentRightValue =
          otherIndexedSortedSet.buckets[rightOuterIterator].select(
            rightInnerIterator
          );
      if (
        this.cmp(currentLeftValue, currentRightValue) &&
        this.cmp(currentRightValue, currentLeftValue)
      ) {
        leftInnerIterator = leftInnerIterator + 1;
        rightInnerIterator = rightInnerIterator + 1;
        leftIterator = leftIterator + 1;
        rightIterator = rightIterator + 1;
        matches = matches + 1;
      } else if (this.cmp(currentLeftValue, currentRightValue)) {
        leftInnerIterator = leftInnerIterator + 1;
        leftIterator = leftIterator + 1;
      } else {
        rightInnerIterator = rightInnerIterator + 1;
        rightIterator = rightIterator + 1;
      }
    }

    return (
      matches === otherIndexedSortedSet.length &&
      this.length !== otherIndexedSortedSet.length
    );
  }
}
export { IndexedSortedSet };
