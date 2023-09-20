import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import typescript from "@rollup/plugin-typescript";

export default {
    plugins: [
        typescript({
            compilerOptions: {
                sourceMap: false,
            },
            outputToFilesystem: true,
        }),
        // Resolve bare module specifiers to relative paths
        resolve(),
        // Minify HTML template literals
        minifyHTML.default(),
        // Minify JS
        terser({
            ecma: 2022,
            module: true,
            warnings: true,
        }),
    ],
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "es",
    },
    preserveEntrySignatures: "strict",
};
