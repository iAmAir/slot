/**
 * Dependence
 */
import { Texture } from "pixi.js";
import { Machine } from "@slot/machine";

describe('animationMixin', () => {
	it('should have target public properties', async () => {
		const items = [{ id: "0", texture: Texture.WHITE }];
		const machine = new Machine({ row: 3, col: 3, items });

		expect(machine.start).toBeInstanceOf(Function);
		expect(machine.stop).toBeInstanceOf(Function);
	});
});