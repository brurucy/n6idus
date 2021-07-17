const join = (A, B, cmp) => {
  let indexA = 0;
  let indexB = 0;
  const lengthA = A.length;
  const lengthB = B.length;
  const products = [];

  while (indexA < lengthA && indexB < lengthB) {
    if (cmp(A[indexA], B[indexB]) & cmp(B[indexB], A[indexA])) {
      const product = [
        A[indexA][0],
        [A[indexA][1], A[indexA][2]],
        [B[indexB][1], B[indexB][2]],
      ];
      products.push(product);
      indexB = indexB + 1;
    } else if (cmp(A[indexA], B[indexB])) {
      indexA = indexA + 1;
    } else {
      indexB = indexB + 1;
    }
  }

  return products;
};

const antiJoin = (A, B, cmp) => {
  let indexA = 0;
  let indexB = 0;
  const lengthA = A.length;
  const lengthB = B.length;
  let difference = [];

  if (lengthB === 0) {
    difference = A;
  } else {
    while (indexA < lengthA && indexB < lengthB) {
      if (cmp(A[indexA], B[indexB]) & cmp(B[indexB], A[indexA])) {
        indexB = indexB + 1;
        indexA = indexA + 1;
      } else if (cmp(A[indexA], B[indexB])) {
        difference.push(A[indexA]);
        indexA = indexA + 1;
      } else {
        indexB = indexB + 1;
      }
    }
  }
  return difference;
};

const joinMap = (A, B, cmp, f) => {
  let indexA = 0;
  let indexB = 0;
  const lengthA = A.length;
  const lengthB = B.length;
  const products = [];

  while (indexA < lengthA && indexB < lengthB) {
    if (cmp(A[indexA], B[indexB]) & cmp(B[indexB], A[indexA])) {
      const product = [
        A[indexA][0],
        [A[indexA][1], A[indexA][2]],
        [B[indexB][1], B[indexB][2]],
      ];
      products.push(f(product));
      indexB = indexB + 1;
    } else if (cmp(A[indexA], B[indexB])) {
      indexA = indexA + 1;
    } else {
      indexB = indexB + 1;
    }
  }
  return products;
};

export { join, antiJoin, joinMap };
