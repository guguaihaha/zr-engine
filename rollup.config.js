import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'
export default {
    input: 'src/js/zr.js',
    targets: [
        {
            dest: 'dist/zr.amd.js',
            format: 'amd'
        },
        {
            dest: 'dist/zr.cjs.js',
            format: 'cjs'
        },
        {
            dest: 'dist/zr.es.js',
            format: 'es'
        },
    ],
    plugins:[
        uglify(),
        resolve(),
        commonjs({
            extensions: [ '.js', '.coffee' ]
        }),
    ]
};