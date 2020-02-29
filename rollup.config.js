import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/injector.js',
  output: [
    {
      file: 'dist/injector.js',
      format: 'umd',
      name: 'injector'
    }, {
      file: 'dist/injector.min.js',
      format: 'umd',
      name: 'injector',
      plugins: [
        terser()
      ]
    }
  ],
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};