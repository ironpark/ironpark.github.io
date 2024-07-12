interface FootprintInfo {
	name: string;
	offsetX: number;
	offsetY: number;
}
interface Key {
	x: number;
	y: number;
	w: number;
	h: number;
	name: string;
	type?: string;
	color?: string;
	fp?: FootprintInfo[];
}

export type { Key, FootprintInfo };
