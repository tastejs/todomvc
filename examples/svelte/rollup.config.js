import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-import-css";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/index.js",
    output: {
        file: "dist/app.js",
        format: "iife",
        sourcemap: true,
        name: "app",
    },
    plugins: [
        css({
            minify: true,
        }),
        svelte({
            include: "src/**/*.svelte",
        }),
        resolve({
            browser: true,
            exportConditions: ["svelte"],
            extensions: [".svelte"],
        }),
        production && terser(),
        production && filesize(),
        copy({
            targets: [{ src: "public/index.html", dest: "dist/" }],
        }),
    ],
};
