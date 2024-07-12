import type { Sexpr } from '$lib/kicad/sexpr';
import { exist, get, parse } from '$lib/kicad/parserUtils';
import type { FpArc, FpLine, FpPad, FpText, FpRect } from '$lib/kicad/types/graphics';
import type { Effect, FpPoint, FpPosition, Stroke, FpFont, FpSize } from '$lib/kicad/footprint';

function parseString(item: Sexpr): string {
	return get(item, 1);
}
function parseNumber(item: Sexpr): number {
	return get(item, 1);
}
function parseSize(item: Sexpr): FpSize {
	return {
		height: get(item, 1),
		width: get(item, 2)
	};
}
// (fp_rect
// (start -7 -7)
// (end 7 7)
// (stroke (width 0.05) (type default))
// (fill none)
// (layer "B.CrtYd")
// (tstamp 8f2859a9-a762-478d-a819-a7cf57dea40a))
function parseRect(item: Sexpr): FpRect {
	let rect: any = {
		_type: 'rect'
	};
	parse(
		{
			start: parseFpPoint,
			end: parseFpPoint,
			stroke: parseStroke,
			layer: parseString
		},
		item,
		rect
	);
	return rect as FpRect;
}

function parseFont(item: Sexpr): FpFont {
	let font: any = {};
	font.italic = exist(item, 'italic');
	font.bold = exist(item, 'bold');
	parse(
		{
			face: parseString,
			size: parseSize,
			thickness: parseNumber,
			line_spacing: parseNumber
		},
		item,
		font
	);
	return font;
}
function parseStroke(item: Sexpr): Stroke {
	let stroke: Stroke = {
		width: 0,
		type: ''
	};
	parse(
		{
			width: parseNumber,
			type: parseString
		},
		item,
		stroke
	);
	stroke.width = stroke.width * 2;
	return stroke;
}
function parseTuple(sexp: Sexpr): string[] {
	if (Array.isArray(sexp)) {
		return sexp.slice(1, sexp.length - 1) as string[];
	}
	return [];
}
function parseFpPoint(sexp: Sexpr): FpPoint {
	let point: FpPoint = {
		x: get(sexp, 1),
		y: get(sexp, 2)
	};
	return point;
}

function parseFpLine(sexp: Sexpr): FpLine {
	let line: any = {
		_type: 'line',
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 }
	};
	parse(
		{
			start: parseFpPoint,
			end: parseFpPoint,
			layer: parseString,
			stroke: parseStroke
		},
		sexp,
		line
	);
	return line;
}

function parseFpArc(sexp: Sexpr): FpArc {
	let arc: any = {
		_type: 'arc',
		mid: { x: 0, y: 0 }
	};
	parse(
		{
			start: parseFpPoint,
			end: parseFpPoint,
			mid: parseFpPoint,
			layer: parseString,
			angle: parseNumber,
			stroke: parseStroke
		},
		sexp,
		arc
	);
	return arc;
}
function parseFpPosition(sexp: Sexpr): FpPosition {
	let pos: FpPosition = {
		x: get(sexp, 1),
		y: get(sexp, 2),
		angle: get(sexp, 3)
	};
	return pos;
}
function parsePad(sexp: Sexpr): FpPad {
	let pad: any = {
		_type: 'pad'
	};
	pad.name = get<string>(sexp, 1);
	pad.type = get<string>(sexp, 2);
	pad.shape = get<string>(sexp, 3);
	parse(
		{
			roundrect_rratio: parseNumber,
			at: parseFpPosition,
			size: parseFpPoint,
			drill: (item: Sexpr) => get<number>(item, 1),
			layers: (item: Sexpr) => (item as string[]).slice(1),
			net: (item: Sexpr) => get<string>(item, 1)
		},
		sexp,
		pad
	);
	return pad as FpPad;
}
function parseEffect(sexp: Sexpr): Effect {
	let effect: any = {
		font: {},
		hide: exist(sexp, 'hide'),
		justify: []
	};
	parse(
		{
			font: parseFont,
			justify: parseTuple
		},
		sexp,
		effect
	);
	return effect;
}
function parseFpText(sexp: Sexpr): FpText {
	let text: any = {
		_type: 'text',
		hide: exist(sexp, 'hide'),
		unlocked: exist(sexp, 'unlocked')
	};
	// 	(fp_text reference "REF**" (at -4.25 -1.75) (layer "F.SilkS")
	// 	(effects (font (size 1 1) (thickness 0.15)))
	// 	(tstamp abcea926-33d8-442d-a367-35cda3816ca5)
	// )
	parse(
		{
			layer: parseString,
			at: parseFpPosition,
			effects: parseEffect,
			text: parseString,
			type: parseString
		},
		sexp,
		text
	);
	return text;
}

export {
	parseStroke,
	parseFont,
	parseSize,
	parseNumber,
	parseString,
	parseTuple,
	parseFpPoint,
	parseFpLine,
	parseFpArc,
	parseFpPosition,
	parsePad,
	parseEffect,
	parseFpText,
	parseRect
};
