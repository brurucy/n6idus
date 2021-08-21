class SortedArraySet {
  constructor(cmp) {
    this.bucket = [];
    this.max = undefined;
    this.cmp = cmp;
  }
  // gets the nth element
  select(nth) {
    if (nth < 0 || nth >= this.bucket.length) {
      return null;
    } else {
      return this.bucket[nth];
    }
  }
  indexOf(item) {
    let low = 0,
      high = this.bucket.length,
      mid = 0;

    while (low < high) {
      mid = (low + high) >>> 1;
      let midVal = this.bucket[mid];
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
  has(item) {
    const position = this.indexOf(item);
    if (
      this.bucket[position] !== undefined &&
      this.cmp(this.bucket[position], item) &&
      this.cmp(item, this.bucket[position])
    ) {
      return true;
    } else {
      return false;
    }
  }
  add(item) {
    const position = this.indexOf(item);
    if (
      this.bucket[position] !== undefined &&
      this.cmp(this.bucket[position], item) &&
      this.cmp(item, this.bucket[position])
    ) {
      return null;
    } else {
      this.bucket.splice(position, 0, item);
      if (this.max === undefined || this.cmp(this.max, item)) {
        this.max = item;
      }
      return item;
    }
  }
  // deletes by value
  delete(item) {
    const position = this.indexOf(item);
    if (
      this.bucket[position] !== undefined &&
      this.cmp(this.bucket[position], item) &&
      this.cmp(item, this.bucket[position])
    ) {
      this.bucket.splice(position, 1);
      if (this.cmp(this.max, item) && this.cmp(item, this.max)) {
        this.max = this.bucket[this.bucket.length - 1];
      }
      return item;
    } else {
      return null;
    }
  }
  // removes by position
  remove(nth) {
    const item = this.select(nth);
    if (item === null) {
      return null;
    } else {
      this.bucket.splice(nth, 1);
      if (this.cmp(this.max, item) && this.cmp(item, this.max)) {
        if (this.bucket.length !== 0) {
          this.max = this.bucket[this.bucket.length - 1];
        } else {
          this.max = undefined;
        }
      }
      return item;
    }
  }
}

export { SortedArraySet };
