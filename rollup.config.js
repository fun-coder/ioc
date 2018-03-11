import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import polyfillPlugin from 'rollup-plugin-polyfill';

const polyfill = polyfillPlugin('./index.ts', ['./node_modules/reflect-metadata/Reflect.js']);

export default {
  entry: './index.ts',

  output: {
    name: 'ioc',
    file: './index.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    polyfill,
  ]
}