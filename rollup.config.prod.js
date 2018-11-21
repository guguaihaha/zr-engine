import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify'
export default {
    input: 'src/js/zr.js',
    targets: [
        {
            dest: 'dist/zr.min.js',
            name:"Zr",
            format: 'umd'
        },
        {
            dest: 'dist/zr.amd.min.js',
            format: 'amd'
        }
    ],
    plugins:[
        uglify(),
        resolve(),
        commonjs({
            extensions: [ '.js', '.coffee' ]
        }),
    ]
};
