/**
 * Dependence
 */
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/dist/PixiPlugin";

/**
 * Types
 */
import type { Machine } from "..";
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
 * Интерфейс описывающий объект с класстерами 
 */
export interface SlotClusters {
	[id: string]: [number, number][][];
}

/**
 * Если `result` включен для объекта, добавляется функциональность отображения результата к Machine
 * @memberof result
 */
export interface ResultOptions {
	/**
	 * findClusters
	 * @params {MachineItem[][]} matrix - матрица элементов, которые нужно просчитать
	 * @params {number} minCluster - минимальное кол. элементов для объединения в кластеры
	 */
	findClusters(matrix: MachineItem[][], minCluster: number): SlotClusters;
	/**
	 * set result
	 * @description триггер управления отображением результата
	 * @param {boolean} result - включено ли отображение результата
	 */
	set result(result: boolean);
	/**
	 * get result
	 * @description триггер управления отображением результата
	 * @returns {boolean} - включено ли отображение результата
	 * @default false
	 */
	get result(): boolean;
}

/**
 * Объект result прикрепляется к {@link Machine}
 * @private
 */
export interface ResultTarget extends ResultOptions {
	/**
	 * _resultInstance
	 * @description инстанс результатов
	 */
	_resultInstance: PIXI.Graphics;
	/**
	 * _resultAnimation
	 * @description анимация результатов
	 */
	_resultAnimation: gsap.core.Tween;
	/**
	 * _result
	 * @description приватный триггер управления отображением результатов
	 * @default false
	 */
	_result: boolean;
	/**
	 * _onStart
	 * @description Функция обработки начала прокрутки
	 */
	_onStart(): void;
	/**
	 * _onStop
	 * @description Функция обработки конца прокрутки
	 */
	_onStop(): void;
}

export const resultTarget: Partial<Machine> = {
	/**
	 * _result
	 * @description приватный триггер управления отображением результатов
	 * @member {boolean}
	 * @memberof Machine#
	 * @default false
	 */
	_result: false,
	/**
	 * set result
	 * @description триггер управления отображением результата
	 * @param {boolean} result - включено ли отображение результата
	 */
	set result(result: boolean) {
		if (this._result !== result) {
			this._result = result;

			if (this._result) {
				/**
				 * Добавляем слушателей
				 */
				this.on("start", this._onStart, this);
			} else {
				/**
				 * Удаляем слушателей
				 */
				this.off("start", this._onStart, this);
				this.off("stop", this._onStop, this);

				/** 
				 * Удаляем все лишнее 
				 */
				if (this._resultInstance && this._resultAnimation) {
					this._resultAnimation.kill();
					this._resultInstance.clear();
					this._resultInstance.removeFromParent();
					this._resultInstance.destroy();
				}
			}
		}
	},
	/**
	 * get result
	 * @description триггер управления отображением результата
	 * @returns {boolean} - включено ли отображение результата
	 * @default false
	 */
	get result(): boolean {
		return this._result;
	},
	/**
	 * _onStart
	 * @description Функция обработки начала прокрутки
	 */
	_onStart(): void {
		/** Если есть инстанс результатов - отчищаем его */
		if (this._resultInstance) {
			this._resultAnimation.kill();
			this._resultInstance.clear();
			this._resultInstance.removeFromParent();
			this._resultInstance.destroy();
		}

		/**
		 * Добавляем слушателей
		 */
		this.on("stop", this._onStop, this);
	},
	/**
	 * _onStop
	 * @description Функция обработки конца прокрутки
	 */
	_onStop(): void {
		/** 
		 * Создаем инстанс
		 */
		this._resultInstance = new PIXI.Graphics();

		/** 
		 * Проставляем параметры 
		 */
		this._resultInstance.zIndex = -1;
		this._resultInstance.alpha = 0;

		/**
		 * Вставляем элемент
		 */
		this.addChild(this._resultInstance);

		/**
		 * Получаем класстеры
		 */
		const keyClusters = this.findClusters(this.matrix, 3);

		/** Отрисовываем кластеры */
		for (const clusters of Object.values(keyClusters)) {
			for (const cluster of clusters) {
				for (const item of cluster) {
					this._resultInstance.rect(
						item[0] * this.style.itemWidth,
						item[1] * this.style.itemHeight,
						this.style.itemWidth,
						this.style.itemHeight,
					)
				}
			}
		}

		/** Раскрашиваем */
		this._resultInstance.fill({
			color: 0xFF0000,
			alpha: 0.5
		});

		/**
		 * Добавляем анимацию
		 */
		this._resultAnimation = gsap.to(this._resultInstance, {
			duration: 0.1,
			alpha: 1,
		});

		/**
		 * Удаляем слушателей
		 */
		this.off("stop", this._onStop, this);
	},
	/**
	 * findClusters
	 * @params {MachineItem[][]} matrix - матрица элементов, которые нужно просчитать
	 * @params {number} minClusterSize - минимальное кол. элементов для объединения в кластеры
	 */
	findClusters(matrix: MachineItem[][], minClusterSize: number): SlotClusters {
		const rows = matrix.length;
		const cols = matrix[0].length;
		const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
		const directions = [
			[0, -1], [0, 1], [-1, 0], [1, 0] // Влево, вправо, вверх, вниз
		];

		const isValid = (y: number, x: number) => x >= 0 && y >= 0 && x < cols && y < rows;

		function bfs(y: number, x: number, value: MachineItem) {
			const queue = [[y, x]];
			const cluster = [];

			while (queue.length > 0) {
				const [cy, cx] = queue.shift();

				if (!visited[cy][cx]) {
					visited[cy][cx] = true;

					if (matrix[cy][cx].slotId === value.slotId) {
						cluster.push([cx, cy]);

						for (const [dy, dx] of directions) {
							const ny = cy + dy;
							const nx = cx + dx;

							if (isValid(ny, nx) && !visited[ny][nx] && matrix[ny][nx].slotId === value.slotId) {
								queue.push([ny, nx]);
							}
						}
					}
				}
			}

			return cluster;
		}

		const clusters: SlotClusters = {};

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (!visited[y][x]) {
					const value = matrix[y][x];
					const cluster = bfs(y, x, value);

					if (cluster.length >= minClusterSize) {
						if (!clusters[value.slotId]) {
							clusters[value.slotId] = [];
						}
						clusters[value.slotId].push(cluster as [number, number][]);
					}
				}
			}
		}

		return clusters;
	},
}