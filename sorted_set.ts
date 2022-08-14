import { SortedArraySet } from "./sorted_array.js";
import { FenwickArray } from "./fenwick_array.js";
import { indexOf, defaultComparator } from "./utils.js";

type PositionAndValue<K> = [number, K | undefined];
type PositionAndValueIterator<K> = IteratorResult<PositionAndValue<K>, void>;
type PositionAndValueGenerator<K> = Generator<
  PositionAndValue<K>,
  void,
  boolean
>;

function drainGenerator<K>(
  currentValue: PositionAndValueIterator<K>,
  generator: PositionAndValueGenerator<K>,
  outputSet: IndexedSortedArraySet<K>
): void {
  if (!currentValue.done) {
    while (!currentValue.done) {
      const value = currentValue.value[1];
      if (value != undefined) {
        outputSet.append(value);
      }
      currentValue = generator.next(true);
    }
  }
}

export default class IndexedSortedArraySet<K = any> implements Iterable<K> {
  public readonly buckets: SortedArraySet<K>[];
  private readonly bucketSize: number;
  private readonly compare: (a: K, b: K) => number;
  public length: number = 0;
  private index: FenwickArray = new FenwickArray([0]);

  constructor(bucketSize?: number, compare?: (a: K, b: K) => number) {
    this.compare =
      compare || (defaultComparator as any as (a: K, b: K) => number);
    this.bucketSize = bucketSize || 1000;
    this.buckets = new Array<SortedArraySet<K>>(1);
    this.buckets[0] = new SortedArraySet<K>(this.compare);
  }

  private buildIndex() {
    this.index = new FenwickArray(
      this.buckets,
      (sortedArraySet: SortedArraySet) => {
        return sortedArraySet.length();
      }
    );
  }

  public toString(): string {
    const flattenedOutput = new Array<K>()
    for (const item of this) {
      flattenedOutput.push(item)
    }
    return flattenedOutput.toString()
  }

  public [Symbol.iterator](): Iterator<K> {
    let coordinates: [number, number] = [0, -1];
    let value: K;

    return {
      next: () => {
        const nextCoordinates = this.locateNextOrPrevious(
          [coordinates[0], coordinates[1]],
          true
        );
        if (nextCoordinates != undefined) {
          coordinates = nextCoordinates;
          const selection = this.buckets[coordinates[0]].select(coordinates[1]);
          if (selection != undefined) {
            value = selection;
            return {
              done: false,
              value: value,
            };
          }
        }
        return {
          done: true,
          value: value,
        };
      },
    };
  }

  private balance(firstLevelIndex: number): void {
    const proposedBucket = this.buckets[firstLevelIndex].bucket;
    const half = Math.ceil(proposedBucket.length / 2);
    const newBucketContents = proposedBucket.slice(half, proposedBucket.length);
    const oldBucketContents = proposedBucket.slice(0, half);

    const newArraySet = new SortedArraySet(this.compare);
    this.buckets[firstLevelIndex] = new SortedArraySet(this.compare);

    newArraySet.bucket = newBucketContents;

    this.buckets[firstLevelIndex].bucket = oldBucketContents;

    newArraySet.max = newArraySet.bucket[newArraySet.bucket.length - 1];

    this.buckets[firstLevelIndex].max =
      this.buckets[firstLevelIndex].bucket[
        this.buckets[firstLevelIndex].bucket.length - 1
      ];

    this.buckets.splice(firstLevelIndex + 1, 0, newArraySet);
    this.buildIndex();
  }

  private bucketsIndexOf(item: K): number {
    return indexOf(
        this.buckets,
        this.buckets.length,
        item,
        (bucket: SortedArraySet<K>, item: K) => {
          if (bucket.max == undefined) {
            return -1;
          }
          return this.compare(bucket.max, item);
        }
    )
  }

  public push(item: K): K | undefined {
    let firstLevelIndex = this.bucketsIndexOf(item);
    if (this.buckets[firstLevelIndex] === undefined) {
      firstLevelIndex = firstLevelIndex - 1;
    }
    const add = this.buckets[firstLevelIndex].add(item);
    if (add === undefined) {
      return undefined;
    }
    if (this.buckets[firstLevelIndex].bucket.length > this.bucketSize) {
      this.balance(firstLevelIndex);
    } else {
      this.index.increaseLength(firstLevelIndex);
    }
    this.length += 1;
    return add;
  }
  // **Use this function carefully**
  // Only when you are absolutely sure that you are adding an element that:
  // 1. Is not already in
  // 2. Is greater than all other elements currently in
  public append(item: K): K {
    let lastBucketPosition = this.buckets.length - 1;
    if (this.buckets[lastBucketPosition].length() < this.bucketSize - 1) {
      this.buckets[lastBucketPosition].bucket.push(item);
      this.index.increaseLength(lastBucketPosition);
    } else {
      this.buckets.push(new SortedArraySet<K>());
      lastBucketPosition += 1;
      this.buckets[lastBucketPosition].bucket.push(item);
      this.buildIndex();
    }
    this.buckets[lastBucketPosition].max = item;
    return item;
  }

  public delete(item: K): K | undefined {
    let firstLevelIndex = this.bucketsIndexOf(item);
    if (this.buckets[firstLevelIndex] === undefined) {
      firstLevelIndex = firstLevelIndex - 1
    }
    const deletion = this.buckets[firstLevelIndex].delete(item)
    if (deletion === undefined) {
      return undefined;
    }
    if (this.buckets[firstLevelIndex].bucket.length === 0) {
      if (this.buckets.length != 1) {
        this.buckets.splice(firstLevelIndex, 1)
      }
      this.buildIndex()
    } else {
      this.index.decreaseLength(firstLevelIndex)
    }
    this.length -= 1;
    return deletion
  }

  public remove(nth: number): K | undefined {
    const coordinates = this.locate(nth)
    if (coordinates === undefined) {
      return undefined
    }
    const firstLevelIndex = coordinates[0]
    const removal = this.buckets[firstLevelIndex].remove(coordinates[1])
    if (removal === undefined) {
      return undefined;
    }
    if (this.buckets[firstLevelIndex].bucket.length === 0) {
      if (this.buckets.length != 1) {
        this.buckets.splice(firstLevelIndex, 1)
      }
      this.buildIndex()
    } else {
      this.index.decreaseLength(firstLevelIndex)
    }
    this.length -= 1;
    return removal
  }

  protected locate(nth: number): undefined | [number, number] {
    if (nth >= this.length || nth < 0) {
      return undefined;
    }
    const firstLevelIndex = this.index.indexOf(nth);
    let offset: number | undefined = 0;
    if (firstLevelIndex !== 0) {
      offset = this.index.prefixSum(firstLevelIndex);
    }
    // This will never happen, since indexOf cannot return a value greater than length.
    if (offset === undefined) {
      return undefined;
    }
    return [firstLevelIndex, nth - offset];
  }

  private locateNextOrPrevious(
    coordinates: [number, number],
    next: boolean
  ): undefined | [number, number] {
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

  /* Creates a possibly infinite cursor that can have its traversal direction
     changed at any given time
   */
  public *makeCursor(
    from: number,
    forward: boolean
  ): Generator<[number, K | undefined], void, boolean> {
    let currentIndex = from;
    const coordinates = this.locate(currentIndex);
    if (coordinates == undefined) {
      return;
    }
    let firstLevelIndex: number = coordinates[0];
    let secondLevelIndex: number = coordinates[1];

    while (true) {
      if (currentIndex > this.length - 1 || currentIndex < 0) {
        break;
      }
      forward = yield [
        currentIndex,
        this.buckets[firstLevelIndex].select(secondLevelIndex),
      ];

      const newCoordinates = this.locateNextOrPrevious(
        [firstLevelIndex, secondLevelIndex],
        forward
      );
      if (newCoordinates == undefined) {
        break;
      }
      firstLevelIndex = newCoordinates[0];
      secondLevelIndex = newCoordinates[1];

      if (forward) {
        currentIndex += 1;
      } else {
        currentIndex -= 1;
      }
    }
  }

  private binaryIteratingOperation(
    otherIndexedSortedArraySet: IndexedSortedArraySet<K>,
    incrementGreater: boolean,
    incrementEqual: boolean,
    incrementLess: boolean,
    drainA: boolean,
    drainB: boolean
  ): IndexedSortedArraySet<K> {
    const A = this.makeCursor(0, true);
    const B = otherIndexedSortedArraySet.makeCursor(0, true);

    let currentValueA = A.next(true);
    let currentValueB = B.next(true);

    const outputIndexedSortedArraySet = new IndexedSortedArraySet(
      this.bucketSize,
      this.compare
    );
    while (!currentValueA.done && !currentValueB.done) {
      if (
        currentValueA.value[1] != undefined &&
        currentValueB.value[1] != undefined
      ) {
        const cmp = this.compare(
          currentValueA.value[1],
          currentValueB.value[1]
        );
        if (cmp > 0) {
          if (
              incrementGreater
          ) {
            outputIndexedSortedArraySet.append(currentValueB.value[1])
          }
          currentValueB = B.next(true)
        } else if (cmp == 0) {
          if (
              incrementEqual
          ) {
            outputIndexedSortedArraySet.append(currentValueA.value[1])
          }
          [currentValueA, currentValueB] = [A.next(true), B.next(true)]
        } else {
          if (
              incrementLess
          ) {
            outputIndexedSortedArraySet.append(currentValueA.value[1])
          }
          currentValueA = A.next(true)
        }
      }
    }
    if (drainA) {
      drainGenerator(currentValueA, A, outputIndexedSortedArraySet);
    }
    if (drainB) {
      drainGenerator(currentValueB, B, outputIndexedSortedArraySet);
    }
    return outputIndexedSortedArraySet;
  }

  public intersection(
    otherIndexedSortedArraySet: IndexedSortedArraySet<K>
  ): IndexedSortedArraySet<K> {
    return this.binaryIteratingOperation(
        otherIndexedSortedArraySet,
        false,
        true,
        false,
        false,
        false,
    );
  }

  public union(
    otherIndexedSortedArraySet: IndexedSortedArraySet<K>
  ): IndexedSortedArraySet<K> {
    return this.binaryIteratingOperation(
        otherIndexedSortedArraySet,
        true,
        true,
        true,
        true,
        true,
    );
  }

  public difference(
    otherIndexedSortedArraySet: IndexedSortedArraySet<K>
  ): IndexedSortedArraySet<K> {
    return this.binaryIteratingOperation(
        otherIndexedSortedArraySet,
        false,
        false,
        true,
        true,
        false,
    );
  }

  public symmetricDifference(
    otherIndexedSortedArraySet: IndexedSortedArraySet<K>
  ): IndexedSortedArraySet<K> {
    return this.binaryIteratingOperation(
        otherIndexedSortedArraySet,
        true,
        false,
        true,
        true,
        true,
    );
  }
  // set equality operations
  // map/foreach/filter/reduce
  public filter(
      callbackFn: (item: K) => boolean
  ) {
    const out = new IndexedSortedArraySet<K>(this.bucketSize, this.compare)
    for (const item of this) {
      if (callbackFn(item)) {
        out.append(item)
      }
    }
    return out
  }

  public map<V>(
      callbackFn: (item: K) => V,
      newCmp?: (a: V, b: V) => number
  ) {
    const out = new IndexedSortedArraySet<V>(this.bucketSize, newCmp)
    for (const item of this) {
      out.push(callbackFn(item))
    }
    return out
  }

  public reduce<V>(
      callbackFn: (accumulator: V, currentValue: K, currentIndex: number) => V,
      initialValue: V,
  ) {
    let acc = initialValue
    let currentPosition = 0;
    for (const item of this) {
      acc = callbackFn(acc, item, currentPosition)
      currentPosition += 1;
    }
    return acc
  }
}
