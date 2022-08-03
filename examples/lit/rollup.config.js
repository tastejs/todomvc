import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'

const extensions = ['.js']

export default {
    input: 'js/index.js',
    output: [{
        file: './out/index.js',
        format: 'es',
        sourcemap: true,
    }],
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
            }
        }),
        resolve({ extensions })
    ]
}
