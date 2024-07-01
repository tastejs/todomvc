import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import css from "rollup-plugin-import-css";
import copy from "rollup-plugin-copy";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/index.js",
    output: [
        {
            file: "dist/app.js",
            format: "iife",
            sourcemap: true,
        },
    ],
    plugins: [
        css({
            minify: true,
        }),
        babel({
            babelrc: false,
            presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: [
                [
                    "@babel/plugin-transform-react-jsx",
                    {
                        pragma: "h",
                        pragmaFrag: "Fragment",
                    },
                ],
            ],
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        copy({
            targets: [
				{ src: "public/index.html", dest: "dist/" },
				{ src: "node_modules/todomvc-common/base.js", dest: "dist/" }
			],
        }),
        production && terser(),
    ],
};
