/**
 * Dependence
 */
import { utils, Texture } from "pixi.js";

/**
 * Types
 */
export interface MachineItemStyleOptions {
	/**
	 * width
	 * @description ширина элемента
	 * @type {number}
	 */
	width: number;

	/**
	 * height
	 * @description высота элемента
	 * @type {number}
	 */
	height: number;

	/**
	 * texture
	 * @description текстура отрисовки элемента
	 * @type {Texture | string | null}
	 */
	texture: Texture | string | null;
}

export class MachineItemStyle extends utils.EventEmitter {
	public static defaultStyle: MachineItemStyleOptions = {
		width: 50,
		height: 50,
		texture: null,
	}

	protected _width: number;
	protected _height: number;
	protected _texture: Texture | null;

	/**
	 * @param style - Стили элементов слот-машины
	 */
	constructor(style: Partial<MachineItemStyleOptions> = {}) {
		super();

		/** Полные стили */
		const fullStyle = { ...MachineItemStyle.defaultStyle, ...style };

		/** Установка стилей */
		for (const key in MachineItemStyle.defaultStyle) {
			const thisKey = key as keyof typeof this;

			this[thisKey] = fullStyle[key as keyof MachineItemStyleOptions] as any;
		}

		/** Вызываем обновление */
		this.update();
	}

	/**
	 * width
	 * @description ширина элемента
	 * @member {number}
	 */
	get width(): number {
		return this._width;
	}
	set width(width: number) {
		if (this._width !== width) {
			if (width < 32) throw new Error(`MachineItemStyle: Minimal value for width is 32`);

			this._width = width;

			this.update();
		}
	}

	/**
	 * height
	 * @description высота элемента
	 * @member {number}
	 */
	get height(): number {
		return this._height;
	}
	set height(height: number) {
		if (this._height !== height) {
			if (height < 32) throw new Error(`MachineStyle: Minimal value for itemWidth is 32`);

			this._height = height;

			this.update();
		}
	}

	/**
	 * texture
	 * @description текстура элемента
	 * @member {Texture|null}
	 */
	get texture(): Texture | null {
		return this._texture;
	}
	set texture(texture: Texture | string | null) {
		if (texture instanceof Texture) {
			this._texture = texture;
		} else if (typeof texture === "string") {
			this._texture = Texture.from(texture);
		} else if (texture === null) {
			this._texture = texture;
		}

		this.update();
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
		const defaultStyle = MachineItemStyle.defaultStyle;

		for (const key in defaultStyle) {
			this[key as keyof typeof this] = defaultStyle[key as keyof MachineItemStyleOptions] as any;
		}
	}

	/**
	 * clone
	 * @description Создает новый объект MachineItemStyle с параметрами как в этом
	 * Обратите внимание, что клонируются только свойства объекта.
	 *
	 * @return {MachineItemStyle} - новый объект стилей
	 */
	public clone(): MachineItemStyle {
		return new MachineItemStyle({
			width: this.width,
			height: this.height,
			texture: this.texture
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