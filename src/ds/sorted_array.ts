import { defaultComparator, indexOf } from "../utils/utils";

export class SortedArraySet<K = any> {
  private readonly bucket: K[];
  private max: K | undefined;
  private readonly compare: (a: K, b: K) => number;

  public constructor(compare?: (a: K, b: K) => number) {
    this.compare =
      compare || (defaultComparator as any as (a: K, b: K) => number);
    this.bucket = [];
  }

  public getMax(): K | undefined {
    return this.max
  }
  public select(nth: number): K | undefined {
    if (nth < 0 || nth >= this.bucket.length) {
      return undefined;
    } else {
      return this.bucket[nth];
    }
  }
  public indexOf(item: K): number {
    return indexOf<K>(this.bucket, this.bucket.length, item, this.compare)
  }
  public add(item: K): K | undefined {
    const position = this.indexOf(item);
    if (this.compare(this.bucket[position], item) == 0) {
      return undefined;
    } else {
      this.bucket.splice(position, 0, item);
      if (this.max === undefined || this.compare(this.max, item)) {
        this.max = item;
      }
      return item;
    }
  }
  public delete(item: K): K | undefined {
    const position = this.indexOf(item);
    if (this.compare(this.bucket[position], item) == 0) {
      this.bucket.splice(position, 1);
      if (this.max != undefined) {
        if (this.compare(this.max, item) <= 0) {
          this.max = this.bucket[this.bucket.length - 1];
        }
      }
      return item;
    } else {
      return undefined;
    }
  }
  public has(item: K): boolean {
    const position = this.indexOf(item);
    return this.compare(this.bucket[position], item) == 0;
  }
  public remove(nth: number): K | undefined {
    const item = this.select(nth);
    if (item === undefined) {
      return undefined;
    } else {
      this.bucket.splice(nth, 1);
      if (this.max != undefined) {
        if (this.compare(this.max, item) <= 0) {
          if (this.bucket.length !== 0) {
            this.max = this.bucket[this.bucket.length - 1];
          } else {
            this.max = undefined;
          }
        }
      }
      return item;
    }
  }
}
