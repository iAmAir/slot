/**
 * Dependence
 */
import { Application, Assets, Color, FillGradient, Text, TextStyle } from 'pixi.js';
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
		col: 7,
		row: 8,
		items,
	}, {
		itemWidth: 100,
		itemHeight: 100,
	});

	/**
	 * Insert Slot Machine
	 */
	app.stage.addChild(machine);

	/**
	 * Add TextStyle
	 */
	const fill = new FillGradient(0, 0, 0, 36 * 1.7);
	const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

	colors.forEach((number, index) => {
		const ratio = index / colors.length;

		fill.addColorStop(ratio, number);
	});

	const style = new TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: { fill },
		stroke: { color: 0x4a1850, width: 5 },
		dropShadow: {
			color: 0x000000,
			angle: Math.PI / 6,
			blur: 4,
			distance: 6,
		},
		wordWrap: true,
		wordWrapWidth: 440,
	});
	const text = new Text({
		text: "Play",
		style,
	});

	/**
	 * Set Parameters
	 */
	text.eventMode = "dynamic";
	text.cursor = "pointer";

	/**
	 * Add event
	 */
	let started = false;

	text.on("click", async () => {
		if (!started) {
			text.text = "Stop";
			machine.start();
		} else {
			await machine.stop([
				[items[0], items[0], items[1], items[3], items[3], items[1], items[4]],
				[items[5], items[4], items[1], items[4], items[5], items[5], items[1]],
				[items[5], items[0], items[3], items[3], items[3], items[0], items[0]],
				[items[3], items[0], items[1], items[3], items[3], items[3], items[4]],
				[items[4], items[1], items[3], items[3], items[0], items[0], items[4]],
				[items[4], items[1], items[4], items[5], items[5], items[1], items[3]],
				[items[5], items[5], items[5], items[4], items[3], items[1], items[1]],
				[items[5], items[5], items[5], items[4], items[3], items[1], items[3]]
			]);
			text.text = "Play";
		}

		started = !started;
	});

	/**
	 * Insert Play Text
	 */
	app.stage.addChild(text);

	/**
	 * Resize
	 */
	app.renderer.on("resize", onResize.bind(null, app, machine), this);

	onResize(app, machine);
})();
