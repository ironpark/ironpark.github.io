import { getContext, setContext } from 'svelte';
import type { G, Svg } from '@svgdotjs/svg.js';

export interface Layer {
	name: string;
	color: string;
	visible: boolean;
}

export interface PcbContext {
	layers: Layer[];
	cache: { [key: string]: G };
	root: Svg;
	mm: number;
	globalOffset: number;
	unitSize: number;
}

export const getPCBContext = () => {
	return getContext<PcbContext>('pcbContext');
};

export const setPCBContext = (pcbContext: PcbContext) => {
	setContext('pcbContext', pcbContext);
};
