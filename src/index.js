const mostSignificantBit = (value) => {
	let result = value;

	result |= result >> 1;
	result |= result >> 2;
	result |= result >> 4;
	result |= result >> 8;
	result |= result >> 16;
	result |= result >> 32;

	return result - (result >> 1);
};

const leastSignificantBit = (value) => {
	return value & -value;
};

class FenwickArray {
	innerStructure = [];
	constructor(arr) {
		this.#init(arr);
	}
	#init(arr) {
		const length = arr.length;
		this.innerStructure = new Array(length);
		this.innerStructure[0] = arr[0];
		for (let i = 1; i < arr.length; i++) {
			this.innerStructure[i] = this.innerStructure[i - 1] + arr[i];
		}
		for (let i = length - 1; i > 0; i--) {
			const lowerBound = (i & (i + 1)) - 1;
			if (lowerBound >= 0) {
				this.innerStructure[i] -= this.innerStructure[lowerBound];
			}
		}
	}
	prefixSum(index) {
		let sum = 0;
		while (index > 0) (sum += this.innerStructure[index - 1]), (index &= index - 1);
		return sum;
	}
	increaseLength(index) {
		const length = this.innerStructure.length;
		while (index < length) (this.innerStructure[index] += 1), (index |= index + 1);
	}
	decreaseLength(index) {
		const length = this.innerStructure.length;
		while (index < length) (this.innerStructure[index] -= 1), (index |= index + 1);
	}
	indexOf(ith) {
		const length = this.innerStructure.length;
		let ans = 0,
			x = mostSignificantBit(length) * 2,
			sum = 0;
		while (x && x === (x | 0)) {
			const lsb = leastSignificantBit(x);
			if (x <= length && this.innerStructure[x - 1] <= ith) {
				ith -= this.innerStructure[x - 1];
				sum += this.innerStructure[x - 1];
				ans = x;
				x += lsb / 2;
			} else {
				x += lsb / 2 - lsb;
			}
		}
		return ans;
	}
}

export { FenwickArray };
