/**
 * itterative function
 * complexity: O(n) -> linear time as it loops from 1 to n
 * effeciency:
 * - easy to understand but if n is large it'll slow
 */
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * math formula (Gauss' formula)
 * complexity: O(1) - constant time, single calculation
 * effeciency:
 * most effecient regardless of n
 */
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

/**
 * recurisve function
 * complexity: O(n) - makes n recursive calls
 * effeciency:
 * can cause stack overflow for large n and uses more memory
 */
function sum_to_n_c(n: number): number {
    if (n <= 1) return n;
    return n + sum_to_n_c(n - 1);
}