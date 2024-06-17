/**
 * Dependence
 */
import { utils } from "pixi.js";

export interface MachineStyleOptions {
	/**
	 * itemWidth
	 * @description ширина элементов
	 * @type {number}
	 */
	itemWidth: number;

	/**
	 * itemHeight
	 * @description высота элементов
	 * @type {number}
	 */
	itemHeight: number;
}

export class MachineStyle extends utils.EventEmitter {
	public static defaultStyle: MachineStyleOptions = {
		itemWidth: 50,
		itemHeight: 50
	}

	protected _itemWidth: number;
	protected _itemHeight: number;

	/**
	 * @param style - Стили слот-машины
	 */
	constructor(style: Partial<MachineStyleOptions> = {}) {
		super();

		/** Полные стили */
		const fullStyle = { ...MachineStyle.defaultStyle, ...style };

		/** Установка стилей */
		for (const key in MachineStyle.defaultStyle) {
			const thisKey = key as keyof typeof this;

			this[thisKey] = fullStyle[key as keyof MachineStyleOptions] as any;
		}

		/** Вызываем обновление */
		this.update();
	}

	/**
	 * itemWidth
	 * @description ширина элементов
	 * @member {number}
	 */
	get itemWidth(): number {
		return this._itemWidth;
	}
	set itemWidth(itemWidth: number) {
		if (this._itemWidth !== itemWidth) {
			if (itemWidth < 32) throw new Error(`MachineStyle: Minimal value for itemWidth is 32`);

			this._itemWidth = itemWidth;

			this.update();
		}
	}

	/**
	 * itemHeight
	 * @description высота элементов
	 * @member {number}
	 */
	get itemHeight(): number {
		return this._itemHeight;
	}
	set itemHeight(itemHeight: number) {
		if (this._itemHeight !== itemHeight) {
			if (itemHeight < 32) throw new Error(`MachineStyle: Minimal value for itemWidth is 32`);

			this._itemHeight = itemHeight;

			this.update();
		}
	}

	/**
	 * update
	 * @description Функция вызывающаяся при обновлении стилей
	 */
	public update() {
		this.emit('update', this);
	}

	/** 
	 * reset
	 * @description Сброс всех параметров стиля до стандартных
	 */
	public reset(): void {
		const defaultStyle = MachineStyle.defaultStyle;

		for (const key in defaultStyle) {
			this[key as keyof typeof this] = defaultStyle[key as keyof MachineStyleOptions] as any;
		}
	}

	/**
	 * clone
	 * @description Создает новый объект MachineStyle с параметрами как в этом
	 * Обратите внимание, что клонируются только свойства объекта.
	 *
	 * @return {MachineStyle} - новый объект стилей
	 */
	public clone(): MachineStyle {
		return new MachineStyle({
			itemWidth: this.itemWidth,
			itemHeight: this.itemHeight
		});
	}

	/**
	 * destroy
	 * @description функция отчистки стилей
	 */
	public destroy() {
		this.removeAllListeners();
	}
}