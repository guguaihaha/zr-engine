import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default {
    input: 'src/js/zr.js',
    targets: [
        {
            dest: 'dist/zr.js',
            name:"Zr",
            format: 'umd'
        },
        {
            dest: 'dist/zr.amd.js',
            format: 'amd'
        }
    ],
    plugins:[
        resolve(),
        commonjs({
            extensions: [ '.js', '.coffee' ]
        }),
    ]
};