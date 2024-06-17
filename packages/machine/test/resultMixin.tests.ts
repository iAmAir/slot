/**
 * Dependence
 */
import { Texture } from "pixi.js";
import { Machine } from "@slot/machine";

describe('resultMixin', () => {
	it('should have target public properties', async () => {
		const items = [{ id: "0", texture: Texture.WHITE }];
		const machine = new Machine({ row: 3, col: 3, items });

		expect(machine.findClusters).toBeInstanceOf(Function);
		expect(machine.result).toBe(true);
	});
});