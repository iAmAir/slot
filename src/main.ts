/**
 * Dependence
 */
import { Application, Assets } from 'pixi.js';
import { Machine } from '@slot/machine';

/**
 * Style
 */
import "./style.css";

/**
 * Function
 */
function onResize(app: Application, machine: Machine): void {
	machine.x = (app.renderer.screen.width - machine.width) / 2;
	machine.y = (app.renderer.screen.height - machine.height) / 2;
}

/**
 * App
 */
(async () => {
	/**
	 * Create Application
	 */
	const app = new Application();

	/**
	 * Get container
	 */
	const container = document.getElementById("app") as HTMLElement;

	/**
	 * Init Application
	 */
	await app.init({
		resizeTo: container,
		resolution: window.devicePixelRatio || 1,
		background: 0x000000
	});

	/**
	 * Add Pixi Dev Tools
	 */
	globalThis.__PIXI_APP__ = app;

	/**
	 * Insert application
	 */
	container.appendChild(app.canvas);

	/**
	 * Loading sprite
	 */
	const { textures } = await Assets.load('/slot-texture.json');

	/**
	 * Create Machine Item
	 */
	const items = [
		{
			id: "0",
			texture: textures["rt_object_01.png"]
		},
		{
			id: "1",
			texture: textures["rt_object_02.png"]
		},
		{
			id: "2",
			texture: textures["rt_object_03.png"]
		},
		{
			id: "3",
			texture: textures["rt_object_04.png"]
		},
		{
			id: "4",
			texture: textures["rt_object_05.png"]
		},
		{
			id: "5",
			texture: textures["rt_object_06.png"]
		},
		{
			id: "6",
			texture: textures["rt_object_07.png"]
		},
		{
			id: "7",
			texture: textures["rt_object_08.png"]
		}
	];

	/** 
	 * Create Slot Machine
	 */
	const machine = new Machine({
		row: 3,
		col: 3,
		items,
	}, {
		itemWidth: 200,
		itemHeight: 200,
	});

	machine.start();
	setTimeout(async () => {
		await machine.stop([
			[items[7], items[1], items[2]],
			[items[3], items[7], items[4]],
			[items[5], items[6], items[7]]
		]);

		console.log("hello world!");
	}, 4500);

	/**
	 * Insert Slot Machine
	 */
	app.stage.addChild(machine);

	/**
	 * Resize
	 */
	app.renderer.on("resize", onResize.bind(null, app, machine), this);

	onResize(app, machine);
})();
