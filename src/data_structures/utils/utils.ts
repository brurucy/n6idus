export declare type DefaultComparable =
  | number
  | string
  | Date
  | boolean
  | null
  | undefined
  | (number | string)[]
  | {
      valueOf: () =>
        | number
        | string
        | Date
        | boolean
        | null
        | undefined
        | (number | string)[];
    };

export function defaultComparator(
  a: DefaultComparable,
  b: DefaultComparable
): number {
  // Special case finite numbers first for performance.
  // Note that the trick of using 'a - b' and checking for NaN to detect non-numbers
  // does not work if the strings are numeric (ex: "5"). This would leading most
  // comparison functions using that approach to fail to have transitivity.
  if (Number.isFinite(a as any) && Number.isFinite(b as any)) {
    return (a as number) - (b as number);
  }

  // The default < and > operators are not totally ordered. To allow types to be mixed
  // in a single collection, compare types and order values of different types by type.
  let ta = typeof a;
  let tb = typeof b;
  if (ta !== tb) {
    return ta < tb ? -1 : 1;
  }

  if (ta === "object") {
    // standardized JavaScript bug: null is not an object, but typeof says it is
    if (a === null) return b === null ? 0 : -1;
    else if (b === null) return 1;

    a = a!.valueOf() as DefaultComparable;
    b = b!.valueOf() as DefaultComparable;
    ta = typeof a;
    tb = typeof b;
    // Deal with the two valueOf()s producing different types
    if (ta !== tb) {
      return ta < tb ? -1 : 1;
    }
  }

  // a and b are now the same type, and will be a number, string or array
  // (which we assume holds numbers or strings), or something unsupported.
  if (a! < b!) return -1;
  if (a! > b!) return 1;
  if (a === b) return 0;

  // Order NaN less than other numbers
  if (Number.isNaN(a as any)) return Number.isNaN(b as any) ? 0 : -1;
  else if (Number.isNaN(b as any)) return 1;
  // This could be two objects (e.g. [7] and ['7']) that aren't ordered
  return Array.isArray(a) ? 0 : Number.NaN;
}

export interface NumberIndexable<K> {
  [x: number]: K
}

export function indexOf<K, T>(container: NumberIndexable<K>, high: number, item: T, cmp: (a: K, b: T) => number): number {
  let low = 0,
      mid = 0;

  while (low < high) {
    mid = (low + high) >>> 1;
    let midVal = container[mid];
    if (cmp(midVal, item) < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return high;
}

export function mostSignificantBit(value: number): number {
    let result = value;

    result |= result >> 1;
    result |= result >> 2;
    result |= result >> 4;
    result |= result >> 8;
    result |= result >> 16;
    result |= result >> 32;

    return result - (result >> 1);
}

export function leastSignificantBit(value: number): number {
  return value & -value;
}