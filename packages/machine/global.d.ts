declare namespace PixiMixins {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Machine { }

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Machine extends Partial<import("@slot/machine").AnimationTarget> { }

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Machine extends Partial<import("@slot/machine").ResultTarget> { }
}