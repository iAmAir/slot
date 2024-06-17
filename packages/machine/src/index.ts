/**
 * Dependence
 */
import { Machine } from "./Machine";
import { animationTarget, resultTarget } from "./mixins";

/**
 * Init
 */
Machine.mixin(animationTarget);
Machine.mixin(resultTarget);

/**
 * Utils
 */
export * from "./utils";

/**
 * Mixins
 */
export * from "./mixins";

/**
 * Styles
 */
export * from "./MachineStyle";

/**
 * Module
 */
export * from "./Machine";