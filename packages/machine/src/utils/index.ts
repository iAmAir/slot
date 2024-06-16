/**
 * getRandomValue
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение 
 * @returns {number} - возвращает рандомное число в промежутке между min и max
 */
export function getRandomValue(min: number, max: number): number {
	let rand = min + Math.random() * (max + 1 - min);

	return Math.floor(rand);
}

/**
 * getRandomArray
 * @description получает случайных элемент из массива
 * @param {T[]} array - массив элементов
 * @param {number} beginIndex - стартовый индекс
 * @param {number} endIndex - конечный индекс
 * @returns {T} - случайный элемент из массива
 */
export function getRandomArray<T extends any>(array: T[], beginIndex: number = 0, endIndex?: number): T {
	const end = endIndex ?? array.length - 1;
	const index = getRandomValue(beginIndex, end);

	return array[index];
}