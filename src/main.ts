/**
 * Dependence
 */
import { Application, Text, TextStyle, Texture } from 'pixi.js';
import { Assets } from "@pixi/assets";
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
	 * Get container
	 */
	const container = document.getElementById("app") as HTMLElement;

	/**
	 * Create Application
	 */
	const app = new Application({
		resizeTo: container,
		resolution: window.devicePixelRatio || 1,
		backgroundColor: 0x000000
	});

	/**
	 * Add Pixi Dev Tools
	 */
	globalThis.__PIXI_APP__ = app;

	/**
	 * Insert application
	 */
	container.appendChild(app.view);

	/**
	 * Create Machine Item
	 */
	const items = [
		{
			id: "0",
			texture: await Texture.fromURL("./rt_object_01.png")
		},
		{
			id: "1",
			texture: await Texture.fromURL("./rt_object_02.png")
		},
		{
			id: "2",
			texture: await Texture.fromURL("./rt_object_03.png")
		},
		{
			id: "3",
			texture: await Texture.fromURL("./rt_object_04.png")
		},
		{
			id: "4",
			texture: await Texture.fromURL("./rt_object_05.png")
		},
		{
			id: "5",
			texture: await Texture.fromURL("./rt_object_06.png")
		},
		{
			id: "6",
			texture: await Texture.fromURL("./rt_object_07.png")
		},
		{
			id: "7",
			texture: await Texture.fromURL("./rt_object_08.png")
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
	const style = new TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: [0xFFFFFF, 0x00ff99],
		wordWrap: true,
		wordWrapWidth: 440,
	});
	const text = new Text("Play", style);

	/**
	 * Set Parameters
	 */
	text.interactive = true;
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
