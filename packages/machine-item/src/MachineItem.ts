/**
 * Dependence
 */
import { Graphics } from "pixi.js";
import { MachineItemStyle, MachineItemStyleOptions } from ".";

/**
 * Types
 */
import type { IDestroyOptions } from "pixi.js";

export class MachineItem extends Graphics {
	public slotId: string;

	/** Текущая строка */
	private _currentRow: number;

	/** Текущая колонка */
	private _currentCol: number;

	/**
	 * Приватный трекер текущих стилей
	 * @private
	 */
	protected _style: MachineItemStyle;

	constructor(style?: Partial<MachineItemStyleOptions> | MachineItemStyle) {
		super();

		/** Устанавливаем стили */
		this._style = null;
		this.style = style;
	}

	/**
	 * updateItem
	 * @description перерисовывает элемент
	 */
	public updateItem(): void {
		const style = this.style;

		/** Отчищаем элемент */
		this.clear();

		/** Рисуем */
		if (style.texture) {
			this.beginTextureFill({
				texture: style.texture
			});
			this.drawRect(0, 0, style.width, style.height);
			// this.endFill();
		}
	}

	/**
	 * onUpdate
	 * @description функция обновления, перерисовывающая элемент
	 */
	public onUpdate(): void {
		this.updateItem();
	}

	/**
	 * currentRow
	 * @description текущая строка в слот-машине
	 * @member {number}
	 */
	set currentRow(currentRow: number) {
		if (this._currentRow !== currentRow) {
			this._currentRow = currentRow;
		}
	}
	get currentRow(): number {
		return this._currentRow;
	}

	/**
	 * currentCol
	 * @description текущая колонка в слот-машине
	 * @member {number}
	 */
	set currentCol(currentCol: number) {
		if (this._currentCol !== currentCol) {
			this._currentCol = currentCol;
		}
	}
	get currentCol(): number {
		return this._currentCol;
	}

	/**
	 * style
	 * @description установка и отслеживание стилей
	 */
	get style(): MachineItemStyle {
		return this._style;
	}
	set style(style: MachineItemStyle | Partial<MachineItemStyleOptions>) {
		style = style || {};

		/** Удаляем прослушку эвента */
		this._style?.off('update', this.onUpdate, this);

		if (style instanceof MachineItemStyle) {
			this._style = style;
		} else {
			this._style = new MachineItemStyle(style);
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
	public destroy(options: IDestroyOptions | boolean = false): void {
		/** Отчистка стилей */
		this._style.destroy();
		this._style = null;

		super.destroy(options);
	}
}