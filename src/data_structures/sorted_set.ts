import { SortedArraySet } from "./sorted_array";
import { FenwickArray } from "./fenwick_array";
import { indexOf, defaultComparator } from "../utils/utils";

type PositionAndValue<K> = [number, (K | undefined)]
type PositionAndValueIterator<K> = IteratorResult<PositionAndValue<K>, void>
type PositionAndValueGenerator<K> = Generator<PositionAndValue<K>, void, boolean>

type binaryIteratingFunction = <K>(currentValueA: PositionAndValueIterator<K>,
                                   A: PositionAndValueGenerator<K>,
                                   currentValueB: PositionAndValueIterator<K>,
                                   B: PositionAndValueGenerator<K>,
                                   outputIndexedSortedArraySet: IndexedSortedArraySet<K>) => [PositionAndValueIterator<K>, PositionAndValueIterator<K>]

export class IndexedSortedArraySet<K = any> {
    public readonly buckets: SortedArraySet<K>[];
    private readonly bucketSize: number
    private readonly compare: (a: K, b: K) => number;
    public length: number = 0;
    private index: FenwickArray = new FenwickArray([0])

    constructor(bucketSize?: number, compare?: (a: K, b: K) => number) {
        this.compare =
            compare || (defaultComparator as any as (a: K, b: K) => number);
        this.bucketSize =
            bucketSize || 1000;
        this.buckets = new Array<SortedArraySet<K>>(1)
        this.buckets[0] = new SortedArraySet<K>(this.compare);
    }

    private buildIndex() {
        this.index = new FenwickArray(this.buckets, (sortedArraySet: SortedArraySet) => {
            return sortedArraySet.length()
        });
    }

    private balance(firstLevelIndex: number): void {
        const proposedBucket = this.buckets[firstLevelIndex].bucket
        const half = Math.ceil(proposedBucket.length / 2);
        const newBucketContents = proposedBucket.slice(
            half,
            proposedBucket.length
        );
        const oldBucketContents = proposedBucket.slice(
            0,
            half
        );

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

    push(item: K): K | undefined {
        let firstLevelIndex = indexOf(this.buckets, this.buckets.length, item, (bucket: SortedArraySet<K>, item: K) => {
            if (bucket.max == undefined) {
                return -1
            }
            return this.compare(bucket.max, item)
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
        } else {
            this.index.increaseLength(firstLevelIndex);
        }
        this.length += 1;
        return add
    }
    // **Use this function carefully**
    // Only when you are absolutely sure that you are adding an element that:
    // 1. Is not already in
    // 2. Is greater than all other elements currently in
    append(item: K): K {
        let lastBucketPosition = this.buckets.length - 1
        if (this.buckets[lastBucketPosition].length() < this.bucketSize - 1) {
            this.buckets[lastBucketPosition].bucket.push(item)
            this.index.increaseLength(lastBucketPosition)
        } else {
            this.buckets.push(new SortedArraySet<K>())
            lastBucketPosition += 1;
            this.buckets[lastBucketPosition].bucket.push(item)
            this.buildIndex()
        }
        this.buckets[lastBucketPosition].max = item
        return item
    }

    protected locate(nth: number): undefined | [number, number] {
        if (nth >= this.length || nth < 0) {
            return undefined
        }
        const firstLevelIndex = this.index.indexOf(nth);
        let offset: number | undefined = 0;
        if (firstLevelIndex !== 0) {
            offset = this.index.prefixSum(firstLevelIndex)
        }
        // This will never happen, since indexOf cannot return a value greater than length.
        if (offset === undefined) {
            return undefined
        }
        return [firstLevelIndex, nth - offset];
    }

    private locateNextOrPrevious(coordinates: [number, number], next: boolean): undefined | [number, number] {
        const firstLevelIndex = coordinates[0]
        const secondLevelIndex = coordinates[1]
        const proposedBucket = this.buckets[firstLevelIndex]

        if (next) {
            if (proposedBucket.length() - 1 === secondLevelIndex) {
                if (this.buckets.length - 1 === firstLevelIndex) {
                    return undefined
                }
                return [firstLevelIndex+1, 0]
            }
            return [firstLevelIndex, secondLevelIndex+1]
        }
        if (secondLevelIndex - 1 >= 0) {
            return [firstLevelIndex, secondLevelIndex-1]
        }
        if (this.buckets.length - 1 >= 0) {
            return [firstLevelIndex-1, proposedBucket.length() - 1]
        }
        return undefined
    }

    public *makeCursor(from: number, forward: boolean): Generator<[number, K | undefined], void, boolean> {
        let currentIndex = from
        const coordinates = this.locate(currentIndex)
        if (coordinates == undefined) {
            return
        }
        let firstLevelIndex: number = coordinates[0]
        let secondLevelIndex: number = coordinates[1]

        while (true) {
            if (currentIndex > this.length - 1 || currentIndex < 0) {
                break
            }
            forward = yield [currentIndex, this.buckets[firstLevelIndex].select(secondLevelIndex)]

            const newCoordinates = this.locateNextOrPrevious([firstLevelIndex, secondLevelIndex], forward)
            if (newCoordinates == undefined) {
                break
            }
            firstLevelIndex = newCoordinates[0]
            secondLevelIndex = newCoordinates[1]

            if (forward) {
                currentIndex += 1;
            } else {
                currentIndex -= 1;
            }
        }
    }

    private binaryIteratingOperation(otherIndexedSortedArraySet: IndexedSortedArraySet<K>,
                                     fGreater: binaryIteratingFunction,
                                     fEq: binaryIteratingFunction,
                                     fLess: binaryIteratingFunction): IndexedSortedArraySet<K> {
        const A = this.makeCursor(0, true)
        const B = otherIndexedSortedArraySet.makeCursor(0, true)

        let currentValueA = A.next(true)
        let currentValueB = B.next(true)

        const outputIndexedSortedArraySet = new IndexedSortedArraySet(this.bucketSize, this.compare)
        while (!currentValueA.done && !currentValueB.done) {
            if (currentValueA.value[1] != undefined && currentValueB.value[1] != undefined) {
                const cmp = this.compare(currentValueA.value[1], currentValueB.value[1]);
                if (cmp > 0) {
                    [currentValueA, currentValueB] = fGreater(currentValueA, A, currentValueB, B, outputIndexedSortedArraySet)
                } else if (cmp == 0) {
                    [currentValueA, currentValueB] = fEq(currentValueA, A, currentValueB, B, outputIndexedSortedArraySet)
                } else {
                    [currentValueA, currentValueB] = fLess(currentValueA, A, currentValueB, B, outputIndexedSortedArraySet)
                }
            }
        }

        return outputIndexedSortedArraySet
    }

    public intersection(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K> {
        return this.binaryIteratingOperation(otherIndexedSortedArraySet,
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                return [currentValueA, B.next(true)]
            },
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore this will never be void since there is a check inside the parent function that prevents that
                // unfortunately typescript's type inference isn't advanced enough to go up the call stack
                outputIndexedSortedArraySet.append(currentValueA.value[1])
                return [A.next(true), B.next(true)]
            }, (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                return [A.next(true), currentValueB]
            })
    }

    public union(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K> {
        return this.binaryIteratingOperation(otherIndexedSortedArraySet,
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.push(currentValueB.value[1])
                // @ts-ignore
                outputIndexedSortedArraySet.push(currentValueA.value[1])
                return [A.next(true), B.next(true)]
            },
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.push(currentValueA.value[1])
                return [A.next(true), B.next(true)]
            }, (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.push(currentValueB.value[1])
                // @ts-ignore
                outputIndexedSortedArraySet.push(currentValueA.value[1])
                return [A.next(true), B.next(true)]
            })
    }

    public difference(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K> {
        return this.binaryIteratingOperation(otherIndexedSortedArraySet,
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                return [currentValueA, B.next(true)]
            },
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                return [A.next(true), B.next(true)]
            }, (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.append(currentValueA.value[1])
                return [A.next(true), currentValueB]
            })
    }

    public symmetricDifference(otherIndexedSortedArraySet: IndexedSortedArraySet<K>): IndexedSortedArraySet<K> {
        return this.binaryIteratingOperation(otherIndexedSortedArraySet,
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.append(currentValueB.value[1])
                return [currentValueA, B.next(true)]
            },
            (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                return [A.next(true), B.next(true)]
            }, (currentValueA, A, currentValueB, B, outputIndexedSortedArraySet) => {
                // @ts-ignore
                outputIndexedSortedArraySet.append(currentValueA.value[1])
                return [A.next(true), currentValueB]
            })
    }
}