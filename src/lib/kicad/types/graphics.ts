import type { FpPoint, FpPosition, Stroke, Effect } from '$lib/kicad/footprint';
import type { Svg } from '@svgdotjs/svg.js';

interface FpLine {
	_type: string;
	start: FpPoint;
	end: FpPoint;
	stroke: Stroke;
	layer: string;
}
interface FpArc {
	_type: string;
	start: FpPoint;
	mid: FpPoint;
	end: FpPoint;
	angle: number;
	stroke: Stroke;
	layer: string;
}
interface FpText {
	_type: string;
	type: string;
	text: string;
	at: FpPosition;
	unlocked: boolean;
	layer: string;
	hide: boolean;
	effects?: Effect;
}

interface FpRect {
	_type: string;
	start: FpPoint;
	end: FpPoint;
	width: number;
	layer: string;
	stroke: Stroke;
}

interface FpPad {
	_type: string;
	name: string;
	roundrect_rratio: number;
	type: string;
	shape: string;
	at: FpPosition;
	size: FpPoint;
	drill: number;
	layers: string[];
	net: string;
}

type Graphic = FpLine | FpArc | FpText | FpPad | FpRect;

export type { FpLine, FpArc, FpText, FpPad, Graphic, FpRect };
