/**
 * Dependence
 */
import { Container, Graphics, removeItems, Texture } from "pixi.js";
import { MachineStyle, getRandomArray } from ".";
import { MachineItem } from "@slot/machine-item";

/**
 * Types
 */
import type { DestroyOptions, Dict } from "pixi.js";
import type { MachineStyleOptions } from ".";

/**
 * Machine
 * @description интерфейс слот-машины
 */
export interface Machine extends PixiMixins.Machine { }

export interface SlotItem {
	id: string;
	texture: Texture;
}

export interface MachineOptions {
	row: number;
	col: number;
	items: SlotItem[];
}

export class Machine extends Container {
	/**
	 * Смешивает все перечислимые свойства и методы из исходного объекта в контейнер.
	 * @param source — источник свойств и методов, которые можно использовать.
	 */
	public static mixin(source: Dict<any>): void {
		Object.defineProperties(Machine.prototype, Object.getOwnPropertyDescriptors(source));
	}

	/**
	 * Приватный трекер текущих стилей
	 * @private
	 */
	protected _style: MachineStyle;

	/** Защищено ли от изменения параметров */
	public protected: boolean = false;
	/** Приватный счетчик строк */
	private _row: number = 0;
	/** Приватный счетчик колонок */
	private _col: number = 0;
	/** Приватное хранилище возможных вариаций слотов */
	private _items: SlotItem[] = [];

	/** Приватный триггер для матрицы элементов */
	public readonly matrix: MachineItem[][] = [];

	/** Временная строка для реализации анимаций */
	public readonly tempRow: MachineItem[] = [];

	/** Устанавливает маску */
	public mask: Graphics = new Graphics();

	constructor(options?: MachineOptions, style?: Partial<MachineStyleOptions> | MachineStyle) {
		super();

		/** Устанавливаем стили */
		this._style = null;
		this.style = style;

		/** Устанавливаем стандартные опции */
		options = Object.assign({
			row: 3,
			col: 3,
			items: [
				{
					id: "0",
					texture: Texture.WHITE
				}
			]
		}, options);

		/** Установка опций */
		this.items = options.items;
		this.col = options.col;
		this.row = options.row;

		/** Добавляем маску */
		this.addChild(this.mask);
	}

	/**
	 * updateGrid
	 * @description обновляет сетку элементов
	 */
	public updateGrid(): void {
		const style = this.style;

		for (let i = 0; i < this.matrix.length; i++) {
			const row = this.matrix[i];

			for (let z = 0; z < row.length; z++) {
				const item = row[z];

				/** Обновляем позиции элементов */
				item.x = z * style.itemWidth;
				item.y = i * style.itemHeight;

				/** Обновляем стили элементов */
				item.style.width = style.itemWidth;
				item.style.height = style.itemHeight;
			}
		}
	}

	/**
	 * updateTempRow
	 * @description обновляет временную строку
	 */
	public updateTempRow(): void {
		const style = this.style;

		for (let i = 0; i < this.tempRow.length; i++) {
			const item = this.tempRow[i];

			/** Обновляем позицию элементов */
			item.x = i * style.itemWidth;
			item.y = this._row * style.itemHeight;

			/** Обновляем стили элементов */
			item.style.width = style.itemWidth;
			item.style.height = style.itemHeight;
		}
	}

	/**
	 * updateMask
	 * @description Обновляем маску
	 */
	public updateMask(): void {
		const style = this.style;

		/** Отчищаем маску */
		this.mask.clear();

		/** Отрисовываем прямоугольник */
		this.mask.rect(0, 0, this._col * style.itemWidth, this._row * style.itemHeight);

		/** Включаем любой цвет */
		this.mask.fill({
			color: 0xffffff
		});
	}

	/** 
	 * onUpdate
	 * @description функция обновления, перерисовывающая контроль
	 */
	public onUpdate(): void {
		this.updateGrid();
		this.updateTempRow();
		this.updateMask();
	}

	/**
	 * row
	 * @description количество строк 
	 */
	get row(): number {
		return this._row;
	}
	set row(row: number) {
		if (this.protected) throw new Error(`Machine: Machine is protected!`);

		if (this._row === row) return;

		/** Добавляем строчки */
		while (this._row < row) {
			const row = [];

			for (let i = 0; i < this._col; i++) {
				/** Берем рандомный элемент */
				const slotItem = getRandomArray(this.items);

				/** Создаем элемент */
				const item = new MachineItem({
					texture: slotItem.texture,
				});

				/** Устанавливаем текущий row, col и slotId */
				item.slotId = slotItem.id;
				item.currentCol = i;
				item.currentRow = row.length;

				/** Добавляем элемент в контейнер */
				this.addChild(item);

				/** Добавляем элемент в строчку */
				row.push(item);
			}

			/** Добавляем в матрицу */
			this.matrix.push(row);

			/** Обновляем счетчик row */
			this._row++;
		}

		/** Удаляем строчки */
		while (this._row > row) {
			const lastIndex = this.matrix.length - 1;
			const lastRow = this.matrix[lastIndex];

			/** Удаляем элементы */
			for (let i = 0; i < lastRow.length; i++) {
				const item = lastRow[i];

				item.removeFromParent();
				item.destroy();
			}

			/** Удаляем строку из матрицы */
			removeItems(this.matrix, lastIndex, 1);

			/** Обновляем счетчик row */
			this._row--;
		}

		/** Обновляем */
		this.onUpdate();
	}

	/**
	 * col
	 * @description количество колонок
	 */
	get col(): number {
		return this._col;
	}
	set col(col: number) {
		if (this.protected) throw new Error(`Machine: Machine is protected!`);

		if (this._col === col) return;

		/** Добавляем колонки */
		while (this._col < col) {
			for (let i = 0; i <= this._row; i++) {
				/** Берем рандомный элемент */
				const slotItem = getRandomArray(this.items);

				/** Получаем строчку */
				const row = this._row === i ? this.tempRow : this.matrix[i];

				/** Создаем элемент */
				const item = new MachineItem({
					texture: slotItem.texture,
				});

				/** Устанавливаем текущий row, col и slotId */
				item.slotId = slotItem.id;

				if (this._row === i) {
					item.currentCol = this._col + 1;
					item.currentRow = i;
				}

				/** Добавляем элемент в контейнер */
				this.addChild(item);

				/** Добавляем элемент в строчку */
				row.push(item);
			}

			/** Обновляем счетчик col */
			this._col++;
		}

		/** Удаляем колонки */
		while (this._col > col) {
			for (let i = 0; i <= this._row; i++) {
				const row = this._row === i ? this.tempRow : this.matrix[i];

				/** Удаляем элемент */
				const lastElement = row[row.length - 1];

				lastElement.removeFromParent();
				lastElement.destroy();

				/** Удаляем элемент из массива */
				removeItems(row, row.length - 1, 1);
			}

			/** Обновляем счетчик col */
			this._col--;
		}

		/** Обновляем */
		this.onUpdate();
	}

	/**
	 * items
	 * @description хранилище возможных вариаций слотов
	 */
	get items(): SlotItem[] {
		return this._items;
	}
	set items(items: SlotItem[]) {
		if (this.protected) throw new Error(`Machine: Machine is protected!`);

		this._items = items;
	}

	/**
	 * style
	 * @description установка и отслеживание стилей
	 */
	get style(): MachineStyle {
		return this._style;
	}
	set style(style: MachineStyle | Partial<MachineStyleOptions>) {
		if (this.protected) throw new Error(`Machine: Machine is protected!`);

		style = style || {};

		/** Удаляем прослушку эвента */
		this._style?.off('update', this.onUpdate, this);

		if (style instanceof MachineStyle) {
			this._style = style;
		} else {
			this._style = new MachineStyle(style);
		}

		/** Устанавливаем подписку на новые стили */
		this._style.on('update', this.onUpdate, this);
		this.onUpdate();
	}

	/**
	 * destroy
	 * @description Уничтожает элемент
	 * @param {object|boolean} [options] - Параметр опций. Если передано булево значение, то все опции
	 * будут установлены в этот параметр
	 * @param {boolean} [options.children=false] - если установлено в true, все дочерние элементы будут также уничтожены
	 * вызовется их метод destroy. 'options' будет передан в эти вызовы.
	 * @param {boolean} [options.texture=false] - Следует ли уничтожить текущую текстуру спрайта
	 * @param {boolean} [options.baseTexture=false] - Следует ли уничтожить базовую текстуру спрайта
	 * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
	 * If options.children is set to true it should destroy the context of the child graphics
	 * @param {boolean} [options.context=false] - Используется только для children с graphicsContext. Например Graphics
	 * Если для параметра options.children установлено значение true, контекст дочерней графики должен быть уничтожен.
	 */
	public destroy(options: DestroyOptions = false): void {
		if (this.protected) throw new Error(`Machine: Machine is protected!`);

		/** Отчистка стилей */
		this._style.destroy();
		this._style = null;

		super.destroy(options);
	}
}