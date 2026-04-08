/**
 * Loop from 1 to n and add each number to a sum variable.
 * Complexity: O(n)
 * Space Complexity: O(1)
 */

func sum_to_n_a(n: number): number {
    let sum = 0;
	for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Use mathematical formula
 * Complexity: O(1)
 * Space Complexity: O(1)
 */

func sum_to_n_b(n: number): number {
	return n * (n + 1) / 2;
}

/**
 * Use recursion to add n to the sum of numbers from 1 to n.
 * Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 */

func sum_to_n_c(n: number): number {
    if (n < 1) {
        return 0;
    }
    return n + sum_to_n_c(n - 1);
}

