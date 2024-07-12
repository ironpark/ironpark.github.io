interface FpSize {
	height: number;
	width: number;
}
interface FpPoint {
	x: number;
	y: number;
}
interface FpFont {
	size: FpSize;
	thickness: number;
	bold: boolean;
	italic: boolean;
	line_spacing?: number;
}

interface FpPosition {
	x: number;
	y: number;
	angle?: number;
}
interface Stroke {
	width: number;
	type: string;
}
interface Effect {
	font: FpFont;
	justify: string[];
	hide: boolean;
}

export type { FpSize, FpPoint, FpFont, FpPosition, Stroke, Effect };
