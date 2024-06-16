/**
 * Dependence
 */
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [
        glsl()
    ],
    resolve: {
        alias: {
            "@slot": fileURLToPath(new URL("./packages", `${import.meta.url}`))
        }
    },
})