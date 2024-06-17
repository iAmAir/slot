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
	 * @param {SlotItem[][]} matrix - матрица элементов, которые нужно показать в конце
	 * @returns {Promise<boolean>} - успешно ли
	 */
	stop(matrix: SlotItem[][]): Promise<boolean>;
}

/**
 * Объект animation прикрепляется к {@link Machine}
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
	 * @param {gsap.core.Tween} animation - инстанс анимации
	 * @param {SlotItem[]} items - массив из возможных элементов слотов 
	 */
	_onRepeatLoop(animation: gsap.core.Tween, items: SlotItem[]): void;
	/**
	 * _onRepeatStop
	 * @param {gsap.core.Tween} animation - текущая анимация
	 * @param {SlotItem[]} items - массив элементов слотов, которые нужно вставить
	 */
	_onRepeatStop(animation: gsap.core.Tween, items: SlotItem[]): void;
	/**
	 * _onComplete
	 * @param {gsap.core.Tween} animation - инстанс анимации
	 * @param {SlotItem[]} items - массив из возможных элементов слотов 
	 */
	_onComplete(animation: gsap.core.Tween, items: SlotItem[]): void;
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

			for (let z = 0; z < this.row; z++) {
				items.push(this.matrix[z][i]);
			}

			items.push(this.tempRow[i]);

			const animation = gsap.to(items, {
				y: (_index: number, item: MachineItem) => item.y - item.width,
				duration: 0.10,
				ease: "none",
				repeat: -1
			});

			animation.vars.onRepeat = this._onRepeatLoop;
			animation.vars.onRepeatParams = [animation, this.items];

			this._animationColumn.push(animation);
		}

		/** Отдаем событие */
		this.emit("start");
	},
	/**
	 * stop
	 * @description функция выключает анимацию прокрутки
	 * @param {SlotItem[][]} matrix - матрица элементов, которые нужно показать в конце
	 * @returns {Promise<boolean>} - успешно ли
	 */
	stop(matrix: SlotItem[][]): Promise<boolean> {
		return new Promise(async (resolve) => {
			let isValid = true;

			/** Если количество строк не соответствует - не валидно */
			if (this.row !== matrix.length) isValid = false;

			/** Если количество колонок не соответствует - не валидно */
			for (const row of matrix) {
				if (this.col !== row.length) isValid = false;
			}

			/** Если не переданно - возвращаем */
			if (!isValid) return resolve(false);

			/** Перебираем колонки */
			for (let i = 0; i < this.col; i++) {
				const items = [];
				const animation = this._animationColumn[i];

				/** Добавляем элементы с переданной матрицы */
				for (const row of matrix) {
					items.push(row[i]);
				}

				/** Переделываем onRepeat */
				animation.vars.onRepeat = this._onRepeatStop;
				animation.vars.onRepeatParams = [animation, items];
				animation.vars.onComplete = this._onComplete;
				animation.vars.onCompleteParams = [animation, this.items];
			}

			/** Дожидаемся когда все анимации завершатся */
			await Promise.all(this._animationColumn);

			/** Удаляем их полностью */
			PIXI.removeItems(this._animationColumn, 0, this._animationColumn.length);

			/** Снимаем защиту */
			this.protected = false;

			/** Отдаем событие */
			this.emit("stop");

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
	 * @param {gsap.core.Tween} animation - инстанс анимации
	 * @param {SlotItem[]} items - массив элементов слотов 
	 */
	_onRepeatLoop(animation: gsap.core.Tween, items: SlotItem[]): void {
		const targets = animation.targets() as MachineItem[];
		const lastIndex = targets.length - 1;
		const lastTarget = targets[lastIndex];

		/** Перебираем элементы, и делаем сдвиг */
		for (let i = 1; i < targets.length; i++) {
			const prevTarget = targets[i - 1];
			const target = targets[i];

			prevTarget.style.texture = target.style.texture;
			prevTarget.slotId = target.slotId;

			if (lastIndex === i) {
				const slotItem = getRandomArray(items);

				lastTarget.slotId = slotItem.id;
				lastTarget.style.texture = slotItem.texture;
			}
		}
	},
	/**
	 * _onRepeatStop
	 * @param {gsap.core.Tween} animation - текущая анимация
	 * @param {MachineItem[]} targets - элементы колонки
	 * @param {SlotItem[]} items - массив элементов слотов
	 */
	_onRepeatStop(animation: gsap.core.Tween, items: SlotItem[]): void {
		const targets = animation.targets() as MachineItem[];
		const lastIndex = targets.length - 1;

		for (let i = 1; i < targets.length; i++) {
			const prevTarget = targets[i - 1];
			const target = targets[i];

			prevTarget.style.texture = target.style.texture;
			prevTarget.slotId = target.slotId;

			if (lastIndex === i) {
				const lastTargat = targets[lastIndex];
				const slotItem = items[0];

				lastTargat.slotId = slotItem.id;
				lastTargat.style.texture = slotItem.texture;

				PIXI.removeItems(items, 0, 1);
			}
		}

		animation.vars.onRepeatParams = [animation, items];

		if (items.length === 0) animation.repeat(0);
	},
	_onComplete(animation: gsap.core.Tween, items: SlotItem[]): void {
		/** Возвращаем сетку в исходное состояние */
		animation.revert();

		const targets = animation.targets() as MachineItem[];
		const lastIndex = targets.length - 1;
		const lastTarget = targets[lastIndex];

		/** Перебираем элементы, и делаем сдвиг */
		for (let i = 1; i < targets.length; i++) {
			const prevTarget = targets[i - 1];
			const target = targets[i];

			prevTarget.style.texture = target.style.texture;
			prevTarget.slotId = target.slotId;

			if (lastIndex === i) {
				const slotItem = getRandomArray(items);

				lastTarget.slotId = slotItem.id;
				lastTarget.style.texture = slotItem.texture;
			}
		}

		/** Убиваем анимацию */
		animation.kill();
	}
}