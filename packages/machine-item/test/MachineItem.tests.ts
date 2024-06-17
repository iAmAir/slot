/**
 * Dependence
 */
import { MachineItem } from "@slot/machine-item";

describe("MachineItem", () => {
	describe('row&col', () => {
		it('set currentRow', () => {
			const machineItem = new MachineItem();

			machineItem.currentRow = 3;

			expect(machineItem.currentRow).toEqual(3);
		});

		it('set currentCol', () => {
			const machineItem = new MachineItem();

			machineItem.currentCol = 3;

			expect(machineItem.currentCol).toEqual(3);
		});
	});

	describe('destroy', () => {
		it('should destroy styles', () => {
			const machineItem = new MachineItem();

			machineItem.destroy();

			expect(machineItem.style).toBeNull();
		});
	});
});

