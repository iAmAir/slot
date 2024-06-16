/**
 * Dependence
*/
import * as PIXI from "pixi.js";
import { getRandomArray } from "..";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

/**
 * Types
 */
import type { Machine, SlotItem } from "..";
import type { MachineItem } from "@slot/machine-item";
import { MotionBlurFilter } from "pixi-filters";

/**
 * Init GSAP Plugin
 */
gsap.registerPlugin(PixiPlugin);

/** 
 * Register pixi
 */
PixiPlugin.registerPIXI(PIXI);

/**
 * Добавляет необходимые функции для старта и конца анимации
 */
export interface AnimationOptions {
	/**
	 * start
	 * @description функция включает анимацию прокрутки
	 */
	start(): void;
	/**
	 * stop
	 * @description функция выключает анимацию прокрутки
	 */
	stop(matrix: SlotItem[][]): void;
}

/**
 * Объект centerPoint прикрепляется к {@link Line}.
 * @private
 */
export interface AnimationTarget extends AnimationOptions {
	/**
	 * _animationColumn
	 * @description хранилище для анимаций по колонкам
	 * @member {gsap.core.Tween[]}
	 * @membeof {Machine}
	 * @default []
	 */
	_animationColumn: gsap.core.Tween[];
	/**
	 * _onRepeatLoop
	 * @param {MachineItem[]} targets - элементы колонки
	 * @param {SlotItem[]} items - массив элементов слотов 
	 */
	_onRepeatLoop(targets: MachineItem[], items: SlotItem[]): void;
	/**
	 * _onRepeatStop
	 * @param {gsap.core.Tween} animation - текущая анимация
	 * @param {MachineItem[]} targets - элементы колонки
	 * @param {SlotItem[]} items - массив элементов слотов
	 */
	_onRepeatStop(animation: gsap.core.Tween, targets: MachineItem[], items: SlotItem[]): void;
}

export const animationTarget: Partial<Machine> = {
	/**
	 * start
	 * @description функция включает анимацию прокрутки
	 */
	start(): void {
		this.protected = true;

		for (let i = 0; i < this.col; i++) {
			const items = [];

			for (let z = 0; z <= this.row; z++) {
				const item = (z === this.row) ? this.tempRow[i] : this.matrix[z][i];

				items.push(item);
			}

			const animation = gsap.to(items, {
				y: (_index: number, item: MachineItem) => item.y - item.width,
				duration: 0.20,
				ease: "none",
				repeat: -1,
				onStart: () => {
					this.filters = new MotionBlurFilter();
				},
				onRepeat: this._onRepeatLoop,
				onRepeatParams: [items, this.items]
			});

			this._animationColumn.push(animation);
		}
	},
	/**
	 * stop
	 * @description функция выключает анимацию прокрутки
	 */
	stop(matrix: SlotItem[][]): Promise<boolean> | false {
		return new Promise(async (resolve, reject) => {
			let isValid = true;

			/** Если количество строк не соответствует - не валидно */
			if (this.row !== matrix.length) isValid = false;

			/** Если количество колонок не соответствует - не валидно */
			for (const row of matrix) {
				if (this.col !== row.length) isValid = false;
			}

			/** Если не переданно - возвращаем */
			if (!isValid) reject(false);

			/** Перебираем колонки */
			for (let i = 0; i < this.col; i++) {
				const items = [];
				const animation = this._animationColumn[i];

				/** Добавляем элементы с переданной матрицы */
				for (const row of matrix) {
					items.push(row[i]);
				}

				/** Добавляем последний рандомный элемент во временную строку */
				items.push(getRandomArray(this.items));

				/** Переделываем onRepeat */
				animation.vars.onRepeat = this._onRepeatStop;
				animation.vars.onRepeatParams = [animation, animation.targets(), items];

				/** Удаляем при завершении */
				animation.then(() => PIXI.removeItems(this._animationColumn, i - 1, 1));
			}

			await Promise.all(this._animationColumn);

			this.protected = false;

			return resolve(true);
		});
	},
	/**
	 * _animationColumn
	 * @description хранилище для анимаций по колонкам
	 * @member {gsap.core.Tween[]}
	 * @membeof {Machine}
	 * @default []
	 */
	_animationColumn: [],
	/**
	 * _onRepeatLoop
	 * @param {MachineItem[]} targets - элементы колонки
	 * @param {SlotItem[]} items - массив элементов слотов 
	 */
	_onRepeatLoop(targets: MachineItem[], items: SlotItem[]): void {
		for (let i = 1; i < targets.length; i++) {
			const prevTarget = targets[i - 1];
			const target = targets[i];

			prevTarget.style.texture = target.style.texture;
			prevTarget.slotId = target.slotId;

			if (i === targets.length - 1) {
				const slotItem = getRandomArray(items);

				target.slotId = slotItem.id;
				target.style.texture = slotItem.texture;
			}
		}
	},
	/**
	 * _onRepeatStop
	 * @param {gsap.core.Tween} animation - текущая анимация
	 * @param {MachineItem[]} targets - элементы колонки
	 * @param {SlotItem[]} items - массив элементов слотов
	 */
	_onRepeatStop(animation: gsap.core.Tween, targets: MachineItem[], items: SlotItem[]): void {
		for (let i = 1; i < targets.length; i++) {
			const prevTarget = targets[i - 1];
			const target = targets[i];

			prevTarget.style.texture = target.style.texture;
			prevTarget.slotId = target.slotId;

			if (i === targets.length - 1) {
				const slotItem = items[0];

				target.slotId = slotItem.id;
				target.style.texture = slotItem.texture;

				/** Удаляем элемент */
				PIXI.removeItems(items, 0, 1);
			}
		}

		animation.vars.onRepeatParams = [animation, animation.targets(), items];

		if (items.length === 1) {
			animation.repeat(0);
		}
	},
}