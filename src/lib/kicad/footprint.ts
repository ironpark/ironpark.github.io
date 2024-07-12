import sexp, { type Sexpr } from '$lib/kicad/sexpr';
import { exist, get, parse } from '$lib/kicad/parserUtils';
import type { FpArc, FpLine, FpPad, FpRect, FpText } from '$lib/kicad/types/graphics';
import type { Effect, FpPoint, FpPosition, Stroke, FpFont, FpSize } from '$lib/kicad/types/types';
import { parseFpArc, parseFpLine, parseFpText, parsePad, parseRect } from '$lib/kicad/parser';

interface FootPrint {
	name: string;
	lines: FpLine[];
	texts: FpText[];
	arcs: FpArc[];
	pads: FpPad[];
	rects: FpRect[];
	width: number;
	height: number;
	center: FpPoint;
	box: {
		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
	};
}
const parseFootprint = (source: string): FootPrint | null => {
	let sexps = sexp(source);
	if (!sexps || get<string>(sexps, 0) !== 'footprint') {
		return null;
	}
	let footprint: FootPrint = {
		lines: [],
		name: '',
		pads: [],
		texts: [],
		arcs: [],
		rects: [],
		height: 0,
		width: 0,
		center: { x: 0, y: 0 },
		box: {
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	};
	footprint.name = get(sexps, 1);
	let maxX = 0;
	let maxY = 0;
	let minX = 0;
	let minY = 0;
	if (sexps instanceof Array) {
		sexps.forEach((sexp) => {
			if (sexp instanceof Array) {
				if (sexp[0] == 'fp_line') {
					footprint.lines.push(parseFpLine(sexp));
				} else if (sexp[0] == 'pad') {
					footprint.pads.push(parsePad(sexp));
				} else if (sexp[0] == 'fp_text') {
					footprint.texts.push(parseFpText(sexp));
				} else if (sexp[0] == 'fp_arc') {
					footprint.arcs.push(parseFpArc(sexp));
				} else if (sexp[0] == 'fp_rect') {
					footprint.rects.push(parseRect(sexp));
				}
			}
		});
	}
	footprint.lines.forEach((line) => {
		maxX = Math.max(maxX, line.start.x, line.end.x);
		maxY = Math.max(maxY, line.start.y, line.end.y);
		minX = Math.min(minX, line.start.x, line.end.x);
		minY = Math.min(minY, line.start.y, line.end.y);
	});
	footprint.arcs.forEach((arc) => {
		maxX = Math.max(maxX, arc.start.x, arc.end.x);
		maxY = Math.max(maxY, arc.start.y, arc.end.y);
		minX = Math.min(minX, arc.start.x, arc.end.x);
		minY = Math.min(minY, arc.start.y, arc.end.y);
	});
	footprint.width = maxX - minX;
	footprint.height = maxY - minY;
	footprint.center = {
		x: (minX + maxX) / 2,
		y: (minY + maxY) / 2
	};
	footprint.box = {
		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY
	};
	return footprint;
};

export { parseFootprint };
export type { FootPrint, Effect, FpPosition, Stroke, FpPoint, FpSize, FpFont };
