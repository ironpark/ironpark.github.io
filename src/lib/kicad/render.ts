import type { Svg, G } from '@svgdotjs/svg.js';
import type { FpArc, FpLine, FpPad, FpPoint, FpPosition, FpText, Graphic } from '$lib/kicad/types';
import type { FootPrint } from '$lib/kicad/footprint';
import type { FpRect } from '$lib/kicad/types/graphics';
type RenderContext = {
	mm: number;
	color: string;
	x: number;
	y: number;
};

function draw(svg: G, ctx: RenderContext, gp: Graphic) {
	switch (gp._type) {
		case 'line':
			return drawLine(svg, ctx, gp as FpLine);
		case 'arc':
			return drawArc(svg, ctx, gp as FpArc);
		case 'pad':
			return drawPad(svg, ctx, gp as FpPad);
		case 'text':
			return drawText(svg, ctx, gp as FpText);
		case 'rect':
			return drawRect(svg, ctx, gp as FpRect);
		default:
			return '';
	}
}

function createSvgArcPath(arc: FpArc, ctx: RenderContext): string {
	let mm = ctx.mm;
	let center: FpPoint = arc.start;
	let start: FpPoint = arc.end;
	let endX = arc.end.x * mm;
	let endY = arc.end.y * mm;
	let largeArcFlag = arc.angle > 180 ? 1 : 0;
	let sweepFlag = 0; // 시계 방향으로 회전

	// 원의 반경 계산
	let radius = Math.sqrt(
		Math.pow(start.x * mm - center.x * mm, 2) + Math.pow(start.y * mm - center.y * mm, 2)
	);
	if (!arc.mid || (arc.mid.x != 0 && arc.mid.y != 0)) {
		start = arc.start;
		center = findCircleCenter(arc.start, arc.mid!, arc.end);
		radius = Math.sqrt(
			Math.pow(start.x * mm - center.x * mm, 2) + Math.pow(start.y * mm - center.y * mm, 2)
		);
		sweepFlag = 1;
	} else {
		let angleRad = arc.angle * (Math.PI / 180);
		endX =
			(start.x * mm - center.x * mm) * Math.cos(angleRad) -
			(start.y * mm - center.y * mm) * Math.sin(angleRad) +
			center.x * mm;
		endY =
			(start.x * mm - center.x * mm) * Math.sin(angleRad) +
			(start.y * mm - center.y * mm) * Math.cos(angleRad) +
			center.y * mm;
	}

	// SVG path 문자열 생성
	return `M ${start.x * mm} ${
		start.y * mm
	} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
}
function drawLine(svg: G, ctx: RenderContext, line: FpLine) {
	let width = 0.3;
	if (line?.stroke?.width) {
		width = line.stroke.width * ctx.mm;
	}
	let lineSvg = svg.line(
		line.start.x * ctx.mm,
		line.start.y * ctx.mm,
		line.end.x * ctx.mm,
		line.end.y * ctx.mm
	);
	lineSvg.stroke({ color: ctx.color, width: width });
	return line;
}

function findCircleCenter(p1: FpPoint, p2: FpPoint, p3: FpPoint): FpPoint {
	// 두 점 사이의 중점 계산
	let mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
	let mid2 = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };

	// 두 점 사이의 기울기 계산
	let m1, m2;
	if (p1.x === p2.x) {
		m1 = Infinity;
	} else {
		m1 = (p2.y - p1.y) / (p2.x - p1.x);
	}
	if (p1.x === p3.x) {
		m2 = Infinity;
	} else {
		m2 = (p3.y - p1.y) / (p3.x - p1.x);
	}

	// 수직한 기울기 계산
	let perpM1 = m1 === 0 ? Infinity : m1 === Infinity ? 0 : -1 / m1;
	let perpM2 = m2 === 0 ? Infinity : m2 === Infinity ? 0 : -1 / m2;

	// 직선 방정식: y = mx + c 에서 c 계산
	let c1 = mid1.y - perpM1 * mid1.x;
	let c2 = mid2.y - perpM2 * mid2.x;

	// 두 직선의 교차점 계산
	let centerX, centerY;
	if (perpM1 === Infinity) {
		centerX = mid1.x;
		centerY = perpM2 * centerX + c2;
	} else if (perpM2 === Infinity) {
		centerX = mid2.x;
		centerY = perpM1 * centerX + c1;
	} else {
		centerX = (c2 - c1) / (perpM1 - perpM2);
		centerY = perpM1 * centerX + c1;
	}

	return { x: centerX, y: centerY };
}
function drawRect(svg: G, ctx: RenderContext, rect: FpRect) {
	// console.log(ctx);
	let width = 0.1;
	if (rect?.stroke?.width) {
		width = rect.stroke.width;
	}
	const w = (rect.end.x - rect.start.x) * ctx.mm;
	const h = (rect.end.y - rect.start.y) * ctx.mm;
	return svg
		.rect(w, h)
		.move(rect.start.x * ctx.mm, rect.start.y * ctx.mm)
		.fill('none')
		.stroke({
			width: width * ctx.mm,
			color: ctx.color
		});
}

function drawArc(svg: G, ctx: RenderContext, arc: FpArc) {
	let width = 0.1;
	if (arc?.stroke?.width) {
		width = arc.stroke.width;
	}
	return svg
		.path(createSvgArcPath(arc, ctx))
		.fill('none')
		.stroke({
			width: width * ctx.mm,
			color: ctx.color
		});
}

function drawPad(svg: G, ctx: RenderContext, pad: FpPad) {
	let position: FpPosition = {
		x: pad.at.x * ctx.mm,
		y: pad.at.y * ctx.mm
	};
	// console.log(pad.type, pad.shape, ctx);
	if (pad.type === 'thru_hole' || pad.type === 'np_thru_hole') {
		let stroke = ((pad.size.x - pad.drill) / 2) * ctx.mm;
		position.x = (pad.at.x - pad.drill / 2) * ctx.mm - stroke / 4;
		position.y = (pad.at.y - pad.drill / 2) * ctx.mm - stroke / 4;

		if (pad.type === 'thru_hole') {
			svg
				.circle(pad.drill * ctx.mm + stroke / 2, pad.drill * ctx.mm + stroke / 2)
				.move(position.x, position.y)
				.stroke({ width: stroke, color: '#f3bd00' })
				.fill('#000e29');
		} else {
			// console.log('drawPad', stroke, position.x, position.y);
			svg
				.circle(pad.drill * ctx.mm + stroke / 2, pad.drill * ctx.mm + stroke / 2)
				.move(position.x, position.y)
				.fill('#24e8ff');
		}
		if (pad.name != '') {
			// console.log('PAD TEXT', pad.name);
			svg
				.plain(pad.name)
				.font({
					size: ctx.mm * pad.drill * 0.6,
					family: 'monospace',
					'text-anchor': 'middle'
				})
				.fill('#f3bd00')
				.center(pad.at.x * ctx.mm, pad.at.y * ctx.mm);
		}
		return;
	}

	if (pad.shape === 'circle') {
		return svg
			.circle(pad.size.x * ctx.mm, pad.size.y * ctx.mm)
			.move(position.x, position.y)
			.fill(ctx.color);
	} else if (pad.shape === 'rect') {
		return svg
			.rect(pad.size.x * ctx.mm, pad.size.y * ctx.mm)
			.move(position.x - (pad.size.x / 2) * ctx.mm, position.y - (pad.size.x / 2) * ctx.mm)
			.fill(ctx.color);
	} else if (pad.shape === 'roundrect') {
		return svg
			.rect(pad.size.x * ctx.mm, pad.size.y * ctx.mm)
			.radius(pad.roundrect_rratio * ctx.mm, pad.roundrect_rratio * ctx.mm)
			.fill(ctx.color)
			.move(position.x - (pad.size.x / 2) * ctx.mm, position.y - (pad.size.x / 2) * ctx.mm);
	}
}

function drawText(svg: G, ctx: RenderContext, text: FpText) {
	// console.log('DrawText', text);
	let size: number = 1;
	// if (text.effects?.font.size) {
	// 	size = text.effects!.font.size.height;
	// }
	svg
		.plain(text.text)
		.font({
			size: ctx.mm * size,
			family: 'monospace',
			'text-anchor': 'middle'
		})
		.center(text.at.x * ctx.mm, text.at.y * ctx.mm)
		.fill('white');
	return text;
}

function getGraphics(footprint: FootPrint, layer: string): Graphic[] {
	return [
		...footprint?.lines.filter((line) => line.layer === layer),
		...footprint?.arcs.filter((arc) => arc.layer === layer),
		...footprint?.texts.filter((text) => text.layer === layer),
		...footprint?.rects.filter((rect) => rect.layer === layer),
		...footprint?.pads.filter((pad) => {
			return layer == 'F.Cu' || layer == 'B.Cu';
			// return pad.layers.includes(layer);
		})
	];
}

function renderGraphics(svg: Svg, ctx: RenderContext, gps: Graphic[]) {
	let group = svg.group().center(0, 0).move(ctx.x, ctx.y);
	gps.forEach((gp) => {
		draw(group, ctx, gp);
	});
	group.dmove(ctx.x, ctx.y);
	group.attr({ class: 'footprint' });
}
// function render(svg: Svg, footprint: FootPrint, layer: string, mm: number, color: string) {
// 	getGraphics(footprint, layer).forEach((gp) => {
// 		draw(svg, gp, mm, color);
// 	});
// }

export { getGraphics, draw, renderGraphics };
