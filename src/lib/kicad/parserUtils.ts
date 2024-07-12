import type { Sexpr } from '$lib/kicad/sexpr';

export const exist = (sexpr: Sexpr, key: string) =>
	Array.isArray(sexpr) ? sexpr.includes(key) : false;

export const get = <T>(sexpr: Sexpr, index: number): T => {
	if (Array.isArray(sexpr)) {
		const token = sexpr[index];
		if (typeof token !== 'undefined') {
			return token as T;
		}
	}
	return 0 as T;
};

export const each = (sexpr: Sexpr, callback: (sexpr: Sexpr) => void) => {
	if (Array.isArray(sexpr)) {
		sexpr.forEach((item) => {
			if (Array.isArray(item)) callback(item);
		});
	}
};

export const parse = (
	parsers: { [key: string]: (item: Sexpr) => any },
	sexpr: Sexpr,
	target: any
) => {
	each(sexpr, (item) => {
		let property = get<string>(item, 0);
		if (parsers[property]) {
			target[property] = parsers[property](item);
		}
	});
};
