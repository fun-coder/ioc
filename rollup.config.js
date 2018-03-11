import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: `${__dirname}/main.ts`,

  output: {
    name: 'ioc',
    file: './index.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    resolve(),
  ],
};