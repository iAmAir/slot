/**
 * Dependence
 */
import { Texture } from "pixi.js";
import { Machine } from "@slot/machine";

describe("Machine", () => {
	describe('matrix', () => {
		it('create items', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			expect(machine.matrix.length).toEqual(3);

			for (let i = 0; i < 3; i++) {
				expect(machine.matrix[i].length).toEqual(3);
			}
		});

		it('remove items', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			machine.row = 2;
			machine.col = 2;

			expect(machine.matrix.length).toEqual(2);

			for (let i = 0; i < 2; i++) {
				expect(machine.matrix[i].length).toEqual(2);
			}
		})
	});

	describe('row&col', () => {
		it('create row and col in constructor', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			expect(machine.row).toEqual(3);
			expect(machine.col).toEqual(3);
		});

		it('add row', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			machine.row = 4;

			expect(machine.row).toEqual(4);
			expect(machine.col).toEqual(3);
		});

		it('remove row', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			machine.row = 2;

			expect(machine.row).toEqual(2);
			expect(machine.col).toEqual(3);
		});

		it('add col', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			machine.col = 4;

			expect(machine.row).toEqual(3);
			expect(machine.col).toEqual(4);
		});

		it('remove col', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			machine.col = 2;

			expect(machine.row).toEqual(3);
			expect(machine.col).toEqual(2);
		});

		it('zero col', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			function changeCol() {
				machine.col = 0;
			}

			expect(() => changeCol()).toThrow(`Machine: Min value for col - 1`);
		});

		it('zero row', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 3, col: 3, items });

			function changeRow() {
				machine.row = 0;
			}

			expect(() => changeRow()).toThrow(`Machine: Min value for row - 1`);
		})
	});

	describe('destroy', () => {
		it('should destroy styles', () => {
			const items = [{ id: "0", texture: Texture.WHITE }];
			const machine = new Machine({ row: 1, col: 1, items }, { itemWidth: 100, itemHeight: 100 });

			machine.destroy();

			expect(machine.style).toBeNull();
		});

		it('should destroy mask', () => {
			const items = [{ id: "0", texture: Texture.WHITE }]
			const machine = new Machine({ row: 1, col: 1, items }, { itemWidth: 100, itemHeight: 100 });

			machine.destroy();

			expect(machine.mask).toBeNull();
		});
	});
});

