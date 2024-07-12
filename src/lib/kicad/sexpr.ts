const SPACE = /[ \r\n\t]/;
const ATOM = /[^\(\)'"\r\n\t ]/;
const NUMBER = /^-?\d+(?:\.\d+)?$/;

type Sexpr = string | number | Sexpr[];

/**
 * Parses an atom starting from the given index in the source string.
 * @param source The source string.
 * @param currentIndex The current index in the source string.
 * @returns A tuple of the parsed atom and the new index.
 */
const parseAtom = (source: string, currentIndex: number): [Sexpr, number] => {
	const start = currentIndex;
	while (currentIndex < source.length && ATOM.test(source[currentIndex])) {
		currentIndex++;
	}
	const atom = source.substring(start, currentIndex);
	return NUMBER.test(atom) ? [Number(atom), currentIndex] : [atom, currentIndex];
};

/**
 * Parses a string enclosed in quotes from the source string.
 * @param source The source string.
 * @param currentIndex The current index in the source string.
 * @param quote The quote character (either ' or ").
 * @returns A tuple of the parsed string and the new index.
 */
const parseString = (source: string, currentIndex: number, quote: string): [string, number] => {
	const start = currentIndex;
	currentIndex++;
	while (currentIndex < source.length && source[currentIndex] !== quote) {
		currentIndex++;
	}
	if (currentIndex === source.length) {
		throw new Error(`Parse error: Unterminated string at index ${start}`);
	}
	currentIndex++;
	return [source.substring(start + 1, currentIndex - 1), currentIndex];
};

/**
 * Parses an S-expression from the source string.
 * @param source The source string.
 * @param currentIndex The current index in the source string.
 * @returns A tuple of the parsed S-expression and the new index.
 */
const parseSexp = (source: string, currentIndex: number): [Sexpr[], number] => {
	while (currentIndex < source.length && SPACE.test(source[currentIndex])) {
		currentIndex++;
	}
	if (source[currentIndex] !== '(') {
		throw new Error(`Parse error: Expected '(' at index ${currentIndex}`);
	}
	currentIndex++;
	const items: Sexpr[] = [];
	while (currentIndex < source.length) {
		if (source[currentIndex] === ')') {
			return [items, currentIndex + 1];
		} else if (source[currentIndex] === '(') {
			const [nestedSexp, newIndex] = parseSexp(source, currentIndex);
			items.push(nestedSexp);
			currentIndex = newIndex;
		} else if (source[currentIndex] === '"' || source[currentIndex] === "'") {
			const [string, newIndex] = parseString(source, currentIndex, source[currentIndex]);
			items.push(string);
			currentIndex = newIndex;
		} else if (SPACE.test(source[currentIndex])) {
			currentIndex++;
		} else {
			const [atom, newIndex] = parseAtom(source, currentIndex);
			items.push(atom);
			currentIndex = newIndex;
		}
	}
	throw new Error(`Parse error: Unexpected end of input at index ${currentIndex}`);
};

const sexp = (source: string): Sexpr => {
	const [result, _] = parseSexp(source, 0);
	return result;
};

export default sexp;
export type { Sexpr };
